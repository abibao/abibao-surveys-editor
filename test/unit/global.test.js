const Hooks = require('../../server/services/globalHooks')

describe('[unit] global hooks', function () {
  it('should create an uuid', (done) => {
    Hooks.uuid()
    done()
  })
  it('should create an urn', (done) => {
    Hooks.urn()
    done()
  })
})
