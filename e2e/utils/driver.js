const { Builder, By, until, Key } = require("selenium-webdriver");
const { platform } = require("node:process");

const cmdCtrl = platform.includes("darwin") ? Key.COMMAND : Key.CONTROL;
module.exports.cmdCtrl = cmdCtrl;

// driver utility methods
module.exports.getWebDriver = async () => {
  let browser = process.env.BROWSER;
  let driver = await new Builder().forBrowser(browser).build();
  return driver;
};

const findElementWithWait = async (driver, by) => {
  await driver.wait(until.elementLocated(by), 3000);
  let elem = await driver.findElement(by);
  return elem;
};
module.exports.findElementWithWait = findElementWithWait;

module.exports.findTextInputWithLabel = async (driver, label) => {
  const by = By.xpath(`//label[text()='${label}']/ancestor-or-self::div/div/input`);
  return findElementWithWait(driver, by);
};

module.exports.findTextAreaWithLabel = async (driver, label) => {
  const by = By.xpath(`//label[text()='${label}']/ancestor-or-self::div/div/textarea`);
  return findElementWithWait(driver, by);
};

module.exports.findDropDownWithLabel = async (driver, label) => {
  const by = By.xpath(`//label[text()='${label}']/ancestor-or-self::div/div/div[@role='combobox']`);
  return findElementWithWait(driver, by);
};

module.exports.findDropDownOption = async (driver, labelId, value) => {
  const by = By.xpath(
    `//ul[@aria-labelledby='${labelId}'][@role='listbox']/li[@data-value='${value}']`
  );
  return findElementWithWait(driver, by);
};

module.exports.findButtonContainingText = async (driver, text) => {
  const by = By.xpath(`//button[contains(text(),'${text}')]`);
  return findElementWithWait(driver, by);
};

module.exports.waitForUrl = async (driver, url) => {
  await driver.wait(until.urlIs(url), 5000);
};

module.exports.click = async (elem) => {
  await elem.click();
};

module.exports.sendKeysInto = async (driver, elem, text) => {
  await driver.actions().sendKeys(elem, text).perform();
};

module.exports.clearTextFrom = async (driver, elem) => {
  await elem.click();
  await driver
    .actions()
    .keyDown(cmdCtrl)
    .sendKeys("a")
    .keyUp(cmdCtrl)
    .sendKeys(Key.DELETE)
    .perform();
};
