const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyardcricket.onrender.com"; // ✅ your deployed backend URL

export default API_URL;
