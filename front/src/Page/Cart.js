import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setCart]);

  if (!cart || cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontSize: "1.2rem" }}>
        Your cart is empty.
      </div>
    );
  }

  // Update quantity of a cart item
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove an item from cart
  const handleRemove = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPHP = (amount) =>
    `₱${Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{ maxWidth: "900px", margin: "100px auto 50px", padding: "20px" }}>
      <h2 style={{ marginBottom: "30px" }}>Your Cart</h2>

      {cart.map(item => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px",
            borderBottom: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {/* ✅ Product Image with Hover Zoom */}
          <div
            style={{ flex: 0.8, marginRight: "15px", overflow: "hidden", borderRadius: "12px" }}
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img
              src={item.image_url || item.image || "/images/no-image.jpg"}
              alt={item.name}
              onError={(e) => { e.target.src = "/images/no-image.jpg"; }}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "1px solid #ccc",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            />
          </div>

          {/* ✅ Product Info - Clickable */}
          <div
            style={{ flex: 2 }}
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <strong>{item.name}</strong>
            <p style={{ margin: "5px 0", color: "#555" }}>{item.category}</p>
          </div>

          {/* Quantity */}
          <div style={{ flex: 1 }}>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
              style={{ width: "60px", padding: "5px" }}
            />
          </div>

          {/* Price */}
          <div style={{ flex: 1 }}>
            {formatPHP(item.price * item.quantity)}
          </div>

          {/* Remove Button */}
          <div style={{ flex: 0.5 }}>
            <button
              onClick={() => handleRemove(item.id)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#ff6666",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Total */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "30px",
        fontSize: "1.2rem",
        fontWeight: "bold"
      }}>
        <span>Total:</span>
        <span>{formatPHP(totalPrice)}</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={() => navigate("/checkout")}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "12px",
          backgroundColor: "#b71c1c",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
