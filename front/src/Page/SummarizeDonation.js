import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import api from "./api";

export default function SummarizeDonation() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchDonations = async () => {
    try {
      const response = await api.get("/donations");
      setDonations(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const totalDonations = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const averageAmount = totalDonations ? totalAmount / totalDonations : 0;

  // Group donations by fundraiser
  const donationsByFundraiser = donations.reduce((acc, d) => {
    const fundraiser = d.fundraiser || "General";
    if (!acc[fundraiser]) acc[fundraiser] = { count: 0, amount: 0 };
    acc[fundraiser].count += 1;
    acc[fundraiser].amount += Number(d.amount);
    return acc;
  }, {});

  if (loading) return <div className="loadingScreen">Loading...</div>;
  if (error) return <div className="errorScreen">{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          backgroundColor: "#343a40",
          color: "#fff",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Donation Summary</h2>
        <Button variant="light" onClick={() => navigate("/donations")}>
          Back to Manage Donations
        </Button>
      </nav>

      {/* Overall summary */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Total Donations: {totalDonations}</h4>
        <h4>
          Total Amount: ₱{totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </h4>
        <h4>
          Average Donation: ₱{averageAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </h4>
      </div>

      {/* Cards for each fundraiser */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {Object.entries(donationsByFundraiser).map(([fundraiser, stats]) => (
          <Col key={fundraiser}>
            <Card>
              <Card.Body>
                <Card.Title>{fundraiser}</Card.Title>
                <Card.Text>
                  Total Donations: {stats.count} <br />
                  Total Amount: ₱{stats.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  <br />
                  Average Donation: ₱{(stats.amount / stats.count).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
