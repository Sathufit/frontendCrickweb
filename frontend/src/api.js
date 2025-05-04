import axios from "axios";

// ✅ **Set API Base URL**
const API_URL = "https://friendspherecricweb.onrender.com"; // ✅ Update with deployed backend URL

// ✅ **Fetch Runs**
export const fetchRuns = async () => {
    try {
        const response = await axios.get(`${API_URL}/runs`);
        console.log("📌 Fetched Runs Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching runs:", error.response?.data || error);
        return [];
    }
};

// ✅ **Fetch Wickets**
export const fetchWickets = async () => {
    try {
        const response = await axios.get(`${API_URL}/wickets`);
        console.log("📌 Fetched Wickets Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching wickets:", error.response?.data || error);
        return [];
    }
};

// ✅ **Add a New Run (No Auth Needed)**
export const addRun = async (runData) => {
    try {
        const response = await axios.post(`${API_URL}/runs`, runData);
        console.log("✅ Run Added:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error adding run:", error.response?.data || error);
        throw error;
    }
};

// ✅ **Add a New Wicket (No Auth Needed)**
export const addWicket = async (wicketData) => {
    try {
        const response = await axios.post(`${API_URL}/wickets`, wicketData);
        console.log("✅ Wicket Added:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error adding wicket:", error.response?.data || error);
        throw error;
    }
};

// ✅ **Delete a Run (No Auth Needed)**
export const deleteRun = async (id) => {
    try {
        await axios.delete(`${API_URL}/runs/${id}`);
        console.log(`✅ Run with ID ${id} deleted.`);
    } catch (error) {
        console.error(`❌ Error deleting run with ID ${id}:`, error.response?.data || error);
        throw error;
    }
};

// ✅ **Delete a Wicket (No Auth Needed)**
export const deleteWicket = async (id) => {
    try {
        await axios.delete(`${API_URL}/wickets/${id}`);
        console.log(`✅ Wicket with ID ${id} deleted.`);
    } catch (error) {
        console.error(`❌ Error deleting wicket with ID ${id}:`, error.response?.data || error);
        throw error;
    }
};

// ✅ **Update a Run (No Auth Needed)**
export const updateRun = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/runs/${id}`, updatedData);
        console.log("✅ Run Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating run:", error.response?.data || error);
        throw error;
    }
};

// ✅ **Update a Wicket (No Auth Needed)**
export const updateWicket = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/wickets/${id}`, updatedData);
        console.log("✅ Wicket Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating wicket:", error.response?.data || error);
        throw error;
    }
};

// ✅ **Fetch Player Stats**
export const fetchPlayerStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/players/stats`);
        console.log("📌 Player Stats Fetched:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching player stats:", error.response?.data || error);
        throw error;
    }
};
