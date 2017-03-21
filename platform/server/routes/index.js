'use strict'

exports.endpoints = [
  // server is alive
  { method: 'GET', path: '/v1/alive', config: require('../handlers/alive') },
  // admin
  { method: 'POST', path: '/v1/auth/admin', config: require('../handlers/auth/admin') }
]
