'use strict'

const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
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
    // mandatory
    if (!params.individual) {
      return Promise.reject(new Error('individual is mandatory'))
    }
    if (!params['campaign_id']) {
      return Promise.reject(new Error('campaign_id is mandatory'))
    }
    if (!params.question) {
      return Promise.reject(new Error('question is mandatory'))
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
      return app.service('api/answers').create(answersToCreate).then(Promise.resolve)
    }).catch(Promise.reject)

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
