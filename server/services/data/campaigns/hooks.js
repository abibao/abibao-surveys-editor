const uuid = require('../../globalHooks').uuid
const auth = require('feathers-authentication')

exports.before = {
  all: [
    auth.hooks.authenticate(['jwt', 'local'])
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
