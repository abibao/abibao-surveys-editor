'use strict'

const intersection = require('lodash').intersection
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

module.exports.hasRole = function(permissions = []) {
  return function(hook) {
  	let found = intersection(hook.params.user.permissions, permissions)
  	if (found.length > 0) {
  		return hook
  	} else {
  		throw new Error('No permissions to do that.')
  	}
  }
}
