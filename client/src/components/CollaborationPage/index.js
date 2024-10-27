import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collaborationSocket } from "../../socket";
import Cookies from "universal-cookie";
import { Button } from "@mui/material";

function CollaborationPage() {
  const { state } = useLocation();
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");
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
    setValue("");
    setIsLoading(true);
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

     
    }
      setIsLoading(false);

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
    <>
      {!isLoading && (
        <CodeMirror
          value={value}
          height="200px"
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
        />
      )}
      <Button onClick={handleEnd}>Disconnect</Button>
    </>
  );
}

export default CollaborationPage;
