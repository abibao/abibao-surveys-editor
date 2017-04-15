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
    app.service('api/individuals').find({query: {
      email: params.email
    }})
    .then((individuals) => {
      if (individuals.length === 0) {
        throw new Error('ERROR_INDIVIDUAL_NOT_FOUND')
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
      sendgrid.API(request)
      return {
        sended: true
      }
    })
    .then(Promise.resolve)
    .catch(Promise.reject)
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
