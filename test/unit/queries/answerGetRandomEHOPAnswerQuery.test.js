const Promise = require('bluebird')
const feathers = require('feathers')
const chai = require('chai')
const expect = chai.expect

const Service = require('../../../server/services/domain/queries/answerGetRandomEHOPAnswerQuery').Service

const app = feathers()

app.bus = {
  send (chanel, message) { }
}
app.error = (message) => {
}
app.info = (message) => {
}
app.get = (param) => {
  switch (param) {
    case 'postgres':
      return {
        force: false
      }
    default:
      return {}
  }
}
app.sequelize = {
  define: (name) => {
    return {
      sync: () => {},
      findAll: (params) => {
        return new Promise((resolve, reject) => {
          if (params.where.campaign_id === 'urn:individual:error') {
            return reject(new Error('ERROR_TEST_UNIT'))
          }
          if (params.where.campaign_id === '000000') {
            return resolve([{dataValues: {count: 0}}])
          }
          if (params.where.campaign_id === '111111') {
            return resolve([{dataValues: {count: 4}}])
          }
          return reject(new Error('ERROR_TEST_UNIT'))
        })
      }
    }
  }
}
app.use('query/answerGetRandomEHOPAnswer', new Service())

describe('[unit] query answerGetRandomEHOPAnswer', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail because individual is mandatory', (done) => {
    app.service('query/answerGetRandomEHOPAnswer').find({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_INDIVIDUAL_MANDATORY')
      done()
    })
  })
  it('should fail because an error occured', (done) => {
    app.service('query/answerGetRandomEHOPAnswer').find({individual: 'urn:individual:error'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_TEST_UNIT')
      done()
    })
  })
  it('should return random=false and count=0', (done) => {
    app.service('query/answerGetRandomEHOPAnswer').find({individual: 'urn:individual:test', campaign: '000000'}).then((result) => {
      expect(result).to.have.property('count').and.equal(0)
      expect(result).to.have.property('random').and.equal(false)
      done()
    }).catch(done)
  })
  it('should return an aswer random', (done) => {
    app.service('query/answerGetRandomEHOPAnswer').find({individual: 'urn:individual:test', campaign: '111111'}).then((result) => {
      done()
    }).catch(done)
  })
})
