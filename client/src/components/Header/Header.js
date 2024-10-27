import { Box, Button, ButtonGroup, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Header() {
  // TEMP
  let navigate = useNavigate();

  const { isAuthenticated, checkIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      await checkIsAuthenticated();
      setLoading(false); 
    };
    authenticate();
  }, [checkIsAuthenticated]);

  return (
    <Stack direction={"row"} justifyContent={"space-between"} padding={"0 10px 0 10px"}>
      <h1 
        onClick={() => navigate("/")} 
        style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
      >
        PeerPrep
      </h1>
      <Box display={"flex"} alignItems={"center"}>
      {
        // TEMP
      }
      <ButtonGroup>
        <Button onClick={() => navigate("/questionpage")}>
          Questions
        </Button>
      </ButtonGroup>
      {
        // ^^^^^^^^^^^^^^^^
      }
        {loading ? (
          <CircularProgress />
        ) : isAuthenticated ? (
          <Link to="/logout">
            <Button variant="contained">Logout</Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="contained">Login</Button>
          </Link>
        )}
      </Box>
    </Stack>
  );
}

export default Header;