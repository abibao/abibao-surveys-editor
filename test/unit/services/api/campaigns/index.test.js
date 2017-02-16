'use strict'

const assert = require('assert')
const app = require('../../../../../server/app')

describe('[unit] campaigns service', function () {
  it('registered the campaigns service', () => {
    assert.ok(app.service('api/campaigns'))
  })
})
