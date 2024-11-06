const { seedQuestions } = require("./seedQuestions");
const Question = require("./model/questionModel");

jest.mock("./model/questionModel");

describe("seedQuestions unit tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should insert questions if the count is 0", async () => {
    Question.countDocuments.mockImplementationOnce(() => 0);
    await seedQuestions();
    expect(Question.insertMany).toHaveBeenCalled();
  });

  it("should not insert questions if the count is not 0", async () => {
    Question.countDocuments.mockImplementationOnce(() => 1);
    await seedQuestions();
    expect(Question.insertMany).not.toHaveBeenCalled();
  });
});
