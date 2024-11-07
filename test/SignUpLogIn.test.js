let {
  getWebDriver,
  findTextInputWithLabel,
  findButtonContainingText,
  waitForUrl,
} = require("./utils/driver");
let { ROOT_URL, TEST_USER, DB_URI_USER } = require("./utils/const");
const { By, until } = require("selenium-webdriver");
const { getConn, clearAll } = require("./utils/db");

let driver, usersConn;
let url = ROOT_URL;
let urlSignup = url + "/signup";
let urlLogin = url + "/login";

/**
 * SIGN UP LOG IN TEST
 * This test simulates a user:
 * - opening the homepage
 * - clicking log in button in toolbar
 * - clicking sign up link on login page
 * - signing up
 * - logging in
 * - logging out
 */
describe("Sign Up/Log In test", () => {
  beforeAll(async () => {
    driver = await getWebDriver();
    usersConn = await getConn(DB_URI_USER);
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  beforeEach(async () => {
    clearAll(usersConn);
  });

  test("simulate successful user sign up and log in from home page", async () => {
    // go to home page
    await driver.get(url);

    // click log in
    let loginButton = await findButtonContainingText(driver, "Login");
    await loginButton.click();
    await waitForUrl(driver, urlLogin);

    // click sign up
    let signupLink = await driver.findElement(By.linkText("here"));
    await signupLink.click();
    await waitForUrl(driver, urlSignup);

    // fill sign up form
    let usernameField = await findTextInputWithLabel(driver, "Username");
    let emailField = await findTextInputWithLabel(driver, "Email");
    let passwordField = await findTextInputWithLabel(driver, "Password");
    let submit = await findButtonContainingText(driver, "Signup");
    await driver.actions().sendKeys(usernameField, TEST_USER.username).perform();
    await driver.actions().sendKeys(emailField, TEST_USER.email).perform();
    await driver.actions().sendKeys(passwordField, TEST_USER.password).perform();
    await submit.click();

    // check redirect to login
    await waitForUrl(driver, urlLogin);

    // fill log in form
    emailField = await findTextInputWithLabel(driver, "Email");
    passwordField = await findTextInputWithLabel(driver, "Password");
    submit = await findButtonContainingText(driver, "Login");
    await driver.actions().sendKeys(emailField, TEST_USER.email).perform();
    await driver.actions().sendKeys(passwordField, TEST_USER.password).perform();
    await submit.click();

    // check redirect to root
    await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(),'Logout')]`)), 3000);

    // log out
    let logOutButton = await findButtonContainingText(driver, "Logout");
    await logOutButton.click();

    // check redirect to login page
    await waitForUrl(driver, urlLogin);
  });
});
