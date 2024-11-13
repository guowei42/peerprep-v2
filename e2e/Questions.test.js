let {
  getWebDriver,
  findButtonContainingText,
  waitForUrl,
  click,
  findElementWithWait,
} = require("./utils/driver");
let { URLS, TEST_QUESTION } = require("./utils/const");
const { By } = require("selenium-webdriver");
const {
  resetServer,
  fillAddQuestionForm,
  fillUpdateQuestionForm,
} = require("./utils/utils");
const { getNewTestUser } = require("./utils/users");
const { resetQuestions } = require("./utils/server");
const { signUpAndLogIn } = require("./utils/utils");

describe("Questions test", () => {
  let driver;
  const user = getNewTestUser();

  beforeAll(async () => {
    driver = await getWebDriver();
    await resetServer();
    await signUpAndLogIn(driver, user);
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  beforeEach(async () => {
    await resetQuestions();
  });

  describe("button on home page brings you to questions page", () => {
    test("button on home page brings you to questions page", async () => {
      await click(await findButtonContainingText(driver, "Questions List"));
      await waitForUrl(driver, URLS.questions);
      expect(await driver.getCurrentUrl()).toEqual(URLS.questions);
    });
  });

  describe("simulate viewing question and clicking link", () => {
    test("simulate viewing question and clicking link", async () => {
      const titleXpath = `//p[contains(normalize-space(), '${TEST_QUESTION.title}')]`;
      const descriptionXpath = `//div[contains(@class,'MuiCollapse-entered')][contains(normalize-space(), 'Category: ${TEST_QUESTION.categories}')]`;
      const linkXpath = descriptionXpath + "//a";

      await driver.get(URLS.questions);

      await click(await findElementWithWait(driver, By.xpath(titleXpath)));
      // expect correct description to be shown
      await findElementWithWait(driver, By.xpath(descriptionXpath));

      let link = await findElementWithWait(driver, By.xpath(linkXpath));
      expect(await link.getAttribute("href")).toEqual(TEST_QUESTION.link);
    });
  });

  describe("adding question successfully", () => {
    test("adding question successfully", async () => {
      let newQuestion = { ...TEST_QUESTION };
      newQuestion.title = "hello";
      let successMsg = `Successfully submitted question “${newQuestion.title}”.`;
      let successMsgXpath = `//p[normalize-space()='${successMsg}']`;

      await driver.get(URLS.questions);
      await click(await findButtonContainingText(driver, "Add question"));
      await fillAddQuestionForm(driver, newQuestion);
      await expect(findElementWithWait(driver, By.xpath(successMsgXpath))).resolves.not.toThrow();

      // check that added question appears in list
      await click(await findButtonContainingText(driver, "View questions"));
      let newTitleXpath = `//p[contains(normalize-space(), '${newQuestion.title}')]`;
      await expect(findElementWithWait(driver, By.xpath(newTitleXpath))).resolves.not.toThrow();
    });
  });

  describe("adding question unsuccessfully", () => {
    test("adding question unsuccessfully", async () => {
      let failureMsg = `Question with the title "${TEST_QUESTION.title}" already exists.`;
      let failureMsgXpath = `//p[normalize-space()='${failureMsg}']`;

      await driver.get(URLS.questions);
      await click(await findButtonContainingText(driver, "Add question"));
      await fillAddQuestionForm(driver, TEST_QUESTION);
      await expect(findElementWithWait(driver, By.xpath(failureMsgXpath))).resolves.not.toThrow();
    });
  });

  describe("updating question", () => {
    test("updating question", async () => {
      let newQuestion = { ...TEST_QUESTION };
      newQuestion.title = "hello";
      let successMsgXpath = `//div[@role='alert'][contains(normalize-space(), 'Question updated successfully!')]`;
      let updateButtonXpath = `//div[contains(normalize-space(), '${TEST_QUESTION.title}')]/button[contains(text(), 'Update/Delete')]`;

      await driver.get(URLS.questions);
      await click(await findElementWithWait(driver, By.xpath(updateButtonXpath)));
      await fillUpdateQuestionForm(driver, newQuestion);
      await expect(findElementWithWait(driver, By.xpath(successMsgXpath))).resolves.not.toThrow();

      // check that updated question appears in list
      await click(await findButtonContainingText(driver, "View questions"));
      let newTitleXpath = `//p[contains(normalize-space(), '${newQuestion.title}')]`;
      await expect(findElementWithWait(driver, By.xpath(newTitleXpath))).resolves.not.toThrow();
    });
  });

  describe("deleting question", () => {
    test("deleting question", async () => {
      let successMsgXpath = `//div[@role='alert'][contains(normalize-space(), 'Question deleted successfully!')]`;
      let updateButtonXpath = `//div[contains(normalize-space(), '${TEST_QUESTION.title}')]/button[contains(text(), 'Update/Delete')]`;

      await driver.get(URLS.questions);
      await click(await findElementWithWait(driver, By.xpath(updateButtonXpath)));
      await click(await findButtonContainingText(driver, "Delete Question"));
      await expect(findElementWithWait(driver, By.xpath(successMsgXpath))).resolves.not.toThrow();

      // check that deleted question disappears from list
      let titleXpath = `//p[contains(normalize-space(), '${TEST_QUESTION.title}')]`;
      await expect(findElementWithWait(driver, By.xpath(titleXpath))).rejects.toThrow();
    });
  });
});
