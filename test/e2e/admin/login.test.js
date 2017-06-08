const webdriver = require('selenium-webdriver')
const chai = require('chai')
const expect = chai.expect

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .usingServer('http://selenium_hub:4444/wd/hub')
  .build()

const page = require('./login.page.js')(driver)

describe('describe step 1', function () {
  before(function (done) {
    page.navigate()
    done()
  })

  it('should step 1.1', function (done) {
    expect(page.login()).to.equal('John Doe')
    done()
  })
})
