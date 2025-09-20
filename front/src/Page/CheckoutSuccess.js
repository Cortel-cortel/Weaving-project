// src/Page/CheckoutSuccess.js
import React from 'react';
import { Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home'); // Always go to home
  };

  return (
    <Container style={{ paddingTop: '120px' }}> {/* Add top padding for sticky navbar */}
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* Back to Home button on top */}
          <div className="mb-4 text-center">
            <Button 
              variant="danger" 
              size="lg" 
              onClick={handleBackToHome}
            >
              Back to Home
            </Button>
          </div>

          <Alert variant="success" className="text-center p-4 shadow-sm rounded">
            <h2 className="mb-3">Checkout Successful</h2>
            <p>
              Your order has been placed successfully!<br />
              Thank you for shopping with us. Your order will be processed shortly.
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}
