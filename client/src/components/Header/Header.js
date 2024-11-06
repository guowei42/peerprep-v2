import { AppBar, Toolbar, Typography, Box, Button, ButtonGroup, CircularProgress, Stack } from "@mui/material";
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
    <AppBar position="static" sx={{ backgroundColor: "#e0e0e0" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', textAlign: 'left' }}>
        <Link to="/" style={{ textDecoration: "none", color: "#1976d2"}}>
          PeerPrep
          </Link>
        </Typography>
        <Box>
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : isAuthenticated ? (
            <Link to="/logout" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
                Logout
              </Button>
            </Link>
          ) : (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
                Login
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
