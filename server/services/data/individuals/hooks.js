const auth = require('feathers-authentication')
const uuid = require('../../globalHooks').uuid
const urn = require('../../globalHooks').urn

exports.before = {
  all: [
    auth.hooks.authenticate('jwt')
  ],
  find: [],
  get: [],
  create: [
    uuid(),
    urn()
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
