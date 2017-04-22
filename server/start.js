const app = require('./app')
const bus = require('./bus')

// mock logstash for unit testing and without docker started in development
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  const logstash = require('./../test/mock/logstash')
  logstash()
}

// Start server
app.listen(app.get('port'), app.get('host'), () => {
  console.log('server has just started')
  app.bus = bus(app)
})
