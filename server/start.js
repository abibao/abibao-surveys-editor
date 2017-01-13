'use strict'

const Sequelize = require('sequelize')
const feathers = require('feathers')
const configuration = require('feathers-configuration')
const serveStatic = require('feathers').static

const app = feathers()

app.configure(configuration())

app.sequelize = new Sequelize(app.get('postgres').database, app.get('postgres').username, app.get('postgres').password, {
  dialect: 'postgres',
  host: app.get('postgres').host,
  port: app.get('postgres').port,
  logging: false
})

app.use('/', serveStatic(app.get('public')))

app.listen(app.get('port'), app.get('host'), () => {
})
