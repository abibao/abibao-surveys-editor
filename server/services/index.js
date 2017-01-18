'use strict'

const surveys = require('./data/surveys')

module.exports = function () {
  const app = this
  app.configure(surveys)
}
