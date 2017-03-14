'use strict'

// internal services
const users = require('./memory/users')
const entities = require('./data/entities')
const campaigns = require('./data/campaigns')
const surveys = require('./data/surveys')
const answers = require('./data/answers')

// external commands
const upsertAnsweringSurveyCommand = require('./domain/commands/upsertAnsweringSurveyCommand')

module.exports = function () {
  const app = this

  app.configure(users)
  app.configure(entities)
  app.configure(campaigns)
  app.configure(surveys)
  app.configure(answers)

  app.configure(upsertAnsweringSurveyCommand)
}
