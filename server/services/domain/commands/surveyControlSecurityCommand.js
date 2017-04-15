'use strict'

const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const eraro = require('eraro')({package:'platform.abibao.com'})
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
    const starttime = new Date()
    let email = params.email.toLowerCase()
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
        return sendgrid.API(request).then(() => {
          return {
            connected: true
          }
        })
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
              urn: result.dataValues.urn
            }
          })
        })
      }
    })
    .then((result) => {
      console.log(result)
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'surveyControlSecurity',
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
        name: 'surveyControlSecurity',
        error
      })
      return Promise.reject(error)
    })
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
