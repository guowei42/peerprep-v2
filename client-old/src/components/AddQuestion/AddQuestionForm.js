import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { SVC_ENDPOINTS } from "../../consts/api";

function AddQuestionForm(props) {
  const [error, setError] = useState(null);
  const [newQuestion, setNewQuestion] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState("");
  const [complexity, setComplexity] = useState("Medium");
  const [link, setLink] = useState("");


  const resetFormFields = () => {
    setTitle("")
    setDescription("")
    setCategories("")
    setComplexity("Medium")
    setLink("")
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const qn = {
      title,
      description,
      categories,
      complexity,
      link,
    };

    setError(null)
    setNewQuestion(null)

    axios
      .post(`${SVC_ENDPOINTS.question}/questions/add`, qn)
      .then(function (response) {
        setNewQuestion(response.data);
        resetFormFields();
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          setError(error.response.data);
        } else if (error.response.status === 500) {
          setError("Internal Server Error")
        } else {
          setError(error.message)
        }
      });
  };

  const handleComplexityChange = (event) => {
    setComplexity(event.target.value);
  };

  return (
    <div className="AddQuestionForm">
      <h2>Add new question</h2>
      <div>
        {error ? (
          <Typography align="center" color="error">
            {error}
          </Typography>
        ) : (
          ""
        )}

        {newQuestion ? (
          <div>
            <Typography align="center" color="secondary">
              Successfully submitted question &ldquo;{newQuestion.title}&rdquo;.
            </Typography>
          </div>
        ) : (
          ""
        )}

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
                onChange={handleComplexityChange}
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
              Submit question
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
}

export default AddQuestionForm;
