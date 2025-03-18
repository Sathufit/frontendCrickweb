import axios from "axios";

const API_URL = "http://localhost:5001"; // Ensure this matches your backend server port

// ✅ Fetch Runs
export const fetchRuns = async () => {
    try {
        const response = await axios.get("http://localhost:5001/runs");
        console.log("📌 Fetched Runs Data (Frontend):", response.data); // ✅ Debugging
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching runs:", error);
        return [];
    }
};


// ✅ Fetch Wickets
export const fetchWickets = async () => {
    try {
        const response = await axios.get(`${API_URL}/wickets`);
        console.log("📌 Fetched Wickets Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching wickets:", error);
        return [];
    }
};

// ✅ Add New Run
export const addRun = async (runData) => {
    try {
        const response = await axios.post(`${API_URL}/runs`, runData);
        console.log("✅ Run Added:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error adding run:", error);
        throw error;
    }
};


// ✅ Add New Wicket
export const addWicket = async (wicketData) => {
    try {
        const response = await axios.post(`${API_URL}/wickets`, wicketData);
        console.log("✅ Wicket Added:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error adding wicket:", error);
        throw error;
    }
};

// ✅ Delete Run
export const deleteRun = async (id) => {
    try {
        await axios.delete(`http://localhost:5001/runs/${id}`);
        console.log(`✅ Run with ID ${id} deleted.`);
    } catch (error) {
        console.error(`❌ Error deleting run with ID ${id}:`, error);
        throw error;
    }
};


// ✅ Delete Wicket
export const deleteWicket = async (id) => {
    try {
        await axios.delete(`${API_URL}/wickets/${id}`);  // ✅ Ensure correct endpoint
        console.log(`✅ Wicket with ID ${id} deleted.`);
    } catch (error) {
        console.error(`❌ Error deleting wicket with ID ${id}:`, error);
        throw error;
    }
};


// ✅ Update Run
export const updateRun = async (id, updatedData) => {
    try {
        const response = await axios.put(`http://localhost:5001/runs/${id}`, updatedData);
        console.log("✅ Run Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating run:", error);
        throw error;
    }
};



// ✅ Update Wicket
export const updateWicket = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/wickets/${id}`, updatedData);  // ✅ Ensure correct endpoint
        console.log("✅ Wicket Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating wicket:", error);
        throw error;
    }
};
export const fetchPlayerStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/players/stats`); // ✅ Correct API endpoint
        console.log("📌 Player Stats Fetched:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching player stats:", error);
        throw error;
    }
};
