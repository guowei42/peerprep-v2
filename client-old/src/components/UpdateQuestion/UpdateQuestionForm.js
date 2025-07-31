import { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert
} from "@mui/material";
import axios from "axios";
import { SVC_ENDPOINTS } from "../../consts/api";

function UpdateQuestionForm({ goBack, selectedQuestion, onUpdateSuccess, onDeleteSuccess }) {
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [complexity, setComplexity] = useState("Medium");
  const [link, setLink] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (selectedQuestion) {
      setTitle(selectedQuestion.title);
      setDescription(selectedQuestion.description);
      setCategories(selectedQuestion.categories);
      setComplexity(selectedQuestion.complexity);
      setLink(selectedQuestion.link);
    }
  }, [selectedQuestion]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedQuestion = {
      title,
      description,
      categories,
      complexity,
      link,
    };

    try {
      const response = await axios.put(
        `${SVC_ENDPOINTS.question}/questions/${selectedQuestion._id}`,
        updatedQuestion
      );

      onUpdateSuccess(response.data);
      setSuccessMessage("Question updated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
        goBack();
      }, 3000); 

    } catch (error) {
      console.error(error);
      setError("Failed to update the question");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${SVC_ENDPOINTS.question}/questions/${selectedQuestion._id}`);
      
      if (response.status === 200) {
        onDeleteSuccess(selectedQuestion._id);
        setSuccessMessage("Question deleted successfully!");

        setTimeout(() => {
          setSuccessMessage("");
          goBack();
        }, 3000); 
      }
    } catch (error) {
      console.error(error);
      setError("Failed to delete the question");
    }
  };

  return (
    <div className="UpdateQuestionForm">
      <h2>Update/Delete Question</h2>
      <div>
        {error && (
          <Typography align="center" color="error">
            {error}
          </Typography>
        )}

        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ paddingX: 10 }}>
            <TextField
              label="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
              value={title}
            />

            <TextField
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              variant="outlined"
              value={description}
            />

            <TextField
              label="Categories"
              onChange={(e) => setCategories(e.target.value)}
              required
              variant="outlined"
              value={categories}
            />

            <FormControl>
              <InputLabel id="complexity-select-label">Complexity</InputLabel>
              <Select
                labelId="complexity-select-label"
                id="complexity-select"
                value={complexity}
                label="Complexity"
                onChange={(e) => setComplexity(e.target.value)}
                required
              >
                <MenuItem value={"Easy"}>Easy</MenuItem>
                <MenuItem value={"Medium"}>Medium</MenuItem>
                <MenuItem value={"Hard"}>Hard</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Link"
              onChange={(e) => setLink(e.target.value)}
              required
              variant="outlined"
              value={link}
            />

            <Button variant="outlined" type="submit">
              Update Question
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              Delete Question
            </Button>

          </Stack>
        </form>
      </div>
    </div>
  );
}

export default UpdateQuestionForm;