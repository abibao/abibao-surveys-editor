'use strict'

// libraries
const Promise = require('bluebird')
const path = require('path')
const _ = require('lodash')
const Cryptr = require('cryptr')
const Server = require('node-cqrs-framework').Server
const Client = require('node-cqrs-framework').Client

class Domain {
  constructor (engine) {
    this.type = 'domain'
    this.name = 'domain'
    this.debug = require('debug')('abibao:domain')
    this.error = engine.error
    this.config = require('../config')
    this.cryptr = new Cryptr(this.config.cryptr.secret)
    this.debug('cqrs location', path.resolve(__dirname, '..'))
    this.cqrs = {
      client: new Client(this.config.rabbitmq),
      server: new Server({
        bus: this.config.rabbitmq,
        source: path.resolve(__dirname, '..'),
        patterns: this.config.cqrs.patterns
      })
    }
  }
  getIDfromURN (urn) {
    return this.cryptr.decrypt(_.last(_.split(urn, ':')))
  }
  getURNfromID (model, id) {
    return 'urn:abibao:database:' + model + ':' + this.cryptr.encrypt(id)
  }
}

Domain.prototype.request = function (promise, params) {
  return new Promise((resolve, reject) => {
    this.cqrs.client.request(promise, params, (result) => {
      if (result.eraro) {
        reject(result)
      } else {
        resolve(result)
      }
    })
  })
}

Domain.prototype.initialize = function () {
  return new Promise((resolve, reject) => {
    this.debug('start initializing')
    const initializers = [this.cqrs.client.initialize(), this.cqrs.server.initialize()]
    Promise.all(initializers).then(resolve).catch(reject)
  })
}

module.exports = Domain
