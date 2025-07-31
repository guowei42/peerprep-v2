import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LandingPage from "../components/LandingPage/LandingPage";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkIsAuthenticated } = useAuth();

  useEffect(() => {
    checkIsAuthenticated();
  }, [checkIsAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {!isAuthenticated ? (
        <LandingPage/>
      ) : (
        <Outlet context={isAuthenticated} />
      )}
    </>
  );
};

export default ProtectedRoute;
