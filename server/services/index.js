'use strict'

const authentication = require('./authentication')
const users = require('./memory/users')
const surveys = require('./data/surveys')

module.exports = function () {
  const app = this
  app.configure(authentication)
  app.configure(users)
  app.configure(surveys)
}
