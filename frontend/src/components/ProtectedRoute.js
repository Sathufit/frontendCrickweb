import React from "react";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  return <Outlet />; // ✅ No authentication needed
};

export default ProtectedRoute;
