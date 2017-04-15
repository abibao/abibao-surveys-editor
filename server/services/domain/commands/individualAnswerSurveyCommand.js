'use strict'

const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const eraro = require('eraro')({package: 'platform.abibao.com'})
const _ = require('lodash')

const options = {
  service: 'users'
}

class Service {
  setup (app, path) {
    this.app = app
  }
  create (params) {
    const app = this.app
    const starttime = new Date()
    // mandatory
    if (!params.individual) {
      return Promise.reject(eraro('individual is mandatory'))
    }
    if (!params['campaign_id']) {
      return Promise.reject(eraro('campaign_id is mandatory'))
    }
    if (!params['campaign_name']) {
      return Promise.reject(eraro('campaign_name is mandatory'))
    }
    if (!params['survey_id']) {
      return Promise.reject(eraro('survey_id is mandatory'))
    }
    if (!params.question) {
      return Promise.reject(eraro('question is mandatory'))
    }
    const answersToCreate = []
    return app.service('api/answers').remove(null, {query: {
      individual: params.individual,
      'survey_id': params['survey_id'],
      'campaign_id': params['campaign_id'],
      question: params.question
    }}).then(() => {
      if (_.isArray(params.answer)) {
        _.map(params.answer, (answer) => {
          let newParams = _.clone(params)
          newParams.answer = answer
          answersToCreate.push(newParams)
        })
      } else {
        answersToCreate.push(params)
      }
      return app.service('api/answers').create(answersToCreate)
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'individualAnswerSurvey',
        params
      })
      return Promise.resolve(result)
    })
    .catch((error) => {
      const endtime = new Date()
      app.error({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'individualAnswerSurvey',
        error
      })
      return Promise.reject(error)
    })
  }
}

module.exports = function () {
  const app = this
  app.use('command/individualAnswerSurvey', new Service())
  const service = app.service('command/individualAnswerSurvey')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}
