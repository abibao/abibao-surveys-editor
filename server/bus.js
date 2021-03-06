const config = require('../config/default')

let url = 'amqp://'
if (config.rabbitmq.user && config.rabbitmq.pass) {
  url = url + config.rabbitmq.user + ':' + config.rabbitmq.pass + '@'
}
url = url + config.rabbitmq.host + ':' + config.rabbitmq.port

module.exports = (app) => {
  const bus = require('servicebus').bus({url})
  bus.subscribe('BUS_EVENT_IS_ALIVE', require('./events/isAliveEvent'), {type: 'fanout', exchangeName: 'amq.fanout'})
  bus.listen('BUS_EVENT_BATCH_EMAILING_SENDGRID', require('./events/batchEmailingSendgridEvent'))
  // online and ready
  bus.on('ready', () => {
    bus.publish('BUS_EVENT_IS_ALIVE', {
      name: 'abibao-platform-server'
    })
  })
  bus.app = app
  return bus
}
