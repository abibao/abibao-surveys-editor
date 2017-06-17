const Promise = require('bluebird')
const _ = require('lodash')
const eraro = require('eraro')({package: 'platform.abibao.com'})
// const hooks = require('../hooks')

let querySQL = '' +
  'SELECT COUNT (DISTINCT individual), question, (COUNT (DISTINCT individual)*100.0)/(SELECT COUNT (DISTINCT individual) ' +
  "FROM public.answers WHERE campaign_name='CAMPAIGN_NAME' " +
  "AND question='CAMPAIGN_FIRST_QUESTION' GROUP BY campaign_name,question) AS pourcentage " +
  "FROM public.answers AS pourcentage WHERE campaign_name='CAMPAIGN_NAME' AND question not LIKE '%question%' " +
  'GROUP BY campaign_name,question ORDER BY COUNT DESC'

class Service {
  setup (app, path) {
    this.app = app
  }
  find (params) {
    const app = this.app
    const starttime = new Date()
    if (!params.query.campaign) {
      return Promise.reject(eraro('ERROR_PARAMS_CAMPAIGN_MANDATORY'))
    }
    return app.service('api/campaigns').get(params.query.campaign)
      .then((result) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'campaignGetTunnelEffect',
          params
        })
        let campaign = {
          id: result.id,
          name: result.name,
          elements: [],
          questions: []
        }
        campaign.name = result.name
        _.map(result.data.pages, (page) => {
          _.map(page.elements, (element) => {
            if (element.title) {
              campaign.questions.push(element.name)
              campaign.elements.push(element)
            }
          })
        })
        querySQL = _.replace(querySQL, /CAMPAIGN_NAME/g, campaign.name)
        querySQL = _.replace(querySQL, /CAMPAIGN_FIRST_QUESTION/g, campaign.questions[0])
        return app.sequelize.query(querySQL, {type: app.sequelize.QueryTypes.SELECT}).then((result) => {
          return Promise.resolve({
            rowCount: result.length,
            rows: result,
            metadata: campaign
          })
        })
      })
      .catch((error) => {
        console.log(error)
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'campaignGetTunnelEffect',
          error
        })
        if (error.name === 'NotFound') {
          return Promise.reject(error)
        }
        return Promise.reject(eraro(error))
      })
  }
}

module.exports = function () {
  const app = this
  app.use('query/campaignGetTunnelEffect', new Service())
  // const service = app.service('query/campaignGetTunnelEffectFromControlPrint')
  // service.before(hooks.before)
  // service.after(hooks.after)
}

module.exports.Service = Service
