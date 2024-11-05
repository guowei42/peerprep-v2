let {TIMEOUT, getWebDriver, URL} = require("./utils");
const {By} = require('selenium-webdriver')

let driver;

beforeAll(async () => {
    driver = await getWebDriver();
}, TIMEOUT);

beforeEach(async () => {
    await driver.get(URL);
});
  
afterAll(async () => {
    if (driver) await driver.quit();
});

test('clicking "PeerPrep" text in toolbar navigates to homepage', async () => {
    let link = await driver.findElement(By.linkText("PeerPrep")); 
    await link.click();
    let newUrl = await driver.getCurrentUrl();
    expect(newUrl).toMatch(URL);
});
  
