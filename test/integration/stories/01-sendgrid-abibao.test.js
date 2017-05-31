const rp = require('request-promise')
const app = require('../../../server/app')
const bus = require('../../../server/bus')
const chai = require('chai')
const expect = chai.expect

let token = ''
let server = false

describe('[integration] story sendgrid', function () {
  before(function (done) {
    server = app.listen(app.get('port'), app.get('host'), () => {
      app.bus = bus(app)
      done()
    })
  })
  after(function (done) {
    server.close(done)
  })
  it('should not refresh sendgrid templates because 401', (done) => {
    const opts = {
      method: 'POST',
      uri: 'http://localhost:3000/command/sendgridRefreshAllTemplates',
      json: true
    }
    rp(opts).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('statusCode').and.equal(401)
      done()
    })
  })
  it('should login as administrator', (done) => {
    const opts = {
      method: 'POST',
      uri: 'http://localhost:3000/authentication',
      body: {
        strategy: 'local',
        email: app.get('accounts').users.super.email,
        password: app.get('accounts').users.super.password
      },
      json: true
    }
    rp(opts).then((result) => {
      expect(result).to.have.property('accessToken')
      token = result.accessToken
      done()
    }).catch(done)
  })
  it('should refresh sendgrid template', (done) => {
    const opts = {
      method: 'POST',
      uri: 'http://localhost:3000/command/sendgridRefreshAllTemplates',
      headers: {
        authorization: token
      },
      json: true
    }
    rp(opts).then((result) => {
      expect(result).to.have.property('length')
      done()
    }).catch(done)
  })
  it('should success the security control', (done) => {
    const opts = {
      method: 'POST',
      uri: 'http://localhost:3000/command/surveyControlSecurity',
      headers: {
        authorization: token
      },
      body: {
        email: 'test@abibao.com',
        campaign: 'urn:campaign:tests',
        location: {
          origin: 'http://localhost',
          pathname: 'pathname',
          search: 'search'
        }
      },
      json: true
    }
    rp(opts).then((result) => {
      expect(result).to.have.property('connected')
      done()
    }).catch(done)
  })
})
