const app = require('./app')

// Start server
app.listen(app.get('port'), app.get('host'), () => {
  console.log('server has just started')
})
