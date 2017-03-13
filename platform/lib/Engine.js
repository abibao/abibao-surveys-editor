'use strict'

// libraries
const Promise = require('bluebird')

// internals
const Domain = require('./Domain')
const Server = require('./Server')

class Engine {
  constructor () {
    this.type = 'engine'
    this.name = 'engine'
    this.debug = require('debug')('abibao:engine')
    this.error = require('debug')('abibao:error')
    this.version = process.env['npm_package_version']
    this.starttime = new Date()
  }
  initialize () {
    this.debug('initialize started')
    // load configurations
    this.config = require('../config/default')
    // initializers
    this.domain = new Domain(this)
    this.server = new Server(this)
    const promises = [this.domain.initialize(), this.server.initialize()]
    return Promise.all(promises)
  }
}

module.exports = Engine
