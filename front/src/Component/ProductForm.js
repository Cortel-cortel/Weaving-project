import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

export default function ProductForm({ product = null }) {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [images, setImages] = useState([]); // New images selected
  const [previewImages, setPreviewImages] = useState(
    product?.images || []
  ); // For both existing and new images
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle multiple image selection
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !description || !category || !price || !stock) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("stock", stock);
    images.forEach((img) => formData.append("images[]", img));

    try {
      const token = localStorage.getItem("userToken");

      if (product) {
        // EDIT mode
        await axios.post(
          `http://127.0.0.1:8000/api/products/${product.id}?_method=PUT`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Product updated successfully!");
      } else {
        // ADD mode
        await axios.post("http://127.0.0.1:8000/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Product added successfully!");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>{product ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
        />

        {/* Image previews */}
        {previewImages.length > 0 && (
          <div
            className="preview-images"
            style={{ display: "flex", gap: "10px", marginTop: "10px" }}
          >
            {previewImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            ))}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? (product ? "Updating..." : "Adding...") : product ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
