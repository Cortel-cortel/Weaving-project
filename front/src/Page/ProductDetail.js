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

  const productImages = {
  "Cordillera Inabel Shawl": [
    "/images/products/inabel-shawl.jpg",
    "/images/products/inabel-shawl2.jpg",
    "/images/products/inabel-shawl3.jpg",
    "/images/products/inabel-shawl4.jpg",
    "/images/products/inabel-shawl5.jpg"
  ],
  "Cordillera Inabel Blanket": [
    "/images/products/inabel-blanket.jpg",
    "/images/products/inabel-blanket2.jpg",
    "/images/products/inabel-blanket3.jpg",
    "/images/products/inabel-blanket4.jpg",
    "/images/products/inabel-blanket5.jpg"
  ],
  "Cordillera Inabel Cushion Cover": [
    "/images/products/inabel-cushion_cover.jpg",
    "/images/products/inabel-cushion_cover2.jpg",
    "/images/products/inabel-cushion_cover3.jpg",
    "/images/products/inabel-cushion_cover4.jpg",
    "/images/products/inabel-cushion_cover5.jpg"
  ],
  "Ikat Table Runner": [
    "/images/products/ikat-table_runner.jpg",
    "/images/products/ikat-table_runner2.jpg",
    "/images/products/ikat-table_runner3.jpg",
    "/images/products/ikat-table_runner4.jpg",
    "/images/products/ikat-table_runner5.jpg"
  ],
  "Ikat Wall Hanging": [
    "/images/products/ikat-wall_hanging.jpg",
    "/images/products/ikat-wall_hanging2.jpg",
    "/images/products/ikat-wall_hanging3.jpg",
    "/images/products/ikat-wall_hanging4.jpg",
    "/images/products/ikat-wall_hanging5.jpg"
  ],
  "Ikat Tote Bag": [
    "/images/products/ikat-tote_bag.jpg",
    "/images/products/ikat-tote_bag2.jpg",
    "/images/products/ikat-tote_bag3.jpg",
    "/images/products/ikat-tote_bag4.jpg",
    "/images/products/ikat-tote_bag5.jpg"
  ],
  "Kalinga Weaving Bag": [
    "/images/products/kalinga-bag.jpg",
    "/images/products/kalinga-bag2.jpg",
    "/images/products/kalinga-bag3.jpg",
    "/images/products/kalinga-bag4.jpg",
    "/images/products/kalinga-bag5.jpg"
  ],
  "Kalinga Weaving Table Mat": [
    "/images/products/kalinga-table_mat.jpg",
    "/images/products/kalinga-table_mat2.jpg",
    "/images/products/kalinga-table_mat3.jpg",
    "/images/products/kalinga-table_mat4.jpg",
    "/images/products/kalinga-table_mat5.jpg"
  ],
  "Kalinga Weaving Wall Decor": [
    "/images/products/kalinga-wall_decor.jpg",
    "/images/products/kalinga-wall_decor2.jpg",
    "/images/products/kalinga-wall_decor3.jpg",
    "/images/products/kalinga-wall_decor4.jpg",
    "/images/products/kalinga-wall_decor5.jpg"
  ],
};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/products/${productId}`);
        const prod = res.data.data || res.data;
        setProduct(prod);
        setLoading(false);

        const resAll = await axios.get("http://127.0.0.1:8000/api/products");
        const allProducts = resAll.data.data || resAll.data;
        const similar = allProducts
          .filter(p => p.category === prod.category && p.id !== prod.id)
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

    const exists = cart.find(item => item.id === product.id);
    const updatedCart = exists
      ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cart, { ...product, quantity }];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartUpdated", Date.now());

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout", { state: { buyNowProduct: { ...product, quantity } } });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "120px" }}>Loading product...</div>;
  if (error) return <div style={{ textAlign: "center", marginTop: "120px", color: "red" }}>{error}</div>;
  if (!product) return <div style={{ textAlign: "center", marginTop: "120px" }}>No product data available.</div>;

  // Use productImages array, then API images, then placeholder
  const images = productImages[product.name] || (product.imgs?.length ? product.imgs : ["/images/placeholder.png"]);

  return (
    <div style={{ padding: "120px 20px 40px 20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.4rem", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>
        {product.name}
      </h1>

      <div style={{ display: "flex", flexDirection: "row", gap: "40px", flexWrap: "wrap", backgroundColor: "#fff", borderRadius: "12px", padding: "30px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
        <Carousel style={{ flex: 1, minWidth: "350px", borderRadius: "12px", overflow: "hidden" }}>
          {images.map((src, idx) => (
            <Carousel.Item key={idx}>
              <img src={src} alt={`${product.name} ${idx + 1}`} style={{ width: "100%", height: "450px", objectFit: "cover", borderRadius: "12px" }} />
            </Carousel.Item>
          ))}
        </Carousel>

        <div style={{ flex: 1, minWidth: "350px", display: "flex", flexDirection: "column" }}>
          <span style={{ backgroundColor: "#ffe6e6", color: "#b71c1c", padding: "5px 12px", borderRadius: "20px", fontWeight: "bold", width: "fit-content", marginBottom: "15px" }}>
            ₱{Number(product.price).toFixed(2)}
          </span>

          <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.8", marginBottom: "25px" }}>
            {product.description || "No description available."}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
            <label style={{ fontWeight: "bold" }}>Quantity:</label>
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: "70px", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }} />
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <button onClick={handleAddToCart} style={{ flex: 1, padding: "12px", fontWeight: "bold", backgroundColor: "#b71c1c", color: "#fff", borderRadius: "10px", border: "none" }}>
              Add to Cart
            </button>
            <button onClick={handleBuyNow} style={{ flex: 1, padding: "12px", fontWeight: "bold", backgroundColor: "#ff6666", color: "#fff", borderRadius: "10px", border: "none" }}>
              Buy Now
            </button>
          </div>

          <button onClick={handleShare} style={{ padding: "10px", backgroundColor: "#555", color: "#fff", borderRadius: "8px", border: "none" }}>
            Share
          </button>
        </div>
      </div>

      {toastVisible && (
        <div style={{ position: "fixed", top: "80px", right: "20px", backgroundColor: "#b71c1c", color: "#fff", padding: "12px 20px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: "8px", transform: toastVisible ? "translateY(0)" : "translateY(-100px)", transition: "transform 0.5s ease-in-out", zIndex: 2000 }}>
          <FaCheck /> <span>Added to cart!</span>
        </div>
      )}

      {similarProducts.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>Similar Products</h3>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {similarProducts.map(sp => (
              <div key={sp.id} onClick={() => navigate(`/product/${sp.id}`)} style={{ cursor: "pointer", width: "200px", border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center", padding: "10px" }}>
                <img 
                  src={productImages[sp.name]?.[0] || sp.imgs?.[0] || "/images/placeholder.png"} 
                  alt={sp.name} 
                  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }} 
                />
                <p style={{ fontWeight: "bold", margin: "10px 0 5px 0" }}>{sp.name}</p>
                <span style={{ color: "#b71c1c", fontWeight: "bold" }}>₱{Number(sp.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
