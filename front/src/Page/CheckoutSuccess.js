import React, { useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function CheckoutSuccess() {
  const navigate = useNavigate();


  const handleBackToHome = () => {
    navigate('/cart');
  };

  

  return (
    <div className="container mt-4">
      <h1>Checkout Successful</h1>
      <Alert variant="success">
        <h4>Your order has been placed successfully!</h4>
        <p>Thank you for shopping with us. Your order will be processed shortly.</p>
      </Alert>

      <div className="d-flex justify-content-between mt-3">
        <Button variant="primary" onClick={handleBackToHome}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
