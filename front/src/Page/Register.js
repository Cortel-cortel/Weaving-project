import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Register({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // errors in an array
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];

    if (!name) newErrors.push("❌ Name is required.");
    if (!email) newErrors.push("❌ Email is required.");
    if (!password) {
      newErrors.push("❌ Password is required.");
    } else if (password.length < 6) {
      newErrors.push("❌ Password must be at least 6 characters.");
    }
    if (!confirmPassword) {
      newErrors.push("❌ Please confirm your password.");
    } else if (password !== confirmPassword) {
      newErrors.push("❌ Passwords do not match.");
    }
    if (!agree) newErrors.push("❌ You must accept the Terms and Conditions.");

    setErrors(newErrors);

    if (newErrors.length > 0) return;

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.data.success) {
        // ✅ Save user info into localStorage for donation auto-fill
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: name,
            email: email,
          })
        );

        // optionally save token if backend returns it
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        onLogin(response.data);
        navigate(response.data.redirect || "/home");
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const serverErrors = [];
        if (error.response.data.errors.email) {
          serverErrors.push("❌ " + error.response.data.errors.email[0]);
        }
        setErrors(serverErrors);
      } else {
        setErrors(["❌ Something went wrong. Please try again."]);
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
        <h2 className="login-title">Register</h2>

        {/* 🔴 Error Alert Box */}
        {errors.length > 0 && (
          <div className="error-box">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Name */}
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`login-input ${
              errors.some((err) => err.toLowerCase().includes("name"))
                ? "input-error"
                : ""
            }`}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`login-input ${
              errors.some((err) => err.toLowerCase().includes("email"))
                ? "input-error"
                : ""
            }`}
          />

          {/* Password */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`password-input ${
                errors.some((err) => err.toLowerCase().includes("password"))
                  ? "input-error"
                  : ""
              }`}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`password-input ${
                errors.some((err) => err.toLowerCase().includes("match"))
                  ? "input-error"
                  : ""
              }`}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          {/* Terms & Conditions */}
          <div style={{ margin: "5px", fontSize: "0.75rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
                style={{ width: "14px", height: "14px" }}
              />
              <span style={{ flex: 1 }}>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  Terms and Conditions
                </button>
              </span>
            </label>
          </div>

          <button type="submit" className="login-button">
            Register
          </button>
        </form>

        <p className="login-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>

      {/* ✅ Terms Modal */}
      {showTerms && (
        <div className="terms-modal">
          <div className="terms-content">
            <h3>Terms and Conditions</h3>
            <div className="terms-body">
              <p>
                Welcome to Threaditional! By using our platform, you agree to the following:
              </p>
              <ul>
                <li><b>Account:</b> You must provide accurate details and keep them updated.</li>
                <li><b>Orders:</b> Purchases are subject to availability and confirmation.</li>
                <li><b>Payments:</b> All payments must be made securely using approved methods.</li>
                <li><b>Privacy:</b> We respect your privacy and handle your data responsibly.</li>
                <li><b>Usage:</b> You agree not to misuse or attempt to exploit the site.</li>
                <li><b>Returns:</b> Items can only be returned if defective or misrepresented.</li>
                <li><b>Liability:</b> Threaditional is not responsible for third-party misuse.</li>
                <li><b>Changes:</b> Terms may be updated, and continued use implies agreement.</li>
              </ul>
              <p style={{ fontSize: "0.7rem", marginTop: "10px", textAlign: "justify" }}>
                Please read these carefully before proceeding. If you do not agree, you should not register or use this platform. 
                For further details, contact our support team.
              </p>
            </div>
            <button className="close-button" onClick={() => setShowTerms(false)}>
              I Agree & Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Styles */}
      <style>
        {`
          .terms-modal {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .terms-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          }
          .terms-body {
            font-size: 0.8rem;
            line-height: 1.4;
            margin-bottom: 15px;
            text-align: left;
          }
          .terms-body ul {
            margin-left: 18px;
            padding-left: 0;
          }
          .terms-body li {
            margin-bottom: 6px;
          }
          .error-box {
            background: #ffe6e6;
            border: 1px solid red;
            border-radius: 6px;
            padding: 10px;
            margin-bottom: 12px;
          }
          .error-box p {
            color: red;
            font-size: 0.85rem;
            margin: 2px 0;
          }
          .input-error {
            border: 1px solid red;
            background-color: #fff5f5;
          }
          .close-button {
            background: #007bff;
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            align-self: flex-end;
          }
          .close-button:hover {
            background: #0056b3;
          }
        `}
      </style>
    </div>
  );
}

export default Register;
