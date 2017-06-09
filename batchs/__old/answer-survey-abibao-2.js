const glob = require('glob-promise')
const async = require('async')
const _ = require('lodash')
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
  async.mapLimit(files, 10, (filepath, next) => {
    // load
    let data = fse.readJsonSync(filepath)
    // load individual from rethinkdb file
    let individualFilepath = path.resolve(__dirname, '../../api-gateway/src/tools/.cache/prod/rethinkdb/individuals', data.individual + '.json')
    if (fse.existsSync(individualFilepath)) {
      let individual = fse.readJsonSync(individualFilepath)
      client.service('api/individuals').find({query: {email: individual.email}})
        .then((users) => {
          if (data.campaign !== campaignRef) {
            return true
          }
          if (users.length === 0) {
            return true
          }
          // let's find the survey_id for this email
          return client.service('api/surveys').find({query: {individual: users[0].urn, campaign: campaignPostgres.id}}).then((surveys) => {
            if (surveys.length === 0) {
              throw new Error('ERROR_NO_AFFECTATION_FOUND')
            }
            if (surveys.length > 1) {
              console.log(surveys)
              throw new Error('ERROR_MORE_THAN_ONE_AFFECTATIONS_FOUND')
            }
            // we have email exists and campaign is ref so we answer the survey
            let promises = []
            _.map(Object.keys(data.answers), (key) => {
              let choiceFilepath = path.resolve(__dirname, '../../api-gateway/src/tools/.cache/prod/rethinkdb/campaigns_items_choices', data.answers[key] + '.json')
              if (fse.existsSync(choiceFilepath)) {
                let choice = fse.readJsonSync(choiceFilepath)
                promises.push(client.service('command/individualAnswerSurvey').create({
                  individual: users[0].urn,
                  survey_id: surveys[0].id,
                  campaign_id: campaignPostgres.id,
                  campaign_name: campaignPostgres.name,
                  question: key,
                  answer: choice.prefix + '_' + choice.suffix,
                  createdAt: data.createdAt
                }))
              } else {
                promises.push(client.service('command/individualAnswerSurvey').create({
                  individual: users[0].urn,
                  survey_id: surveys[0].id,
                  campaign_id: campaignPostgres.id,
                  campaign_name: campaignPostgres.name,
                  question: key,
                  answer: data.answers[key],
                  createdAt: data.createdAt
                }))
              }
            })
            if (!data.answers.ABIBAO_ANSWER_ASKING_CGU) {
              promises.push(client.service('command/individualAnswerSurvey').create({
                individual: users[0].urn,
                survey_id: surveys[0].id,
                campaign_id: campaignPostgres.id,
                campaign_name: campaignPostgres.name,
                question: 'ABIBAO_ANSWER_ASKING_CGU',
                answer: 'ABIBAO_CGU_YES'
              }))
            }
            promises.push(client.service('command/individualAnswerSurvey').create({
              individual: users[0].urn,
              survey_id: surveys[0].id,
              campaign_id: campaignPostgres.id,
              campaign_name: campaignPostgres.name,
              question: 'ABIBAO_ANSWER_CHARITY_SENSIBILITY',
              answer: ['ABIBAO_BATCH']
            }))
            if (promises.length === 6) {
              promises.push(client.service('command/individualCompleteSurvey').create({
                id: surveys[0].id,
                campaign: {
                  id: campaignPostgres.id
                }
              }))
            }
            return Promise.all(promises)
          })
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
    } else {
      bar.tick()
      next()
    }
  }, () => {
    callback()
  })
}
