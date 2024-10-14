import { Box, Button, Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import axios from "axios";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { SVC_ENDPOINTS } from "../../../consts/api";
import { CustomInput, LoginBox } from "../LoginWrapper";

function Signup() {
  const [emailError, setEmailError] = useState(false);
  const [missingFields, setMissingFields] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  const handleSignup = async () => {
    if (!email.includes("@")) {
      setEmailError(true);
    } else {
      setEmailError(false);

      const body = {
        username: username,
        email: email,
        password: password,
      };

      try {
        const response = await axios.post(`${SVC_ENDPOINTS.user}/users`, body);

        if (response.status === 201) {
          navigate("/login");
        }
      } catch (error) {
        setMissingFields(false);
        setDuplicateError(false);
        setDatabaseError(false);
        if (error.status === 400) {
          setMissingFields(true);
        } else if (error.status === 409) {
          setDuplicateError(true);
        } else if (error.status === 500) {
          setDatabaseError(true);
        }
      }
    }
  };
  return (
    <div>
      {missingFields && <Alert severity="error">Missing fields!</Alert>}
      {duplicateError && (
        <Alert severity="error">Duplicate username or email encountered!</Alert>
      )}
      {databaseError && (
        <Alert severity="error">Database or server error!</Alert>
      )}
      <Stack
        direction={"row"}
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <LoginBox>
          <Box sx={{ fontSize: "2rem", fontWeight: "bold" }}>SIGNUP</Box>
          <CustomInput
            label="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <CustomInput
            label="Email"
            required
            error={emailError}
            helperText={emailError ? "Please enter a valid email" : ""}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomInput
            label="Password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSignup();
              }
            }}
          />

          <RouterLink>
            <Button variant="contained" onClick={handleSignup}>
              Signup
            </Button>
          </RouterLink>
        </LoginBox>
      </Stack>
    </div>
  );
}

export default Signup;
