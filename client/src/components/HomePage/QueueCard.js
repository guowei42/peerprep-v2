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
  Typography,
  styled,
} from "@mui/material";
import { toggleButtonGroupClasses } from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import { useEffect, useState } from "react";
import { SVC_ENDPOINTS } from "../../consts/api";
import { matchingSocket } from "../../socket";
import Cookies from "universal-cookie";
import CircularWithValueLabel from "./CircularWithValueLabel";
import { DIFFICULTY } from "../../consts/difficulty";

const steps = ["Difficulty", "Topic", "Start Queue"];

const BlurredButton = styled(Button)(({ theme }) => ({
  pointerEvents: 'none',  
  color: theme.palette.grey[800], 
  opacity: 0.5
}));

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
  const [difficulty, setDifficulty] = useState(DIFFICULTY.easy);
  const [topic, setTopic] = useState("");
  const [questionCategories, setQuestionCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueState, setQueueState] = useState({});
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(null);

  const handleDifficultyChange = (_, nextView) => {
    setDifficulty(nextView);
  };

  const handleTopicChange = (_, nextView) => {
    setTopic(nextView);
    if (nextView) {
      setError(""); 
    }
  };

  const handleNext = () => {
    if (activeStep === 1 && !topic) {
      setError("Please select a topic.");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setError("");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SVC_ENDPOINTS.question}/questions/categories/unique`
      );
      if (response.status === 200) {
        console.log(response.data.map((x) => x.category))
        setQuestionCategories(Array.from(response.data.map((x) => x.category)).sort());
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleStartQueue = () => {
    if (!matchingSocket.connected) {
      matchingSocket.connect();
      matchingSocket.emit("connection");
      console.log("User connected to matchingSocket");
    }
    setProgress(100);
    setQueueLoading(true);
    
    clearInterval(timer);
    const timerId = setInterval(() => {setProgress((prevProgress) => (prevProgress <= 0 ? 0 : prevProgress - 10/3));
    }, 1000);
    setTimer(timerId)
    const cookies = new Cookies();
    const userId = cookies.get("userId");
    matchingSocket.emit("requestMatch", {
      userId: userId,
      topic: topic.category,
      difficulty: difficulty,
    });

    matchingSocket.on("matchUpdate", (msg) => {
      clearInterval(timerId);
      setQueueLoading(false);
      console.log("Message from match: ", msg);
      setQueueState(msg);
    });
  };

  const handleEnd = () => {
    matchingSocket.disconnect();
    setQueueLoading(false);
    setQueueState({});
    setProgress(100);
    clearInterval(timer);
  };

  useEffect(() => {
    return () => {
      matchingSocket.off("matchUpdate");
      matchingSocket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (activeStep === 1 && questionCategories.length === 0) {
      getCategories();
    }
  }, [activeStep, questionCategories]);

  return (
    <Card
      variant="outlined"
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
            <ToggleButton value={DIFFICULTY.easy} aria-label={DIFFICULTY.easy}>
              Easy
            </ToggleButton>
            <ToggleButton value={DIFFICULTY.medium} aria-label={DIFFICULTY.medium}>
              Medium
            </ToggleButton>
            <ToggleButton value={DIFFICULTY.hard} aria-label={DIFFICULTY.hard}>
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
                {questionCategories.map((category, index) => {
                  return (
                    <ToggleButton key={`cat${index}`} value={category}>
                      {category}
                    </ToggleButton>
                  );
                })}
              </CustomToggleGroup>
            )}
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            {queueLoading && <div><Typography variant="h3">Finding You A Match! :D</Typography><CircularWithValueLabel value={progress}/></div>}
            {!queueLoading && queueState.status === "timeout" && (
              <Typography variant="h3">No Match Found! D:</Typography>
            )}
            {!queueLoading && queueState.status === "match_found" && (
              <Typography variant="h4">
                Queued with: {queueState.partnerId}
              </Typography>
            )}
            {queueLoading && (<div><BlurredButton>Start</BlurredButton><Button onClick={handleEnd}>Quit</Button></div>)} 
            {!queueLoading && queueState.status === "timeout" && (
              <Button onClick={handleStartQueue}>Retry</Button>
            )}
            {!queueLoading && queueState.status !== "timeout" && (<div><Button onClick={handleStartQueue}>Start</Button><Button onClick={handleEnd}>Quit</Button></div>)} 
            
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
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
