'use strict'

const path = require('path')
const nconf = require('nconf')
const GoogleStrategy = require('passport-google-oauth20').Strategy

nconf.argv().env().file({ file: 'nconf.json' })

module.exports = {
  env: nconf.get('ABIBAO_ENV') || 'deve',
  host: nconf.get('ABIBAO_SERVICE_HOST') || '0.0.0.0',
  port: nconf.get('ABIBAO_SERVICE_PORT') || 3000,
  analytics: nconf.get('ABIBAO_GOOGLE_ANALYTICS') || 'UA-77334841-5',
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
        permissions: ['admin']
      },
      reader: {
        email: nconf.get('ABIBAO_READER_EMAIL') || 'reader@abibao.com',
        password: nconf.get('ABIBAO_READER_PASSWORD') || 'password',
        permissions: ['reader']
      }
    }
  },
  authentication: {
    secret: nconf.get('ABIBAO_AUTH_SECRET') || '148fc7815e552128cc7d64850750e34a0cbfbfaabc50ced3e9a330bf40a95392e2fe',
    strategies: [
      'jwt',
      'local',
      'oauth2'
    ],
    path: '/authentication',
    service: 'users',
    oauth2: {
      name: 'google',
      Strategy: GoogleStrategy,
      clientID: nconf.get('ABIBAO_GOOGLE_CLIENT_ID') || '10370308640-lfult5ck78v8pu6jknjevp0mqv61tt2e.apps.googleusercontent.com',
      clientSecret: nconf.get('ABIBAO_GOOGLE_CLIENT_SECRET') || 'yZeuRmhZhGCdh0E7jcLR94ck',
      scope: ['profile'],
      callbackURL: nconf.get('ABIBAO_GOOGLE_CALLBACK_URL') || 'http://localhost:4000/auth/google/callback'
    },
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
