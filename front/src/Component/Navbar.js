import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css";

export default function Navbar({ onLogout, role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  const showBackButton = location.pathname !== "/home";

  // Fetch cart count (only for users)
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get("http://127.0.0.1:8000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const totalItems = data.data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    if (role === "user") {
      fetchCartCount();
      const interval = setInterval(fetchCartCount, 3000);
      return () => clearInterval(interval);
    }
  }, [role]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isAdmin");
    sessionStorage.clear();

    if (typeof onLogout === "function") onLogout();

    navigate("/login", { replace: true });
  };

  // Show navbar only for users
  if (role !== "user") return null;

  return (
    <nav
      className="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        backgroundColor: "#b71c1c",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      {/* Left: Back button */}
      <div>
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "1.5rem",
              cursor: "pointer",
              outline: "none",
              transition: "color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff9999";
              e.currentTarget.style.transform = "scale(1.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ←
          </button>
        )}
      </div>

      {/* Right: Cart + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Cart button */}
        <button
          onClick={() => navigate("/cart")}
          style={{
            position: "relative",
            backgroundColor: "#fff",
            color: "#b71c1c",
            border: "none",
            borderRadius: "5px",
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff9999")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
        >
          🛒 Cart
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                background: "red",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ff6666",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff9999")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff6666")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
