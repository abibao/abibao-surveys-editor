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
  find () {
    const app = this.app
    const starttime = new Date()
    const sendgrid = require('sendgrid')(app.get('sendgrid').key)
    const request = sendgrid.emptyRequest()
    request.method = 'GET'
    request.path = '/v3/templates'
    return sendgrid.API(request)
      .then((response) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'sendgridGetAllTemplates'
        })
        return Promise.resolve(response.body)
      })
      .catch((error) => {
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'sendgridGetAllTemplates',
          error
        })
        // error have to be not blocking for the UI
        return Promise.resolve({
          templates: [{id: 'none', name: 'ERROR_SENDGRID'}]
        })
      })
  }
}

module.exports = function () {
  const app = this
  app.use('query/sendgridGetAllTemplates', new Service())
  const service = app.service('query/sendgridGetAllTemplates')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}
