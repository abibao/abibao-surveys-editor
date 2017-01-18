'use strict'

const uuid = require('uuid')

module.exports.uuid = function () {
  return function (hook) {
    if (hook.data.id) {
      return hook
    } else {
      hook.data.id = uuid.v4()
      return hook
    }
  }
}
