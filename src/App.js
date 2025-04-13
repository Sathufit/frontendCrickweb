import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ViewRuns from "./pages/ViewRuns";
import ViewWickets from "./pages/ViewWickets";
import PlayerStats from "./pages/PlayerStats";
import Analyst from "./pages/Analyst";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddRuns from "./pages/AddRuns";
import AddWickets from "./pages/AddWickets";
import ManageRuns from "./pages/ManageRuns";
import ManageWickets from "./pages/ManageWickets";
import WicketAnalysis from './pages/WicketAnalysis';

import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/view-runs" element={<ViewRuns />} />
        <Route path="/view-wickets" element={<ViewWickets />} />
        <Route path="/stats" element={<PlayerStats />} />
        <Route path="/analyst" element={<Analyst />} />
        <Route path="/wicket-analysis" element={<WicketAnalysis />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ✅ Admin Routes (Nested Inside Admin Dashboard) */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="add-runs" element={<AddRuns />} />
          <Route path="add-wickets" element={<AddWickets />} />
          <Route path="manage-runs" element={<ManageRuns />} />
          <Route path="manage-wickets" element={<ManageWickets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
