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
import { socket } from "../../socket";
import Cookies from "universal-cookie";

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
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueState, setQueueState] = useState({});
  const [error, setError] = useState("");

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
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${SVC_ENDPOINTS.question}/questions/categories/unique`
      );
      if (response.status === 200) {
        setQuestionCategories(Array.from(response.data).sort());
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleStartQueue = () => {
    if (!socket.connected) {
      socket.connect();
      socket.emit("connection");
      console.log("User connected to socket");
    }

    setQueueLoading(true);
    const cookies = new Cookies();
    const userId = cookies.get("userId");
    socket.emit("requestMatch", {
      userId: userId,
      topic: topic,
      difficulty: difficulty,
    });

    socket.on("matchUpdate", (msg) => {
      setQueueLoading(false);
      console.log("Message from match: ", msg);
      setQueueState(msg);
    });
  };

  const handleEnd = () => {
    socket.disconnect();
  };

  useEffect(() => {
    return () => {
      socket.off("matchUpdate");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (activeStep === 1 && questionCategories.length === 0) {
      getCategories();
    }
  }, [activeStep, questionCategories]);

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
        {activeStep === 2 && (
          <Box>
            {queueLoading && <Typography variant="h3">Finding You A Match! :D</Typography>}
            {!queueLoading && queueState.status === "timeout" && (
              <Typography variant="h3">No Match Found! D:</Typography>
            )}
            {!queueLoading && queueState.status === "match_found" && (
              <Typography variant="h3">
                Queued with: {queueState.partnerId}
              </Typography>
            )}
            <Button onClick={handleStartQueue}>Start Queue</Button>
            <Button onClick={handleEnd}>Exit Socket</Button>
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
