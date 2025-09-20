// src/Page/Checkout.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    const payload = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      items: cart.map((item) => ({
        product_id: item.id || item.product_id,
        quantity: Number(item.quantity) || 1,
      })),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/checkout",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/checkout-success");
      } else {
        setError(response.data.message || "Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Your cart is empty.
      </div>
    );
  }

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "12px",
    backgroundColor: "#b71c1c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Checkout</h2>

      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

      {/* Cart Summary */}
      <div style={{ marginBottom: "20px", border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
        <h3 style={{ marginBottom: "10px" }}>Order Summary</h3>
        {cart.map((item, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span>{item.name} x {item.quantity}</span>
            <span>₱{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem" }}>
          <span>Total:</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleConfirmOrder} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="text" placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={inputStyle} required />
        <input type="email" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} style={inputStyle} required />
        <input type="text" placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={inputStyle} required />
        <textarea placeholder="Shipping Address" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={{ ...inputStyle, minHeight: "80px" }} required />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}
