const Promise = require('bluebird')
const eraro = require('eraro')({package: 'platform.abibao.com'})
// const hooks = require('../hooks')

const querySQL = "SELECT COUNT (DISTINCT individual), question ,campaign_name, (COUNT (DISTINCT individual)*100.0)/(SELECT  COUNT (DISTINCT individual) FROM public.answers  WHERE  campaign_name='SMF - Control-P' AND question='SMF_CTRLP_PERSONALPRINTER_USAGE_OWNPRINTER_FREQ' GROUP BY campaign_name,question )  AS pourcentage FROM public.answers AS pourcentage WHERE  campaign_name='SMF - Control-P' AND question not LIKE '%question%' GROUP BY campaign_name,question ORDER BY COUNT DESC;"

class Service {
  setup (app, path) {
    this.app = app
  }
  find (params) {
    const app = this.app
    const starttime = new Date()
    return app.sequelize.query(querySQL, {type: app.sequelize.QueryTypes.SELECT})
      .then((result) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'campaignGetTunnelEffectFromControlPrint',
          params
        })
        return Promise.resolve({
          rowCount: result.length,
          rows: result
        })
      })
      .catch((error) => {
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'campaignGetTunnelEffectFromControlPrint',
          error
        })
        return Promise.reject(eraro(error))
      })
  }
}

module.exports = function () {
  const app = this
  app.use('query/campaignGetTunnelEffectFromControlPrint', new Service())
  // const service = app.service('query/campaignGetTunnelEffectFromControlPrint')
  // service.before(hooks.before)
  // service.after(hooks.after)
}

module.exports.Service = Service
