'use strict'

const Promise = require('bluebird')
const JWT = require('jsonwebtoken')
const config = require('../../config')

const handler = function (params) {
  return new Promise((resolve, reject) => {
    const token = JWT.sign(params, config.auth.secret, { expiresIn: 60 * 60 * 24 })
    resolve({token})
  })
}

module.exports = handler
