import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import all your pages
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
import WicketAnalysis from "./pages/WicketAnalysis";
import DailyReport from "./pages/DailyReport";
import LiveMatches from "./pages/LiveMatches";
import LiveMatchViewer from "./pages/LiveMatchViewer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        
        {/* Live Match Routes */}
        <Route path="/live-matches" element={<LiveMatches />} />
        <Route path="/live-match/:matchId" element={<LiveMatchViewer />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="add-runs" element={<AddRuns />} />
          <Route path="add-wickets" element={<AddWickets />} />
          <Route path="manage-runs" element={<ManageRuns />} />
          <Route path="manage-wickets" in element={<ManageWickets />} />
          <Route path="daily-report" element={<DailyReport />} />
        </Route>
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
}

export default App;