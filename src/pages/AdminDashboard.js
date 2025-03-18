import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="add-runs">Add Runs</Link></li>
          <li><Link to="add-wickets">Add Wickets</Link></li>
          <li><Link to="manage-runs">Manage Runs</Link></li>
          <li><Link to="manage-wickets">Manage Wickets</Link></li>
        </ul>
      </nav>

      {/* ✅ Display the nested routes */}
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
