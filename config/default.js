'use strict'

const path = require('path')
const nconf = require('nconf')
const _ = require('lodash')
const Verifier = require('feathers-authentication-oauth2').Verifier
const GoogleStrategy = require('passport-google-oauth20').Strategy

class GoogleVerifier extends Verifier {
  verify (req, accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value
    let authorized = false
    _.map(this.app.get('accounts').administrators, (item) => {
      if (item === email) {
        authorized = true
      }
    })
    if (authorized === false) {
      return req.res.redirect(this.app.get('domains').admin + '/admin/login?error=NotAuthorized')
    }
    //
    profile.picture = profile.photos[0].value || 'default.jpg'
    profile.email = email
    profile.password = accessToken
    profile.permissions = ['admin']
    //
    delete profile.photos
    delete profile.emails
    delete profile._rawj
    delete profile._json
    //
    this.app.service('users').create(profile).then((user) => {
      return this.app.passport.createJWT({
        userId: user.id
      }, {
        secret: this.app.get('authentication').secret,
        jwt: this.app.get('authentication').jwt
      }).then((accessToken) => {
        done(null, profile, {accessToken, domain: this.app.get('domains').admin})
      })
    }).catch((error) => {
      console.log(error)
      done(error)
    })
  }
}

const GoogleHandler = (req, res) => {
  res.redirect(req.payload.domain + '/admin/login?accessToken=' + req.payload.accessToken)
}

nconf.argv().env().file({ file: 'nconf.json' })

module.exports = {
  env: nconf.get('ABIBAO_ENV') || 'deve',
  host: nconf.get('ABIBAO_SERVICE_HOST') || 'localhost',
  port: nconf.get('ABIBAO_SERVICE_PORT') || 3000,
  domains: {
    api: nconf.get('ABIBAO_DOMAIN_API') || 'http://localhost:3000',
    admin: nconf.get('ABIBAO_DOMAIN_ADMIN') || 'http://localhost:4000',
    reader: nconf.get('ABIBAO_DOMAIN_READER') || 'http://localhost:4000'
  },
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
  corsWhitelist: ['localhost', 'accounts.google.com'],
  cryptr: {
    secret: nconf.get('ABIBAO_CRYPTR_SECRET') || 'secret key'
  },
  accounts: {
    administrators: [
      'gperreymond@gmail.com',
      'boitaumail@gmail.com'
    ],
    users: {
      super: {
        email: nconf.get('ABIBAO_SUPERU_EMAIL') || 'administrator@abibao.com',
        password: nconf.get('ABIBAO_SUPERU_PASSWORD') || '9SY2wVpace53jFahtCzBsU5GMVkusfh8Gue4s2AC',
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
    shouldSetupSuccessRoute: false,
    strategies: ['jwt', 'oauth2', 'local'],
    path: '/authentication',
    service: 'users',
    oauth2: {
      name: 'google',
      Strategy: GoogleStrategy,
      Verifier: GoogleVerifier,
      callbackURL: nconf.get('ABIBAO_DOMAIN_API') ? nconf.get('ABIBAO_DOMAIN_API') + '/auth/google/callback' : 'http://localhost:3000/auth/google/callback',
      entity: 'user',
      service: 'users',
      passReqToCallback: true,
      handler: GoogleHandler,
      scope: ['profile', 'email'],
      clientID: nconf.get('ABIBAO_GOOGLE_CLIENT_ID') || '10370308640-t9s5mm5dk2mmerjoecql4uc8eb520ub6.apps.googleusercontent.com',
      clientSecret: nconf.get('ABIBAO_GOOGLE_CLIENT_SECRET') || 'ExbftaUix_chjykO5949OHxC'
    },
    jwt: {
      header: {
        type: 'access'
      },
      audience: 'accounts.abibao.com',
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
