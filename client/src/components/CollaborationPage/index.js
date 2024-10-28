import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collaborationSocket } from "../../socket";
import Cookies from "universal-cookie";
import { Button, TextField, Paper, Typography, CircularProgress} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { SVC_ENDPOINTS } from "../../consts/api";

function CollaborationPage() {
  const { state } = useLocation();
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");
  const [question, setQuestion] = useState(null);
  const [aiText, setAiText] = useState(null);
  const [aiResponse, setAiReponse] = useState(null);
  const [isAiLoading, setisAiLoading] = useState(false);
  const onChange = (val, viewUpdate) => {
    setValue(val);
    collaborationSocket.emit("code_change", {
      roomId: cookies.get("roomId"),
      code: val,
    });
    cookies.set('code', val, { path: '/' });
  };

  const handleEnd = () => {
    collaborationSocket.disconnect();
    cookies.remove("roomId");
    cookies.remove("partnerId");
    cookies.remove("code");
    cookies.remove("question");
    setValue("");
    setIsLoading(true);
  };

  const handleAi= async () => {
    const payload = {
      "prompt" : aiText,
      "topic" : question.title,
      "description": question.description,
      "code": cookies.get('code')

    }
    setAiReponse(null);
    setisAiLoading(true);
    const response = await axios.post(`${SVC_ENDPOINTS.ai}/ai/prompt`, payload);
    setisAiLoading(false);
    setAiReponse(response.data); 
  };

  useEffect(() => {
    console.log(state)
    if (cookies.get("roomId") === undefined && state === null) {
      return
    }
    if (!collaborationSocket.connected) {
      console.log(collaborationSocket);
      collaborationSocket.connect();
      collaborationSocket.emit("connection");
      console.log("User connected to collaboration socket");

      
      const userId = cookies.get("userId");

      if (cookies.get("roomId") === undefined) {
        cookies.set("roomId", state.roomId, { path: '/' });
      }

      if (cookies.get("partnerId") === undefined) {
        cookies.set("partnerId", state.partnerId, { path: '/' });
      }
      

      collaborationSocket.emit("match_found", {
        userId: userId,
        partnerId: cookies.get("partnerId"),
        roomId: cookies.get("roomId"),
      });
      const fetchQuestion = async () => {
        try {
          const response = await axios.get(`${SVC_ENDPOINTS.question}/questions/${state.topic}/${state.complexity}`);
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

      collaborationSocket.on("code_update", (msg) => {
        console.log(msg)
        setValue(msg);
      });
      const initialCode = cookies.get("code");
      if (initialCode) {
      setValue(initialCode);
    }
    

   

    return () => {
      collaborationSocket.off("code_change");
      collaborationSocket.off("code_update");
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
    <div style = {{flex: '1'}}>
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
      <Button color="error" variant="contained" onClick={handleEnd}>END SESSION</Button>
      </div>
      <div style = {{flex: '1'}}>
        <h2>Type below to ask help from AI!</h2>
        {aiResponse !== null && (
          <div>
            <Paper style={{ padding: '10px', marginTop: '20px', backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h6">Gemini Response:</Typography>
                    <Typography style={{ whiteSpace: 'pre-line' }}>{aiResponse}</Typography>
            </Paper>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
            <TextField 
                fullWidth 
                label="Ask Gemini" 
                id="fullWidth"
                style={{ flex: '1'}} 
                onChange={(e) => setAiText(e.target.value)}
            />
            {isAiLoading ? (
              <CircularProgress />
              ) : (
                <Button 
                variant="contained" 
                endIcon={<SendIcon />}
                onClick={handleAi}
            > Send </Button>
            )}
        </div>
      </div>
    </div>
  );
}

export default CollaborationPage;
