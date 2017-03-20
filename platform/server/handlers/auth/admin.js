'use strict'

// libraries
const Boom = require('boom')
const Joi = require('joi')

module.exports = {
  auth: false,
  payload: {
    allow: ['application/x-www-form-urlencoded', 'application/json']
  },
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  handler (request, reply) {
    request.server.methods.request('AuthenticateAdministratorCommand', request.payload)
      .then((result) => {
        reply(result)
      })
      .catch((error) => {
        reply(Boom.badRequest(error))
      })
  }
}
