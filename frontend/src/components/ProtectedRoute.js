import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  return isAdmin ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;
