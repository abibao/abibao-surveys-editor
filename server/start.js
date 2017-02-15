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
  .use('/', serveStatic(app.get('public')))
  .use('/admin/*', serveStatic(app.get('public')))
  .use('/wp_content', serveStatic(path.resolve(__dirname, 'uploads')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  // Configure feathers-authentication
  .configure(auth({
    secret: app.get('auth').token.secret,
    cookie: {
      enabled: app.get('auth').cookie.enabled,
      name: app.get('auth').cookie.name,
      secure: true
    },
    jwt: {
      audience: 'http://abibao.com',
      issuer: 'api.abibao.com'
    },
    session: true,
    successRedirect: false,
    failureRedirect: false
  }))
  .configure(local())
  .configure(jwt())
  // Configure services
  .configure(services)
  .configure(middlewares)

// Upload Service
app.use('/uploads', blobService({Model: blobStorage}))

// User service
const newUser = {
  email: app.get('superu').email,
  password: app.get('superu').password,
  permissions: ['*']
}
app.service('users').create(newUser).then(user => {
  console.log('Created default user', user)
}).catch(console.error)

// Start server
app.listen(app.get('port'), app.get('host'), () => {
})
