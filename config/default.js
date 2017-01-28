'use strict'

const path = require('path')
const nconf = require('nconf')

nconf.argv().env().file({ file: 'nconf.json' })

module.exports = {
  host: nconf.get('ABIBAO_SERVICE_HOST') || 'localhost',
  port: nconf.get('ABIBAO_SERVICE_PORT') || 8000,
  superu: {
    email: nconf.get('ABIBAO_ADMINISTRATOR_EMAIL') || 'administrator@abibao.com',
    password: nconf.get('ABIBAO_ADMINISTRATOR_PASSWORD') || 'password'
  },
  postgres: {
    host: nconf.get('ABIBAO_POSTGRES_HOST') || 'localhost',
    port: nconf.get('ABIBAO_POSTGRES_PORT') || 5432,
    database: nconf.get('ABIBAO_POSTGRES_DB') || 'abibao',
    username: nconf.get('ABIBAO_POSTGRES_USER') || 'abibao',
    password: nconf.get('ABIBAO_POSTGRES_PASSWORD') || 'abibao'
  },
  public: path.resolve(__dirname, '../build'),
  corsWhitelist: ['localhost'],
  auth: {
    token: {
      secret: nconf.get('ABIBAO_AUTH_TOKEN_SECRET') || 'secret key'
    },
    cookie: {
      enabled: true,
      name: nconf.get('ABIBAO_AUTH_COOKIE_NAME') || 'rememberMe'
    }
  }
}
