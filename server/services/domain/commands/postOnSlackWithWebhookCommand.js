'use strict'

const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
var rp = require('request-promise')

const options = {
  service: 'users'
}

class Service {
  setup (app, path) {
    this.app = app
  }
  create (params) {
    const app = this.app
    const opts = {
      method: 'POST',
      uri: app.get('slack').webhook,
      body: params,
      json: true
    }
    return rp(opts).then(Promise.resolve).catch(Promise.reject)
  }
}

module.exports = function () {
  const app = this
  app.use('command/postOnSlackWithWebhook', new Service())
  const service = app.service('command/postOnSlackWithWebhook')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}
