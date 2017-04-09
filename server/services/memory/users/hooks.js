'use strict'

const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const local = require('feathers-authentication-local')

exports.before = {
  all: [
    auth.hooks.authenticate('jwt'),
    permissions.hooks.checkPermissions({ service: 'users' }),
    permissions.hooks.isPermitted()
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
