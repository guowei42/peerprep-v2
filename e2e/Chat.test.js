let {
  getWebDriver,
  findButtonContainingText,
  findTextInputWithLabel,
  sendKeysInto,
  click,
  findElementWithWait,
} = require("./utils/driver");
let { TEST_QUESTION } = require("./utils/const");
const { By } = require("selenium-webdriver");
const { startSession, setupMatchingTests, resetServer } = require("./utils/utils");

describe("Chat tests", () => {
  let driver1, driver2;

  beforeAll(async () => {
    driver1 = await getWebDriver();
    driver2 = await getWebDriver();
    await resetServer();
  });

  afterAll(async () => {
    if (driver1) await driver1.quit();
    if (driver2) await driver2.quit();
  });

  beforeEach(async () => {
    await setupMatchingTests(driver1, driver2);
    await startSession(driver1, driver2, TEST_QUESTION.complexity, TEST_QUESTION.categories);
  });

  test("chat message should show correctly for both sender and partner", async () => {
    let chatTextBoxLabel = "Type your message";
    let msg = "hello from 1 :)";
    let chatInput1 = await findTextInputWithLabel(driver1, chatTextBoxLabel);
    await sendKeysInto(driver1, chatInput1, msg);
    await click(await findButtonContainingText(driver1, "Send"));
    await findElementWithWait(driver1, By.xpath(`//p[normalize-space()='You: ${msg}']`));
    await findElementWithWait(driver2, By.xpath(`//p[normalize-space()='Partner: ${msg}']`));
  });
});
