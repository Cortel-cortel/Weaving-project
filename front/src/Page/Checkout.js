import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if Buy Now product exists
  const buyNowProduct = location.state?.buyNowProduct || null;

  const [checkoutItems, setCheckoutItems] = useState(
    buyNowProduct ? [buyNowProduct] : cart
  );

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Autofill name & email from localStorage.user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCustomerName(user.name || "");
      setCustomerEmail(user.email || "");
    }
  }, []);

  // Total calculation
  const total = checkoutItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  // Handle quantity change
  const handleQuantityChange = (productId, qty) => {
    if (qty < 1) return;
    const updatedItems = checkoutItems.map((item) =>
      item.id === productId ? { ...item, quantity: qty } : item
    );
    setCheckoutItems(updatedItems);

    // Also update cart if not Buy Now
    if (!buyNowProduct) {
      setCart(updatedItems);
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  // Remove item
  const handleRemove = (productId) => {
    const updatedItems = checkoutItems.filter((item) => item.id !== productId);
    setCheckoutItems(updatedItems);
    if (!buyNowProduct) {
      setCart(updatedItems);
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    }
  };

  // Format currency
  const formatPHP = (amount) =>
    `₱${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Estimated delivery
  const estimatedDelivery = () => {
    const now = new Date();
    const delivery = new Date(now.setDate(now.getDate() + 6));
    return delivery.toLocaleDateString("en-PH", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Payment instructions
  useEffect(() => {
    switch (paymentMethod) {
      case "cod":
        setInstructions("💵 Cash on Delivery: Pay when the order arrives.");
        break;
      case "gcash":
        setInstructions("📱 Send your payment to GCash Number: 09XXXXXXXXX");
        break;
      case "bank":
        setInstructions(
          "🏦 Bank Transfer: Account Name: YourStore, Account No: 1234-5678-9012, BDO"
        );
        break;
      case "credit":
        setInstructions(
          "💳 Enter your Credit Card details securely during checkout."
        );
        break;
      default:
        setInstructions("");
    }
  }, [paymentMethod]);

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!checkoutItems.length) {
      setError("Your cart is empty.");
      return;
    }

    const payload = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      items: checkoutItems.map((item) => ({
        product_id: item.id || item.product_id,
        quantity: Number(item.quantity),
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
        // Clear only cart if Buy Now
        if (!buyNowProduct) {
          setCart([]);
          localStorage.removeItem("cart");
        }
        navigate("/checkout-success");
      } else {
        setError(response.data.message || "Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.message || "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutItems.length) {
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
    <div
      style={{
        maxWidth: "900px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", marginTop: "20px"}}>Checkout</h2>

      {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Order Summary</h3>
        {checkoutItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <img
              src={item.image_url || item.image || "/images/no-image.jpg"}
              alt={item.name}
              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
            />
            <span style={{ flex: 1, marginLeft: "10px" }}>{item.name}</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                handleQuantityChange(item.id, Number(e.target.value))
              }
              style={{ width: "60px", marginRight: "10px" }}
            />
            <span style={{ width: "100px" }}>{formatPHP(item.price * item.quantity)}</span>
            {!buyNowProduct && (
              <button
                onClick={() => handleRemove(item.id)}
                style={{
                  marginLeft: "10px",
                  padding: "4px 8px",
                  backgroundColor: "#ff6666",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <hr />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          <span>Total:</span>
          <span>{formatPHP(total)}</span>
        </div>
        <div
          style={{
            marginTop: "5px",
            fontSize: "0.9rem",
            color: "#555",
          }}
        >
          Estimated Delivery: {estimatedDelivery()}
        </div>
      </div>

      <form
        onSubmit={handleConfirmOrder}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          style={inputStyle}
          required
        />
        <textarea
          placeholder="Shipping Address"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          style={{ ...inputStyle, minHeight: "80px" }}
          required
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontWeight: "bold" }}>Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
            required
          >
            <option value="">-- Select Payment Method --</option>
            <option value="cod">Cash on Delivery</option>
            <option value="gcash">Gcash</option>
            <option value="bank">Bank Transfer</option>
            <option value="credit">Credit Card</option>
          </select>
          {instructions && (
            <div
              style={{
                fontSize: "0.9rem",
                color: "#555",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            >
              {instructions}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </form>
    </div>
  );
}
