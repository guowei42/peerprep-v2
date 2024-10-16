import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Step,
  StepLabel,
  Stepper,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from "@mui/material";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import { useEffect, useState } from "react";
import { SVC_ENDPOINTS } from "../../consts/api";

const steps = ["Difficulty", "Topic", "Start Queue"];

const CustomToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: "flex", 
  flexWrap: "wrap", 
  gap: 1,
  overflow: "auto",
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: "1px solid black",
    borderRadius: "50px",
  },
}));

function QueueCard() {
  const [activeStep, setActiveStep] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [questionCategories, setQuestionCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDifficultyChange = (_, nextView) => {
    setDifficulty(nextView);
  };

  const handleTopicChange = (_, nextView) => {
    setTopic(nextView);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SVC_ENDPOINTS.question}/questions/categories/unique`
      );
      if (response.status === 200) {
        setQuestionCategories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeStep === 1) {
      getCategories();
    }
  }, [activeStep]);

  return (
    <Card
      outlined
      sx={{ display: "flex", flexDirection: "column", flex: "1 1 auto" }}
    >
      <CardContent>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
      <Divider />
      <CardContent sx={{ flex: "1 1 auto" }}>
        {activeStep === 0 && (
          <ToggleButtonGroup
            value={difficulty}
            onChange={handleDifficultyChange}
            exclusive
          >
            <ToggleButton value="easy" aria-label="easy">
              Easy
            </ToggleButton>
            <ToggleButton value="medium" aria-label="medium">
              Medium
            </ToggleButton>
            <ToggleButton value="hard" aria-label="hard">
              Hard
            </ToggleButton>
          </ToggleButtonGroup>
        )}
        {activeStep === 1 && (
          <Box>
            {loading ? (
              <CircularProgress />
            ) : (
              <CustomToggleGroup
                value={topic}
                onChange={handleTopicChange}
                exclusive
              >
                {questionCategories.map((category) => {
                  return (
                    <ToggleButton value={category}>
                      {category.category}
                    </ToggleButton>
                  );
                })}
              </CustomToggleGroup>
            )}
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        {activeStep < steps.length - 1 && (
          <Button onClick={handleNext}>Next</Button>
        )}
      </CardActions>
    </Card>
  );
}

export default QueueCard;
