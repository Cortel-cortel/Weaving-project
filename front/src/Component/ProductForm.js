import React, { useState, useRef } from "react";
import axios from "axios";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [trivia, setTrivia] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const imageInputRef = useRef();

  const triggerFileInput = () => {
    imageInputRef.current.click();
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!name || !price || !stock) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/products",
        { name, description, details, trivia, category, price, stock },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const productId = response.data.data.id;

      if (images.length > 0) {
        for (const img of images) {
          const formData = new FormData();
          formData.append("image", img);
          await axios.post(
            `http://127.0.0.1:8000/api/products/${productId}/image`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }

      setSuccess("✅ Product added successfully!");
      setName("");
      setDescription("");
      setDetails("");
      setTrivia("");
      setCategory("");
      setPrice("");
      setStock("");
      setImages([]);
      setPreviews([]);
    } catch (err) {
      console.error(err.response);
      setError(err.response?.data?.message || "❌ Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Add New Product</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Details</label>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} />

        <label>Trivia</label>
        <textarea value={trivia} onChange={(e) => setTrivia(e.target.value)} />

        <label>Category</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />

        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label>Stock</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          multiple
          ref={imageInputRef}
          onChange={handleImagesChange}
          style={{ display: "none" }}
        />

        {/* Visible button to trigger image input */}
        <button
          type="button"
          onClick={triggerFileInput}
          style={{
            padding: "10px",
            marginTop: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            backgroundColor: "#f4f4f4",
            cursor: "pointer",
          }}
        >
          Add Images
        </button>

        {/* Preview selected images */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
          {previews.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`preview ${idx + 1}`}
              style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
            />
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
