import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const products = [
  { id: "ikat1", name: "Ikat", img: "/images/ikat.jpg" },
  { id: "inabel1", name: "Inabel", img: "/images/inabel.jpg" },
  { id: "kalinga", name: "Kalinga", img: "/images/kalinga.jpg" },
];

const Home = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role") || "user");
  const [startIndex, setStartIndex] = useState(0);
  const [hoverArrow, setHoverArrow] = useState("");
  const [hoverView, setHoverView] = useState(null);

  const handlePrev = () => setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  const handleNext = () => setStartIndex((prev) => (prev + 1) % products.length);

  const handleView = (product) => {
    if (role === "admin") {
      navigate("/dashboard");
    } else {
      const category = product.id.toLowerCase().replace(/\d+$/, "");
      navigate(`/products/${category}`);
    }
  };

  const visibleProducts = [
    products[startIndex],
    products[(startIndex + 1) % products.length],
    products[(startIndex + 2) % products.length],
  ];

  return (
    <div className="home-page">
      <div className="hero-section" style={{ height: "50vh", position: "relative" }}>
        <img
          src="/images/hero-banner.jpg"
          alt="Hero Banner"
          className="hero-image"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          className="hero-text"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "3rem",
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            textAlign: "center",
          }}
        >
          <h1>Welcome to Threaditional</h1>
        </div>
      </div>

      <div
        className="carousel-container"
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "40px 0",
        }}
      >
        <button
          className="arrow-btn left"
          onClick={handlePrev}
          onMouseEnter={() => setHoverArrow("left")}
          onMouseLeave={() => setHoverArrow("")}
          style={{
            position: "absolute",
            left: "10px",
            fontSize: "2rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: hoverArrow === "left" ? "#ff9999" : "#b71c1c",
          }}
        >
          ❮
        </button>

        <div
          className="carousel"
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            width: "80%",
          }}
        >
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="card"
              style={{
                flex: "0 0 auto",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
                backgroundColor: "#fff",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={product.img}
                alt={product.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
              <button
                className="view-btn"
                onClick={() => handleView(product)}
                onMouseEnter={() => setHoverView(product.id)}
                onMouseLeave={() => setHoverView(null)}
                style={{
                  backgroundColor: hoverView === product.id ? "#ff9999" : "#b71c1c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                }}
              >
                View
              </button>
            </div>
          ))}
        </div>

        <button
          className="arrow-btn right"
          onClick={handleNext}
          onMouseEnter={() => setHoverArrow("right")}
          onMouseLeave={() => setHoverArrow("")}
          style={{
            position: "absolute",
            right: "10px",
            fontSize: "2rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: hoverArrow === "right" ? "#ff9999" : "#b71c1c",
          }}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Home;
