let {getWebDriver, ROOT_URL} = require("./utils");
const {By} = require('selenium-webdriver')

let driver;
let url = ROOT_URL; 

beforeAll(async () => {
    driver = await getWebDriver();
}, 20 * 1000);

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
  
