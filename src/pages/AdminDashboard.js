import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/admin/add-runs">Add Runs</Link></li>
          <li><Link to="/admin/add-wickets">Add Wickets</Link></li>
          <li><Link to="/admin/manage-runs">Manage Runs</Link></li>
          <li><Link to="/admin/manage-wickets">Manage Wickets</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
