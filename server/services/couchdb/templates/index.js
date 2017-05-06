const Service = require('feathers-couchdb')

module.exports = function () {
  const app = this
  app.use('api/templates', Service({
    connection: app.cradle,
    Model: 'templates'
  }))
}
