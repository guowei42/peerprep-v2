const { By, until, Key } = require("selenium-webdriver");
let {
  findTextInputWithLabel,
  findButtonContainingText,
  waitForUrl,
  click,
  findDropDownWithLabel,
  findDropDownOption,
  findTextAreaWithLabel,
  clearTextFrom,
} = require("./driver");
let { URLS } = require("./const");
const { deleteAllUsers, resetQuestions, clearMatchQueue } = require("./server");
const { getNewTestUser } = require("./users");

// general utility methods for common tasks

const fillSignUpForm = async (driver, user) => {
  let usernameField = await findTextInputWithLabel(driver, "Username");
  let emailField = await findTextInputWithLabel(driver, "Email");
  let passwordField = await findTextInputWithLabel(driver, "Password");
  await driver.actions().sendKeys(usernameField, user.username).perform();
  await driver.actions().sendKeys(emailField, user.email).perform();
  await driver.actions().sendKeys(passwordField, user.password).perform();
  await click(await findButtonContainingText(driver, "Signup"));
};
module.exports.fillSignUpForm = fillSignUpForm;

const fillLoginForm = async (driver, user) => {
  let emailField = await findTextInputWithLabel(driver, "Email");
  let passwordField = await findTextInputWithLabel(driver, "Password");
  await driver.actions().sendKeys(emailField, user.email).perform();
  await driver.actions().sendKeys(passwordField, user.password).perform();
  await click(await findButtonContainingText(driver, "Login"));
};
module.exports.fillLoginForm = fillLoginForm;

const signUp = async (driver, user) => {
  await driver.get(URLS.signup);
  await fillSignUpForm(driver, user);
  await waitForUrl(driver, URLS.login);
};
module.exports.signUp = signUp;

const logIn = async (driver, user) => {
  await driver.get(URLS.login);
  await fillLoginForm(driver, user);
  await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(),'Logout')]`)), 3000);
};
module.exports.logIn = logIn;

const signUpAndLogIn = async (driver, user) => {
  await signUp(driver, user);
  await logIn(driver, user);
};
module.exports.signUpAndLogIn = signUpAndLogIn;

const logOut = async (driver) => {
  await driver.get(URLS.logout);
};
module.exports.logOut = logOut;

const selectMatchingOptions = async (driver, complexity, topic) => {
  await click(await findButtonContainingText(driver, complexity));
  await click(await findButtonContainingText(driver, "Next"));
  await click(await findButtonContainingText(driver, topic));
  await click(await findButtonContainingText(driver, "Next"));
};
module.exports.selectMatchingOptions = selectMatchingOptions;

module.exports.startSession = async (driver1, driver2, complexity, topic) => {
  await driver1.get(URLS.root);
  await driver2.get(URLS.root);
  await selectMatchingOptions(driver1, complexity, topic);
  await selectMatchingOptions(driver2, complexity, topic);
  await click(await findButtonContainingText(driver1, "Start"));
  await click(await findButtonContainingText(driver2, "Start"));
  await waitForUrl(driver1, URLS.collab);
  await waitForUrl(driver2, URLS.collab);
};

const waitUntilMatchingTimeout = async (driver1, driver2) => {
  const waitSeconds = 32;
  await Promise.all([driver1.sleep(waitSeconds * 1000), driver2.sleep(waitSeconds * 1000)]);
};
module.exports.waitUntilMatchingTimeout = waitUntilMatchingTimeout;

module.exports.setupMatchingTests = async (driver1, driver2) => {
  let user1 = getNewTestUser();
  let user2 = getNewTestUser();
  await Promise.all([
    logOut(driver1),
    logOut(driver2),
    deleteAllUsers(),
    resetQuestions(),
    clearMatchQueue(),
    driver1.manage().deleteAllCookies(),
    driver2.manage().deleteAllCookies(),
  ]);
  await Promise.all([signUpAndLogIn(driver1, user1), signUpAndLogIn(driver2, user2)]);
  await Promise.all([driver1.get(URLS.root), driver2.get(URLS.root)]);
};

const fillQuestionForm = async (driver, qn) => {
  let titleField = await findTextInputWithLabel(driver, "Title");
  let descriptionField = await findTextAreaWithLabel(driver, "Description");
  let categoriesField = await findTextInputWithLabel(driver, "Categories");
  let linkField = await findTextInputWithLabel(driver, "Link");
  let complexitySelect = await findDropDownWithLabel(driver, "Complexity");

  // clear
  await clearTextFrom(driver, titleField);
  await clearTextFrom(driver, descriptionField);
  await clearTextFrom(driver, categoriesField);
  await clearTextFrom(driver, linkField);

  // enter qn
  await driver.actions().sendKeys(titleField, qn.title).perform();
  await driver.actions().sendKeys(descriptionField, qn.description).perform();
  await driver.actions().sendKeys(categoriesField, qn.categories).perform();
  await driver.actions().sendKeys(linkField, qn.link).perform();
  await click(complexitySelect);
  await click(await findDropDownOption(driver, "complexity-select-label", qn.complexity));
  await driver.actions().sendKeys(Key.ESC).perform();
};

module.exports.fillAddQuestionForm = async (driver, qn) => {
  await fillQuestionForm(driver, qn);
  await click(await findButtonContainingText(driver, "Submit question"));
};

module.exports.fillUpdateQuestionForm = async (driver, qn) => {
  await fillQuestionForm(driver, qn);
  await click(await findButtonContainingText(driver, "Update Question"));
};

module.exports.resetServer = () =>
  Promise.allSettled([deleteAllUsers(), resetQuestions(), clearMatchQueue()]);
