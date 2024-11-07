let {
  getWebDriver,
  ROOT_URL,
  TEST_USER,
  findTextInputWithLabel,
  findButtonContainingText,
} = require("./utils");
const { By, until } = require("selenium-webdriver");

let driver;
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
  });

  beforeEach(async () => {
    await driver.get(url);
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test("simulate successful user sign up and log in", async () => {
    // click log in
    let loginButton = await findButtonContainingText(driver, "Login");
    await loginButton.click();
    await driver.wait(until.urlIs(urlLogin), 3000);

    // click sign up
    let signupLink = await driver.findElement(By.linkText("here"));
    await signupLink.click();
    await driver.wait(until.urlIs(urlSignup), 3000);

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
    await driver.wait(until.urlIs(urlLogin), 3000);

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
    await driver.wait(until.urlIs(urlLogin), 3000);
  });
});
