'use strict'

const auth = require('feathers-authentication')
const permissions = require('feathers-permissions')
const uuid = require('../../globalHooks').uuid

exports.before = {
  all: [
    auth.hooks.authenticate('jwt'),
    permissions.hooks.checkPermissions({ service: 'users' }),
    permissions.hooks.isPermitted()
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
}

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [
    uuid()
  ],
  update: [],
  patch: [],
  remove: []
}
