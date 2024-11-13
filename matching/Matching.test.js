let { getWebDriver, findButtonContainingText, waitForUrl, click } = require("./utils/driver");
let { URLS, TEST_QUESTION } = require("./utils/const");
const {
  selectMatchingOptions,
  waitUntilMatchingTimeout,
  setupMatchingTests,
  resetServer,
} = require("./utils/utils");

describe("Matching tests", () => {
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
  });

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
      await driver1.sleep(100);
      await click(await findButtonContainingText(driver1, "Cancel"));
      await driver2.sleep(500);
      await click(await findButtonContainingText(driver2, "Start"));
      expect(await driver1.getCurrentUrl()).toEqual(URLS.root);
      expect(await driver2.getCurrentUrl()).toEqual(URLS.root);
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
        expect(await driver1.getCurrentUrl()).toEqual(URLS.root);
        expect(await driver2.getCurrentUrl()).toEqual(URLS.root);

        // retry - success
        await click(await findButtonContainingText(driver1, "Retry"));
        await waitForUrl(driver1, URLS.collab);
        await waitForUrl(driver2, URLS.collab);
        expect(await driver1.getCurrentUrl()).toEqual(URLS.collab);
        expect(await driver2.getCurrentUrl()).toEqual(URLS.collab);

        await click(await findButtonContainingText(driver1, "END SESSION"));
        await click(await findButtonContainingText(driver2, "END SESSION"));
      },
      60 * 1000
    );
  });
});
