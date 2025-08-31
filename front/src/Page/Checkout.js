import React, { useState, useEffect } from "react";
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from "./api"; // ✅ use axios instance

export default function Checkout() {
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/cart'); // ✅ fixed
        setCartItems(response.data.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    setErrorMessage('');

    if (
      !shippingDetails.name ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.country
    ) {
      setErrorMessage('Please fill out all shipping details.');
      setLoading(false);
      return;
    }

    try {
      await api.delete('/cart/clear'); // ✅ fixed
      navigate('/user');
    } catch (error) {
      console.error('Error during checkout:', error);
      setErrorMessage('An error occurred during checkout. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel the order and return to the cart?')) {
      navigate('/cart');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Checkout</h1>
      <Form>
        <h3>Shipping Details</h3>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={shippingDetails.name}
            onChange={handleChange}
            placeholder="Enter your name"
            isInvalid={!shippingDetails.name && errorMessage}
          />
        </Form.Group>
        <Form.Group controlId="formAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={shippingDetails.address}
            onChange={handleChange}
            placeholder="Enter your address"
            isInvalid={!shippingDetails.address && errorMessage}
          />
        </Form.Group>
        <Form.Group controlId="formCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={shippingDetails.city}
            onChange={handleChange}
            placeholder="Enter your city"
            isInvalid={!shippingDetails.city && errorMessage}
          />
        </Form.Group>
        <Form.Group controlId="formCountry">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={shippingDetails.country}
            onChange={handleChange}
            placeholder="Enter your country"
            isInvalid={!shippingDetails.country && errorMessage}
          />
        </Form.Group>

        <h3>Payment Method</h3>
        <Form.Check
          type="radio"
          label="Cash on Delivery"
          name="paymentMethod"
          value="cash"
          checked={paymentMethod === 'cash'}
          onChange={handlePaymentChange}
        />

        {errorMessage && (
          <Alert variant="danger" className="mt-3">
            {errorMessage}
          </Alert>
        )}

        <div className="d-flex justify-content-between mt-3">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleConfirmOrder}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Confirm Order'}
          </Button>
        </div>
      </Form>

      <div
        style={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          marginTop: "20px"
        }}
      >
        <h3>Transaction Receipt</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
