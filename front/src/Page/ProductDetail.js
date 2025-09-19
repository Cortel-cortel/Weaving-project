// src/Page/ProductDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";

export default function ProductDetail({ cart, setCart }) {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);

  const productData = {
    "Cordillera Inabel Shawl": {
      images: [
        "/images/products/inabel-shawl.jpg",
        "/images/products/inabel-shawl2.jpg",
        "/images/products/inabel-shawl3.jpg",
        "/images/products/inabel-shawl4.jpg",
        "/images/products/inabel-shawl5.jpg"
      ],
      details:
        "The Cordillera Inabel Shawl is handwoven using age-old weaving traditions from the Ilocos and Cordillera regions. It is known for its softness, durability, and distinctive patterns.",
      trivia:
        "Inabel weaving is considered a cultural treasure of the Philippines, and shawls like this are often worn during festivals and important cultural gatherings."
    },
    "Cordillera Inabel Blanket": {
      images: [
        "/images/products/inabel-blanket.jpg",
        "/images/products/inabel-blanket2.jpg",
        "/images/products/inabel-blanket3.jpg",
        "/images/products/inabel-blanket4.jpg",
        "/images/products/inabel-blanket5.jpg"
      ],
      details:
        "This traditional blanket showcases intricate geometric designs that represent harmony and community. Each piece is woven by hand using wooden looms.",
      trivia:
        "Inabel blankets were once considered heirlooms and passed down across generations as a sign of heritage and family honor."
    },
    "Cordillera Inabel Cushion Cover": {
      images: [
        "/images/products/inabel-cushion_cover.jpg",
        "/images/products/inabel-cushion_cover2.jpg",
        "/images/products/inabel-cushion_cover3.jpg",
        "/images/products/inabel-cushion_cover4.jpg",
        "/images/products/inabel-cushion_cover5.jpg"
      ],
      details:
        "Handwoven Inabel cushion covers add warmth and authenticity to any home setting. They are crafted from durable cotton yarn with unique woven textures.",
      trivia:
        "Inabel cushion covers often incorporate tribal patterns that symbolize unity, prosperity, and protection."
    },
    "Ikat Table Runner": {
      images: [
        "/images/products/ikat-table_runner.jpg",
        "/images/products/ikat-table_runner2.jpg",
        "/images/products/ikat-table_runner3.jpg",
        "/images/products/ikat-table_runner4.jpg",
        "/images/products/ikat-table_runner5.jpg"
      ],
      details:
        "A vibrant ikat table runner that highlights the resist-dye technique, creating intricate patterns and color gradients.",
      trivia:
        "Ikat textiles are prized across Southeast Asia for their complexity, with each piece requiring careful dyeing and weaving coordination."
    },
    "Ikat Wall Hanging": {
      images: [
        "/images/products/ikat-wall_hanging.jpg",
        "/images/products/ikat-wall_hanging2.jpg",
        "/images/products/ikat-wall_hanging3.jpg",
        "/images/products/ikat-wall_hanging4.jpg",
        "/images/products/ikat-wall_hanging5.jpg"
      ],
      details:
        "This ikat wall hanging is designed to bring color and cultural heritage into modern interiors. Its bold patterns reflect harmony and artistry.",
      trivia:
        "Wall hangings were historically used in households to represent wealth and artistry, passed on through family lines."
    },
    "Ikat Tote Bag": {
      images: [
        "/images/products/ikat-tote_bag.jpg",
        "/images/products/ikat-tote_bag2.jpg",
        "/images/products/ikat-tote_bag3.jpg",
        "/images/products/ikat-tote_bag4.jpg",
        "/images/products/ikat-tote_bag5.jpg"
      ],
      details:
        "The Ikat Tote Bag is a versatile accessory combining modern fashion with traditional weaving techniques.",
      trivia:
        "Ikat tote bags symbolize sustainability, as they are handmade by artisans using eco-friendly weaving practices."
    },
    "Kalinga Weaving Bag": {
      images: [
        "/images/products/kalinga-bag.jpg",
        "/images/products/kalinga-bag2.jpg",
        "/images/products/kalinga-bag3.jpg",
        "/images/products/kalinga-bag4.jpg",
        "/images/products/kalinga-bag5.jpg"
      ],
      details:
        "A handwoven bag crafted by Kalinga artisans, incorporating patterns that reflect tribal identity and strength.",
      trivia:
        "Bags like this are not just accessories but symbols of resilience, as weaving is passed down from generation to generation."
    },
    "Kalinga Weaving Table Mat": {
      images: [
        "/images/products/kalinga-table_mat.jpg",
        "/images/products/kalinga-table_mat2.jpg",
        "/images/products/kalinga-table_mat3.jpg",
        "/images/products/kalinga-table_mat4.jpg",
        "/images/products/kalinga-table_mat5.jpg"
      ],
      details:
        "This traditional table mat features colorful patterns inspired by Kalinga heritage. It blends function with artistry.",
      trivia:
        "Table mats are often gifted during cultural exchanges and represent hospitality in the Kalinga community."
    },
    "Kalinga Weaving Wall Decor": {
      images: [
        "/images/products/kalinga-wall_decor.jpg",
        "/images/products/kalinga-wall_decor2.jpg",
        "/images/products/kalinga-wall_decor3.jpg",
        "/images/products/kalinga-wall_decor4.jpg",
        "/images/products/kalinga-wall_decor5.jpg"
      ],
      details:
        "Kalinga weaving wall decor combines symbolic motifs with striking colors, bringing heritage into home aesthetics.",
      trivia:
        "Wall decor in Kalinga weaving represents pride in identity and is often created to preserve cultural legacy."
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/products/${productId}`
        );
        const prod = res.data.data || res.data;
        setProduct(prod);
        setLoading(false);

        const resAll = await axios.get("http://127.0.0.1:8000/api/products");
        const allProducts = resAll.data.data || resAll.data;
        const similar = allProducts
          .filter((p) => p.category === prod.category && p.id !== prod.id)
          .slice(0, 3);
        setSimilarProducts(similar);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    const exists = cart.find((item) => item.id === product.id);
    const updatedCart = exists
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cart, { ...product, quantity }];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartUpdated", Date.now());

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout", {
      state: { buyNowProduct: { ...product, quantity } }
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        Loading product...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "120px", color: "red" }}>
        {error}
      </div>
    );
  if (!product)
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        No product data available.
      </div>
    );

  const extraData = productData[product.name] || {};
  const images =
    extraData.images || (product.imgs?.length ? product.imgs : ["/images/placeholder.png"]);

  return (
    <div
      style={{
        padding: "120px 20px 40px 20px",
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
      <h1
        style={{
          fontSize: "2.4rem",
          fontWeight: "bold",
          marginBottom: "30px",
          textAlign: "center"
        }}
      >
        {product.name}
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          flexWrap: "wrap",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
        }}
      >
        <Carousel
          style={{
            flex: 1,
            minWidth: "350px",
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          {images.map((src, idx) => (
            <Carousel.Item key={idx}>
              <img
                src={src}
                alt={`${product.name} ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "450px",
                  objectFit: "cover",
                  borderRadius: "12px"
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <div
          style={{
            flex: 1,
            minWidth: "350px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <span
            style={{
              backgroundColor: "#ffe6e6",
              color: "#b71c1c",
              padding: "5px 12px",
              borderRadius: "20px",
              fontWeight: "bold",
              width: "fit-content",
              marginBottom: "15px"
            }}
          >
            ₱{Number(product.price).toFixed(2)}
          </span>

          <p
            style={{
              fontSize: "1rem",
              color: "#555",
              lineHeight: "1.8",
              marginBottom: "25px"
            }}
          >
            {product.description || "No description available."}
          </p>

          {/* Quantity limited to 10 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "25px"
            }}
          >
            <label style={{ fontWeight: "bold" }}>Quantity:</label>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(10, Math.max(1, Number(e.target.value))))
              }
              style={{
                width: "70px",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: "12px",
                fontWeight: "bold",
                backgroundColor: "#b71c1c",
                color: "#fff",
                borderRadius: "10px",
                border: "none"
              }}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                flex: 1,
                padding: "12px",
                fontWeight: "bold",
                backgroundColor: "#ff6666",
                color: "#fff",
                borderRadius: "10px",
                border: "none"
              }}
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={handleShare}
            style={{
              padding: "10px",
              backgroundColor: "#555",
              color: "#fff",
              borderRadius: "8px",
              border: "none"
            }}
          >
            Share
          </button>
        </div>
      </div>

      {/* About this Product Section */}
      <div
        style={{
          marginTop: "50px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h3
          style={{
            fontWeight: "bold",
            marginBottom: "15px",
            fontSize: "1.4rem"
          }}
        >
          About this Product
        </h3>

        <p
          style={{
            fontSize: "1rem",
            color: "#333",
            lineHeight: "1.6",
            marginBottom: "15px"
          }}
        >
          <strong>Description:</strong>{" "}
          {product.description || "No description available."}
        </p>

        <p
          style={{
            fontSize: "1rem",
            color: "#333",
            lineHeight: "1.6",
            marginBottom: "15px"
          }}
        >
          <strong>Details:</strong>{" "}
          {extraData.details || "No specific details provided."}
        </p>

        <p style={{ fontSize: "1rem", color: "#333", lineHeight: "1.6" }}>
          <strong>Trivia:</strong>{" "}
          {extraData.trivia || "No trivia available for this product."}
        </p>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>
            Similar Products
          </h3>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {similarProducts.map((sp) => (
              <div
                key={sp.id}
                onClick={() => navigate(`/product/${sp.id}`)}
                style={{
                  cursor: "pointer",
                  width: "200px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  padding: "10px"
                }}
              >
                <img
                  src={
                    (productData[sp.name]?.images?.[0]) ||
                    sp.imgs?.[0] ||
                    "/images/placeholder.png"
                  }
                  alt={sp.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px"
                  }}
                />
                <p style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>
                  {sp.name}
                </p>
                <span
                  style={{ color: "#b71c1c", fontWeight: "bold" }}
                >
                  ₱{Number(sp.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
