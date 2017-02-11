'use strict'

const Service = require('feathers-sequelize')
const hooks = require('./hooks')

const CampaignModel = require('./../campaigns/model')

module.exports = function () {
  const app = this
  const Campaign = CampaignModel(app)
  app.use('/api/campaigns', Service({
    Model: Campaign,
    paginate: {
      default: 25,
      max: 50
    }
  }))
  const service = app.service('api/campaigns')
  service.before(hooks.before)
  service.after(hooks.after)
}
