import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ onLogout, role, cart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (role !== "user") return null;

  const cartCount = cart.length;

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    if (typeof onLogout === "function") {
      onLogout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          backgroundColor: "#b71c1c",
          color: "#fff",
          boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 40px",
          }}
        >
          {/* LOGO */}
          <Link
            to="/home"
            style={{
              textDecoration: "none",
              fontSize: "1.7rem",
              fontWeight: "bold",
              color: "#fff",
              transition: "transform 0.3s ease, color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.color = "#ffe6e6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#fff";
            }}
          >
            Threaditional
          </Link>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            {/* CART BUTTON */}
            <CartButton
              count={cartCount}
              path="/cart"
              activePath={location.pathname}
            />

            {/* PROFILE DROPDOWN */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.15)",
                  padding: "8px 16px",
                  borderRadius: "25px",
                  transition: "background 0.3s ease",
                }}
              >
                <span>👤 Profile</span>
                <span style={{ fontSize: "0.8rem" }}>▼</span>
              </div>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "45px",
                    right: 0,
                    backgroundColor: "#fff",
                    color: "#333",
                    borderRadius: "8px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                    minWidth: "170px",
                    overflow: "hidden",
                  }}
                >
                  <DropdownItem label="My Donations" link="/donations" />
                  <DropdownItem label="My Orders" link="/orders" />
                  <DropdownItem
                    label="Logout"
                    color="#b71c1c"
                    bold
                    onClick={() => setShowLogoutConfirm(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NAV LINKS BAR */}
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "50px",
            padding: "10px 0",
            backgroundColor: "#a01515",
          }}
        >
          <NavLink label="Home" path="/home" activePath={location.pathname} />
          <NavLink
            label="Fundraiser"
            path="/fundraiser"
            activePath={location.pathname}
          />
          <NavLink
            label="Orders"
            path="/orders"
            activePath={location.pathname}
          />
          <NavLink
            label="Donations"
            path="/donations"
            activePath={location.pathname}
          />
        </nav>
      </header>

      {/* ===== LOGOUT CONFIRMATION MODAL ===== */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "30px 40px",
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              width: "90%",
              maxWidth: "380px",
            }}
          >
            <h3 style={{ color: "#b71c1c", marginBottom: "15px" }}>
              Confirm Logout
            </h3>
            <p style={{ color: "#333", marginBottom: "25px" }}>
              Are you sure you want to logout?
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  background: "#ccc",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: "#b71c1c",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* --- Subcomponents --- */
function NavLink({ label, path, activePath }) {
  const isActive = activePath === path;
  return (
    <Link
      to={path}
      style={{
        position: "relative",
        fontSize: "1rem",
        fontWeight: "600",
        color: isActive ? "#ffe6e6" : "#fff",
        textDecoration: "none",
        padding: "5px 10px",
        transition: "color 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#ffdddd")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = isActive ? "#ffe6e6" : "#fff")
      }
    >
      {label}
      <span
        style={{
          position: "absolute",
          left: "50%",
          bottom: "0",
          transform: "translateX(-50%)",
          width: isActive ? "60%" : "0%",
          height: "2px",
          background: "#fff",
          borderRadius: "2px",
          transition: "width 0.3s ease",
        }}
      ></span>
    </Link>
  );
}

function CartButton({ count, path, activePath }) {
  const isActive = activePath === path;
  return (
    <Link
      to={path}
      style={{
        background: "transparent",
        border: "none",
        color: isActive ? "#ffcccb" : "#fff",
        fontWeight: "600",
        fontSize: "1.4rem",
        cursor: "pointer",
        position: "relative",
        textDecoration: "none",
        transition: "transform 0.3s ease, color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.15)";
        e.currentTarget.style.color = "#ffdddd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.color = isActive ? "#ffcccb" : "#fff";
      }}
    >
      🛒
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-10px",
            background: "#ff3b3b",
            color: "#fff",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "0.7rem",
            fontWeight: "bold",
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

function DropdownItem({ label, link, onClick, color = "#333", bold = false }) {
  const baseStyle = {
    width: "100%",
    textAlign: "left",
    padding: "10px 16px",
    background: "transparent",
    border: "none",
    fontSize: "0.95rem",
    color,
    fontWeight: bold ? "bold" : "normal",
    display: "block",
    textDecoration: "none",
    transition: "background 0.3s ease, padding-left 0.2s ease",
  };

  const hoverEffect = (e) => {
    e.currentTarget.style.background = "#f2f2f2";
    e.currentTarget.style.paddingLeft = "20px";
  };

  const leaveEffect = (e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.paddingLeft = "16px";
  };

  if (link) {
    return (
      <Link
        to={link}
        style={baseStyle}
        onMouseEnter={hoverEffect}
        onMouseLeave={leaveEffect}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={hoverEffect}
      onMouseLeave={leaveEffect}
    >
      {label}
    </button>
  );
}
