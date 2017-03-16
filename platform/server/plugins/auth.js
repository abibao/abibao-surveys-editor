'use strict'

const AuthJWT = require('hapi-auth-jwt2')
const path = require('path')

const Provision = function (server, callback) {
  server.hapi.register({
    register: AuthJWT,
    options: { }
  },
  (error) => {
    const libpath = path.resolve(__dirname, 'lib')
    server.hapi.auth.strategy('jwt', 'jwt', {
      key: server.config.auth.secret,
      validateFunc: require(path.resolve(libpath, 'auth-jwt-validate')),
      verifyOptions: { algorithms: ['HS256'] }
    })
    callback(error)
  })
}

module.exports = Provision
