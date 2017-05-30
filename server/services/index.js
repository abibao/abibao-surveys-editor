// internal services
const users = require('./memory/users')
const entities = require('./data/entities')
const campaigns = require('./data/campaigns')
const surveys = require('./data/surveys')
const answers = require('./data/answers')
const individuals = require('./data/individuals')
const templates = require('./couchdb/templates')

// external commands
const campaignCreateEmailingCommand = require('./domain/commands/campaignCreateEmailingCommand')
const individualAnswerSurveyCommand = require('./domain/commands/individualAnswerSurveyCommand')
const individualCompleteSurveyCommand = require('./domain/commands/individualCompleteSurveyCommand')
const individualAffectSurveyCommand = require('./domain/commands/individualAffectSurveyCommand')
const postOnSlackWithWebhookCommand = require('./domain/commands/postOnSlackWithWebhookCommand')
const sendgridRefreshAllTemplatesCommand = require('./domain/commands/sendgridRefreshAllTemplatesCommand')
const surveyControlMinimumCommand = require('./domain/commands/surveyControlMinimumCommand')
const surveyControlSecurityCommand = require('./domain/commands/surveyControlSecurityCommand')

// external queries
const getCampaignScreenCompleteMessageQuery = require('./domain/queries/getCampaignScreenCompleteMessageQuery')
const answerGetRandomAnswerQuery = require('./domain/queries/answerGetRandomAnswerQuery')
const answerGetRandomEHOPAnswerQuery = require('./domain/queries/answerGetRandomEHOPAnswerQuery')

module.exports = function () {
  const app = this

  app.configure(users)
  app.configure(entities)
  app.configure(campaigns)
  app.configure(surveys)
  app.configure(answers)
  app.configure(individuals)
  app.configure(templates)

  app.configure(campaignCreateEmailingCommand)
  app.configure(individualAnswerSurveyCommand)
  app.configure(individualCompleteSurveyCommand)
  app.configure(individualAffectSurveyCommand)
  app.configure(postOnSlackWithWebhookCommand)
  app.configure(sendgridRefreshAllTemplatesCommand)
  app.configure(surveyControlMinimumCommand)
  app.configure(surveyControlSecurityCommand)

  app.configure(getCampaignScreenCompleteMessageQuery)
  app.configure(answerGetRandomAnswerQuery)
  app.configure(answerGetRandomEHOPAnswerQuery)
}
