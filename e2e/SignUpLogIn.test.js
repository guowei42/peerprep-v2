let {
  getWebDriver,
  findButtonContainingText,
  waitForUrl,
  click,
  findElementWithWait,
} = require("./utils/driver");
let { URLS } = require("./utils/const");
const { By } = require("selenium-webdriver");
const { deleteAllUsers } = require("./utils/server");
const { fillLoginForm, fillSignUpForm, signUp, resetServer } = require("./utils/utils");
const { getNewTestUser } = require("./utils/users");

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
  let driver;
  const TEST_USER_1 = getNewTestUser();

  beforeAll(async () => {
    driver = await getWebDriver();
    await resetServer();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  beforeEach(async () => {
    await deleteAllUsers();
  });

  test("simulate successful user sign up and log in from home page", async () => {
    // go to home page
    await driver.get(URLS.root);

    // click log in
    await click(await findButtonContainingText(driver, "Login"));
    await waitForUrl(driver, URLS.login);

    // click sign up
    await click(await driver.findElement(By.linkText("here")));
    await waitForUrl(driver, URLS.signup);

    // fill sign up form
    await fillSignUpForm(driver, TEST_USER_1);

    // check redirect to login
    await waitForUrl(driver, URLS.login);

    // fill log in form
    await fillLoginForm(driver, TEST_USER_1);

    // log out
    await click(await findButtonContainingText(driver, "Logout"));

    // check redirect to login page
    await waitForUrl(driver, URLS.login);
  });

  describe("tests with existing user", () => {
    beforeEach(async () => {
      await deleteAllUsers();
      // create existing user
      await signUp(driver, TEST_USER_1);
    });

    test("simulate unsuccessful user sign up", async () => {
      const errorMsgXpath = `//div[contains(text(),'Duplicate username or email encountered!')]`;
      await driver.get(URLS.signup);
      await fillSignUpForm(driver, TEST_USER_1);
      await findElementWithWait(driver, By.xpath(errorMsgXpath));
    });

    test("simulate unsuccessful user log in", async () => {
      const errorMsgXpath = `//div[contains(text(),'Incorrect email or password!')]`;

      let wrongEmail = { ...TEST_USER_1 };
      wrongEmail.email = "a" + wrongEmail.email;
      let wrongPassword = { ...TEST_USER_1 };
      wrongPassword.password = "a" + wrongPassword.password;

      await driver.get(URLS.login);
      await fillLoginForm(driver, wrongEmail);
      await findElementWithWait(driver, By.xpath(errorMsgXpath));

      await driver.get(URLS.root);
      await driver.get(URLS.login);
      await fillLoginForm(driver, wrongPassword);
      await findElementWithWait(driver, By.xpath(errorMsgXpath));
    });
  });
});
