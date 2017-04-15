'use strict'

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

const tables = ['surveys']
const campaignRef = '56eb2501e9b0fbf30250f8c8'
let campaignPostgres = false

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
    client.service('api/campaigns').find({query: {position: 2}}).then((campaigns) => {
      campaignPostgres = campaigns[0]
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
    // load
    let data = fse.readJsonSync(filepath)
    // load individual from rethinkdb file
    let individualFilepath = path.resolve(__dirname, '../../api-gateway/src/tools/.cache/prod/rethinkdb/individuals', data.individual + '.json')
    if (fse.existsSync(individualFilepath)) {
      let individual = fse.readJsonSync(individualFilepath)
      client.service('api/individuals').find({query: {email: individual.email.toLowerCase()}})
        .then((users) => {
          if (data.campaign !== campaignRef) {
            return true
          }
          if (users.length === 0) {
            return true
          }
          // we have email exists and campaign is ref so we affect the survey
          return client.service('command/individualAffectSurvey').create({
            silence: true,
            individual: users[0].urn,
            campaign: campaignPostgres.id,
            createdAt: data.createdAt
          })
        })
        .then(() => {
          bar.tick()
          next()
        })
        .catch((error) => {
          if (error.toString() === 'Error: ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE') {
            bar.tick()
            return next()
          }
          console.log('')
          console.log(colors.red.bold('an error occured', filepath))
          console.error(error)
          process.exit(-1)
        })
    } else {
      bar.tick()
      next()
    }
  }, () => {
    callback()
  })
}
