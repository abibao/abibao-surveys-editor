const webdriver = require('selenium-webdriver')
const By = webdriver.By
const until = webdriver.until

module.exports = function (driver) {
  const elements = {
    refContainerLogin: By.css('.container.login'),
    refButtonLogin: By.css('.button.login')
  }
  return {
    url: 'http://web:3000/admin/login',
    elements,
    waitUntilVisible: function () {
      return driver.wait(until.elementLocated(elements.refContainerLogin))
    },
    navigate: function () {
      driver.navigate().to(this.url)
      return this.waitUntilVisible()
    },
    login: function () {
      return driver.findElement(elements.refButtonLogin).click()
    }
  }
}
