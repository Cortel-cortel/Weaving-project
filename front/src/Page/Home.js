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
  const [role] = useState(() => localStorage.getItem("role") || "user");
  const [startIndex, setStartIndex] = useState(0);
  const [hoverArrow, setHoverArrow] = useState("");
  const [hoverView, setHoverView] = useState(null);

  // Carousel controls
  const handlePrev = () =>
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);

  const handleNext = () =>
    setStartIndex((prev) => (prev + 1) % products.length);

  // Navigate to product page or admin dashboard
  const handleView = (productId) => {
    if (role === "admin") navigate("/dashboard");
    else navigate(`/product/${productId}`);
  };

  const visibleProducts = [
    products[startIndex],
    products[(startIndex + 1) % products.length],
    products[(startIndex + 2) % products.length],
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
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
            color: "white",
            fontSize: "3rem",
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          <h1>Welcome to Threaditional Weaving</h1>
        </div>
      </div>

      {/* Carousel Section */}
      <div
        className="carousel-container"
        style={{ overflow: "hidden", maxWidth: "100%", boxSizing: "border-box" }}
      >
        {/* Left Arrow */}
        <button
          className="arrow-btn left"
          onClick={handlePrev}
          onMouseEnter={() => setHoverArrow("left")}
          onMouseLeave={() => setHoverArrow("")}
          style={{ color: hoverArrow === "left" ? "#ff9999" : "#b71c1c" }}
        >
          ❮
        </button>

        {/* Product Cards */}
        <div
          className="carousel"
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            width: "100%",
          }}
        >
          {visibleProducts.map((product) => (
            <div key={product.id} className="card" style={{ flex: "0 0 auto" }}>
              <img
                src={product.img}
                alt={product.name}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
              <h3>{product.name}</h3>
              <button
                className="view-btn"
                onClick={() => handleView(product.id)}
                onMouseEnter={() => setHoverView(product.id)}
                onMouseLeave={() => setHoverView(null)}
                style={{
                  backgroundColor: hoverView === product.id ? "#ff9999" : "#b71c1c",
                }}
              >
                View
              </button>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="arrow-btn right"
          onClick={handleNext}
          onMouseEnter={() => setHoverArrow("right")}
          onMouseLeave={() => setHoverArrow("")}
          style={{ color: hoverArrow === "right" ? "#ff9999" : "#b71c1c" }}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Home;
