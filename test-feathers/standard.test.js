'use strict'

const standard = require('mocha-standard')

describe('[code] standard style', function () {
  it('should be conforms to standard', standard.files([
    'config/**/*.js',
    'server/**/*.js',
    'src/**/*.js',
    'test/**/*.js'
  ]))
})
