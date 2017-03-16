'use strict'

exports.endpoints = [
  // server is alive
  { method: 'GET', path: '/v1/alive', config: require('../handlers/alive') },
  // admin
  { method: 'POST', path: '/v1/admin/auth', config: require('../handlers/admin/auth') }
]
