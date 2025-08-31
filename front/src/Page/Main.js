import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Component/Header";
import Filter from "../Component/Filter";
import ProductCard from "../Component/ProductCard";
import "../App.css";

export default function Main() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products");
        const productsWithImages = response.data.data.map((p) => ({
          ...p,
          thumbnail: p.images?.length
            ? `http://127.0.0.1:8000/storage/${p.images[0]}`
            : "https://via.placeholder.com/200x200?text=No+Image",
          description: p.description || "No description available.",
        }));
        setProducts(productsWithImages);
        setFilteredProducts(productsWithImages);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Unique categories for filter
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  // Filter handler
  const handleSearch = (searchTerm, selectedCategories, minPrice, maxPrice) => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    if (minPrice !== "") filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice !== "") filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));

    setFilteredProducts(filtered);
  };

  // Navigate to product page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) return <div className="loadingScreen">Loading...</div>;
  if (error) return <div className="errorScreen">{error}</div>;

  return (
    <div className="user-dashboard">
      <Header user="user" />

      <div className="dashboard">
        <aside className="searchFilter">
          <Filter onSearch={handleSearch} categories={uniqueCategories} />
        </aside>

        <div className="view">
          {filteredProducts.length > 0 ? (
            <div className="product-list-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-thumbnail-card"
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <h4>{product.name}</h4>
                  <p>{product.description.length > 50 ? product.description.slice(0, 50) + "..." : product.description}</p>
                  <p><strong>${product.price}</strong></p>
                </div>
              ))}
            </div>
          ) : (
            <h3>No Products Found</h3>
          )}
        </div>
      </div>
    </div>
  );
}
