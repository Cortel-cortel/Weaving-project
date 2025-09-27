import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail({ cart, setCart }) {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [otherProducts, setOtherProducts] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);

  const [sortOption, setSortOption] = useState("alphabetical");
  const [filterCategory, setFilterCategory] = useState("all");

// Static product data
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
  "The Cordillera Inabel Shawl is handwoven using age-old weaving traditions from Cordillera regions. It is known for its softness, durability, and distinctive patterns. Each shawl carries motifs that symbolize nature, life, and protection, making it both fashionable and meaningful.",
  trivia:
  "Inabel weaving is considered a cultural treasure of the Philippines, and shawls like this are often worn during festivals and important cultural gatherings. Beyond their cultural use, these shawls are also valued today as heirlooms and modern accessories, bridging tradition with contemporary style."
  },
  "Cordillera Inabel Blanket": {
  images: [
  "/images/products/inabel-blanket.jpg",
  "/images/products/inabel-blanket2.jpg",
  "/images/products/inabel-blanket3.jpg",
  "/images/products/inabel-blanket4.jpg",
  "/images/products/inabel-blanket5.jpg"
  ],
  details: "This traditional blanket showcases intricate geometric designs that represent harmony and community. Each piece is woven by hand using wooden looms, prized for its warmth, durability, and craftsmanship while serving both practical and decorative purposes in Filipino households.",
  trivia: "Inabel blankets were once considered heirlooms and passed down across generations as a sign of heritage and family honor. Today, they are treasured as sustainable works of art that highlight the dedication of artisans preserving centuries-old techniques."
  },
  "Cordillera Inabel Cushion Cover": {
  images: [
  "/images/products/inabel-cushion_cover.jpg",
  "/images/products/inabel-cushion_cover2.jpg",
  "/images/products/inabel-cushion_cover3.jpg",
  "/images/products/inabel-cushion_cover4.jpg",
  "/images/products/inabel-cushion_cover5.jpg"
  ],
  details: "Handwoven Inabel cushion covers add warmth and authenticity to any home setting. Crafted from durable cotton yarn with unique woven textures, their vibrant colors and tribal patterns make them versatile pieces that blend seamlessly with both modern and traditional interiors.",
  trivia: "Inabel cushion covers often incorporate tribal patterns that symbolize unity, prosperity, and protection. They are also favored as cultural souvenirs, reflecting the artistry and identity of the Ilocos region."
  },
  "Ikat Table Runner": {
  images: [
  "/images/products/ikat-table_runner.jpg",
  "/images/products/ikat-table_runner2.jpg",
  "/images/products/ikat-table_runner3.jpg",
  "/images/products/ikat-table_runner4.jpg",
  "/images/products/ikat-table_runner5.jpg"
  ],
  details: "A vibrant ikat table runner that highlights the resist-dye technique, creating intricate patterns and color gradients. Each runner requires careful planning, as the dyed threads must align perfectly during weaving to reveal the intended design.",
  trivia: "Ikat textiles are prized across Southeast Asia for their complexity, with each piece requiring careful dyeing and weaving coordination. These runners are also used as statement pieces in cultural events, symbolizing abundance and artistry."
  },
  "Ikat Wall Hanging": {
  images: [
  "/images/products/ikat-wall_hanging.jpg",
  "/images/products/ikat-wall_hanging2.jpg",
  "/images/products/ikat-wall_hanging3.jpg",
  "/images/products/ikat-wall_hanging4.jpg",
  "/images/products/ikat-wall_hanging5.jpg"
  ],
  details: "This ikat wall hanging is designed to bring color and cultural heritage into modern interiors. Its bold patterns reflect harmony and artistry, with motifs inspired by nature, balance, and resilience.",
  trivia: "Wall hangings were historically used in households to represent wealth and artistry, passed on through family lines. Today, they remain sought-after as both heritage pieces and stylish home accents that showcase traditional skill."
  },
  "Ikat Tote Bag": {
  images: [
  "/images/products/ikat-tote_bag.jpg",
  "/images/products/ikat-tote_bag2.jpg",
  "/images/products/ikat-tote_bag3.jpg",
  "/images/products/ikat-tote_bag4.jpg",
  "/images/products/ikat-tote_bag5.jpg"
  ],
  details: "The Ikat Tote Bag is a versatile accessory combining modern fashion with traditional weaving techniques. Lightweight yet durable, it showcases the adaptability of ikat weaving to contemporary lifestyles while keeping artistry intact.",
  trivia: "Ikat tote bags symbolize sustainability, as they are handmade by artisans using eco-friendly weaving practices. Beyond fashion, they also represent cultural continuity, with every pattern carrying a story from the community that made it."
  },
  "Kalinga Weaving Bag": {
  images: [
  "/images/products/kalinga-bag.jpg",
  "/images/products/kalinga-bag2.jpg",
  "/images/products/kalinga-bag3.jpg",
  "/images/products/kalinga-bag4.jpg",
  "/images/products/kalinga-bag5.jpg"
  ],
  details: "A handwoven bag crafted by Kalinga artisans, incorporating patterns that reflect tribal identity and strength. Each bag is carefully designed to embody both durability and cultural significance, making it more than just a functional item.",
  trivia: "Bags like this are not just accessories but symbols of resilience, as weaving is passed down from generation to generation. They are often gifted during important milestones, serving as reminders of cultural pride and continuity."
  },
  "Kalinga Weaving Table Mat": {
  images: [
  "/images/products/kalinga-table_mat.jpg",
  "/images/products/kalinga-table_mat2.jpg",
  "/images/products/kalinga-table_mat3.jpg",
  "/images/products/kalinga-table_mat4.jpg",
  "/images/products/kalinga-table_mat5.jpg"
  ],
  details: "This traditional table mat features colorful patterns inspired by Kalinga heritage. It blends function with artistry, and beyond everyday use, these mats are appreciated as decorative accents that showcase the vibrancy of Kalinga weaving.",
  trivia: "Table mats are often gifted during cultural exchanges and represent hospitality in the Kalinga community. They also stand as tokens of gratitude, symbolizing the warmth and generosity of the people."
  },
  "Kalinga Weaving Wall Decor": {
  images: [
  "/images/products/kalinga-wall_decor.jpg",
  "/images/products/kalinga-wall_decor2.jpg",
  "/images/products/kalinga-wall_decor3.jpg",
  "/images/products/kalinga-wall_decor4.jpg",
  "/images/products/kalinga-wall_decor5.jpg"
  ],
  details: "Kalinga weaving wall decor combines symbolic motifs with striking colors, bringing heritage into home aesthetics. Each piece serves as a cultural canvas, embodying ancestral stories and a sense of community identity.",
  trivia: "Wall decor in Kalinga weaving represents pride in identity and is often created to preserve cultural legacy. These pieces are cherished as visual narratives of heritage, reminding future generations of their ancestral roots."
  }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/products/${productId}`
        );
        const prod = res.data.data;
        if (!prod) throw new Error("Product not found");

        const defaultImages =
          productData[prod.name]?.images || ["/images/placeholder.png"];
        const uploadedImages =
          prod.images && prod.images.length > 0
            ? prod.images.map((img) =>
                img.startsWith("http")
                  ? img
                  : `http://127.0.0.1:8000/storage/${img}`
              )
            : prod.image
            ? [`${prod.image_url || `http://127.0.0.1:8000/storage/${prod.image}`}`]
            : [];
        const combinedImages = uploadedImages.length > 0 ? uploadedImages : defaultImages;

        setProduct({
          ...prod,
          images: combinedImages,
          image_url: combinedImages[0],
          details: prod.details || productData[prod.name]?.details || prod.description,
          trivia: prod.trivia || productData[prod.name]?.trivia || "",
        });

        const resAll = await axios.get("http://127.0.0.1:8000/api/products");
        const allProducts = resAll.data.data || [];

        const others = allProducts
          .filter((p) => p.id !== prod.id)
          .map((p) => {
            const spDefault = productData[p.name]?.images || ["/images/placeholder.png"];
            const spUploaded =
              p.images && p.images.length > 0
                ? p.images.map((img) =>
                    img.startsWith("http")
                      ? img
                      : `http://127.0.0.1:8000/storage/${img}`
                  )
                : p.image
                ? [`${p.image_url || `http://127.0.0.1:8000/storage/${p.image}`}`]
                : [];
            const spImages = spUploaded.length > 0 ? spUploaded : spDefault;
            return { ...p, images: spImages, image_url: spImages[0] };
          });

        setOtherProducts(others);
        setLoading(false);
      } catch (err) {
        console.error(err);
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
      state: { buyNowProduct: { ...product, quantity } },
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

  const images = product.images || ["/images/placeholder.png"];
  const categories = [...new Set(otherProducts.map((p) => p.category))];

  // Filter + Sort
  let displayedProducts =
    filterCategory === "all"
      ? [...otherProducts]
      : otherProducts.filter((p) => p.category === filterCategory);

  if (sortOption === "alphabetical") {
    displayedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "priceLowHigh") {
    displayedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOption === "priceHighLow") {
    displayedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <div
      style={{
        padding: "120px 20px 40px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              padding: "15px 20px",
              borderRadius: "10px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              zIndex: 1000,
            }}
          >
            <FaCheck /> Added to cart!
          </motion.div>
        )}
      </AnimatePresence>

      <h1
        style={{
          fontSize: "2.4rem",
          fontWeight: "bold",
          marginBottom: "30px",
          textAlign: "center",
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
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ flex: 1, minWidth: "350px" }}
        >
          <Carousel style={{ borderRadius: "12px", overflow: "hidden" }}>
            {images.map((src, idx) => (
              <Carousel.Item key={idx}>
                <motion.img
                  src={src}
                  alt={`${product.name} ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "450px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </motion.div>

        <div
          style={{
            flex: 1,
            minWidth: "350px",
            display: "flex",
            flexDirection: "column",
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
              marginBottom: "15px",
            }}
          >
            ₱{Number(product.price).toFixed(2)}
          </span>

          <p
            style={{
              fontSize: "1rem",
              color: "#555",
              lineHeight: "1.8",
              marginBottom: "25px",
            }}
          >
            {product.description || "No description available."}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "25px",
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
                border: "1px solid #ccc",
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
                border: "none",
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
                border: "none",
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
              border: "none",
            }}
          >
            Share
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          marginTop: "50px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontWeight: "bold", marginBottom: "15px", fontSize: "1.4rem" }}>
          About this Product
        </h3>
        <p>
          <strong>Details:</strong> {product.details || "No details available."}
        </p>
        {product.trivia && (
          <p style={{ marginTop: "10px" }}>
            <strong>Trivia:</strong> {product.trivia}
          </p>
        )}
      </motion.div>

      {otherProducts.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>
            You may also like
          </h3>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px" }}
            >
              <option value="all">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px" }}
            >
              <option value="alphabetical">Alphabetical (A–Z)</option>
              <option value="priceLowHigh">Price: Low → High</option>
              <option value="priceHighLow">Price: High → Low</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {displayedProducts.map((sp, index) => (
              <motion.div
                key={sp.id}
                onClick={() => navigate(`/product/${sp.id}`)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  cursor: "pointer",
                  width: "200px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <img
                  src={(sp.images && sp.images[0]) || "/images/placeholder.png"}
                  alt={sp.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
                <p
                  style={{
                    fontWeight: "bold",
                    margin: "10px 0 5px 0",
                  }}
                >
                  {sp.name}
                </p>
                <span style={{ color: "#b71c1c", fontWeight: "bold" }}>
                  ₱{Number(sp.price).toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
