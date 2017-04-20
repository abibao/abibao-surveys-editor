'use strict'

const assert = require('assert')
const request = require('request')
const app = require('../../../server/app')

describe('[integration] user service', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })

  after(function (done) {
    this.server.close(done)
  })

  it('should fail to login', (done) => {
    request({
      method: 'POST',
      url: 'http://localhost:3030/authentication',
      json: true,
      headers: {
      }
    }, function (err, res, body) {
      assert.equal(res.statusCode, 401)
      assert.equal(body.code, 401)
      done(err)
    })
  })

  it('should fail to login as administrator', (done) => {
    request({
      method: 'POST',
      url: 'http://localhost:3030/authentication',
      json: true,
      headers: {
      },
      body: {
        email: 'administrator@abibao.com',
        password: 'not a good one'
      }
    }, function (err, res, body) {
      assert.equal(res.statusCode, 401)
      assert.equal(body.code, 401)
      done(err)
    })
  })

  it('should success to login as administrator', (done) => {
    request({
      method: 'POST',
      url: 'http://localhost:3030/authentication',
      json: true,
      headers: {
      },
      body: {
        email: 'administrator@abibao.com',
        password: 'password'
      }
    }, function (err, res, body) {
      assert.equal(res.statusCode, 201)
      assert.ok(body.accessToken != null)
      done(err)
    })
  })
})
