const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "";

export default API_URL;
