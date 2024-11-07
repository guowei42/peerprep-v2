const { Builder, By } = require("selenium-webdriver");

module.exports.ROOT_URL = "http://localhost:3000";

module.exports.TIMEOUT = 30 * 1000;

module.exports.TEST_USER = {
  username: "testuser1",
  email: "testuser1@example.com",
  password: "testPassword1",
};

module.exports.getWebDriver = async () => {
  let browser = process.env.BROWSER;
  let driver = await new Builder().forBrowser(browser).build();
  return driver;
};

module.exports.scrollTo = async (driver, element) => {
  driver.executeScript("arguments[0].scrollIntoView(false)", element);
  driver.sleep(300);
};

module.exports.findTextInputWithLabel = async (driver, label) => {
  let input = await driver.findElement(
    By.xpath(`//label[text()='${label}']/ancestor-or-self::div/div/input`)
  );
  return input;
};

module.exports.findButtonContainingText = async (driver, text) => {
  let button = await driver.findElement(By.xpath(`//button[contains(text(),'${text}')]`));
  return button;
};
