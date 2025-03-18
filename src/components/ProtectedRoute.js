import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Ensure you have jwt-decode installed

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/admin-login" />;

  try {
    // ✅ Decode token and check expiration
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token"); // ✅ Remove expired token
      return <Navigate to="/admin-login" />;
    }
  } catch (error) {
    return <Navigate to="/admin-login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
