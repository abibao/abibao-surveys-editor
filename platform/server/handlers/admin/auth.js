'use strict'

// libraries
const Boom = require('boom')

module.exports = {
  auth: false,
  handler (request, reply) {
    request.server.methods.request('AdminAuthentificationCommand', request.payload)
      .then((result) => {
        reply(result)
      })
      .catch((error) => {
        reply(Boom.badRequest(error))
      })
  }
}
