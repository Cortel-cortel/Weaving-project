// src/Page/FundraiserList.js
import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const fundraiserData = [
  { id: 1, name: "Kalinga Weaving Project", image: "/images/fundraiser1.jpg" },
  { id: 2, name: "Cordillera Youth Group", image: "/images/fundraiser2.jpg" },
  { id: 3, name: "Ikat Preservation", image: "/images/fundraiser3.jpg" },
  { id: 4, name: "Local Handicraft Support", image: "/images/fundraiser4.jpg" },
  { id: 5, name: "Community Learning Center", image: "/images/fundraiser5.jpg" },
  { id: 6, name: "Sustainable Farming Project", image: "/images/fundraiser6.jpg" },
  { id: 7, name: "Cordillera Cultural Festival", image: "/images/fundraiser7.jpg" },
  { id: 8, name: "Mountain Conservation Project", image: "/images/fundraiser8.jpg" },
  { id: 9, name: "Indigenous Music Initiative", image: "/images/fundraiser9.jpg" },
  { id: 10, name: "Traditional Food Revival", image: "/images/fundraiser10.jpg" },
];

export default function FundraiserList() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "80px 40px", maxWidth: "1600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px", fontWeight: "bold" }}>All Fundraisers</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: "25px",
        }}
      >
        {fundraiserData.map((fundraiser) => (
          <Card
            key={fundraiser.id}
            style={{
              cursor: "pointer",
              width: "100%",
              height: "320px", // Fixed height like FundraiserPage
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              overflow: "hidden",
            }}
            onClick={() => navigate(`/fundraiser/${fundraiser.id}`)}
          >
            <Card.Img
              variant="top"
              src={fundraiser.image}
              style={{
                height: "200px",
                objectFit: "cover",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            />
            <Card.Body style={{ textAlign: "center", padding: "10px" }}>
              <Card.Title style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{fundraiser.name}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
