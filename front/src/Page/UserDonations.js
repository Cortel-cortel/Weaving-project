import React, { useEffect, useState } from "react";

export default function DonationsPage() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // 🧩 Fetch donation history (replace with API or localStorage)
    const storedDonations = JSON.parse(localStorage.getItem("userDonations")) || [];
    setDonations(storedDonations);
  }, []);

  if (donations.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px", fontSize: "1.2rem" }}>
        💖 You haven’t made any donations yet.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "120px auto 60px",
        padding: "25px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "25px" }}>My Donations</h2>

      {donations.map((donation, index) => (
        <div
          key={index}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "15px 0",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Fundraiser: {donation.campaign}</strong>
            <span style={{ color: "#777" }}>
              {new Date(donation.date).toLocaleDateString()}
            </span>
          </div>

          <p style={{ margin: "10px 0", color: "#555" }}>
            Amount Donated: <strong>₱{donation.amount.toLocaleString()}</strong>
          </p>

          {/* Progress Bar */}
          <div style={{ background: "#eee", height: "10px", borderRadius: "5px" }}>
            <div
              style={{
                width: `${donation.progress || 0}%`,
                height: "10px",
                borderRadius: "5px",
                background: "#b71c1c",
                transition: "width 0.4s ease",
              }}
            ></div>
          </div>
          <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#666" }}>
            {donation.progress}% of goal reached
          </p>
        </div>
      ))}
    </div>
  );
}
