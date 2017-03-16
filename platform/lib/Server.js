'use strict'

// libraries
const Promise = require('bluebird')
const Hapi = require('hapi')
const async = require('async')

// internals
const routes = require('./../server/routes')

class Server {
  constructor (engine) {
    this.type = 'server'
    this.name = 'server'
    this.debug = require('debug')('abibao:server')
    this.error = engine.error
    this.config = engine.config
    this.options = {
      host: this.config.host,
      port: this.config.port,
      labels: ['api', 'platform']
    }
    this.hapi = new Hapi.Server({
      debug: false,
      connections: {
        routes: {
          cors: true
        }
      }
    })
    this.hapi.method({
      name: 'request',
      method: (name, params) => {
        this.debug('request', name, params || {})
        return engine.domain.request(name, params || {})
      }
    })
  }
}

Server.prototype.initialize = function () {
  return new Promise((resolve, reject) => {
    this.debug('start initializing %o', this.options)
    this.hapi.connection(this.options)
    const plugins = ['auth']
    async.mapSeries(plugins, (item, next) => {
      require('../server/plugins/' + item)(this, function () {
        next(null, item)
      })
    }, (error, results) => {
      if (error) { return reject(error) }
      this.debug('plugins %o', results)
      // this.hapi.auth.default('jwt')
      this.hapi.route(routes.endpoints)
      this.hapi.start(() => {
        resolve()
      })
    })
  })
}

module.exports = Server
