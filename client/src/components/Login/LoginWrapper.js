import { Box, Stack, styled, TextField } from "@mui/material";
import React from "react";
import { ReactComponent as Background } from "../../assets/background.svg";
import { ReactComponent as Logo } from "../../assets/logo.svg";

export const CustomInput = styled(TextField)({
  backgroundColor: "#C6BDBD",
});

export const LoginBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  height: "580px",
  width: "455px",
  alignItems: "center",
  backgroundColor: "#E7E2E2",
  borderRadius: "10px",
});

function LoginWrapper({ children }) {
  return (
    <Stack
      direction={"row"}
      height={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {children}
      <Box position={"relative"}>
        <Box zIndex={"1"}>
          <Background />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <Logo />
        </Box>
      </Box>
    </Stack>
  );
}

export default LoginWrapper;
