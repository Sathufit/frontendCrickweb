import React, { useState } from "react";
import axios from "axios";
import "../styles/DataEntryImproved.css";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyard.sathush.dev";

const playerNames = [
  "Yamila Dilhara",
  "Chanuka de Silva",
  "Sathush Nanayakkara",
  "Achala Shashvika",
  "Chanindu Maneth",
  "Nidula Hansaja",
  "Ravindu Nanayakkara",
  "Dulshan Thanoj",
  "Savindu Weerarathna",
  "Dinal Chamith",
  "Farhan Navufal",
  "Siluna Sathmina",
  "Madhawa Aloka",
  "Anjitha Kaveendra",
  "Dihindu Nimsath",
  "Shalom Dilsara",
  "Ayesh Jeewantha",
  "Eesara Kovinda",
  "Saveen Nanayakkara",
  "Reshan Kavinga",
  "Ovindu",
  "Diyatha",
  "Adithya",

];

const AddRuns = () => {
  const [formData, setFormData] = useState({
    name: "",
    venue: "",
    runs: "",
    innings: "",
    outs: "",
    date: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(`${API_URL}/runs`, formData);
      console.log("✅ Run Added:", response.data);

      setMessage({
        text: "✅ Batting statistics added successfully!",
        type: "success",
      });

      // Reset form
      setFormData({
        name: "",
        venue: "",
        runs: "",
        innings: "",
        outs: "",
        date: "",
      });
    } catch (error) {
      console.error("❌ Error adding run:", error.response?.data || error);
      setMessage({
        text: "❌ Error adding batting statistics. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      venue: "",
      runs: "",
      innings: "",
      outs: "",
      date: "",
    });
    setMessage({ text: "", type: "" });
  };

  return (
    <div className="main-content">
      <div className="data-entry-container">
        <div className="data-entry-header">
          <h1 className="data-entry-title">
            Add <span className="highlight">Batting Stats</span>
          </h1>
          <p className="data-entry-subtitle">
            Record batting performance and statistics
          </p>
        </div>

        {message.text && (
          <div className={`message-box ${message.type}`}>
            <span>{message.text}</span>
          </div>
        )}

        <div className="form-card">
          <form className="data-entry-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Player Name</label>
                <select
                  name="name"
                  className="form-select"
                  value={formData.name}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Player</option>
                  {playerNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">Venue</label>
                <input
                  type="text"
                  name="venue"
                  className="form-input"
                  placeholder="Enter venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Runs Scored</label>
                <input
                  type="number"
                  name="runs"
                  className="form-input"
                  placeholder="Enter runs"
                  value={formData.runs}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Innings Played</label>
                <input
                  type="number"
                  name="innings"
                  className="form-input"
                  placeholder="Number of innings"
                  value={formData.innings}
                  onChange={handleChange}
                  min="1"
                  max="2"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Outs</label>
                <input
                  type="number"
                  name="outs"
                  className="form-input"
                  placeholder="Enter outs"
                  value={formData.outs}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Match Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Batting Stats"}
              </button>
              <button
                type="button"
                className="btn-reset"
                onClick={handleReset}
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRuns;