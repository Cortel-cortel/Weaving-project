import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./Page/Login";
import Register from "./Page/Register";
import Dashboard from "./Page/Dashboard";
import AddProduct from "./Page/AddProduct";
import Home from "./Page/Home";
import Main from "./Page/Main";
import Cart from "./Page/Cart";
import Checkout from "./Page/Checkout";
import CheckoutSuccess from "./Page/CheckoutSuccess";
import ProductPage from "./Page/ProductPage";
import FundraiserPage from "./Page/FundraiserPage";
import FundraiserList from "./Page/FundraiserList";
import Navbar from "./Component/Navbar";

function AppRoutes({ role, handleLogin, handleLogout }) {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  // Redirect logged-in users away from login/register
  if ((location.pathname === "/" || location.pathname === "/login") && role) {
    return <Navigate to={role === "admin" ? "/dashboard" : "/home"} replace />;
  }

  return (
    <>
      {/* Show Navbar only for user role and not on login/register */}
      {role === "user" && !hideNavbar && <Navbar handleLogout={handleLogout} />}

      <div className={role === "user" ? "with-navbar page-content" : ""}>
        <Routes>
          {/* Authentication */}
          <Route
            path="/"
            element={
              role === "user" ? (
                <Navigate to="/home" />
              ) : role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/login"
            element={
              role === "user" ? (
                <Navigate to="/home" />
              ) : role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={role === "admin" ? <Dashboard /> : <Navigate to="/home" />} />
          <Route path="/add-product" element={role === "admin" ? <AddProduct /> : <Navigate to="/home" />} />

          {/* User Routes */}
          <Route path="/home" element={role === "user" ? <Home role={role} /> : <Navigate to="/dashboard" />} />
          <Route path="/user" element={<Main />} />

          {/* Product Pages */}
          <Route path="/product/:productId" element={<ProductPage />} />

          {/* Fundraiser Pages */}
          <Route path="/fundraiser" element={<FundraiserPage />} />
          <Route path="/fundraiser-list" element={<FundraiserList />} />

          {/* Cart / Checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);

  const handleLogin = (userData) => {
    const newRole = userData.isAdmin ? "admin" : "user";
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  const handleLogout = () => {
    setRole(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <Router>
      <AppRoutes role={role} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  );
}

export default App;
