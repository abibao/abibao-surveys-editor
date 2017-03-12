'use strict'

const hasRole = require('../../../globalHooks').hasRole
const uuid = require('../../../globalHooks').uuid

exports.before = {
  all: [],
  find: [
    hasRole(['*'])
  ],
  get: [
    hasRole(['*', 'reader'])
  ],
  create: [
    hasRole(['*'])
  ],
  update: [
    hasRole(['*'])
  ],
  patch: [
    hasRole(['*'])
  ],
  remove: [
    hasRole(['*'])
  ]
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
