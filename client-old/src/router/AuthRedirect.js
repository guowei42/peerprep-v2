import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthRedirect = () => {
  const { isAuthenticated, checkIsAuthenticated } = useAuth();

  useEffect(() => {
    checkIsAuthenticated();
  }, [checkIsAuthenticated]);

  return <>{isAuthenticated ? <Navigate to="/" replace /> : <Outlet />}</>;
};

export default AuthRedirect;
