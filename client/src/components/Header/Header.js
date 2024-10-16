import { Box, Button, CircularProgress, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Header() {
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
      <h1>PeerPrep</h1>
      <Box display={"flex"} alignItems={"center"}>
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