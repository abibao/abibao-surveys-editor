const chai = require('chai')
const expect = chai.expect
const Promise = require('bluebird')

const Service = require('../../../server/services/domain/commands/campaignCreateEmailingCommand').Service
const service = new Service()

// Mocking feathers application
const app = {
  config: {
    env: 'test'
  },
  bus: {
    send (name, message) {
    }
  },
  info (message) {
  },
  error (message) {
  },
  get (prop) {
    return this.config[prop]
  },
  service (name) {
    return {
      get (params) {
        return Promise.resolve({})
      },
      find (params) {
        return {
          then () {
            console.log('service.find', name, params)
            if (name === 'api/individuals') {
              if (params.query.email === 'test@abibao.com') {
                return [{email: 'test@abibao.com', urn: 'urn:individual'}]
              } else {
                return []
              }
            } else {
              return {}
            }
          }
        }
      }
    }
  }
}

before(function (done) {
  service.setup(app)
  done()
})

describe('[unit] command campaignCreateEmailing', function () {
  it('should fail because email is mandatory', (done) => {
    service.create({}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_EMAIL_MANDATORY')
      done()
    })
  })
  it('should fail because template is mandatory', (done) => {
    service.create({email: 'not@abibao.com'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_TEMPLATE_MANDATORY')
      done()
    })
  })
  it('should fail because template is mandatory', (done) => {
    service.create({email: 'not@abibao.com', template: 'template'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      expect(error).to.have.property('eraro').and.equal(true)
      expect(error).to.have.property('code').and.equal('ERROR_PARAMS_URL_MANDATORY')
      done()
    })
  })
  it('should fail because template is mandatory', (done) => {
    service.create({email: 'not@abibao.com', template: 'template', url: 'http://test.abibao.com'}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch((error) => {
      console.log(error)
      expect(error).to.have.property('eraro').and.equal(true)
      done()
    })
  })
})
