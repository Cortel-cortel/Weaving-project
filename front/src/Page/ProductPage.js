import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Component/Header";
import Filter from "../Component/Filter";
import { Carousel, Button } from "react-bootstrap";

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

  const videoIDs = [
    "VIDEO_ID_1",
    "VIDEO_ID_2",
    "VIDEO_ID_3",
    "VIDEO_ID_4",
    "VIDEO_ID_5",
    "VIDEO_ID_6"
  ];

  // Static image mapping
  const productImages = {
    "Ikat Table Runner": "/images/products/ikat-table_runner.jpg",
    "Ikat Wall Hanging": "/images/products/ikat-wall_hanging.jpg",
    "Ikat Tote Bag": "/images/products/ikat-tote_bag.jpg",
    "Inabel Shawl": "/images/products/inabel-shawl.jpg",
    "Inabel Blanket": "/images/products/inabel-blanket.jpg",
    "Inabel Cushion Cover": "/images/products/inabel-cushion_cover.jpg",
    "Kalinga Bag": "/images/products/kalinga-bag.jpg",
    "Kalinga Table Mat": "/images/products/kalinga-table_mat.jpg",
    "Kalinga Wall Decor": "/images/products/kalinga-wall_decor.jpg"
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products")
      .then((response) => {
        const items = response.data.data || response.data;
        setProducts(items);
        setCategories([...new Set(items.map((p) => p.category))]);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const intros = {
    kalinga: { 
      title: "Kalinga Weaving", 
      description: `Kalinga weaving is a centuries-old tradition from the Cordillera region, known for its bold, geometric patterns and vibrant colors that symbolize strength, bravery, and community. Woven on traditional backstrap looms, each design carries cultural meaning, often used in garments like the tapis (wraparound skirt) that signifies identity and status within the tribe. This weaving practice reflects the resilience and creativity of the Kalinga people, deeply tied to their rituals and way of life.

Today, Kalinga textiles remain highly valued not only for their aesthetic beauty but also for their cultural heritage. Local weavers continue to pass down the knowledge through generations, ensuring that this tradition thrives despite modernization. By supporting Kalinga weaving, communities preserve their history while also promoting sustainable livelihoods through the art of handwoven fabrics.`,
      images: ["/images/kalinga.jpg","/images/kalinga2.jpg","/images/kalinga3.jpg","/images/kalinga4.jpg","/images/kalinga5.jpg"] 
    },
    ikat: { 
      title: "Ikat Weaving", 
      description: `Ikat weaving, practiced in parts of the Cordillera and across Southeast Asia, is a complex dyeing and weaving technique where threads are carefully tied and dyed before being woven into intricate patterns. This labor-intensive process results in designs with a distinctive, slightly blurred effect, symbolizing interconnectedness, spirituality, and the weavers’ deep connection to nature. In the Cordillera, ikat fabrics are used in garments and ceremonial items that reflect identity, tradition, and craftsmanship.

Today, ikat continues to inspire contemporary fashion and design while maintaining its roots as a sacred and cultural textile. By preserving this art form, indigenous communities keep alive their ancestral knowledge and create opportunities for sustainable weaving industries. Supporting ikat weaving helps ensure that both its artistic beauty and cultural significance endure for future generations.`,
      images: ["/images/ikat.jpg","/images/ikat2.jpg","/images/ikat3.jpg","/images/ikat4.jpg","/images/ikat5.jpg"] 
    },
    inabel: {
      title: "Inabel Weaving",
      description: `Inabel is a traditional handwoven textile known for its softness, strong weave, and elegant patterns. Crafted by skilled artisans using time-honored techniques, Inabel textiles include shawls, blankets, and cushion covers that blend function with refined design. Supporting these handwoven pieces helps sustain local weaving practices and craftsmanship.`,
      images: [
        "/images/inabel.jpg",
        "/images/inabel2.jpg",
        "/images/inabel3.jpg",
        "/images/inabel4.jpg",
        "/images/inabel5.jpg"
      ]
    }
  };

  const normalizedId = productId?.toLowerCase().replace(/\d+$/, "");
  const intro =
    intros[normalizedId] || {
      title: "Weaving Products",
      description:
        "Explore our beautiful woven products from the Cordillera region.",
      images: ["/images/placeholder.png"]
    };

  const categoryMap = { kalinga: ["kalinga"], inabel: ["inabel"], ikat: ["ikat"] };

  const filteredProducts = products
    .filter((product) =>
      normalizedId
        ? categoryMap[normalizedId]?.some((alias) =>
            product.category?.toLowerCase().includes(alias)
          )
        : true
    )
    .filter((product) =>
      selectedCategories.length > 0
        ? selectedCategories.includes(product.category)
        : true
    )
    .filter((product) =>
      searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((product) =>
      minPrice ? Number(product.price) >= parseFloat(minPrice) : true
    )
    .filter((product) =>
      maxPrice ? Number(product.price) <= parseFloat(maxPrice) : true
    );

  const mainWrapperStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    padding: "20px"
  };
  const filterStyle = {
    width: "250px",
    minHeight: "calc(100vh - 80px)",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
    flexShrink: 0
  };
  const productsContainerStyle = {
    flexGrow: 1,
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  };
  const productCardStyle = {
    width: "300px",
    textAlign: "center",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer"
  };
  const productImageStyle = {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "0.5rem"
  };
  const addToCartBtnStyle = {
    backgroundColor: "#b62a2aff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.75rem 1.25rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s, transform 0.2s"
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      {intro && (
        <div className="intro-section d-flex align-items-start p-4">
          <div className="intro-images me-4" style={{ flex: 1 }} ref={carouselRef}>
            <Carousel
              controls
              indicators
              nextIcon={
                <span
                  className="carousel-control-next-icon"
                  style={{ backgroundColor: "#b71c1c", borderRadius: "50%" }}
                />
              }
              prevIcon={
                <span
                  className="carousel-control-prev-icon"
                  style={{ backgroundColor: "#b71c1c", borderRadius: "50%" }}
                />
              }
            >
              {intro.images.map((src, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block"
                    src={src}
                    alt={`Slide ${idx + 1}`}
                    style={{
                      width: "500px",
                      height: "500px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      margin: "0 auto"
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>

          <div
            className="intro-text"
            style={{ flex: 1, paddingLeft: "20px", textAlign: "center" }}
          >
            <h2 style={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "16px" }}>
              {intro.title}
            </h2>
            <div style={{ fontSize: "1rem", color: "#555", lineHeight: "1.8" }}>
              {intro.description.split("\n\n").map((para, idx) => (
                <p key={idx} style={{ marginBottom: "1.2rem" }}>
                  {para}
                </p>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "30px"
              }}
            >
              <Button
                style={{
                  backgroundColor: "#b71c1c",
                  borderColor: "#b71c1c",
                  fontWeight: "bold",
                  padding: "8px 20px"
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#8b1414")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#b71c1c")
                }
                onClick={() =>
                  productsSectionRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                See Products
              </Button>

              <Button
                style={{
                  backgroundColor: "#ff6666",
                  borderColor: "#ff6666",
                  fontWeight: "bold",
                  padding: "8px 20px"
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e65555")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ff6666")
                }
                onClick={() => navigate("/fundraiser")}
              >
                Donate
              </Button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3 style={{ fontWeight: "bold", fontSize: "1.8rem", marginBottom: "20px" }}>
          Videos
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            justifyContent: "center"
          }}
        >
          {videoIDs.map((id, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                borderRadius: "8px",
                overflow: "hidden"
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title={`Video ${index + 1}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "0"
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Header />
      </div>

      <div style={mainWrapperStyle}>
        <div style={filterStyle}>
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

        <div style={productsContainerStyle} ref={productsSectionRef}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                style={productCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
              >
                <img
                  src={productImages[product.name] || "/images/placeholder.png"}
                  alt={product.name}
                  style={productImageStyle}
                />
                <h5>{product.name}</h5>
                <p>${Number(product.price).toFixed(2)}</p>
                <button
                  style={addToCartBtnStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#8b1414";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#b62a2aff";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onClick={() => alert(`Added ${product.name} to cart`)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div
              style={{
                fontSize: "20px",
                color: "#777",
                textAlign: "center",
                width: "100%"
              }}
            >
              No products found
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() =>
          carouselRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#b71c1c",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "1.5rem",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          transition: "opacity 0.5s ease, transform 0.3s ease",
          opacity: showScroll ? 1 : 0,
          pointerEvents: showScroll ? "auto" : "none"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ff9999";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#b71c1c";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        ↑
      </button>
    </div>
  );
}
