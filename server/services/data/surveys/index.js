'use strict'

const Service = require('feathers-sequelize')
const hooks = require('./hooks')

const EntityModel = require('./../surveys/model')

module.exports = function () {
  const app = this
  const Entity = EntityModel(app)
  app.use('/api/surveys', Service({
    Model: Entity,
    paginate: {
      default: 25,
      max: 50
    }
  }))
  const service = app.service('api/surveys')
  service.before(hooks.before)
  service.after(hooks.after)
}
