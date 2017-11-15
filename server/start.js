const app = require('./app')
const bus = require('./bus')

// Start server
app.listen(app.get('port'), app.get('host'), () => {
  console.log('server has just started', app.get('port'))
  app.bus = bus(app)
})
