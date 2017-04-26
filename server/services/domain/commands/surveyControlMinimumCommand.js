const Promise = require('bluebird')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')

class Service {
  setup (app, path) {
    this.app = app
  }
  create (params) {
    const app = this.app
    const starttime = new Date()
    return app.service('api/campaigns').find({query: {
      position: 1,
      company: 'Abibao'
    }})
    // affect survey 1
    .then((result) => {
      return result[0]
    })
    .then((result) => {
      return app.service('command/individualAffectSurvey').create({
        individual: params.individual,
        campaign: result.id,
        params: params.params
      })
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'surveyControlMinimum',
        params
      })
      if (result.campaign.complete === true) {
        return Promise.resolve()
      } else {
        return Promise.resolve(result)
      }
    })
    .catch((error) => {
      const endtime = new Date()
      app.error({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'command',
        name: 'surveyControlMinimum',
        error
      })
      if (error.code === 'ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE') {
        return Promise.resolve()
      }
      return Promise.reject(error)
    })
  }
}

module.exports = function () {
  const app = this
  const options = {
    service: 'users'
  }
  app.use('command/surveyControlMinimum', new Service())
  const service = app.service('command/surveyControlMinimum')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}

module.exports.Service = Service
