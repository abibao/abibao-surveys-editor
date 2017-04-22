const http = require('http')

module.exports = () => {
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('logstash')
  }).listen(5000)
}
