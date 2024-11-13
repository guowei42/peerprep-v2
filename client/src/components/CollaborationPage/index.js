import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { chatSocket, collaborationSocket } from "../../socket";
import Cookies from "universal-cookie";
import {
  Button,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Drawer,
  Fab,
  Box,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { SVC_ENDPOINTS } from "../../consts/api";
import { useNavigate } from "react-router-dom";
import AssistantRoundedIcon from "@mui/icons-material/AssistantRounded";

function CollaborationPage() {
  // UI
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };
  const chatRef = useRef(null);
  const { state } = useLocation();
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");
  const [question, setQuestion] = useState(null);
  const [aiText, setAiText] = useState(null);
  const [aiResponse, setAiReponse] = useState(null);
  const [isAiLoading, setisAiLoading] = useState(false);
  // for chat
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const navigate = useNavigate();
  const onChange = (val, viewUpdate) => {
    setValue(val);
    collaborationSocket.emit("code_change", {
      roomId: cookies.get("roomId"),
      code: val,
    });
    cookies.set("code", val, { path: "/" });
  };

  const handleEnd = () => {
    collaborationSocket.off();
    collaborationSocket.disconnect();
    chatSocket.off();
    chatSocket.disconnect();
    cookies.remove("roomId");
    cookies.remove("partnerId");
    cookies.remove("code");
    cookies.remove("question");
    setValue("");
    setIsLoading(true);
    navigate("/", { replace: true, state: null });
  };

  const handleAi = async () => {
    const payload = {
      prompt: aiText,
      topic: question.title,
      description: question.description,
      code: cookies.get("code"),
    };
    setAiReponse(null);
    setisAiLoading(true);
    const response = await axios.post(`${SVC_ENDPOINTS.ai}/ai/prompt`, payload);
    setisAiLoading(false);
    setAiReponse(response.data);
  };

  // handle a message send
  const handleSendMessage = () => {
    if (chatMessage.trim() !== "") {
      chatSocket.emit("send_message", {
        roomId: cookies.get("roomId"),
        senderId: cookies.get("userId"),
        message: chatMessage,
      });
      setChatMessage("");
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    console.log(state);
    if (cookies.get("roomId") === undefined && state === null) {
      return;
    }
    if (!collaborationSocket.connected) {
      console.log(collaborationSocket);
      collaborationSocket.connect();
      collaborationSocket.emit("connection");
      console.log("User connected to collaboration socket");

      const userId = cookies.get("userId");

      if (cookies.get("roomId") === undefined) {
        cookies.set("roomId", state.roomId, { path: "/" });
      }

      if (cookies.get("partnerId") === undefined) {
        cookies.set("partnerId", state.partnerId, { path: "/" });
      }

      collaborationSocket.emit("match_found", {
        userId: userId,
        partnerId: cookies.get("partnerId"),
        roomId: cookies.get("roomId"),
      });
      const fetchQuestion = async () => {
        try {
          const response = await axios.get(
            `${SVC_ENDPOINTS.question}/questions/${state.topic}/${state.complexity}`
          );
          setQuestion(response.data);
          cookies.set("question", response.data);
        } catch (error) {
          console.error("Error fetching question:", error);
        }
      };

      fetchQuestion();
    }
    setIsLoading(false);
    setQuestion(cookies.get("question"));

    if (!chatSocket.connected) {
      chatSocket.connect();
      chatSocket.emit("join_room", { roomId: cookies.get("roomId") });
      console.log("User connected to chat socket");
    }

    chatSocket.on("receive_message", (msg) => {
      setChatHistory((prev) => [...prev, msg]); // Update chat history with new messages
    });

    collaborationSocket.on("code_update", (msg) => {
      console.log(msg);
      setValue(msg);
    });
    const initialCode = cookies.get("code");
    if (initialCode) {
      setValue(initialCode);
    }

    return () => {
      collaborationSocket.off("code_change");
      collaborationSocket.off("code_update");
      chatSocket.off("receive_message");
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "16px",
      }}
    >
      <div style={{ flex: "1" }}>
        {!isLoading && (
          <>
            <div className="question-display">
              <h2>Your challenge: {question?.title}</h2>
              <p>{question?.description}</p>
            </div>
            <CodeMirror
              value={value}
              height="200px"
              extensions={[javascript({ jsx: true })]}
              onChange={onChange}
            />
          </>
        )}
        <Button color="error" variant="contained" onClick={handleEnd}>
          END SESSION
        </Button>
      </div>

      {/* chat section */}
      <div style={{ flex: "1" }}>
        <h2>Chat with your partner</h2>
        <Paper
          ref={chatRef}
          style={{
            padding: "10px",
            marginBottom: "10px",
            height: "200px",
            overflowY: "auto",
          }}
        >
          {chatHistory.map((msg, index) => (
            <Typography
              key={index}
              variant="body1"
              style={{
                textAlign:
                  msg.senderId === cookies.get("userId") ? "right" : "left",
                backgroundColor:
                  msg.senderId === cookies.get("userId")
                    ? "#e0f7fa"
                    : "#f5f5f5",
                padding: "8px",
                borderRadius: "4px",
                margin: "4px 0",
              }}
            >
              {msg.senderId === cookies.get("userId") ? "You" : "Partner"}:{" "}
              {msg.message}
            </Typography>
          ))}
        </Paper>
        <Box sx={{display: "flex"}}>
          <TextField
            fullWidth
            label="Type your message"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </div>

      <Fab
        sx={{ position: "absolute", top: 100, right: 60 }}
        onClick={toggleDrawer(true)}
      >
        <AssistantRoundedIcon />
      </Fab>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ padding: "20px", width: "500px" }}>
          {aiResponse !== null && (
            <Box>
              <Paper
                style={{
                  padding: "10px",
                  marginTop: "20px",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography variant="h6">Gemini Response:</Typography>
                <Typography style={{ whiteSpace: "pre-line" }}>
                  {aiResponse}
                </Typography>
              </Paper>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingTop: "20px",
              width: "92%",
            }}
          >
            <TextField
              fullWidth
              label="Ask Gemini"
              id="fullWidth"
              onChange={(e) => setAiText(e.target.value)}
            />
            {isAiLoading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" onClick={handleAi}>
                <SendIcon />
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}

export default CollaborationPage;
