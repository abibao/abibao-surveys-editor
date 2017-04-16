const Service = require('feathers-sequelize')
const hooks = require('./hooks')

const IndividualModel = require('./../individuals/model')

module.exports = function () {
  const app = this
  const Individual = IndividualModel(app)
  app.use('api/individuals', Service({
    Model: Individual
  }))
  const service = app.service('api/individuals')
  service.before(hooks.before)
  service.after(hooks.after)
}
