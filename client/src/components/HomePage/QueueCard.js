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
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { SVC_ENDPOINTS } from "../../consts/api";
import { DIFFICULTY } from "../../consts/difficulty";
import { collaborationSocket, matchingSocket } from "../../socket";
import CircularWithValueLabel from "./CircularWithValueLabel";

const steps = ["Difficulty", "Topic", "Start Queue"];

const BlurredButton = styled(Button)(({ theme }) => ({
  pointerEvents: "none",
  color: theme.palette.grey[800],
  opacity: 0.5,
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
  const navigate = useNavigate();

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
        console.log(response.data.map((x) => x.category));
        setQuestionCategories(
          Array.from(response.data.map((x) => x.category)).sort()
        );
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
    const timerId = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress <= 0 ? 0 : Math.max(0, prevProgress - 10 / 3)
      );
    }, 1000);
    setTimer(timerId);
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
    if (queueState.status === "match_found") {
      console.log("here");
      const temp_partnerId = queueState.partnerId;
      const temp_roomId = queueState.roomId;
      const temp_complexity = queueState.difficulty;
      handleEnd();
      console.log(queueState);
      navigate("/collaborationpage", {
        state: {
          partnerId: temp_partnerId,
          roomId: temp_roomId,
          topic: topic,
          complexity: temp_complexity,
        },
      });
    }
    return () => {
      matchingSocket.off("matchUpdate");

      //probably don't need
      //matchingSocket.off("disconnect");
    };
  }, [queueState]);

  useEffect(() => {
    if (activeStep === 1 && questionCategories.length === 0) {
      getCategories();
    }
  }, [activeStep, questionCategories]);

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: "1 1 auto",
        maxWidth: "30vw",
        height: "30vh",
        borderRadius: "16px"
      }}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Centers horizontally
              alignItems: "center", // Centers vertically
              height: "100%", // Ensures full height for vertical centering
            }}
          >
            <ToggleButtonGroup
              value={difficulty}
              onChange={handleDifficultyChange}
              exclusive
            >
              <ToggleButton
                value={DIFFICULTY.easy}
                aria-label={DIFFICULTY.easy}
              >
                Easy
              </ToggleButton>
              <ToggleButton
                value={DIFFICULTY.medium}
                aria-label={DIFFICULTY.medium}
              >
                Medium
              </ToggleButton>
              <ToggleButton
                value={DIFFICULTY.hard}
                aria-label={DIFFICULTY.hard}
              >
                Hard
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {queueLoading && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography variant="h4">Finding You A Match! :D</Typography>
                <Divider/>
                <CircularWithValueLabel value={progress} />
                <Divider/>
                <Button color="error" variant="contained" onClick={handleEnd}>
                  Cancel
                </Button>
              </Box>
            )}
            {!queueLoading && queueState.status === "timeout" && (
              <Typography variant="h4">No Match Found! D:</Typography>
            )}
            {queueLoading ||
              (collaborationSocket.connected && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <BlurredButton variant="contained">Start</BlurredButton>
                  <p>Please end all ongoing session before matching again!</p>
                </Box>
              ))}
            {!queueLoading &&
              queueState.status === "timeout" &&
              !collaborationSocket.connected && (
                <Button variant="contained" onClick={handleStartQueue}>
                  Retry
                </Button>
              )}
            {!queueLoading &&
              queueState.status !== "timeout" &&
              !collaborationSocket.connected && (
                <div>
                  <Button variant="contained" onClick={handleStartQueue}>
                    Start
                  </Button>
                </div>
              )}
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
