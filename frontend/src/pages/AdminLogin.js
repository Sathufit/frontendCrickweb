import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPagesImproved.css";

// Credentials stored as env vars; fallback values for local dev only
const ADMIN_USER = process.env.REACT_APP_ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASSWORD || "cricket2024";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("isAdmin", "true");
      navigate("/admin-dashboard");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-gradient-bg"></div>
      
      <div className="login-card">
        <div className="login-logo">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 13.5c0 2-2.5 3.5-2.5 5h-2c0-1.5-2.5-3-2.5-5 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5zm-2.5 6.5h-2v2h2v-2z"/>
          </svg>
        </div>

        <h1 className="login-title">Admin Access</h1>
        <p className="login-subtitle">Enter your credentials to access the dashboard</p>

        <form className="login-form" onSubmit={handleLogin}>
          {error && (
            <div className="message-box error" style={{ marginBottom: "16px" }}>
              <span>{error}</span>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            <span>Access Dashboard</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>

        <div className="login-footer">
          <button onClick={() => navigate("/")} className="btn-back">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
