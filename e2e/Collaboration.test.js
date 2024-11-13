let {
  getWebDriver,
  findElementWithWait,
  sendKeysInto,
  click,
  findButtonContainingText,
  waitForUrl,
} = require("./utils/driver");
let { TEST_QUESTION, URLS } = require("./utils/const");
const { setupMatchingTests, resetServer, startSession, logOut } = require("./utils/utils");
const { By } = require("selenium-webdriver");

describe("Collaboration tests", () => {
  let driver1, driver2;
  const titleXpath = `//h2[normalize-space()='Your challenge: ${TEST_QUESTION.title}']`;

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

  describe("question shown should be the same", () => {
    test("question shown should be the same", async () => {
      await findElementWithWait(driver1, By.xpath(titleXpath));
      await findElementWithWait(driver2, By.xpath(titleXpath));
    });
  });

  describe("code editor changes should reflect on both ends", () => {
    test("code editor changes should reflect on both ends", async () => {
      const editorXpath = "//div[@class='cm-content'][@role='textbox']";
      const code = 'console.log("hello world!");';
      const editorXpathWithCode = `${editorXpath}[normalize-space()='${code}']`;
      let editor1 = await findElementWithWait(driver1, By.xpath(editorXpath));
      await sendKeysInto(driver1, editor1, code);
      await findElementWithWait(driver1, By.xpath(editorXpathWithCode));
      await findElementWithWait(driver2, By.xpath(editorXpathWithCode));
    });
  });

  describe("if one user logs out, other user remains in session", () => {
    test("if one user logs out, other user remains in session", async () => {
      await logOut(driver1);
      await waitForUrl(driver1, URLS.login);

      expect(await driver1.getCurrentUrl()).toEqual(URLS.login);
      expect(await driver2.getCurrentUrl()).toEqual(URLS.collab);
    });
  });

  describe("if one user disconnects, other user remains in session", () => {
    test("if one user disconnects, other user remains in session", async () => {
      await driver1.get(URLS.root);
      expect(await driver1.getCurrentUrl()).toEqual(URLS.root);
      expect(await driver2.getCurrentUrl()).toEqual(URLS.collab);
    });
  });

  describe("if one user disconnects, can rejoin", () => {
    test("if one user disconnects, can rejoin", async () => {
      await driver1.get(URLS.root);
      await driver1.get(URLS.collab);
      expect(await driver1.getCurrentUrl()).toEqual(URLS.collab);
      expect(async () => await findElementWithWait(driver1, By.xpath(titleXpath))).not.toThrow();
      expect(await driver2.getCurrentUrl()).toEqual(URLS.collab);
    });
  });

  describe("if one user ends session, cannot rejoin", () => {
    test("if one user ends session, cannot rejoin", async () => {
      await click(await findButtonContainingText(driver1, "END SESSION"));
      await waitForUrl(driver1, URLS.root);
      await driver1.get(URLS.collab);

      await expect(async () => await findElementWithWait(driver1, By.xpath(titleXpath))).rejects.toThrow();
      expect(async () => await findElementWithWait(driver2, By.xpath(titleXpath))).not.toThrow();
    });
  });
});
