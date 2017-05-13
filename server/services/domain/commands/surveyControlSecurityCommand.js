const Promise = require('bluebird')
const auth = require('feathers-authentication')
const eraro = require('eraro')({package: 'platform.abibao.com'})

class Service {
  setup (app, path) {
    this.app = app
  }
  create (data) {
    const app = this.app
    const starttime = new Date()
    if (!data.email) {
      return Promise.reject(eraro('ERROR_PARAMS_EMAIL_MANDATORY'))
    }
    let email = data.email.toLowerCase()
    return app.service('api/individuals').find({query: {
      email
    }})
    .then((result) => {
      if (result.length === 1) {
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
                '%fingerprint%': data.location.origin + data.location.pathname + '?individual=' + result[0].urn + data.location.search.replace('?', '&')
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
          return app.service('api/individuals').create({
            email
          }).then((result) => {
            return {
              connected: false,
              urn: result.urn
            }
          })
        })
      }
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'surveyControlSecurity',
        data
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
      return Promise.reject(eraro(error))
    })
  }
}

module.exports = function () {
  const app = this
  app.use('command/surveyControlSecurity', new Service())
  const service = app.service('command/surveyControlSecurity')
  service.before({
    create: [
      auth.hooks.authenticate('jwt')
    ]
  })
}

module.exports.Service = Service
