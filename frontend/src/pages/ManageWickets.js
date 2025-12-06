import React, { useEffect, useState } from "react";
import { fetchWickets, deleteWicket, updateWicket } from "../api";
import "../styles/DataEntryImproved.css";

const ManageWickets = () => {
  const [wickets, setWickets] = useState([]);
  const [editWicket, setEditWicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWickets();
      console.log("📌 Fetched Wickets Data:", data);
      setWickets(data);
    } catch (error) {
      console.error("Error fetching wickets:", error);
      setError("Failed to load wickets data");
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
      await deleteWicket(id);
      setWickets(wickets.filter((wicket) => wicket._id !== id));
      setSuccess("Wicket deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting wicket:", error);
      setError("Failed to delete wicket");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleEdit = (wicket) => {
    const formattedWicket = {
      ...wicket,
      date: wicket.date ? new Date(wicket.date).toISOString().split("T")[0] : "",
    };
    setEditWicket(formattedWicket);
  };

  const handleChange = (e) => {
    setEditWicket({ ...editWicket, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      await updateWicket(editWicket._id, editWicket);
      setWickets(
        wickets.map((wicket) =>
          wicket._id === editWicket._id ? editWicket : wicket
        )
      );
      setEditWicket(null);
      setSuccess("Wicket updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating wicket:", error);
      setError("Failed to update wicket");
      setTimeout(() => setError(""), 5000);
    }
  };

  // Filter wickets based on search
  const filteredWickets = wickets.filter(
    (wicket) =>
      wicket.bowler_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wicket.venue?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="data-entry-container">
        <div className="data-entry-header">
          <div className="header-content">
            <h1 className="data-entry-title">
              Manage <span className="highlight">Bowling Records</span>
            </h1>
            <p className="data-entry-subtitle">
              View, edit, and delete bowling statistics
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
              placeholder="🔍 Search by bowler name or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading bowling records...</p>
            </div>
          ) : filteredWickets.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchTerm
                  ? "No records match your search"
                  : "No bowling records found"}
              </p>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bowler Name</th>
                    <th>Venue</th>
                    <th>Wickets</th>
                    <th>Innings</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWickets.map((wicket) => (
                    <tr key={wicket._id}>
                      <td data-label="Bowler">{wicket.bowler_name}</td>
                      <td data-label="Venue">{wicket.venue}</td>
                      <td data-label="Wickets">{wicket.wickets}</td>
                      <td data-label="Innings">{wicket.innings}</td>
                      <td data-label="Date">
                        {wicket.date
                          ? new Date(wicket.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td data-label="Actions">
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(wicket)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setDeleteConfirm(wicket._id)}
                            title="Delete"
                          >
                            🗑️
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
      {editWicket && (
        <div className="modal-overlay" onClick={() => setEditWicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Bowling Record</h2>
              <button
                className="modal-close"
                onClick={() => setEditWicket(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Bowler Name</label>
                  <input
                    type="text"
                    name="bowler_name"
                    className="form-input"
                    value={editWicket.bowler_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    className="form-input"
                    value={editWicket.venue}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Wickets</label>
                  <input
                    type="number"
                    name="wickets"
                    className="form-input"
                    value={editWicket.wickets}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Innings</label>
                  <input
                    type="number"
                    name="innings"
                    className="form-input"
                    value={editWicket.innings}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={editWicket.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-reset" onClick={() => setEditWicket(null)}>
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
              <p>Are you sure you want to delete this bowling record?</p>
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

export default ManageWickets;
