'use strict'

const assert = require('assert')
const app = require('../../../../../server/app')

describe('[unit] surveys service', function () {
  it('registered the surveys service', () => {
    assert.ok(app.service('api/surveys'))
  })
})
