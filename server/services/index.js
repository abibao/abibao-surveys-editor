'use strict'

const authentication = require('./authentication')
const users = require('./memory/users')
const campaigns = require('./data/campaigns')

module.exports = function () {
  const app = this
  app.configure(authentication)
  app.configure(users)
  app.configure(campaigns)
}
