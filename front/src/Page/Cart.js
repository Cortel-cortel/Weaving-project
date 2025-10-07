import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setCart]);

  if (!cart || cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontSize: "1.2rem" }}>
        🛒 Your cart is empty.
      </div>
    );
  }

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemove = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  const handleEditSelected = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to edit.");
      return;
    }
    setIsEditMode(!isEditMode);
  };

  const totalPrice = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPHP = (amount) =>
    `₱${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleCheckout = () => {
    const selectedProducts = cart.filter((item) => selectedItems.includes(item.id));
    if (selectedProducts.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }
    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
    navigate("/checkout");
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "115px auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        {/* ✅ Select All */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            checked={selectedItems.length === cart.length}
            onChange={handleSelectAll}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>All</span>
        </div>

        {/* ✅ Edit Selected Button */}
        <button
          onClick={handleEditSelected}
          style={{
            backgroundColor: isEditMode ? "#1976d2" : "#ffb300",
            border: "none",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isEditMode ? "#1565c0" : "#ffa000")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = isEditMode ? "#1976d2" : "#ffb300")
          }
        >
          {isEditMode ? "Done" : "Edit"}
        </button>
      </div>

      {/* CART ITEMS */}
      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px",
            borderBottom: "1px solid #ddd",
            backgroundColor: selectedItems.includes(item.id)
              ? "#fff9e6"
              : "transparent",
            borderRadius: "8px",
            transition: "background 0.3s ease",
          }}
        >
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleCheckboxChange(item.id)}
            style={{ width: "25px", height: "18px", cursor: "pointer" }}
          />

          {/* Image */}
          <div
            style={{ flex: 0.8, marginRight: "15px", cursor: "pointer" }}
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img
              src={item.image_url || item.image || "/images/no-image.jpg"}
              alt={item.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Product Info */}
          <div
            style={{ flex: 2, cursor: "pointer" }}
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <strong>{item.name}</strong>
            <p style={{ margin: "5px 0", color: "#777" }}>{item.category}</p>
          </div>

          {/* ✅ Always Editable Quantity */}
          <div style={{ flex: 1 }}>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
              style={{
                width: "70px",
                padding: "6px",
                textAlign: "center",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {/* Price */}
          <div style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
            {formatPHP(item.price * item.quantity)}
          </div>

          <div style={{ flex: 0.6 }}>
            {isEditMode && (
              <button
                onClick={() => handleRemove(item.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        <span>Total (Selected):</span>
        <span>{formatPHP(totalPrice)}</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        style={{
          marginTop: "25px",
          width: "100%",
          padding: "14px",
          backgroundColor: "#b71c1c",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#b71c1c")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
