var seleniumWebdriver = require('selenium-webdriver')
var chrome = require('selenium-webdriver/chrome')
// var firefox = require('selenium-webdriver/firefox')
var {defineSupportCode} = require('cucumber')

var chromeOptions = new chrome.Options()

function CustomWorld () {
  this.driver = new seleniumWebdriver.Builder()
    .forBrowser('firefox')
    .setChromeOptions(chromeOptions)
    .usingServer('http://localhost:4444/wd/hub')
    .build()
}

defineSupportCode(function ({setWorldConstructor}) {
  setWorldConstructor(CustomWorld)
})
