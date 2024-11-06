import { createContext, useContext } from "react";
import Cookies from "universal-cookie";

export const AuthContext = createContext({
  isAuthenticated: false,
  checkIsAuthenticated: () => {},
  accessToken: "",
  getAccessToken: () => {
    return new Cookies().get("accessToken");
  },
  logout: () => {
    const cookies = new Cookies();
    cookies.remove("accessToken", { path: "/" });
  },
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);
