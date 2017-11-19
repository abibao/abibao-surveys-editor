const Promise = require('bluebird')

class Service {
  setup (app, path) {
    this.app = app
  }
  find (params) {
    const app = this.app
    const starttime = new Date()
    const endtime = new Date()
    app.info({
      env: app.get('env'),
      exectime: endtime - starttime,
      type: 'query',
      name: 'getRemoteConfiguration',
      params
    })
    let remoteConfig = {
      env: app.get('env'),
      analytics: app.get('analytics'),
      domains: app.get('domains'),
      couchdb: app.get('couchdb')
    }
    return Promise.resolve(remoteConfig)
  }
}

module.exports = function () {
  const app = this
  app.use('query/getRemoteConfiguration', new Service())
}

module.exports.Service = Service
