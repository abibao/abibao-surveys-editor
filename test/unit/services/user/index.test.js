'use strict'

const assert = require('assert')
const app = require('../../../../server/app')

describe('[unit] user service', function () {
  it('registered the users service', () => {
    assert.ok(app.service('users'))
  })
})
