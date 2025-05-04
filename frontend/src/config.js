const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("❌ API_URL is not defined in environment variables");
}

export default API_URL;
