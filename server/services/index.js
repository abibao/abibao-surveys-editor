'use strict'

const authentication = require('./authentication')
const users = require('./memory/users')
const entities = require('./data/entities')
const campaigns = require('./data/campaigns')
const surveys = require('./data/surveys')

module.exports = function () {
  const app = this
  app.configure(authentication)
  app.configure(users)
  app.configure(entities)
  app.configure(campaigns)
  app.configure(surveys)
}
