'use strict'

const Promise = require('bluebird')
const Sequelize = require('sequelize')
const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')

const AnswerModel = require('./../../data/answers/model')

const options = {
  service: 'users'
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Service {
  setup (app, path) {
    this.app = app
  }
  get (params) {
    const app = this.app
    const Answer = AnswerModel(app)
    return Answer.findAll({
      where: { 'campaign_id': params.campaign, question: 'AGENCEDURABLE_EHOP_IDEA', email: { $not: params.email } },
      attributes: [[Sequelize.fn('COUNT', Sequelize.col('question')), 'count']]
    }).then((result) => {
      let count = parseInt(result[0].dataValues.count)
      return count
    }).then((count) => {
      if (count === 0) {
        return {
          count,
          random: false
        }
      } else {
        let offset = getRandomInt(0, count-1)
        return Answer.findAll({
          where: { 'campaign_id': params.campaign, question: 'AGENCEDURABLE_EHOP_IDEA', email: { $not: params.email } },
          offset, limit: 1
       })
      }
    }).then(Promise.resolve).catch(Promise.reject)
}


module.exports = function () {
  const app = this
  app.use('query/answerGetRandom', new Service())
  const service = app.service('query/answerGetRandom')
  service.before({
    get: [
      auth.hooks.authenticate('jwt'),
      permissions.hooks.checkPermissions(options),
      permissions.hooks.isPermitted()
    ]
  })
}