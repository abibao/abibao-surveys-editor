'use strict'

const hooks = require('feathers-hooks')
const local = require('feathers-authentication-local')

exports.before = {
  all: [],
  find: [
    hooks.disable('external')
  ],
  get: [],
  create: [
    hooks.disable('external'),
    local.hooks.hashPassword({ passwordField: 'password' })
  ],
  update: [
    hooks.disable('external')
  ],
  patch: [
    hooks.disable('external')
  ],
  remove: [
    hooks.disable('external')
  ]
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
