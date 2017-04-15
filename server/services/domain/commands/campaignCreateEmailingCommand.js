'use strict'

const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const eraro = require('eraro')({package:'platform.abibao.com'})

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
      const sendgrid = require('sendgrid')(app.get('sendgrid').key)
      const request = sendgrid.emptyRequest()
      request.method = 'POST'
      request.path = '/v3/mail/send'
      request.body = {
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
      return sendgrid.API(request)
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
