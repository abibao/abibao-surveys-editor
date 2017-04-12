'use strict'

const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const uuid = require('uuid')

const options = {
  service: 'users'
}

class Service {
  setup (app, path) {
    this.app = app
  }
  create (params) {
    const app = this.app
    let email = params.email
    let user = ''
    let campaignAbibaoPosition1 = ''
    return app.service('api/individuals').find({query: {
      email
    }})
    .then((result) => {
      if (result.length === 1) {
        user = result[0]
        // case 1: email is in database
        const sendgrid = require('sendgrid')(app.get('sendgrid').key)
        const request = sendgrid.emptyRequest()
        request.method = 'POST'
        request.path = '/v3/mail/send'
        request.body = {
          'personalizations': [
            { 'to': [{ 'email': email }],
              'subject': 'Confirmation de votre email, pour répondre à un sondage.',
              'substitutions': {
                '%fingerprint%': params.origin + '&individual=' + result[0].urn
              }
            }
          ],
          'from': { 'email': 'bonjour@abibao.com', 'name': 'Abibao' },
          'content': [{ 'type': 'text/html', 'value': ' ' }],
          'template_id': app.get('sendgrid').templates.passwordless
        }
        sendgrid.API(request)
        return {
          connected: true
        }
      } else {
        // case 2: email not in database
        return app.service('api/campaigns').find({query: {
          position: 1,
          company: 'Abibao'
        }}).then((result) => {
          let campaign = result[0]
          return app.service('api/individuals').create({
            email
          }).then((result) => {
            return {
              connected: false,
              campaign: campaign.id,
              urn: result.dataValues.urn
            }
          })
        })
      }
    })
    .then(Promise.resolve)
    .catch(Promise.reject)
  }
}

module.exports = function () {
  const app = this
  app.use('command/surveyControlSecurity', new Service())
  const service = app.service('command/surveyControlSecurity')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}
