const event = require('../../../server/events/batchEmailingSendgridEvent')

describe('[integration] events batchEmailingSendgridEvent', function () {
  it('should success', (done) => {
    event({
      email: 'test@abibao.com',
      template: 'template',
      body: '<h2>BODY</h2>'
    })
    done()
  })
})
