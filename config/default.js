'use strict'

const path = require('path')
const nconf = require('nconf')

nconf.argv().env().file({ file: 'nconf.json' })

module.exports = {
  env: nconf.get('ABIBAO_ENV') || 'deve',
  host: nconf.get('ABIBAO_SERVICE_HOST') || '0.0.0.0',
  port: nconf.get('ABIBAO_SERVICE_PORT') || 3000,
  logstash: {
    host: nconf.get('ABIBAO_LOGSTASH_HOST') || 'localhost',
    port: nconf.get('ABIBAO_LOGSTASH_PORT') || 5000
  },
  couchdb: {
    host: nconf.get('ABIBAO_COUCHDB_HOST') || 'localhost',
    port: nconf.get('ABIBAO_COUCHDB_PORT') || 5984,
    user: nconf.get('ABIBAO_COUCHDB_USER') || 'infra',
    pass: nconf.get('ABIBAO_COUCHDB_PASSWORD') || 'infra'
  },
  postgres: {
    host: nconf.get('ABIBAO_POSTGRES_HOST') || 'localhost',
    port: nconf.get('ABIBAO_POSTGRES_PORT') || 5432,
    database: nconf.get('ABIBAO_POSTGRES_DB') || 'infra',
    username: nconf.get('ABIBAO_POSTGRES_USER') || 'infra',
    password: nconf.get('ABIBAO_POSTGRES_PASSWORD') || 'infra',
    force: false
  },
  rabbitmq: {
    host: nconf.get('ABIBAO_RABBITMQ_HOST') || 'localhost',
    port: nconf.get('ABIBAO_RABBITMQ_PORT') || 5672,
    user: nconf.get('ABIBAO_RABBITMQ_USER') || 'guest',
    pass: nconf.get('ABIBAO_RABBITMQ_PASSWORD') || 'guest'
  },
  sendgrid: {
    key: nconf.get('ABIBAO_SENDGRID_KEY') || 'sendgrid',
    templates: {
      passwordless: nconf.get('ABIBAO_SENDGRID_TEMPLATE_PASSWORDLESS') || 'sendgrid'
    }
  },
  slack: {
    webhook: nconf.get('ABIBAO_SLACK_WEBHOOK') || 'http://localhost'
  },
  public: path.resolve(__dirname, '..', nconf.get('ABIBAO_WWW_DIRPATH') || 'public'),
  corsWhitelist: ['localhost'],
  cryptr: {
    secret: nconf.get('ABIBAO_CRYPTR_SECRET') || 'secret key'
  },
  accounts: {
    users: {
      super: {
        email: nconf.get('ABIBAO_SUPERU_EMAIL') || 'administrator@abibao.com',
        password: nconf.get('ABIBAO_SUPERU_PASSWORD') || 'password',
        roles: ['admin']
      },
      reader: {
        email: nconf.get('ABIBAO_READER_EMAIL') || 'reader@abibao.com',
        password: nconf.get('ABIBAO_READER_PASSWORD') || 'password',
        roles: ['reader']
      }
    }
  },
  authentication: {
    secret: '148fc7815e552128cc7d64850750e34a0cbfbfaabc50ced3e9a330bf40a95392e2fedcdce64b101c4ab42609b1f26c093203b80c318eb0d6c62090589bd19c1ac55bca21c8b1f4d8d9a46b904f60728532ebce15ae03b47377e3665efe97d29c8e40e1a56b6b5700bdc48eb3daf3322a07d2e746326e984b4465df900c8b98317d38abeec6fbc85f64ce8e309117e4b347c180043011c1dce95d096809b83d3132deff5c429d5596e201d03e8350981b28c493ebf334aec4cd593d3be8f0ca5745fc702479614dc6264cf6e21550c5ee6aee3ea0883db9fcbb54e4f6f3794c928742c75e9ab62d10e2cf4c6b301f6534f7339c5122ccea084089c0263604999b',
    strategies: [
      'jwt',
      'local'
    ],
    path: '/authentication',
    service: 'users',
    jwt: {
      header: {
        type: 'access'
      },
      audience: 'https://api.abibao.com',
      subject: 'anonymous',
      issuer: 'feathers',
      algorithm: 'HS256',
      expiresIn: '1d'
    },
    local: {
      entity: 'user',
      service: 'users',
      usernameField: 'email',
      passwordField: 'password'
    }
  }
}
