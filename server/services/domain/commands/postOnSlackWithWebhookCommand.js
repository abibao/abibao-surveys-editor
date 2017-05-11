const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const rp = require('request-promise')
const eraro = require('eraro')({package: 'platform.abibao.com'})

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
    return rp(opts).then(Promise.resolve).catch((error) => {
      return Promise.reject(eraro(error))
    })
  }
}

module.exports = function () {
  const app = this
  const options = {
    service: 'users'
  }
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

module.exports.Service = Service
