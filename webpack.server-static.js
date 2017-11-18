var serverFactory = require('spa-server')

var server = serverFactory.create({
  path: '/code/public',
  port: 8043,
  fallback: '/index.html'
})

server.start()
