const app = require('./app')
const bus = require('./bus')
// const allRoutes = require('express-list-endpoints')

// Start server
app.listen(app.get('port'), app.get('host'), () => {
  console.log('server has just started')
  app.bus = bus(app)
  // console.log(allRoutes(app))
})
