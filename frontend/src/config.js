const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : ""; // use relative path in production

export default API_URL;
