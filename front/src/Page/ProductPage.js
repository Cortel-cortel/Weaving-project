// src/Page/ProductPage.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel, Button } from "react-bootstrap";

import Header from "../Component/Header";
import Filter from "../Component/Filter";

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const productsSectionRef = useRef(null);
  const carouselRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showScroll, setShowScroll] = useState(false);

  const videoIDs = ["VIDEO_ID_1", "VIDEO_ID_2", "VIDEO_ID_3", "VIDEO_ID_4", "VIDEO_ID_5", "VIDEO_ID_6"];

  const productImages = {
    "Cordillera Inabel Shawl": "/images/products/inabel-shawl.jpg",
    "Cordillera Inabel Blanket": "/images/products/inabel-blanket.jpg",
    "Cordillera Inabel Cushion Cover": "/images/products/inabel-cushion_cover.jpg",
    "Ikat Table Runner": "/images/products/ikat-table_runner.jpg",
    "Ikat Wall Hanging": "/images/products/ikat-wall_hanging.jpg",
    "Ikat Tote Bag": "/images/products/ikat-tote_bag.jpg",
    "Kalinga Weaving Bag": "/images/products/kalinga-bag.jpg",
    "Kalinga Weaving Table Mat": "/images/products/kalinga-table_mat.jpg",
    "Kalinga Weaving Wall Decor": "/images/products/kalinga-wall_decor.jpg",
  };

  // Fetch products from API
  useEffect(() => {
    axios.get("http://localhost:8000/api/products")
      .then(res => {
        const items = res.data.data || res.data;

        // Map products to include image_url (uploaded or fallback)
        const mappedProducts = items.map(p => ({
          ...p,
          image_url: p.image 
            ? p.image_url || `http://127.0.0.1:8000/storage/${p.image}` 
            : productImages[p.name] || "/images/placeholder.png"
        }));

        setProducts(mappedProducts);
        setCategories([...new Set(mappedProducts.map(p => p.category))]);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const intros = {
    kalinga: {
      title: "Kalinga Weaving",
      description: [
        "Kalinga weaving is a centuries-old tradition from the Cordillera region, known for its bold geometric patterns and vibrant colors.",
        "Supporting Kalinga weaving sustains local artisans and preserves a rich cultural heritage passed down through generations."
      ],
      images: ["/images/kalinga.jpg","/images/kalinga2.jpg","/images/kalinga3.jpg","/images/kalinga4.jpg","/images/kalinga5.jpg"]
    },
    ikat: {
      title: "Ikat Weaving",
      description: [
        "Ikat weaving, practiced in select areas of the Cordillera, is a sophisticated technique where threads are dyed before weaving to create intricate patterns.",
        "Preserving Ikat weaving is essential for maintaining the rich cultural heritage of the region and supporting local artisan livelihoods."
      ],
      images: ["/images/ikat.jpg","/images/ikat2.jpg","/images/ikat3.jpg","/images/ikat4.jpg","/images/ikat5.jpg"]
    },
    inabel: {
      title: "Inabel Weaving",
      description: [
        "Inabel is a traditional handwoven textile from the Ilocos region, known for its fine cotton fabrics and timeless patterns.",
        "Supporting Inabel weaving sustains local artisan livelihoods while keeping this beautiful craft alive for future generations."
      ],
      images: ["/images/inabel.jpg","/images/inabel2.jpg","/images/inabel3.jpg","/images/inabel4.jpg","/images/inabel5.jpg"]
    },
  };

  const normalizedId = productId?.toLowerCase().replace(/\d+$/, "");
  const intro = intros[normalizedId] || {
    title: "Weaving Products",
    description: [
      "Explore our beautiful woven products from the Cordillera region.",
      "Each product is crafted with care and carries the story of local artisan traditions."
    ],
    images: ["/images/placeholder.png"],
  };

  // Filter products based on category, search, and price
  const filteredProducts = products
    .filter(p => normalizedId ? p.category?.toLowerCase().includes(normalizedId) : true)
    .filter(p => selectedCategories.length > 0
      ? selectedCategories.some(cat => p.category?.toLowerCase().includes(cat.toLowerCase()))
      : true)
    .filter(p => searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    .filter(p => minPrice ? Number(p.price) >= parseFloat(minPrice) : true)
    .filter(p => maxPrice ? Number(p.price) <= parseFloat(maxPrice) : true);

  const styles = {
    mainWrapper: { display: "flex", flexDirection: "row", gap: "20px", padding: "20px" },
    filter: { width: "250px", minHeight: "calc(100vh - 80px)", padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "10px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)", flexShrink: 0 },
    productsContainer: { flexGrow: 1, display: "flex", flexWrap: "wrap", gap: "20px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    productCard: { width: "300px", textAlign: "center", padding: "1rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer" },
    productImage: { width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" },
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      {/* Intro Section */}
      <div className="intro-section d-flex align-items-start p-4">
        <div className="intro-images me-4" style={{ flex: 1 }} ref={carouselRef}>
          <Carousel controls indicators
            nextIcon={<span className="carousel-control-next-icon" style={{ backgroundColor: "#b71c1c", borderRadius: "50%" }}/> }
            prevIcon={<span className="carousel-control-prev-icon" style={{ backgroundColor: "#b71c1c", borderRadius: "50%" }}/> }
          >
            {intro.images.map((src, idx) => (
              <Carousel.Item key={idx}>
                <img className="d-block" src={src} alt={`Slide ${idx + 1}`} style={{ width: "500px", height: "500px", objectFit: "cover", borderRadius: "8px", margin: "0 auto" }} />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <div className="intro-text" style={{ flex: 1, paddingLeft: "20px", textAlign: "center" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "16px" }}>{intro.title}</h2>
          {intro.description.map((para, idx) => (
            <p key={idx} style={{ fontSize: "1rem", color: "#555", lineHeight: "1.8", marginBottom: "1.2rem" }}>{para}</p>
          ))}

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px" }}>
            <Button
              style={{ backgroundColor: "#b71c1c", borderColor: "#b71c1c", fontWeight: "bold", padding: "8px 20px" }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#8b1414"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#b71c1c"}
              onClick={() => productsSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              See Products
            </Button>
            <Button
              style={{ backgroundColor: "#ff6666", borderColor: "#ff6666", fontWeight: "bold", padding: "8px 20px" }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#e65555"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#ff6666"}
              onClick={() => navigate("/fundraiser")}
            >
              Donate
            </Button>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3 style={{ fontWeight: "bold", fontSize: "1.8rem", marginBottom: "20px" }}>Videos</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", justifyContent: "center" }}>
          {videoIDs.map((id, idx) => (
            <div key={idx} style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "8px", overflow: "hidden" }}>
              <iframe src={`https://www.youtube.com/embed/${id}`} title={`Video ${idx + 1}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen />
            </div>
          ))}
        </div>
      </div>

      <Header />

      {/* Filter & Products Section */}
      <div style={styles.mainWrapper}>
        <div style={styles.filter}>
          <Filter
            categories={categories}
            onSearch={(search, selectedCats, min, max) => {
              setSearchTerm(search);
              setSelectedCategories(selectedCats);
              setMinPrice(min);
              setMaxPrice(max);
            }}
          />
        </div>

        <div style={styles.productsContainer} ref={productsSectionRef}>
          {filteredProducts.length > 0 ? filteredProducts.map(p => (
            <div key={p.id} style={styles.productCard}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; }}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <img src={p.image_url} alt={p.name} style={styles.productImage} />
              <h5>{p.name}</h5>
              <p>₱{Number(p.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "8px" }}>
                {p.description?.split("\n")[0] || "No description available."}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {p.description?.split("\n")[1] || ""}
              </p>
            </div>
          )) : (
            <div style={{ fontSize: "20px", color: "#777", textAlign: "center", width: "100%" }}>No products found</div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button onClick={() => carouselRef.current?.scrollIntoView({ behavior: "smooth" })}
        style={{
          position: "fixed", bottom: "30px", right: "30px", backgroundColor: "#b71c1c", color: "#fff",
          border: "none", borderRadius: "50%", width: "50px", height: "50px", fontSize: "1.5rem", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)", transition: "opacity 0.5s ease, transform 0.3s ease",
          opacity: showScroll ? 1 : 0, pointerEvents: showScroll ? "auto" : "none"
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#ff9999"; e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#b71c1c"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        ↑
      </button>
    </div>
  );
}
