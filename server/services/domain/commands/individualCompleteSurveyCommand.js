const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')

class Service {
  setup (app, path) {
    this.app = app
  }
  create (data) {
    const app = this.app
    const starttime = new Date()
    data.complete = true
    data.campaign = data.campaign.id
    return app.service('api/surveys').patch(data.id, data)
      .then((result) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'command',
          name: 'individualCompleteSurvey',
          params: data
        })
        return Promise.resolve(result)
      })
      .catch((error) => {
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'command',
          name: 'individualCompleteSurvey',
          error
        })
        return Promise.reject(error)
      })
  }
}

module.exports = function () {
  const app = this
  const options = {
    service: 'users'
  }
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

module.exports.Service = Service
