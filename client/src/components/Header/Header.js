import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  SvgIcon,
  Toolbar,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/logo.svg";
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
    <AppBar position="static" sx={{ backgroundColor: "#e0e0e0" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", textAlign: "left" }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            <SvgIcon component={Logo} sx={{ overflow: "visible" }} />
          </Link>
        </Typography>
        <Box>
          {loading ? (
            <CircularProgress color="inherit" size={24} />
          ) : isAuthenticated ? (
            <Link to="/logout" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#6454F0", color: "#fff" }}
              >
                Logout
              </Button>
            </Link>
          ) : (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#6454F0", color: "#fff" }}
              >
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
