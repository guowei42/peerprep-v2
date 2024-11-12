const { Builder, By, until } = require("selenium-webdriver");

// driver utility methods
module.exports.getWebDriver = async () => {
  let browser = process.env.BROWSER;
  let driver = await new Builder().forBrowser(browser).build();
  return driver;
};

module.exports.findTextInputWithLabel = async (driver, label) => {
  let input = await driver.findElement(
    By.xpath(`//label[text()='${label}']/ancestor-or-self::div/div/input`)
  );
  return input;
};

module.exports.findButtonContainingText = async (driver, text) => {
  const by = By.xpath(`//button[contains(text(),'${text}')]`);
  await driver.wait(until.elementLocated(by), 3000);
  let button = await driver.findElement(by);
  return button;
};

module.exports.waitForUrl = async (driver, url) => {
  await driver.wait(until.urlIs(url), 5000);
};

module.exports.click = async (elem) => {
  await elem.click();
};

module.exports.fillTextInput = async (driver, field, text) => {
  await driver.actions().sendKeys(field, text).perform();
};
