import { Grid2, Box, styled, TextField } from "@mui/material";
import { ReactComponent as Background } from "../../assets/background.svg";
import { ReactComponent as Logo } from "../../assets/logo.svg";

export const CustomInput = styled(TextField)({
  backgroundColor: "#C6BDBD",
});

export const LoginBox = styled(Box)({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-evenly",
  minHeight: "580px",
  minWidth: "455px",
  height: "100%",
  alignItems: "center",
  backgroundColor: "#E7E2E2",
  borderRadius: "10px",
});

function LoginWrapper({ children }) {
  return (
    <Grid2
      container
      spacing={3}
      sx={{
        padding: "35px",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Grid2 item size={{ xs: 12, md: 6 }}>
        {children}
      </Grid2>
      <Grid2 item size={{ xs: 12, md: 6 }} position={"relative"}>
        <Box zIndex={"1"} height={"100%"}>
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
      </Grid2>
    </Grid2>
  );
}

export default LoginWrapper;
