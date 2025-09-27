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

  const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  const videoIDs = [
    "VIDEO_ID_1",
    "VIDEO_ID_2",
    "VIDEO_ID_3",
    "VIDEO_ID_4",
    "VIDEO_ID_5",
    "VIDEO_ID_6",
  ];

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

  const buildStorageUrl = (pathOrFilename) => {
    if (!pathOrFilename) return null;
    if (/^https?:\/\//i.test(pathOrFilename)) return pathOrFilename;
    const trimmed = pathOrFilename.replace(/^\/+/, "");
    if (trimmed.startsWith("storage/")) return `${API_BASE}/${trimmed}`;
    return `${API_BASE}/storage/${trimmed}`;
  };

  const getImageFromProduct = (p) => {
    if (Array.isArray(p.images) && p.images.length > 0) {
      const first = p.images.find((i) => i && i !== "null" && i !== "");
      if (first) return buildStorageUrl(first);
    }

    if (p.image_url && typeof p.image_url === "string" && p.image_url.trim() !== "") {
      return buildStorageUrl(p.image_url);
    }

    if (p.image && typeof p.image === "string" && p.image.trim() !== "") {
      return buildStorageUrl(p.image);
    }

    if (productImages[p.name]) return productImages[p.name];

    return "/images/placeholder.png";
  };

  // Fetch products with robust image_url mapping
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => {
        const items = res.data.data || res.data || [];
        console.log("API products raw:", items);

        const mappedProducts = items.map((p) => {
          const image_url = getImageFromProduct(p);
          return { ...p, image_url };
        });

        console.log("mappedProducts:", mappedProducts); 
        setProducts(mappedProducts);
        setCategories([...new Set(mappedProducts.map((p) => p.category))]);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []); 

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
        "Supporting Kalinga weaving sustains local artisans and preserves a rich cultural heritage passed down through generations.",
        "The patterns of Kalinga textiles often tell stories of bravery, unity, and the deep connection of the people with their ancestral lands. Each woven piece is not just fabric but a cultural narrative, reflecting the values and traditions of the community.",
        "As interest in handmade and sustainable products grows, Kalinga weaving has the potential to reach wider markets. Promoting this craft not only empowers local weavers but also allows more people to appreciate the artistry and identity embedded in every textile.",
      ],
      images: [
        "/images/kalinga.jpg",
        "/images/kalinga2.jpg",
        "/images/kalinga3.jpg",
        "/images/kalinga4.jpg",
        "/images/kalinga5.jpg",
      ],
    },
    ikat: {
      title: "Ikat Weaving",
      description: [
        "Ikat weaving, practiced in select areas of the Cordillera, is a sophisticated technique where threads are dyed before weaving to create intricate patterns.",
        "What makes Ikat truly remarkable is the level of precision required. Artisans must carefully plan and dye threads so that the design emerges seamlessly when woven, showcasing both their skill and patience. This meticulous process gives Ikat its distinctive blurred yet striking look.",
        "Today, Ikat is admired not only as a textile but as a symbol of heritage and resilience. Supporting Ikat weaving helps protect this rare craft from disappearing, while giving artisans opportunities to innovate and adapt their designs for modern fashion and lifestyle.",
      ],
      images: [
        "/images/ikat.jpg",
        "/images/ikat2.jpg",
        "/images/ikat3.jpg",
        "/images/ikat4.jpg",
        "/images/ikat5.jpg",
      ],
    },
    inabel: {
      title: "Inabel Weaving",
      description: [
        "The art of Inabel weaving involves meticulous handcrafting using traditional backstrap looms. Skilled weavers create intricate designs that often feature geometric patterns, stripes, and symbolic motifs. The process is labor-intensive, requiring patience and precision to produce the high-quality fabric that Inabel is known for.",
        "Beyond its practical use, Inabel is deeply woven into the cultural identity of the Ilocano people. The designs often carry symbolic meanings, with patterns representing fertility, protection, and harmony with nature. Each piece reflects not just skill, but also the values and beliefs passed down through generations.",
        "Today, Inabel weaving is experiencing a revival as more people appreciate sustainable, handmade products. By promoting and preserving this craft, we help strengthen community pride, encourage eco-friendly fashion, and ensure that the artistry of Inabel continues to inspire both locally and globally.",
      ],
      images: [
        "/images/inabel.jpg",
        "/images/inabel2.jpg",
        "/images/inabel3.jpg",
        "/images/inabel4.jpg",
        "/images/inabel5.jpg",
      ],
    },
  };

  const normalizedId = productId?.toLowerCase().replace(/\d+$/, "");
  const intro =
    intros[normalizedId] || {
      title: "Weaving Products",
      description: [
        "Explore our beautiful woven products from the Cordillera region.",
        "Each product is crafted with care and carries the story of local artisan traditions.",
      ],
      images: ["/images/placeholder.png"],
    };

  // Filter products based on category, search, and price
  const filteredProducts = products
    .filter((p) => (normalizedId ? p.category?.toLowerCase().includes(normalizedId) : true))
    .filter((p) =>
      selectedCategories.length > 0
        ? selectedCategories.some((cat) => p.category?.toLowerCase().includes(cat.toLowerCase()))
        : true
    )
    .filter((p) => (searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true))
    .filter((p) => (minPrice ? Number(p.price) >= parseFloat(minPrice) : true))
    .filter((p) => (maxPrice ? Number(p.price) <= parseFloat(maxPrice) : true));

  const styles = {
    mainWrapper: { display: "flex", flexDirection: "row", gap: "20px", padding: "20px" },
    filter: { width: "250px", minHeight: "calc(100vh - 80px)", padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "10px", boxShadow: "2px 2px 10px rgba(0,0,0,0.1)", flexShrink: 0 },
    productsContainer: { flexGrow: 1, display: "flex", flexWrap: "wrap", gap: "20px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
    productCard: { width: "300px", textAlign: "center", padding: "1rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer" },
    productImage: { width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "0.5rem" },
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <div className="intro-section d-flex align-items-start p-4">
        <div className="intro-images me-4" style={{ flex: 1 }} ref={carouselRef}>
          <Carousel
            controls
            indicators
            nextIcon={<span className="carousel-control-next-icon" style={{ backgroundColor: "#b71c1c", borderRadius: "50%" }} />}
            prevIcon={<span className="carousel-control-prev-icon" style={{ backgroundColor: "#b71c1c", borderRadius: "50%" }} />}
          >
            {(intro.images && intro.images.length > 0 ? intro.images : ["/images/placeholder.png"]).map((src, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block"
                  src={src}
                  alt={`Slide ${idx + 1}`}
                  style={{ width: "500px", height: "500px", objectFit: "cover", borderRadius: "8px", margin: "0 auto" }}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/placeholder.png"; }}
                />
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
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#8b1414")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#b71c1c")}
              onClick={() => productsSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              See Products
            </Button>
            <Button
              style={{ backgroundColor: "#ff6666", borderColor: "#ff6666", fontWeight: "bold", padding: "8px 20px" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e65555")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff6666")}
              onClick={() => navigate("/fundraiser")}
            >
              Donate
            </Button>
          </div>
        </div>
      </div>

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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div key={p.id} style={styles.productCard}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; }}
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={styles.productImage}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/placeholder.png"; }}
                />
                <h5>{p.name}</h5>
                <p>₱{Number(p.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "8px" }}>{p.description?.split("\n")[0] || "No description available."}</p>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>{p.description?.split("\n")[1] || ""}</p>
              </div>
            ))
          ) : (
            <div style={{ fontSize: "20px", color: "#777", textAlign: "center", width: "100%" }}>No products found</div>
          )}
        </div>
      </div>

      <button
        onClick={() => carouselRef.current?.scrollIntoView({ behavior: "smooth" })}
        style={{
          position: "fixed", bottom: "30px", right: "30px", backgroundColor: "#b71c1c", color: "#fff",
          border: "none", borderRadius: "50%", width: "70px", height: "70px", fontSize: "2rem", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)", transition: "opacity 0.5s ease, transform 0.3s ease",
          opacity: showScroll ? 1 : 0, pointerEvents: showScroll ? "auto" : "none"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff9999"; e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#b71c1c"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        ↑
      </button>
    </div>
  );
}
