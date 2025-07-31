import { Box, Button, Link, Stack, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { SVC_ENDPOINTS } from "../../../consts/api";
import { CustomInput, LoginBox } from "../LoginWrapper";

function Login() {
  
  const [emailError, setEmailError] = useState(false);
  const [invalidEmailError, setInvalidEmailError] = useState(false);
  const [missingFields, setMissingFields] = useState(false);
  const [databaseError, setDatabaseError] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.includes("@")) {
      setEmailError(true);
    } else {
      setEmailError(false);
      const body = {
        email: email,
        password: password,
      };
      try {
        const response = await axios.post(
          `${SVC_ENDPOINTS.user}/auth/login`,
          body
        );
        if (response.status === 200) {
          const cookies = new Cookies();
          cookies.set("userId", response.data.data.id);
          cookies.set("accessToken", response.data.data.accessToken, {
            path: "/",
          });
          navigate("/", { replace: true });
          window.location.reload();
        }
      } catch (error) {
        setMissingFields(false);
        setInvalidEmailError(false);
        setDatabaseError(false);
        if (error.status === 400) {
          setMissingFields(true);
        }
        if (error.status === 401) {
          setInvalidEmailError(true);
        }
        if (error.status === 500) {
          setDatabaseError(true);
        }
      }
    }
  };
  return (
    <LoginBox>
      <Box position={"absolute"} top={"0"} width={"100%"}>
        {invalidEmailError && (
          <Alert severity="error">Incorrect email or password!</Alert>
        )}
        {missingFields && <Alert severity="error">Missing fields!</Alert>}
        {databaseError && <Alert severity="error">DatabaseError!</Alert>}
      </Box>
      <Box sx={{ fontSize: "2rem", fontWeight: "bold" }}>LOGIN</Box>
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
            handleLogin();
          }
        }}
      />
      <Stack alignItems={"center"}>
        <RouterLink>
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </RouterLink>
        <Stack alignItems={"center"} marginTop={"10px"}>
          <Typography variant="body2">Don&apos;t have an account?</Typography>
          <Typography variant="body2">
            Sign up{" "}
            <Link component={RouterLink} to="/signup">
              here
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </LoginBox>
  );
}

export default Login;
