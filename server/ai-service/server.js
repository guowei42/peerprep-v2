const express = require("express");
const app = express();
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

app.post("/ai/prompt", async (req, res) => {
    try {
      let payload = "I am solving a leetcode question for my computer science interview. I am stuck. Below is the given topic and my code.";
      let prompt = req.body.prompt;
      let topic = "Topic: " + req.body.topic;
      let description = " Question Description: "+ req.body.description;
      let code = " My current code: " +req.body.code + "\n";

      payload = payload + topic + description + code + prompt
      console.log(payload);
      const result = await model.generateContent(payload);
      const response = result.response.candidates[0].content.parts[0].text;
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.listen(port, () => {
        console.log("AI service is listening on port " + port);
});






