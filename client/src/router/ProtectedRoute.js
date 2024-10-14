import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
        <Navigate to="/" replace />
      ) : (
        <Outlet context={isAuthenticated} />
      )}
    </>
  );
};

export default ProtectedRoute;
