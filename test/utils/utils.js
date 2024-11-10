const { By, until } = require("selenium-webdriver");
let { findTextInputWithLabel, findButtonContainingText, waitForUrl, click } = require("./driver");
let { URLS } = require("./const");

// general utility methods for common tasks

const fillSignUpForm = async (driver, user) => {
  let usernameField = await findTextInputWithLabel(driver, "Username");
  let emailField = await findTextInputWithLabel(driver, "Email");
  let passwordField = await findTextInputWithLabel(driver, "Password");
  let submit = await findButtonContainingText(driver, "Signup");
  await driver.actions().sendKeys(usernameField, user.username).perform();
  await driver.actions().sendKeys(emailField, user.email).perform();
  await driver.actions().sendKeys(passwordField, user.password).perform();
  await submit.click();
};
module.exports.fillSignUpForm = fillSignUpForm;

const fillLoginForm = async (driver, user) => {
  let emailField = await findTextInputWithLabel(driver, "Email");
  let passwordField = await findTextInputWithLabel(driver, "Password");
  let submit = await findButtonContainingText(driver, "Login");
  await driver.actions().sendKeys(emailField, user.email).perform();
  await driver.actions().sendKeys(passwordField, user.password).perform();
  await submit.click();
};
module.exports.fillLoginForm = fillLoginForm;

module.exports.signUpAndLogIn = async (driver, user) => {
  await driver.get(URLS.signup);
  await fillSignUpForm(driver, user);
  await waitForUrl(driver, URLS.login);
  await fillLoginForm(driver, user);
  await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(),'Logout')]`)), 3000);
};

module.exports.logIn = async (driver, user) => {
  await driver.get(URLS.login);
  await fillLoginForm(driver, user);
  await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(),'Logout')]`)), 3000);
};

module.exports.logOut = async (driver) => {
  await driver.get(URLS.logout);
};
