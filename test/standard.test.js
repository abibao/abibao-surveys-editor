const standard = require('mocha-standard')

describe('[code] code style', function () {
  it('should be conform to standard', standard.files([
    'config/**/*.js',
    'server/**/*.js',
    'src/**/*.js',
    'test/**/*.js'
  ]))
})
