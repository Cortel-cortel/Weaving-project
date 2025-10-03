import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onLogout, role, cart }) {
  const navigate = useNavigate();
  const location = useLocation();

  const showBackButton = location.pathname !== "/home";

  // 👇 count unique items in cart
  const cartCount = cart.length;

  if (role !== "user") return null;

  return (
    <nav
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
            }}
          >
            ←
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Cart Button */}
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
          }}
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

        {/* Logout Button */}
        <button
          onClick={() => {
            if (typeof onLogout === "function") {
              onLogout(); // 👈 call parent App's logout
              navigate("/login", { replace: true }); // redirect to login
            }
          }}
          style={{
            backgroundColor: "#ff6666",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
