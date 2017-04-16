const Promise = require('bluebird')
const Sequelize = require('sequelize')

const AnswerModel = require('./../../data/answers/model')

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Service {
  setup (app, path) {
    this.app = app
  }
  find (params) {
    const app = this.app
    const starttime = new Date()
    const Answer = AnswerModel(app)
    return Answer.findAll({
      where: { 'campaign_id': params.campaign, question: 'AGENCEDURABLE_EHOP_IDEA', individual: { $not: params.individual } },
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
        let offset = getRandomInt(0, count - 1)
        return Answer.findAll({
          where: { 'campaign_id': params.campaign, question: 'AGENCEDURABLE_EHOP_IDEA', individual: { $not: params.individual } },
          offset,
          limit: 1
        })
      }
    })
    .then((result) => {
      const endtime = new Date()
      app.info({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'query',
        name: 'answerGetRandomEHOPAnswer',
        params
      })
      return Promise.resolve(result)
    })
    .catch((error) => {
      const endtime = new Date()
      app.error({
        env: app.get('env'),
        exectime: endtime - starttime,
        type: 'query',
        name: 'answerGetRandomEHOPAnswer',
        error
      })
      return Promise.reject(error)
    })
  }
}

module.exports = function () {
  const app = this
  app.use('query/answerGetRandomEHOPAnswer', new Service())
}
