'use strict'

module.exports = {
  auth: false,
  handler (request, reply) {
    reply({alive: true})
  }
}
