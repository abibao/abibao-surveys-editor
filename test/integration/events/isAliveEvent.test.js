const event = require('../../../server/events/isAliveEvent')

describe('[integration] events isAliveEvent', function () {
  it('should success', (done) => {
    event({
      name: 'test-platform-server'
    })
    done()
  })
})
