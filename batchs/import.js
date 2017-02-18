'use strict'

const glob = require('glob')
const async = require('async')
const path = require('path')
const fse = require('fs-extra')
const colors = require('colors/safe')
const ProgressBar = require('progress')
const Log = require('log')

const config = require('./../config/default')

const feathers = require('feathers/client')
const socketio = require('feathers-socketio/client')
const hooks = require('feathers-hooks')
const auth = require('feathers-authentication-client')
const io = require('socket.io-client')

const host = 'http://localhost:3001'
const socket = io(host)

const client = feathers()
  .configure(hooks())
  .configure(socketio(socket))
  .configure(auth())

client.io.on('connect', () => {
  console.log(colors.green.bold('client-batch is connected'))
  const tables = ['entities']
  console.log(colors.yellow.bold('client-batch try to login'))
  client.authenticate({
    strategy: 'local',
    email: config.superu.email,
    password: config.superu.password
  }).then((response) => {
    return client.passport.verifyJWT(response.accessToken)
  }).then((payload) => {
    return client.service('users').get(payload.userId)
  }).then((user) => {
    client.set('user', user)
    console.log(colors.green.bold('client-batch is authorized with email', user.email))
    async.mapSeries(tables, (table, next) => {
      batch(table, next)
    }, (error, results) => {
      if (error) {
        throw new Error(error)
      } else {
        console.log(colors.green.bold('all done'))
        process.exit(0)
      }
    })
  }).catch((error) => {
    console.log(colors.red.bold('an error occured'))
    console.error(error)
    process.exit(-1)
  })
})
client.io.on('disconnect', () => {
  console.log(colors.red.bold('client-batch is disconnected'))
})

const batch = (table, callback) => {
  const log = new Log('debug', fse.createWriteStream('batch-import-' + table + '.log'))
  let patternPath = path.resolve(__dirname, '../../api-gateway/src/tools/.cache/prod/rethinkdb', table.replace(/-/gi, '_'), '*.json')
  if (table === 'surveys-answers') {
    patternPath = path.resolve(__dirname, '../../api-gateway/src/tools/.cache/prod/mysql/answers/**/*.json')
  }
  const files = glob.sync(patternPath, {
    nodir: true,
    dot: true
  })
  var bar = new ProgressBar('    progress [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: files.length
  })
  console.log(colors.yellow.bold('... batch for', table, 'with', files.length, 'elements'))
  async.mapLimit(files, 10, (filepath, next) => {
    let data = fse.readJsonSync(filepath)
    // try to insert
    client.service('api/' + table).create(data)
      .then(() => {
        bar.tick()
        next()
      })
      .catch((error) => {
        if (error.errors && error.errors[0].type !== 'unique violation') {
          log.error({
            filepath,
            data,
            error,
            errors: JSON.stringify(error.errors)
          })
        }
        // if error then we try to update
        return client.service('api/' + table).update(data.id, data)
          .then(() => {
            bar.tick()
            next()
          }).catch(() => {
            bar.tick()
            next()
          })
      })
      .catch((error) => {
        console.log('')
        console.log(colors.red.bold('an error occured', filepath))
        console.error(error)
        process.exit(-1)
      })
  }, () => {
    callback()
  })
}
