import axios from "axios";

// ✅ Set API base URL inline (no config.js)
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyard.sathush.dev";

// ✅ Fetch Runs
export const fetchRuns = async () => {
  try {
    const response = await axios.get(`${API_URL}/runs`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching runs:", error.response?.data || error);
    return [];
  }
};

// ✅ Fetch Wickets
export const fetchWickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/wickets`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching wickets:", error.response?.data || error);
    return [];
  }
};

// ✅ Add Run
export const addRun = async (runData) => {
  try {
    const response = await axios.post(`${API_URL}/runs`, runData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding run:", error.response?.data || error);
    throw error;
  }
};

// ✅ Add Wicket
export const addWicket = async (wicketData) => {
  try {
    const response = await axios.post(`${API_URL}/wickets`, wicketData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding wicket:", error.response?.data || error);
    throw error;
  }
};

// ✅ Delete Run
export const deleteRun = async (id) => {
  try {
    await axios.delete(`${API_URL}/runs/${id}`);
  } catch (error) {
    console.error("❌ Error deleting run:", error.response?.data || error);
    throw error;
  }
};

// ✅ Delete Wicket
export const deleteWicket = async (id) => {
  try {
    await axios.delete(`${API_URL}/wickets/${id}`);
  } catch (error) {
    console.error("❌ Error deleting wicket:", error.response?.data || error);
    throw error;
  }
};

// ✅ Update Run
export const updateRun = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/runs/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating run:", error.response?.data || error);
    throw error;
  }
};

// ✅ Update Wicket
export const updateWicket = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/wickets/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating wicket:", error.response?.data || error);
    throw error;
  }
};

// ✅ Fetch Player Stats
export const fetchPlayerStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/players/stats`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching player stats:", error.response?.data || error);
    throw error;
  }
};

// ✅ Live Match API Functions

// Fetch all live matches
export const fetchLiveMatches = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/live-matches`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching live matches:", error.response?.data || error);
    return [];
  }
};

// Fetch specific live match by ID
export const fetchLiveMatch = async (matchId) => {
  try {
    const response = await axios.get(`${API_URL}/api/live-match/${matchId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching live match:", error.response?.data || error);
    throw error;
  }
};

// Create a new live match
export const createLiveMatch = async (matchData) => {
  try {
    const response = await axios.post(`${API_URL}/api/live-match`, matchData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating live match:", error.response?.data || error);
    throw error;
  }
};

// Add a ball to live match
export const addBallToMatch = async (matchId, ballData) => {
  try {
    const response = await axios.post(`${API_URL}/api/live-match/${matchId}/ball`, ballData);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding ball to match:", error.response?.data || error);
    throw error;
  }
};

