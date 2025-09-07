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

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      setError("Please fill out all fields.");
      return;
    }

    if (!cart || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    const items = cart.map((item) => ({
      product_id: item.id || item.product_id,
      quantity: Number(item.quantity) || 1,
    }));

    const payload = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      items,
    };

    try {
      console.log("Checkout payload:", payload);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/checkout",
        payload,
        { withCredentials: true }
      );

      console.log("Checkout response:", response.data);

      if (response.data.success) {
        alert("Order placed successfully!");
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/checkout-success");
      } else {
        setError(response.data.message || "An error occurred during checkout. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error full:", err);
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "An error occurred during checkout. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Your cart is empty.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Checkout</h2>

      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

      <form onSubmit={handleConfirmOrder} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          required
        />
        <textarea
          placeholder="Shipping Address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minHeight: "80px" }}
          required
        />

        <div style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "10px" }}>
          Total: ₱{total.toFixed(2)}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px",
            backgroundColor: "#b71c1c",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}
