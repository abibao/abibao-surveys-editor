const Promise = require('bluebird')
const path = require('path')
const glob = require('glob-promise')
const hooks = require('../hooks')

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
      name: 'getAllUploadedMedia',
      params
    })
    const dirpath = path.resolve(__dirname, '../../../uploads')
    const files = glob.sync(dirpath + '/**/*.*').map(file => {
      return app.get('domains').api + '/wp_content/' + path.basename(file)
    })
    return Promise.resolve(files)
  }
}

module.exports = function () {
  const app = this
  app.use('query/getAllUploadedMedia', new Service())
  const service = app.service('query/getAllUploadedMedia')
  service.before(hooks.before)
  service.after(hooks.after)
}

module.exports.Service = Service
