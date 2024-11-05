let utils = require("./utils");
const {By} = require('selenium-webdriver')

let driver;
const url = "http://localhost:3000"

beforeAll(async () => {
    driver = await utils.getWebDriver();
}, 10000);

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
  
