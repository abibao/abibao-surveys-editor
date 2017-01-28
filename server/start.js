'use strict'

const path = require('path')
const Sequelize = require('sequelize')
const feathers = require('feathers')
const serveStatic = require('feathers').static
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const configuration = require('feathers-configuration')
const socketio = require('feathers-socketio')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const services = require('./services')
const middlewares = require('./middlewares')

const app = feathers()

app.configure(configuration())

app.sequelize = new Sequelize(app.get('postgres').database, app.get('postgres').username, app.get('postgres').password, {
  dialect: 'postgres',
  host: app.get('postgres').host,
  port: app.get('postgres').port,
  logging: false
})

app
  .use(favicon(path.join(app.get('public'), 'favicon.ico')))
  .use('/', serveStatic(app.get('public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  .configure(services)
  .configure(middlewares)

app.listen(app.get('port'), app.get('host'), () => {
})
