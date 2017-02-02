'use strict'

const auth = require('feathers-authentication')

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.hooks.authenticate(['jwt', 'local'])
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
