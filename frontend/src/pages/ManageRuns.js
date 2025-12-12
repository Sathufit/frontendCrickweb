import React, { useEffect, useState } from "react";
import { fetchRuns, deleteRun, updateRun } from "../api";
import "../styles/DataEntryImproved.css";

const ManageRuns = () => {
  const [runs, setRuns] = useState([]);
  const [editRun, setEditRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRuns();
      console.log("📌 Fetched Runs Data:", data);
      setRuns(data);
    } catch (error) {
      console.error("Error fetching runs:", error);
      setError("Failed to load runs data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    setDeleteConfirm(null);
    setError("");
    setSuccess("");
    try {
      await deleteRun(id);
      setRuns(runs.filter((run) => run._id !== id));
      setSuccess("Run deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting run:", error);
      setError("Failed to delete run");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleEdit = (run) => {
    const formattedRun = {
      ...run,
      date: run.date ? new Date(run.date).toISOString().split("T")[0] : "",
    };
    setEditRun(formattedRun);
  };

  const handleChange = (e) => {
    setEditRun({ ...editRun, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      await updateRun(editRun._id, editRun);
      setRuns(runs.map((run) => (run._id === editRun._id ? editRun : run)));
      setEditRun(null);
      setSuccess("Run updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating run:", error);
      setError("Failed to update run");
      setTimeout(() => setError(""), 5000);
    }
  };

  // Filter runs based on search
  const filteredRuns = runs.filter((run) =>
    run.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    run.venue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="data-entry-container">
        <div className="data-entry-header">
          <div className="header-content">
            <h1 className="data-entry-title">
              Manage <span className="highlight">Batting Records</span>
            </h1>
            <p className="data-entry-subtitle">
              View, edit, and delete batting statistics
            </p>
          </div>
          <button className="btn-refresh" onClick={loadData} disabled={loading}>
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {success && (
          <div className="message-box success">
            <span>✅ {success}</span>
          </div>
        )}

        {error && (
          <div className="message-box error">
            <span>{error}</span>
          </div>
        )}

        <div className="form-card">
          <div className="search-bar">
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Search by batter name or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading batting records...</p>
            </div>
          ) : filteredRuns.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchTerm
                  ? "No records match your search"
                  : "No batting records found"}
              </p>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Batter</th>
                    <th>Venue</th>
                    <th>Runs</th>
                    <th>Innings</th>
                    <th>Outs</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRuns.map((run) => (
                    <tr key={run._id}>
                      <td data-label="Batter">{run.name}</td>
                      <td data-label="Venue">{run.venue}</td>
                      <td data-label="Runs">{run.runs}</td>
                      <td data-label="Innings">{run.innings}</td>
                      <td data-label="Outs">{run.outs}</td>
                      <td data-label="Date">
                        {run.date
                          ? new Date(run.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(run)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setDeleteConfirm(run._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editRun && (
        <div className="modal-overlay" onClick={() => setEditRun(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Batting Record</h2>
              <button
                className="modal-close"
                onClick={() => setEditRun(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Batter Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={editRun.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    className="form-input"
                    value={editRun.venue}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Runs</label>
                  <input
                    type="number"
                    name="runs"
                    className="form-input"
                    value={editRun.runs}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Innings</label>
                  <input
                    type="number"
                    name="innings"
                    className="form-input"
                    value={editRun.innings}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Outs</label>
                  <input
                    type="number"
                    name="outs"
                    className="form-input"
                    value={editRun.outs}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-input"
                    value={editRun.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-reset" onClick={() => setEditRun(null)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="modal-content modal-small"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button
                className="modal-close"
                onClick={() => setDeleteConfirm(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>Are you sure you want to delete this batting record?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button
                className="btn-reset"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRuns;
