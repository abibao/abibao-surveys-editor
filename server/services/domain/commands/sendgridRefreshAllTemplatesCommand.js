const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const _ = require('lodash')
const eraro = require('eraro')({package: 'platform.abibao.com'})

class Service {
  setup (app, path) {
    this.app = app
  }
  create () {
    const app = this.app
    const starttime = new Date()
    const sendgrid = require('sendgrid')(app.get('sendgrid').key)
    const request = sendgrid.emptyRequest()
    request.method = 'GET'
    request.path = '/v3/templates'
    return sendgrid.API(request)
      .then((response) => {
        return app.service('api/templates').find({query: {}}).then((templates) => {
          let promises = []
          _.map(templates, (template) => {
            promises.push(app.service('api/templates').remove(template.id))
          })
          return Promise.all(promises).then(() => {
            return app.service('api/templates').create(response.body.templates).then((result) => {
              return result
            })
          })
        })
      })
      .then((result) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'command',
          name: 'sendgridRefreshAllTemplates'
        })
        return Promise.resolve(result)
      })
      .catch((error) => {
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'command',
          name: 'sendgridRefreshAllTemplates',
          error
        })
        return Promise.reject(eraro(error))
      })
  }
}

module.exports = function () {
  const app = this
  const options = {
    service: 'users'
  }
  app.use('command/sendgridRefreshAllTemplates', new Service())
  const service = app.service('command/sendgridRefreshAllTemplates')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}

module.exports.Service = Service
