const Promise = require('bluebird')
const feathers = require('feathers')

const Service = require('../../../server/services/domain/commands/individualCompleteSurveyCommand').Service

const app = feathers()

app.bus = {
  send (chanel, message) { }
}
app.error = (message) => {
}
app.info = (message) => {
}
app.use('command/individualCompleteSurvey', new Service())
app.use('api/surveys', {
  patch (id, data) {
    if (id === 'error') {
      return Promise.reject(new Error('BOOM'))
    }
    return Promise.resolve()
  }
})

describe('[unit] command individualCompleteSurvey', function () {
  before(function (done) {
    this.server = app.listen(3030)
    this.server.once('listening', () => done())
  })
  after(function (done) {
    this.server.close(done)
  })
  it('should fail in completing the survey', (done) => {
    app.service('command/individualCompleteSurvey').create({id: 'error', campaign: {id: 'campaign'}}).then(() => {
      done('THEN_SHOULD_BE_NOT_INVOKE')
    }).catch(() => {
      done()
    })
  })
  it('should success in completing the survey', (done) => {
    app.service('command/individualCompleteSurvey').create({campaign: {id: 'campaign'}}).then(() => {
      done()
    }).catch(done)
  })
})
