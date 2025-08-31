import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Checkout() {
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };


  
  const handleConfirmOrder = async () => {
    setLoading(true);

    // Check if all shipping details are filled out
    if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.city || !shippingDetails.country) {
      alert('Please fill out all shipping details.');
      setLoading(false);
      return;
    }

    try {
      // Clear the cart after successful checkout
      await axios.delete('http://127.0.0.1:8000/api/cart/clear');

      // Redirect to order success page
      navigate('/checkout/success');
    } catch (error) {
      console.error('Error during checkout:', error);
      // Redirect to error page or show an error message
      navigate('/checkout/error');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel and navigate back to the cart page
  const handleCancel = () => {
    navigate('/cart');
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

        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="secondary"
            onClick={handleCancel} 
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleConfirmOrder}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Order'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
