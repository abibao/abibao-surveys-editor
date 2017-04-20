const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const eraro = require('eraro')({package: 'platform.abibao.com'})

class Service {
  setup (app, path) {
    this.app = app
  }
  create (params) {
    const app = this.app
    const starttime = new Date()
    if (!params.email) {
      return Promise.reject(eraro('ERROR_PARAMS_EMAIL_MANDATORY'))
    }
    if (!params.template) {
      return Promise.reject(eraro('ERROR_PARAMS_TEMPLATE_MANDATORY'))
    }
    if (!params.url) {
      return Promise.reject(eraro('ERROR_PARAMS_URL_MANDATORY'))
    }
    app.service('api/individuals').find({query: {
      email: params.email
    }})
    .then((individuals) => {
      if (individuals.length === 0) {
        throw eraro('ERROR_INDIVIDUAL_NOT_FOUND')
      }
      return individuals[0]
    })
    .then((individual) => {
      app.bus.send('BUS_EVENT_BATCH_EMAILING_SENDGRID', {
        email: params.email,
        template: params.template,
        body: {
          'personalizations': [
            { 'to': [{ 'email': params.email }],
              'subject': 'Une entreprise a besoin de vous.',
              'substitutions': {
                '%urn_survey%': params.url + '/reader/' + params.campaign + '?individual=' + individual.urn
              }
            }
          ],
          'from': { 'email': 'bonjour@abibao.com', 'name': 'Abibao' },
          'content': [{ 'type': 'text/html', 'value': ' ' }],
          'template_id': params.template
        }
      })
      return true
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'campaignCreateEmailing',
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
        name: 'campaignCreateEmailing',
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
  app.use('command/campaignCreateEmailing', new Service())
  const service = app.service('command/campaignCreateEmailing')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}

module.exports.Service = Service
