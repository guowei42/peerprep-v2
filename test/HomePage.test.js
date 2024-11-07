let { getWebDriver } = require("./utils/driver");
let { ROOT_URL } = require("./utils/const");
const { By } = require("selenium-webdriver");

let driver;
let url = ROOT_URL;

/**
 * Trivial test case. Mostly used to debug system testing.
 */
describe("homepage contains 'PeerPrep' clickable link in toolbar", () => {
  beforeAll(async () => {
    driver = await getWebDriver();
  });

  beforeEach(async () => {
    await driver.get(url);
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('clicking "PeerPrep" text in toolbar navigates to homepage', async () => {
    let link = await driver.findElement(By.linkText("PeerPrep"));
    await link.click();
    let newUrl = await driver.getCurrentUrl();
    expect(newUrl).toMatch(url);
  });
});
