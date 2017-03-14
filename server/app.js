'use strict'

const path = require('path')
const Sequelize = require('sequelize')
const serveStatic = require('feathers').static
const compress = require('compression')
const cors = require('cors')
const feathers = require('feathers')
const configuration = require('feathers-configuration')
const auth = require('feathers-authentication')
const local = require('feathers-authentication-local')
const jwt = require('feathers-authentication-jwt')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const bodyParser = require('body-parser')
const socketio = require('feathers-socketio')
const middlewares = require('./middlewares')
const services = require('./services')

const blobService = require('feathers-blob')
const fs = require('fs-blob-store')
const blobStorage = fs(path.resolve(__dirname, 'uploads'))

const app = feathers()

app.configure(configuration(path.join(__dirname, '..')))

const routes = '/(' + app.get('routes').join('|') + ')'

app.sequelize = new Sequelize(app.get('postgres').database, app.get('postgres').username, app.get('postgres').password, {
  dialect: 'postgres',
  host: app.get('postgres').host,
  port: app.get('postgres').port,
  logging: false
})

const whitelist = app.get('corsWhitelist')
const corsOptions = {
  origin (origin, callback) {
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1
    callback(null, originIsWhitelisted)
  }
}

app.use(compress())
  .options('*', cors(corsOptions))
  .use(cors(corsOptions))
  .use(serveStatic(path.resolve(__dirname, app.get('public'))))
  .use('/wp_content', serveStatic(path.resolve(__dirname, 'uploads')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  // Configure feathers-authentication
  .configure(auth({
    secret: app.get('auth').secret,
    cookie: {
      enabled: app.get('auth').cookie.enabled,
      name: app.get('auth').cookie.name,
      secure: true
    },
    jwt: {
      audience: 'https://platform.abibao.com',
      issuer: 'platform.abibao.com',
      expiresIn: '1d'
    },
    session: true,
    successRedirect: false,
    failureRedirect: false
  }))
  .configure(jwt())
  .configure(local())
  // Upload Service
  .use('/uploads', blobService({Model: blobStorage}))
  // Always return the main index.html, so react-router render the route in the client
  .use(new RegExp(routes), (req, res) => {
    res.sendFile(path.resolve(__dirname, app.get('public'), 'index.html'))
  })
  // Configure services
  .configure(services)
  .configure(middlewares)

// create super user
app.service('users').create({
  email: app.get('accounts').users.super.email,
  password: app.get('accounts').users.super.password,
  permissions: ['*']
}).then(user => {
}).catch(console.error)

// create reader user
app.service('users').create({
  email: app.get('accounts').users.reader.email,
  password: app.get('accounts').users.reader.password,
  permissions: [
    '*:create'
  ]
}).then(user => {
}).catch(console.error)

app.service('authentication').hooks({
  before: {
    create: [
      auth.hooks.authenticate(['jwt', 'local'])
    ]
  }
})

module.exports = app
