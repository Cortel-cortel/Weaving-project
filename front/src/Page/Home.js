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
  const [hoverView, setHoverView] = useState(null);

  const handleView = (product) => {
    if (role === "admin") navigate("/dashboard");
    else {
      const category = product.id.toLowerCase().replace(/\d+$/, "");
      navigate(`/products/${category}`);
    }
  };

  return (
    <div className="home-page" style={{ backgroundColor: "#fafafa" }}>
      {/* HERO SECTION */}
      <div
        className="hero-section"
        style={{
          position: "relative",
          width: "100%",
          height: "65vh",
          minHeight: "380px",
          marginTop: "65px",
          overflow: "hidden",
          borderBottom: "4px solid #b71c1c",
        }}
      >
        <img
          src="/images/hero-banner.jpg"
          alt="Hero Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(65%)",
            transition: "transform 8s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            textAlign: "center",
            maxWidth: "700px",
            padding: "0 20px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: "800",
              letterSpacing: "1px",
              marginBottom: "10px",
              textShadow: "2px 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            Weaving Culture into Modern Fashion
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              lineHeight: "1.5",
              textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Discover the artistry of Filipino handwoven textiles and their timeless beauty.
          </p>
        </div>
      </div>

      {/* TEXTILE SECTION */}
      <section
        style={{
          padding: "80px 5%",
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#222",
            marginBottom: "50px",
          }}
        >
          Explore Our Signature Textiles
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "nowrap",
            overflowX: "auto",
            scrollBehavior: "smooth",
            paddingBottom: "20px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                flex: "0 0 320px",
                borderRadius: "18px",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
                cursor: "pointer",
              }}
              onClick={() => handleView(product)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 28px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 18px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={product.img}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    color: "#333",
                    marginBottom: "15px",
                    fontWeight: "700",
                  }}
                >
                  {product.name}
                </h3>
                <button
                  onClick={() => handleView(product)}
                  onMouseEnter={() => setHoverView(product.id)}
                  onMouseLeave={() => setHoverView(null)}
                  style={{
                    backgroundColor:
                      hoverView === product.id ? "#d32f2f" : "#b71c1c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 22px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxShadow:
                      hoverView === product.id
                        ? "0 6px 14px rgba(0,0,0,0.25)"
                        : "0 3px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  View Textile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
