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
    let campaign = {}
    let email = params.individual
    // mandatory
    if (!params.individual) {
      return Promise.reject(new Error('individual is mandatory'))
    }
    if (!params.campaign) {
      return Promise.reject(new Error('campaign is mandatory'))
    }
    // logical traitment
    return app.service('api/campaigns').get(params.campaign)
      // check if campaign exists in database
      .then((result) => {
        if (result.code === 404) {
          return Promise.reject(result)
        } else {
          campaign = result.dataValues
          return true
        }
      })
      // is individual already in our database if reader = abibao
      .then(() => {
        if(campaign.reader === 'abibao') {
          return app.service('api/individuals').find({query: {
            urn: params.individual
          }}).then((result) => {
            if (result.length === 0) {
              throw new Error('ABIBAO_INDIVIDUAL_CONTROL_SECURITY')
            } else {
              params.individual = result[0].urn
            }
          })
        } else {
          return true
        }
      })
      // already have affected survey and not complete for this individual ?
      .then(() => {
        return app.service('api/surveys').find({query: {
          individual: params.individual,
          campaign: campaign.id,
          company: campaign.company,
          complete: false
        }})
      })
      // final, create or return
      .then((result) => {
        if (result.length === 0) {
          return app.service('api/surveys').create({
            individual: params.individual,
            campaign: campaign.id,
            company: campaign.company,
            params: params.params,
            complete: false
          }).then((result) => {
            const message = {
              'username': 'individualCreateSurveyCommand',
              'text': '[' + new Date() + '] - [' + email + '] can access a new survey (' + campaign.name + ')'
            }
            app.service('command/postOnSlackWithWebhook').create(message)
            return true
          })
        } else {
          return true
        }
      })
      .then(() => {
        return app.service('api/surveys').find({query: {
          individual: params.individual,
          campaign: campaign.id,
          company: campaign.company,
          complete: false
        }})
      })
      .then((surveys) => {
        let survey = surveys[0]
        survey.campaign = campaign
        return survey
      })
      .then(Promise.resolve)
      .catch(Promise.reject)
  }
}

module.exports = function () {
  const app = this
  app.use('command/individualAffectSurvey', new Service())
  const service = app.service('command/individualAffectSurvey')
  service.before({
    create: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}
