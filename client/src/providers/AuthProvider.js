import { useCallback, useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { AuthContext, useAuth } from "../hooks/useAuth";
import { SVC_ENDPOINTS } from "../consts/api";

function AuthProvider({ children }) {
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(auth.isLoading);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated);
  const [accessToken, setAccessToken] = useState(auth.accessToken);

  const checkIsAuthenticated = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = auth.getAccessToken();

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false)
        return;
      }
      const response = await axios.get(
        `${SVC_ENDPOINTS.user}/auth/verify-token`,
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
        }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        setAccessToken(token);
      }
      
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 500)
      ) {
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false)
  }, [auth]);

  const handleLogout = useCallback(() => {
    const cookies = new Cookies();
    cookies.remove("accessToken", { path: "/" });
    setIsAuthenticated(false);
    setAccessToken("");
  }, []);

  // NOTE: currently need manual check.
  // Auto check might have async issues
  //useEffect(() => {
  //  checkIsAuthenticated();
  //}, []);

  const value = {
    isAuthenticated: isAuthenticated,
    accessToken: accessToken,
    checkIsAuthenticated: checkIsAuthenticated,
    logout: handleLogout,
    isLoading: isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
