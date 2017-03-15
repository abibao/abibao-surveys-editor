'use strict'

const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')

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
    if (!params.email) {
      return Promise.reject(new Error('email is mandatory'))
    }
    if (!params['campaign_id']) {
      return Promise.reject(new Error('campaign_id is mandatory'))
    }
    if (!params.question) {
      return Promise.reject(new Error('question is mandatory'))
    }
    // upsert answer
    return app.service('api/answers').find({
      email: params.email,
      'campaign_id': params['campaign_id'],
      question: params.question
    }).then((result) => {
      if (result.length === 0) {
        return app.service('api/answers').create(params).then(Promise.resolve)
      } else {
        return app.service('api/answers').update(result[0].id, params).then(Promise.resolve)
      }
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
