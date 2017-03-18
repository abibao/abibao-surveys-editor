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
  create (data) {
    const app = this.app
    data.complete = true
    data.campaign = data.campaign.id
    return app.service('api/surveys').patch(data.id, data)
      .then(Promise.resolve)
      .catch(Promise.reject)
  }
}

module.exports = function () {
  const app = this
  app.use('command/individualCompleteSurvey', new Service())
  const service = app.service('command/individualCompleteSurvey')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}
