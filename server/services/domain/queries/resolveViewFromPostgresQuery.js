const Promise = require('bluebird')
const eraro = require('eraro')({package: 'platform.abibao.com'})
const hooks = require('../hooks')
const map = require('lodash').map

class Service {
  setup (app, path) {
    this.app = app
  }
  find (params) {
    const app = this.app
    const starttime = new Date()
    if (!params.query.view) {
      return Promise.reject(eraro('ERROR_PARAMS_VIEW_MANDATORY'))
    }
    return app.sequelize.query('SELECT * FROM ' + params.query.view)
      .then((result) => {
        const endtime = new Date()
        app.info({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'resolveViewFromPostgres',
          params
        })
        let emails = []
        map(result[0], (item) => {
          emails.push(item.email)
        })
        return Promise.resolve(emails)
      })
      .catch((error) => {
        const endtime = new Date()
        app.error({
          env: app.get('env'),
          exectime: endtime - starttime,
          type: 'query',
          name: 'resolveViewFromPostgres',
          error
        })
        return Promise.reject(eraro(error))
      })
  }
}

module.exports = function () {
  const app = this
  app.use('query/resolveViewFromPostgres', new Service())
  const service = app.service('query/resolveViewFromPostgres')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
