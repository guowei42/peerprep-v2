const request = require("supertest");
const express = require("express");
const questionRoute = require("./questionRoute");
const Question = require("../model/questionModel");
jest.mock("../model/questionModel");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", questionRoute);

afterEach(() => {
  jest.clearAllMocks();
});

const sampleQuestion1 = {
  title: "Sample Question 1",
  description: "Sample description",
  categories: "Strings, Data Structures",
  complexity: "Medium",
  link: "localhost",
};
const sampleQuestion2 = {
  title: "Sample Question 2",
  description: "Lorem Ipsum",
  categories: "Algorithms",
  complexity: "Hard",
  link: "localhost",
};

describe("GET /", () => {
  it("should return all questions with status 200", async () => {
    Question.find.mockResolvedValue([sampleQuestion1]);
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([sampleQuestion1]);
  });

  it("should handle errors with status 500", async () => {
    Question.find.mockRejectedValue(new Error("Error"));
    const res = await request(app).get("/");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error");
  });
});

describe("GET /:id", () => {
  it("should return question with the right ID with status 200", async () => {
    Question.findById.mockImplementation(async (id) =>
      id == 123 ? sampleQuestion1 : sampleQuestion2
    );
    const res = await request(app).get("/123");
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(sampleQuestion1);
  });

  it("should handle errors with status 500", async () => {
    Question.findById.mockRejectedValue(new Error("Error"));
    const res = await request(app).get("/123");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error");
  });
});

describe("GET /categories/unique", () => {
  it("should return unique categories with status 200", async () => {
    const uniqueCategories = ["A", "B"];
    Question.aggregate.mockResolvedValue(uniqueCategories);
    const res = await request(app).get("/categories/unique");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(uniqueCategories);
  });

  it("should handle errors with status 500", async () => {
    Question.aggregate.mockRejectedValue(new Error("Error"));
    const res = await request(app).get("/categories/unique");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error");
  });
});

describe("GET /complexity/...", () => {
  const qns = [sampleQuestion1, sampleQuestion2];

  test("get easy with status 200", async () => {
    Question.find.mockResolvedValue(qns);
    const res = await request(app).get("/complexity/easy");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(qns);
  });

  test("get medium with status 200", async () => {
    Question.find.mockResolvedValue(qns);
    const res = await request(app).get("/complexity/easy");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(qns);
  });

  test("get hard with status 200", async () => {
    Question.find.mockResolvedValue(qns);
    const res = await request(app).get("/complexity/easy");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(qns);
  });
});

describe("POST /add", () => {
  it("should create a new question with status 200", async () => {
    Question.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    Question.mockReturnValue({
      ...sampleQuestion1,
      save: jest.fn().mockResolvedValue(sampleQuestion1),
    });
    const res = await request(app)
      .post("/add")
      .send(sampleQuestion1)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(sampleQuestion1);
  });

  it("should return 400 if question already exists", async () => {
    Question.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        ...sampleQuestion1,
      }),
    });
    const res = await request(app)
      .post("/add")
      .send(sampleQuestion1)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(res.status).toBe(400);
    expect(res.text).toBe(`Question with the title "${sampleQuestion1.title}" already exists.`);
  });

  it("should handle errors with status 500", async () => {
    Question.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
    Question.mockReturnValue({
      ...sampleQuestion1,
      save: jest.fn().mockRejectedValue(new Error("Error")),
    });
    const res = await request(app)
      .post("/add")
      .send(sampleQuestion1)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json, text/html");
    expect(res.status).toBe(500);
  });
});

describe("PUT /:id", () => {
  const updatedQuestion = {
    title: "Updated Question",
    description: "",
    categories: "",
    complexity: "",
    link: "",
  };

  it("should update a question by ID with status 200", async () => {
    Question.findById.mockResolvedValue({ save: jest.fn().mockResolvedValue(updatedQuestion) });
    const res = await request(app).put("/123").send(updatedQuestion);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedQuestion);
  });

  it("should return 404 if question not found", async () => {
    Question.findById.mockResolvedValue(null);
    const res = await request(app).put("/123").send(updatedQuestion);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Question not found");
  });

  it("should handle errors with status 500", async () => {
    Question.findById.mockRejectedValue(new Error("Update error"));
    const res = await request(app).put("/123").send(updatedQuestion);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Update error");
  });
});

describe("DELETE /:id", () => {
  it("should delete a question by ID with status 200", async () => {
    Question.findByIdAndDelete.mockResolvedValue({ _id: "123" });
    const res = await request(app).delete("/123");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Question deleted successfully");
  });

  it("should return 404 if question not found", async () => {
    Question.findByIdAndDelete.mockResolvedValue(null);
    const res = await request(app).delete("/123");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Question not found");
  });

  it("should handle errors with status 500", async () => {
    Question.findByIdAndDelete.mockRejectedValue(new Error("Delete error"));
    const res = await request(app).delete("/123");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Delete error");
  });
});
