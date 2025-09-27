import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

//Category
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

  const handlePrev = () =>
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
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
      <div
        className="hero-section"
        style={{ height: "50vh", position: "relative", marginTop: "55px" }}
      >
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
            fontSize: "8rem",
            fontWeight: "1000",
            textShadow: "4px 4px 14px rgba(0,0,0,0.9)",
            textAlign: "center",
            letterSpacing: "4px",
          }}
        >
          <h1 style={{ margin: 0 }}>Welcome to Threaditional</h1>
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
          padding: "60px 0",
        }}
      >
        <button
          className="arrow-btn left"
          onClick={handlePrev}
          onMouseEnter={() => setHoverArrow("left")}
          onMouseLeave={() => setHoverArrow("")}
          style={{
            position: "absolute",
            left: "7%",
            fontSize: "2.8rem",
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
            gap: "45px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            width: "85%",
          }}
        >
          {visibleProducts.map((product) => (
            <div
                key={product.id}
                className="card"
                style={{
                  flex: "0 0 auto",
                  width: "320px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  transition: "all 0.35s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
              >

              <img
                src={product.img}
                alt={product.name}
                style={{ width: "100%", height: "300px", objectFit: "cover" }}
              />
              <h3 style={{ margin: "18px 0", fontSize: "1.6rem" }}>
                {product.name}
              </h3>
              <button
                className="view-btn"
                onClick={() => handleView(product)}
                onMouseEnter={() => setHoverView(product.id)}
                onMouseLeave={() => setHoverView(null)}
                style={{
                  backgroundColor:
                    hoverView === product.id ? "#ff9999" : "#b71c1c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "14px 22px",
                  marginBottom: "18px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease",
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
            right: "7%",
            fontSize: "2.8rem",
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
