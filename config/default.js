'use strict'

const path = require('path')
const nconf = require('nconf')

nconf.argv().env().file({ file: 'nconf.json' })

module.exports = {
  env: nconf.get('ABIBAO_ENV') || 'deve',
  host: nconf.get('ABIBAO_SERVICE_HOST') || 'localhost',
  port: nconf.get('ABIBAO_SERVICE_PORT') || 3001,
  users: {
    super: {
      email: nconf.get('ABIBAO_SUPERU_EMAIL') || 'administrator@abibao.com',
      password: nconf.get('ABIBAO_SUPERU_PASSWORD') || 'password'
    },
    reader: {
      email: nconf.get('ABIBAO_READER_EMAIL') || 'application@abibao.com',
      password: nconf.get('ABIBAO_READER_PASSWORD') || 'password'
    }
  },
  postgres: {
    host: nconf.get('ABIBAO_POSTGRES_HOST') || 'localhost',
    port: nconf.get('ABIBAO_POSTGRES_PORT') || 5432,
    database: nconf.get('ABIBAO_POSTGRES_DB') || 'circle_test',
    username: nconf.get('ABIBAO_POSTGRES_USER') || 'ubuntu',
    password: nconf.get('ABIBAO_POSTGRES_PASSWORD') || '',
    force: false
  },
  rabbitmq: {
    host: nconf.get('ABIBAO_RABBITMQ_HOST') || 'localhost',
    port: nconf.get('ABIBAO_RABBITMQ_PORT') || 5672,
    user: nconf.get('ABIBAO_RABBITMQ_USER') || 'guest',
    pass: nconf.get('ABIBAO_RABBITMQ_PASSWORD') || 'guest'
  },
  cqrs: {
    patterns: ['cqrs/commands/**/*.js', 'cqrs/queries/**/*.js']
  },
  public: path.resolve(__dirname, '..', nconf.get('ABIBAO_WWW_DIRPATH') || 'build'),
  routes: ['admin', 'admin/login', 'admin/entities', 'admin/campaigns', 'admin/editor/:id', 'admin/reader/:id'],
  corsWhitelist: ['localhost'],
  cryptr: {
    secret: nconf.get('ABIBAO_CRYPTR_SECRET') || 'secret key'
  },
  auth: {
    secret: nconf.get('ABIBAO_AUTH_SECRET') || 'secret key',
    cookie: {
      enabled: true,
      name: nconf.get('ABIBAO_AUTH_COOKIE_NAME') || 'rememberMe'
    }
  }
}
