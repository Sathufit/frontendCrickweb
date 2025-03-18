import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config";

const AdminLogin = ({ setAuthToken }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/login`, formData);
            localStorage.setItem("token", response.data.token);
            setAuthToken(response.data.token);
        } catch (error) {
            setError("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default AdminLogin;
