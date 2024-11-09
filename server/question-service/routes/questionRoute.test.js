const request = require("supertest");
const express = require("express");
const questionRoute = require("./questionRoute");
const Question = require("../model/questionModel");
jest.mock("../model/questionModel");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", questionRoute);

beforeEach(() => {
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
    expect(Question.find).toHaveBeenCalledWith({});
    expect(res.status).toBe(200);
    expect(res.body).toEqual([sampleQuestion1]);
  });

  it("should handle errors with status 500", async () => {
    Question.find.mockRejectedValue(new Error("Error"));
    const res = await request(app).get("/");
    expect(Question.find).toHaveBeenCalledWith({});
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error");
  });
});

describe("GET /:id", () => {
  let someId = 123;
  it("should return question with the right ID with status 200", async () => {
    Question.findById.mockImplementation(async (id) =>
      id == someId ? sampleQuestion1 : sampleQuestion2
    );
    const res = await request(app).get("/" + someId);
    expect(Question.findById).toHaveBeenCalledWith(someId.toString());
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(sampleQuestion1);
  });

  it("should handle errors with status 500", async () => {
    Question.findById.mockRejectedValue(new Error("Error"));
    const res = await request(app).get("/" + someId);
    expect(Question.findById).toHaveBeenCalledWith(someId.toString());
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error");
  });
});

describe("GET /categories/unique", () => {
  it("should return unique categories with status 200", async () => {
    const uniqueCategories = ["A", "B"];
    Question.aggregate.mockResolvedValue(uniqueCategories);
    const res = await request(app).get("/categories/unique");
    expect(Question.aggregate).toHaveBeenCalled();
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

describe("GET /:topic/:complexity", () => {
  let topic = "Algorithms";
  let complexity = "Easy";
  const topicRegex = new RegExp(`(^|,)\\s*${topic}\\s*(,|$)`, "i");
  const complexityRegex = new RegExp(`${complexity}`, "i");

  it("should call with the correct regex", async () => {
    Question.findOne.mockResolvedValue(sampleQuestion1);
    const res = await request(app).get(`/${topic}/${complexity}`);
    expect(Question.findOne).toHaveBeenCalledWith({
      complexity: { $regex: complexityRegex },
      categories: { $regex: topicRegex },
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(sampleQuestion1);
  });

  describe("regex tests", () => {
    let otherTopic = "Strings";
    let otherComplexity = "Hard";

    it("should match single topic correctly", async () => {
      expect(topicRegex.test(topic)).toBe(true);
      expect(topicRegex.test(topic.toLowerCase())).toBe(true);
      expect(topicRegex.test(topic.toUpperCase())).toBe(true);
      expect(topicRegex.test(otherTopic)).toBe(false);
    });

    it("should match one of list of topics correctly", async () => {
      expect(topicRegex.test(`${topic}, ${otherTopic}`)).toBe(true);
      expect(topicRegex.test(`${otherTopic}, ${topic}`)).toBe(true);
      expect(topicRegex.test(`${topic}, ${otherTopic}`.toLowerCase())).toBe(true);
      expect(topicRegex.test(`${otherTopic}, ${topic}`.toUpperCase())).toBe(true);
      expect(topicRegex.test(`${otherTopic}, Data Structures`)).toBe(false);
    });

    it("should match complexity correctly", async () => {
      expect(complexityRegex.test(complexity)).toBe(true);
      expect(complexityRegex.test(complexity.toLowerCase())).toBe(true);
      expect(complexityRegex.test(complexity.toUpperCase())).toBe(true);
      expect(complexityRegex.test(otherComplexity)).toBe(false);
    });
  });
});

describe("GET /complexity/...", () => {
  const qns = [sampleQuestion1, sampleQuestion2];

  describe("GET /complexity/easy", () => {
    it("should find easy with status 200", async () => {
      Question.find.mockResolvedValue(qns);
      const res = await request(app).get("/complexity/easy");
      expect(Question.find).toHaveBeenCalledWith({ complexity: { $eq: "Easy" } });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(qns);
    });

    it("should handle errors with status 500", async () => {
      Question.find.mockRejectedValue(new Error("Error"));
      const res = await request(app).get("/complexity/easy");
      expect(Question.find).toHaveBeenCalledWith({ complexity: { $eq: "Easy" } });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error");
    });
  });

  describe("GET /complexity/medium", () => {
    it("should find medium with status 200", async () => {
      Question.find.mockResolvedValue(qns);
      const res = await request(app).get("/complexity/medium");
      expect(Question.find).toHaveBeenCalledWith({ complexity: { $eq: "Medium" } });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(qns);
    });

    it("should handle errors with status 500", async () => {
      Question.find.mockRejectedValue(new Error("Error"));
      const res = await request(app).get("/complexity/medium");
      expect(Question.find).toHaveBeenCalledWith({ complexity: { $eq: "Medium" } });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error");
    });
  });

  describe("GET /complexity/hard", () => {
    it("should find hard with status 200", async () => {
      Question.find.mockResolvedValue(qns);
      const res = await request(app).get("/complexity/Hard");
      expect(Question.find).toHaveBeenCalledWith({ complexity: { $eq: "Hard" } });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(qns);
    });

    it("should handle errors with status 500", async () => {
      Question.find.mockRejectedValue(new Error("Error"));
      const res = await request(app).get("/complexity/hard");
      expect(Question.find).toHaveBeenCalledWith({ complexity: { $eq: "Hard" } });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Error");
    });
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
    expect(Question.findOne).toHaveBeenCalledWith({
      title: sampleQuestion1.title,
    });
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
    expect(Question.findOne).toHaveBeenCalledWith({
      title: sampleQuestion1.title,
    });
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
    expect(Question.findOne).toHaveBeenCalledWith({
      title: sampleQuestion1.title,
    });
    expect(res.status).toBe(500);
  });
});

describe("PUT /:id", () => {
  const id = "123";
  const updatedQuestion = {
    title: "Updated Question",
    description: "",
    categories: "",
    complexity: "",
    link: "",
  };

  it("should update a question by ID with status 200", async () => {
    Question.findById.mockResolvedValue({ save: jest.fn().mockResolvedValue(updatedQuestion) });
    const res = await request(app)
      .put("/" + id)
      .send(updatedQuestion);
    expect(Question.findById).toHaveBeenCalledWith(id);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedQuestion);
  });

  it("should return 404 if question not found", async () => {
    Question.findById.mockResolvedValue(null);
    const res = await request(app)
      .put("/" + id)
      .send(updatedQuestion);
    expect(Question.findById).toHaveBeenCalledWith(id);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Question not found");
  });

  it("should handle errors with status 500", async () => {
    Question.findById.mockRejectedValue(new Error("Update error"));
    const res = await request(app)
      .put("/" + id)
      .send(updatedQuestion);
    expect(Question.findById).toHaveBeenCalledWith(id);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Update error");
  });
});

describe("DELETE /:id", () => {
  const id = "123";
  it("should delete a question by ID with status 200", async () => {
    Question.findByIdAndDelete.mockResolvedValue({ _id: id });
    const res = await request(app).delete("/" + id);
    expect(Question.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Question deleted successfully");
  });

  it("should return 404 if question not found", async () => {
    Question.findByIdAndDelete.mockResolvedValue(null);
    const res = await request(app).delete("/" + id);
    expect(Question.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Question not found");
  });

  it("should handle errors with status 500", async () => {
    Question.findByIdAndDelete.mockRejectedValue(new Error("Delete error"));
    const res = await request(app).delete("/" + id);
    expect(Question.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Delete error");
  });
});
