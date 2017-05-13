const auth = require('feathers-authentication')
const uuid = require('../../globalHooks').uuid

exports.before = {
  all: [
    auth.hooks.authenticate('jwt')
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
