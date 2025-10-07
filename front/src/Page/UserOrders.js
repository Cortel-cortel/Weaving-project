import React, { useEffect, useState } from "react";
import api from "./api"; // ✅ uses the same API instance as admin

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧩 Fetch user orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/orders/user");
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🧩 Cancel order (API call)
  const handleCancel = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}`, { status: "Cancelled" });
      fetchOrders(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "150px" }}>
        <span>⏳ Loading your orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "150px", color: "red" }}>
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "150px",
          fontSize: "1.2rem",
          color: "#555",
        }}
      >
        🛍 You have no orders yet.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "120px auto 60px",
        padding: "20px",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          fontSize: "1.8rem",
          fontWeight: "600",
          color: "#222",
          textAlign: "center",
        }}
      >
        My Orders
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {orders.map((order, index) => {
          const orderDate = new Date(order.created_at);
          const estimatedDelivery = new Date(order.created_at);
          estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

          const now = new Date();
          const diffInDays =
            (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
          const canCancel =
            diffInDays < 2 &&
            order.status !== "Cancelled" &&
            order.status !== "Completed";

          return (
            <div
              key={order.id || index}
              style={{
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                padding: "25px",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.01)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                  marginBottom: "15px",
                }}
              >
                <strong style={{ fontSize: "1.1rem", color: "#333" }}>
                  🧾 Order #{order.id}
                </strong>
                <span style={{ color: "#888", fontSize: "0.9rem" }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Items */}
              <ul
                style={{
                  listStyle: "none",
                  paddingLeft: "0",
                  marginBottom: "15px",
                }}
              >
                {order.items?.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      color: "#444",
                    }}
                  >
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Totals & Delivery */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ color: "#555", fontSize: "0.95rem" }}>
                  Estimated Delivery:{" "}
                  <strong>{estimatedDelivery.toLocaleDateString()}</strong>
                </div>

                <div
                  style={{
                    fontWeight: "600",
                    color: "#b71c1c",
                    fontSize: "1rem",
                  }}
                >
                  Total: ₱{Number(order.total).toLocaleString()}
                </div>
              </div>

              {/* Status & Cancel Button */}
              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color:
                      order.status === "Completed"
                        ? "#2e7d32"
                        : order.status === "Cancelled"
                        ? "#9e9e9e"
                        : order.status === "Pending"
                        ? "#f57c00"
                        : "#0288d1",
                  }}
                >
                  Status: {order.status || "Pending"}
                </div>

                {canCancel && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    style={{
                      background: "#ff5252",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#e53935")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#ff5252")
                    }
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
