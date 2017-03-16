'use strict'

const hooks = require('feathers-hooks')
const local = require('feathers-authentication-local')

exports.before = {
  all: [
    hooks.disable('external')
  ],
  find: [],
  get: [],
  create: [
    local.hooks.hashPassword({ passwordField: 'password' })
  ],
  update: [],
  patch: [],
  remove: []
}

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}
