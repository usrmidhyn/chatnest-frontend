import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/chat");
    } catch (err) {
      alert(err?.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h4 className="mb-4 text-center">Login</h4>

        <input
          type="email"
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>

        <p className="mt-3 text-center">
          No account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
