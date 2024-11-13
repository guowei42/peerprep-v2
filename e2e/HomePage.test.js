let { getWebDriver } = require("./utils/driver");
let { URLS } = require("./utils/const");
const { By } = require("selenium-webdriver");
const { resetServer } = require("./utils/utils");

let driver;

/**
 * Trivial test case. Mostly used to debug system testing.
 */
describe("homepage contains 'PeerPrep' clickable link in toolbar", () => {
  beforeAll(async () => {
    driver = await getWebDriver();
    await resetServer();
  });

  beforeEach(async () => {
    await driver.get(URLS.root);
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('clicking "PeerPrep" text in toolbar navigates to homepage', async () => {
    let link = await driver.findElement(By.linkText("PeerPrep"));
    await link.click();
    let newUrl = await driver.getCurrentUrl();
    expect(newUrl).toMatch(URLS.root);
  });
});
