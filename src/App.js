import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddRuns from "./pages/AddRuns";
import AddWickets from "./pages/AddWickets";
import ManageRuns from "./pages/ManageRuns";
import ManageWickets from "./pages/ManageWickets";
import ViewRuns from "./pages/ViewRuns";
import ViewWickets from "./pages/ViewWickets";
import PlayerStats from "./pages/PlayerStats";
import Analyst from "./pages/Analyst"; // ✅ Corrected Import
import AdminLogin from "./pages/AdminLogin";

import "./styles.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-runs" element={<AddRuns />} />
        <Route path="/add-wickets" element={<AddWickets />} />
        <Route path="/manage-runs" element={<ManageRuns />} />
        <Route path="/manage-wickets" element={<ManageWickets />} />
        <Route path="/view-runs" element={<ViewRuns />} />
        <Route path="/view-wickets" element={<ViewWickets />} />
        <Route path="/stats" element={<PlayerStats />} />
        <Route path="/analyst" element={<Analyst />} /> {/* ✅ Corrected Route */}
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
