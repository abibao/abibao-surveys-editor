'use strict'

const hooks = require('./hooks')

module.exports = function () {
  const app = this
  const service = app.service('authentication')
  service.before(hooks.before)
  service.after(hooks.after)
}
