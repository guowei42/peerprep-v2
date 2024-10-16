import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Step,
  StepLabel,
  Stepper,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { useState } from "react";

const steps = ["Difficulty", "Topic", "Start Queue"];
const topics = ["Algorithms", "Algorithms", "Algorithms", "Algorithms", "Algorithms"]

function QueueCard() {
  const [activeStep, setActiveStep] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");

  const handleChange = (_, nextView) => {
    setDifficulty(nextView);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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
        {activeStep == 0 && (
          <ToggleButtonGroup
            value={difficulty}
            onChange={handleChange}
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
        {activeStep == 1 && <Box>Section 2</Box>}
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
