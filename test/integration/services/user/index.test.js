'use strict'

const assert = require('assert')
const request = require('request')
const app = require('../../../../server/app')

describe('[integration] user service', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })

  after(function (done) {
    this.server.close(done)
  })

  it('failed to login as administrator', (done) => {
    request({
      url: 'http://localhost:3030/path/to/nowhere',
      headers: {
        'Accept': 'text/html'
      }
    }, function (err, res, body) {
      assert.equal(res.statusCode, 404)
      assert.ok(body.indexOf('<html>') !== -1)
      done(err)
    })
  })
})
