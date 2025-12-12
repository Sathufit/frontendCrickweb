import React, { useState } from "react";
import axios from "axios";
import "../styles/DataEntryImproved.css";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyard.sathush.dev";

// ✅ List of bowler names extracted from your data
const bowlerNames = [
  "Ravindu Nanayakkara",
  "Sathush Nanayakkara",
  "Yamila Dilhara",
  "Madhawa Aloka",
  "Dihindu Nimsath",
  "Dinal Chamith",
  "Anjitha Kaveendra",
  "Achala Shashvika",
  "Nidula Hansaja",
  "Dulshan Thanoj",
  "Savindu Weerarathna",
  "Chanuka de Silva",
  "Siluna Sathmina",
  "Farhan Navufal",
  "Saveen Nanayakkara",
  "Reshan Kavinga",
  "Shalom Dilsara",
  "Ovindu",
  "Diyatha",
  "Adithya",
];


const AddWickets = () => {
  const [formData, setFormData] = useState({
    bowler_name: "",
    venue: "",
    wickets: "",
    innings: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    console.log("📌 Sending Wicket Data to Backend:", formData);

    try {
      const response = await axios.post(`${API_URL}/wickets`, {
        bowler_name: formData.bowler_name,
        venue: formData.venue,
        wickets: Number(formData.wickets),
        innings: Number(formData.innings),
        date: formData.date
      });

      console.log("✅ Wicket Added Successfully:", response.data);
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({ bowler_name: "", venue: "", wickets: "", innings: "", date: "" });

    } catch (error) {
      console.error("❌ Error adding wicket:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : "Failed to add wicket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="data-entry-container">
        <div className="data-entry-header">
          <h1 className="data-entry-title">
            Add <span className="highlight">Bowling Stats</span>
          </h1>
          <p className="data-entry-subtitle">
            Record bowling performance and wicket statistics
          </p>
        </div>

        {success && (
          <div className="message-box success">
            <span>✅ Wicket added successfully!</span>
          </div>
        )}

        {error && (
          <div className="message-box error">
            <span>{error}</span>
          </div>
        )}

        <div className="form-card">
          <form className="data-entry-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Bowler Name</label>
                <select
                  name="bowler_name"
                  className="form-select"
                  value={formData.bowler_name}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Bowler</option>
                  {bowlerNames.map((name) => (
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
                <label className="form-label required">Wickets</label>
                <input
                  type="number"
                  name="wickets"
                  className="form-input"
                  placeholder="Enter wickets"
                  value={formData.wickets}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Innings Bowled</label>
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

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Bowling Stats"}
              </button>
              <button
                type="button"
                className="btn-reset"
                onClick={() => setFormData({ bowler_name: "", venue: "", wickets: "", innings: "", date: "" })}
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

export default AddWickets;