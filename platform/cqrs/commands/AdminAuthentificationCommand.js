'use strict'

const Promise = require('bluebird')

const handler = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('WTF ERROR'))
    // resolve({debug: true})
  })
}

module.exports = handler
