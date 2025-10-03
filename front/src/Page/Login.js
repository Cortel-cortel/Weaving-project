import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // ✅ error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear old error

    if (!email || !password) {
      setError("❌ Please enter both email and password.");
      return;
    }

    try {
      const { data } = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.isAdmin);

        onLogin(data);

        navigate(data.isAdmin ? "/dashboard" : "/home", { replace: true });
      } else {
        setError(data.message || "❌ The email or password you entered is incorrect.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.data?.message) {
        setError("❌ " + err.response.data.message);
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{
        backgroundImage: "url('/images/weaver-banner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="overlay"></div>

      <div className="login-container">
        <h2 className="login-title">Login</h2>

        {/* ✅ Error Message Box */}
        {error && <div className="error-box"><p>{error}</p></div>}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`login-input ${error.toLowerCase().includes("email") || error.toLowerCase().includes("password") ? "input-error" : ""}`}
            required
          />

          {/* Password */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`password-input ${error.toLowerCase().includes("password") ? "input-error" : ""}`}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-switch">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>

      {/* ✅ Inline Error Styles */}
      <style>
        {`
          .error-box {
            background: #ffe6e6;
            border: 1px solid red;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 12px;
            text-align: center;
          }
          .error-box p {
            color: red;
            font-size: 0.9rem;
            margin: 0;
          }
          .input-error {
            border: 1px solid red !important;
            background-color: #fff5f5 !important;
          }
        `}
      </style>
    </div>
  );
}

export default Login;
