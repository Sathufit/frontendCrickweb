import React from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/admin-dashboard"); // ✅ Redirects without login
  };

  return (
    <div>
      <h2>Admin Dashboard Access</h2>
      <button onClick={handleLogin}>Enter Admin Dashboard</button>
    </div>
  );
};

export default AdminLogin;
