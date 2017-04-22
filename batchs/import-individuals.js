const glob = require('glob')
const async = require('async')
const path = require('path')
const fse = require('fs-extra')
const colors = require('colors/safe')
const ProgressBar = require('progress')

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

const tables = ['individuals']

client.io.on('connect', () => {
  console.log(colors.green.bold('client-batch is connected'))
  console.log(colors.yellow.bold('client-batch try to login'))
  client.authenticate({
    strategy: 'local',
    email: config.accounts.users.super.email,
    password: config.accounts.users.super.password
  }).then((response) => {
    console.log('token', response.accessToken)
    return client.passport.verifyJWT(response.accessToken)
  }).then((payload) => {
    console.log('payload', payload)
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
  let patternPath = path.resolve(__dirname, '../../api-gateway/src/tools/.cache/prod/rethinkdb', table.replace(/-/gi, '_'), '*.json')
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
  console.log(colors.yellow.bold('batch for', table, 'with', files.length, 'elements'))
  async.mapLimit(files, 1, (filepath, next) => {
    let data = fse.readJsonSync(filepath)
    // email already in dtabase v2 ?
    client.service('api/' + table).find({query: {email: data.email.toLowerCase()}})
      .then((result) => {
        if (result.length === 0) {
          // create user
          return client.service('api/' + table).create({email: data.email.toLowerCase()}).catch((error) => {
            if (error.toString() === 'BadRequest: Validation error: Validation isEmail failed') {
              return true
            } else {
              throw error
            }
          })
        } else {
          // next
          return true
        }
      })
      .then(() => {
        bar.tick()
        next()
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
