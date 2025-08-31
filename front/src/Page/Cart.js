import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart items from API
  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/cart");
      setCartItems(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      alert("Failed to load cart items. Showing empty cart.");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCartItems();

    // Listen to localStorage changes for real-time updates
    const handleStorageChange = (e) => {
      if (e.key === "cartUpdated") fetchCartItems();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update item quantity
  const handleQuantityChange = async (id, quantity) => {
    if (!quantity || quantity <= 0) return;

    try {
      await axios.put(`http://127.0.0.1:8000/api/cart/${id}`, { quantity });
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity.");
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item.");
    }
  };

  // Calculate total price
  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  // Checkout button
  const handleCheckout = () => navigate("/checkout");

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="danger" />
        <span className="ms-2">Loading your cart...</span>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "90px", paddingBottom: "40px" }}>
      <div className="mb-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Return
        </Button>
      </div>

      <h1 className="mb-4 text-danger fw-bold">🛒 Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Alert variant="info" className="text-center">
          Your cart is empty. <br /> Go back and add some items!
        </Alert>
      ) : (
        <>
          <Table responsive bordered hover className="shadow-sm rounded">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th style={{ width: "120px" }}>Quantity</th>
                <th>Total</th>
                <th style={{ width: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₱{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="form-control text-center"
                    />
                  </td>
                  <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                  <td className="text-center">
                    <Button variant="danger" size="sm" onClick={() => handleRemoveItem(item.id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h3 className="fw-bold">Total: ₱{calculateTotal()}</h3>
            <Button variant="success" size="lg" className="px-4" onClick={handleCheckout}>
              Proceed to Checkout →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
