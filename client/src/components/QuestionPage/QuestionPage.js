import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddQuestionForm from "../AddQuestion/AddQuestionForm";
import UpdateQuestionForm from "../UpdateQuestion/UpdateQuestionForm";
import { SVC_ENDPOINTS } from "../../consts/api";

function QuestionPage() {
  const [questionList, setQuestionList] = useState("");
  const [formType, setFormType] = useState("view");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleUpdateClick = (question) => {
    setSelectedQuestion(question);
    setFormType("update");
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${SVC_ENDPOINTS.question}/questions`);
      setQuestionList(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  let accordionList = [];

  Object.entries(questionList).map((wholeQuestion) => {
    let questionId = parseInt(wholeQuestion[0]) + 1;
    accordionList.push(
      <Accordion key={wholeQuestion[1]._id}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Typography>
              {questionId}. {wholeQuestion[1].title}
            </Typography>

            <Button
              variant="outlined"
              color="error"
              onClick={() => handleUpdateClick(wholeQuestion[1])}
            >
              Update/Delete
            </Button>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography align="left">
            Description: {wholeQuestion[1].description}
          </Typography>
          <Typography align="left" color="secondary">
            Category: {wholeQuestion[1].categories}
          </Typography>
          <Typography align="left" color="primary">
            Complexity: {wholeQuestion[1].complexity}
          </Typography>
          <Typography align="left" color="primary">
            Link:&nbsp;
            <a href={wholeQuestion[1].link}>Click to get to leetcode</a>
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
    return null;
  });

  const handleTabChange = (event, newState) => {
    if (newState === "view") {
      setFormType("view");
      setSelectedQuestion(null);
      fetchQuestions();
    } else if (newState === "add") {
      setFormType("add");
    }
  };

  const handleDeleteSuccess = (deletedQuestionId) => {
    setQuestionList((prevList) =>
      prevList.filter((q) => q._id !== deletedQuestionId)
    );
  };

  return (
    <>
      <ToggleButtonGroup
        value={formType}
        exclusive
        onChange={handleTabChange}
        aria-label="tab"
      >
        <ToggleButton value="view" aria-label="view questions">
          View questions
        </ToggleButton>
        <ToggleButton value="add" aria-label="add new question">
          Add question
        </ToggleButton>
      </ToggleButtonGroup>
      <Box>
        {formType === "add" ? (
          <AddQuestionForm goBack={() => setFormType("view")} />
        ) : formType === "update" ? (
          <UpdateQuestionForm
            goBack={() => setFormType("view")}
            selectedQuestion={selectedQuestion}
            onUpdateSuccess={(updatedQuestion) => {
              setQuestionList((prevList) =>
                prevList.map((q) =>
                  q._id === updatedQuestion._id ? updatedQuestion : q
                )
              );
            }}
            onDeleteSuccess={handleDeleteSuccess}
          />
        ) : (
          <div>{accordionList}</div>
        )}
      </Box>
    </>
  );
}

export default QuestionPage;
