'use strict'

const path = require('path')
const nconf = require('nconf')

nconf.argv().env().file({ file: 'nconf.json' })

module.exports = {
  host: nconf.get('ABIBAO_SERVICE_HOST') || '127.0.0.1',
  port: nconf.get('ABIBAO_SERVICE_PORT') || 3001,
  force: true,
  superu: {
    email: nconf.get('ABIBAO_ADMINISTRATOR_EMAIL') || 'administrator@abibao.com',
    password: nconf.get('ABIBAO_ADMINISTRATOR_PASSWORD') || 'password'
  },
  postgres: {
    host: nconf.get('ABIBAO_POSTGRES_HOST') || '127.0.0.1',
    port: nconf.get('ABIBAO_POSTGRES_PORT') || 5432,
    database: nconf.get('ABIBAO_POSTGRES_DB') || 'circle_test',
    username: nconf.get('ABIBAO_POSTGRES_USER') || 'ubuntu',
    password: nconf.get('ABIBAO_POSTGRES_PASSWORD') || ''
  },
  public: path.resolve(__dirname, '..', nconf.get('ABIBAO_WWW_DIRPATH') || 'build'),
  routes: ['admin', 'admin/login', 'admin/campaigns', 'admin/editor/:id', 'admin/reader/:id'],
  corsWhitelist: ['localhost'],
  auth: {
    secret: nconf.get('ABIBAO_AUTH_TOKEN_SECRET') || 'secret key',
    token: {
      secret: nconf.get('ABIBAO_AUTH_TOKEN_SECRET') || 'secret key'
    },
    local: {},
    cookie: {
      enabled: true,
      name: nconf.get('ABIBAO_AUTH_COOKIE_NAME') || 'rememberMe'
    }
  }
}
