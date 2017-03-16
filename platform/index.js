'use strict'

const Engine = require('./lib/Engine')

const engine = new Engine()
engine.initialize()
  .then(function () {
    engine.debug('engine is initialized, mode is [%s]', engine.config.env)
  })
  .catch(function (error) {
    console.log(error)
    process.exit(1)
  })
