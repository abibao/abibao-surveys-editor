'use strict'

const Promise = require('bluebird')
const config = require('../../config')
const _ = require('lodash')

const handler = function (params) {
  return new Promise((resolve, reject) => {
    // match credentials in database memory
    let user = _.find(config.accounts.users, (u) => {
      return (params.email === u.email) && (params.password === u.password)
    })
    if (!user) {
      return reject(new Error('BAD_CREDENTIALS'))
    }
    // create the jwt
    this.server.requesters['CreateJwtTokenCommand'].request(params, (response) => {
      resolve(response)
    })
  })
}

module.exports = handler
