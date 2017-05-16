var {defineSupportCode} = require('cucumber')

defineSupportCode(function ({Before, After}) {
  Before(function (data) {
  })
  After(function () {
    return this.driver.quit()
  })
})
