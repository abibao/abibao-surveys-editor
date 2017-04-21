const assert = require('assert')
const app = require('../../../server/app')

describe('[integration] server', function () {
  it('should has registered authentication service', () => {
    assert.ok(app.service('authentication'))
  })
  it('should has registered users service', () => {
    assert.ok(app.service('users'))
  })
  it('should has registered api/answers service', () => {
    assert.ok(app.service('api/answers'))
  })
  it('should has registered api/campaigns service', () => {
    assert.ok(app.service('api/campaigns'))
  })
  it('should has registered api/entities service', () => {
    assert.ok(app.service('api/entities'))
  })
  it('should has registered api/individuals service', () => {
    assert.ok(app.service('api/individuals'))
  })
  it('should has registered api/surveys service', () => {
    assert.ok(app.service('api/surveys'))
  })
  it('should has registered command/campaignCreateEmailing service', () => {
    assert.ok(app.service('command/campaignCreateEmailing'))
  })
  it('should has registered command/individualAffectSurvey service', () => {
    assert.ok(app.service('command/individualAffectSurvey'))
  })
})
