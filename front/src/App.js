import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Pages
import Login from "./Page/Login";
import Register from "./Page/Register";
import Dashboard from "./Page/Dashboard";
import AddProduct from "./Page/AddProduct";
import Home from "./Page/Home";
import Main from "./Page/Main";
import Cart from "./Page/Cart";
import Checkout from "./Page/Checkout";
import CheckoutSuccess from "./Page/CheckoutSuccess";
import ProductDetail from "./Page/ProductDetail";
import ProductPage from "./Page/ProductPage";
import FundraiserPage from "./Page/FundraiserPage";
import FundraiserDetail from "./Page/FundraiserDetail";
import FundraiserList from "./Page/FundraiserList";
import ManageDonations from "./Page/ManageDonations";
import ManageOrders from "./Page/ManageOrders";

// Components
import Navbar from "./Component/Navbar";

function AppRoutes({ role, handleLogin, handleLogout, cart, setCart }) {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  const redirectIfLoggedIn = (targetForUser = "/home", targetForAdmin = "/dashboard") => {
    if (role === "user") return <Navigate to={targetForUser} />;
    if (role === "admin") return <Navigate to={targetForAdmin} />;
    return null;
  };

  return (
    <>
      {role === "user" && !hideNavbar && <Navbar onLogout={handleLogout} role={role} />}
      
      <div className={role === "user" ? "with-navbar page-content" : ""}>
        <Routes>
          {/* Authentication */}
          <Route path="/" element={redirectIfLoggedIn() || <Login onLogin={handleLogin} />} />
          <Route path="/login" element={redirectIfLoggedIn() || <Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={role === "admin" ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={role === "admin" ? <AddProduct /> : <Navigate to="/login" />} />
          <Route path="/donations" element={role === "admin" ? <ManageDonations handleLogout={handleLogout} /> : <Navigate to="/login" />} />
         
          {/* Admin Manage Orders */}
          <Route path="/manage-orders" element={role === "admin" ? <ManageOrders /> : <Navigate to="/login" />} />

          {/* User Routes */}
          <Route path="/home" element={role === "user" ? <Home /> : <Navigate to="/login" />} />
          <Route path="/user" element={<Main />} />

          {/* Product Pages */}
          <Route path="/products/:productId" element={<ProductPage cart={cart} setCart={setCart} />} />
          <Route path="/product/:productId" element={<ProductDetail cart={cart} setCart={setCart} />} />

          {/* Fundraiser Pages */}
          <Route path="/fundraiser" element={<FundraiserPage />} />
          <Route path="/fundraiser-list" element={<FundraiserList />} />
          <Route path="/fundraiser/:fundraiserId" element={<FundraiserDetail />} />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
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
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Login 
  const handleLogin = (userData) => {
    const newRole = userData.isAdmin ? "admin" : "user";
    setRole(newRole);
    localStorage.setItem("role", newRole);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("isAdmin", userData.isAdmin);
  };

  // Logout 
  const handleLogout = () => {
    setRole(null);
    setCart([]);
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    sessionStorage.clear();
  };

  return (
    <Router>
      <AppRoutes role={role} handleLogin={handleLogin} handleLogout={handleLogout} cart={cart} setCart={setCart} />
    </Router>
  );
}

export default App;
