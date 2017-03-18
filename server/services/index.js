'use strict'

// internal services
const users = require('./memory/users')
const entities = require('./data/entities')
const campaigns = require('./data/campaigns')
const surveys = require('./data/surveys')
const answers = require('./data/answers')

// external commands
const individualAnswerSurveyCommand = require('./domain/commands/individualAnswerSurveyCommand')
const individualCompleteSurveyCommand = require('./domain/commands/individualCompleteSurveyCommand')
const individualAffectSurveyCommand = require('./domain/commands/individualAffectSurveyCommand')
const postOnSlackWithWebhookCommand = require('./domain/commands/postOnSlackWithWebhookCommand')

module.exports = function () {
  const app = this

  app.configure(users)
  app.configure(entities)
  app.configure(campaigns)
  app.configure(surveys)
  app.configure(answers)

  app.configure(individualAnswerSurveyCommand)
  app.configure(individualCompleteSurveyCommand)
  app.configure(individualAffectSurveyCommand)
  app.configure(postOnSlackWithWebhookCommand)
}
