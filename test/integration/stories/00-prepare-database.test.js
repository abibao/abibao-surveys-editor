const rp = require('request-promise')
const app = require('../../../server/app')
const bus = require('../../../server/bus')
const chai = require('chai')
const expect = chai.expect

let token = ''
let server = false

describe('[integration] story prepare database', function () {
  before(function (done) {
    server = app.listen(app.get('port'), app.get('host'), () => {
      app.bus = bus(app)
      done()
    })
  })
  after(function (done) {
    server.close(done)
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
  it('should delete all individuals', (done) => {
    const opts = {
      method: 'DELETE',
      uri: 'http://localhost:3000/api/individuals',
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
  it('should delete all campaigns', (done) => {
    const opts = {
      method: 'DELETE',
      uri: 'http://localhost:3000/api/campaigns',
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
  it('should add campaign in position 1', (done) => {
    const opts = {
      method: 'POST',
      uri: 'http://localhost:3000/api/campaigns',
      headers: {
        authorization: token
      },
      body: {
        name: 'Nouvelle campagne (1)',
        company: 'Abibao',
        reader: 'abibao',
        position: 1,
        picture: 'images/default/campaign.png',
        data: {pages: [{name: 'page1'}]}
      },
      json: true
    }
    rp(opts).then((result) => {
      expect(result).to.have.property('id')
      expect(result).to.have.property('description')
      expect(result).to.have.property('name').to.equal('Nouvelle campagne (1)')
      expect(result).to.have.property('company').to.equal('Abibao')
      expect(result).to.have.property('reader').to.equal('abibao')
      expect(result).to.have.property('position').to.equal(1)
      expect(result).to.have.property('picture').to.equal('images/default/campaign.png')
      expect(result).to.have.property('data')
      done()
    }).catch(done)
  })
  it('should add campaign for reader abibao', (done) => {
    const opts = {
      method: 'POST',
      uri: 'http://localhost:3000/api/campaigns',
      headers: {
        authorization: token
      },
      body: {
        name: 'Nouvelle campagne (1)',
        company: 'Other',
        reader: 'abibao',
        position: 0,
        picture: 'images/default/campaign.png',
        data: {pages: [{name: 'page1'}]}
      },
      json: true
    }
    rp(opts).then((result) => {
      expect(result).to.have.property('id')
      expect(result).to.have.property('description')
      expect(result).to.have.property('name').to.equal('Nouvelle campagne (1)')
      expect(result).to.have.property('company').to.equal('Other')
      expect(result).to.have.property('reader').to.equal('abibao')
      expect(result).to.have.property('position').to.equal(0)
      expect(result).to.have.property('picture').to.equal('images/default/campaign.png')
      expect(result).to.have.property('data')
      done()
    }).catch(done)
  })
  it('should add an individual email=test@abibao.com', (done) => {
    const opts = {
      method: 'POST',
      uri: 'http://localhost:3000/api/individuals',
      headers: {
        authorization: token
      },
      body: {
        email: 'test@abibao.com',
        urn: 'urn:individual:test'
      },
      json: true
    }
    rp(opts).then((result) => {
      expect(result).to.have.property('id')
      expect(result).to.have.property('email').to.equal('test@abibao.com')
      expect(result).to.have.property('urn').to.equal('urn:individual:test')
      done()
    }).catch(done)
  })
})
