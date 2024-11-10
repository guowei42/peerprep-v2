const express = require("express");
const router = express.Router();
const Question = require("../model/questionModel");
const Seed = require("../seedQuestions");

// Test question
const testQuestion = new Question({
  title: "Test Title",
  description: "Lorem ipsum lorem sit amet",
  categories: "TEST",
  complexity: "Easy",
  link: "http://localhost",
});

// delete all questions
router.get("/deleteAll", async (req, res) => {
  try {
    Question.deleteMany({});
    res.status(200).json({ message: "Deleted all questions" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// seed questions
router.get("/seed", async (req, res) => {
  try {
    Seed.seedQuestions();
    await testQuestion.save()
    res.status(200).json({ message: "Seeded default questions" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete + seed questions
router.get("/reset", async (req, res) => {
  try {
    Question.deleteMany({});
    Seed.seedQuestions();
    await testQuestion.save()
    res.status(200).json({ message: "Reset default questions" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
