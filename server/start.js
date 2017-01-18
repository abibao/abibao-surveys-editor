'use strict'

const Sequelize = require('sequelize')
const feathers = require('feathers')
const configuration = require('feathers-configuration')
const socketio = require('feathers-socketio')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const serveStatic = require('feathers').static
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
  .use('/', serveStatic(app.get('public')))
  .use('/editor/:id', serveStatic(app.get('public')))
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  .configure(services)
  .configure(middlewares)

app.listen(app.get('port'), app.get('host'), () => {
})
