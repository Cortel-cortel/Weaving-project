// ProductCard.js
import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const getImageSrc = (name) => {
    const baseName = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    return `/images/products/${baseName}.jpg`;
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(e.target.value, product.stock));
    setQuantity(value);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      const { data } = await axios.get("http://127.0.0.1:8000/api/cart", { withCredentials: true });
      const existingItem = data.data.find((item) => item.product_id === product.id);

      if (existingItem) {
        const updatedQuantity = existingItem.quantity + quantity;
        await axios.put(
          `http://127.0.0.1:8000/api/cart/${existingItem.id}`,
          { quantity: updatedQuantity },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/cart",
          {
            product_id: product.id,
            barcode: product.barcode,
            name: product.name,
            price: product.price,
            quantity,
            category: product.category,
            description: product.description,
          },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
      }

      // Trigger Cart refresh
      localStorage.setItem("cartUpdated", Date.now());

      // Animate product to cart
      animateToCart(e.target.closest(".product-card").querySelector("img"));
    } catch (error) {
      console.error("Cart Error:", error.response || error);
      alert("Failed to add to cart. Check console for details.");
    }
  };

  const animateToCart = (imgElement) => {
    const cartIcon = document.querySelector("#cart-icon"); // Make sure your cart icon has this ID
    if (!imgElement || !cartIcon) return;

    const imgRect = imgElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const clone = imgElement.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.transition = "all 0.8s ease-in-out";
    clone.style.zIndex = 1000;
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.left = `${cartRect.left}px`;
      clone.style.top = `${cartRect.top}px`;
      clone.style.width = "0px";
      clone.style.height = "0px";
      clone.style.opacity = 0;
    });

    clone.addEventListener("transitionend", () => clone.remove());
  };

  const handleViewDetails = () => {
    const normalizedCategory = product.category?.replace(/\d+$/, "").toLowerCase();
    if (normalizedCategory) navigate(`/product/${normalizedCategory}`);
  };

  return (
    <Card className="product-card" style={{ cursor: "pointer" }} onClick={handleViewDetails}>
      <Card.Img
        variant="top"
        src={getImageSrc(product.name)}
        alt={product.name}
        onError={(e) => { e.target.onerror = null; e.target.src = "/images/products/placeholder.png"; }}
        style={{ height: "180px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{product.category}</Card.Subtitle>
        <Card.Text style={{ height: "40px", overflow: "hidden", textOverflow: "ellipsis" }}>
          {product.description || "No description available."}
        </Card.Text>
        <Card.Text><strong>Price:</strong> ₱{product.price}</Card.Text>
        <Card.Text><strong>Stock:</strong> {product.stock}</Card.Text>

        <div className="quantity-container">
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={product.stock}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <Button
          className="add-to-cart-btn mt-2"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}
