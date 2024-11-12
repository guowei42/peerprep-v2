let { getWebDriver, findButtonContainingText, waitForUrl, click } = require("./utils/driver");
let { TEST_USER_1, TEST_USER_2, URLS, TEST_QUESTION } = require("./utils/const");
const { deleteAllUsers, resetQuestions } = require("./utils/api");
const {
  signUpAndLogIn,
  selectMatchingOptions,
  waitUntilMatchingTimeout,
  resetCollabMatching,
} = require("./utils/utils");

let driver1, driver2;

describe("Matching tests", () => {
  beforeAll(async () => {
    driver1 = await getWebDriver();
    driver2 = await getWebDriver();
    await resetQuestions();
    await deleteAllUsers();
    await signUpAndLogIn(driver1, TEST_USER_1);
    await signUpAndLogIn(driver2, TEST_USER_2);
  });

  afterAll(async () => {
    if (driver1) await driver1.quit();
    if (driver2) await driver2.quit();
  });

  beforeEach(async () => {
    await driver1.get(URLS.root);
    await driver2.get(URLS.root);
    await resetCollabMatching(driver1, driver2);
  }, 35 * 1000);

  afterEach(async () => {});

  describe("match found", () => {
    test("match found", async () => {
      await selectMatchingOptions(driver1, TEST_QUESTION.complexity, TEST_QUESTION.categories);
      await selectMatchingOptions(driver2, TEST_QUESTION.complexity, TEST_QUESTION.categories);
      await click(await findButtonContainingText(driver1, "Start"));
      await click(await findButtonContainingText(driver2, "Start"));
      await waitForUrl(driver1, URLS.collab);
      await waitForUrl(driver2, URLS.collab);
      expect(await driver1.getCurrentUrl()).toEqual(URLS.collab);
      expect(await driver2.getCurrentUrl()).toEqual(URLS.collab);

      await click(await findButtonContainingText(driver1, "END SESSION"));
      await click(await findButtonContainingText(driver2, "END SESSION"));
    });
  });

  describe("match cancel", () => {
    test("match cancel", async () => {
      await selectMatchingOptions(driver1, TEST_QUESTION.complexity, TEST_QUESTION.categories);
      await selectMatchingOptions(driver2, TEST_QUESTION.complexity, TEST_QUESTION.categories);
      await click(await findButtonContainingText(driver1, "Start"));
      await click(await findButtonContainingText(driver1, "Cancel"));
      await driver2.sleep(500);
      await click(await findButtonContainingText(driver2, "Start"));
      expect(await driver1.getCurrentUrl()).toEqual(URLS.root + "/");
      expect(await driver2.getCurrentUrl()).toEqual(URLS.root + "/");

      await click(await findButtonContainingText(driver2, "Cancel"));
    });
  });

  describe("match timeout and retry", () => {
    test(
      "match timeout and retry",
      async () => {
        await selectMatchingOptions(driver1, TEST_QUESTION.complexity, TEST_QUESTION.categories);
        await selectMatchingOptions(driver2, TEST_QUESTION.complexity, TEST_QUESTION.categories);

        // after timeout, other user does not get matched
        await click(await findButtonContainingText(driver1, "Start"));
        await waitUntilMatchingTimeout(driver1, driver2);
        await click(await findButtonContainingText(driver2, "Start"));
        expect(await driver1.getCurrentUrl()).toEqual(URLS.root + "/");
        expect(await driver2.getCurrentUrl()).toEqual(URLS.root + "/");

        // retry - success
        await click(await findButtonContainingText(driver1, "Retry"));
        await waitForUrl(driver1, URLS.collab);
        await waitForUrl(driver2, URLS.collab);
        expect(await driver1.getCurrentUrl()).toEqual(URLS.collab);
        expect(await driver2.getCurrentUrl()).toEqual(URLS.collab);

        await click(await findButtonContainingText(driver1, "END SESSION"));
        await click(await findButtonContainingText(driver2, "END SESSION"));
      },
      35 * 1000
    );
  });
});
