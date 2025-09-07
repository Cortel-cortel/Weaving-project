import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "../Component/ProductForm";
import DeletePrompt from "../Component/DeletePrompt";
import Filter from "../Component/Filter";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { RiEdit2Fill, RiDeleteBin5Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import Header from "../Component/Header";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Dashboard({ handleLogout }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const uniqueCategories = [...new Set(products.map((product) => product.category))];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products");
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } catch {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setIsEdit(true);
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleProductSaved = () => {
    setLoading(true);
    setError(null);
    axios.get("http://127.0.0.1:8000/api/products")
      .then((response) => {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${selectedId}`);
      setProducts(products.filter((product) => product.id !== selectedId));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== selectedId));
    } catch {
      setError("Failed to delete product.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="loadingScreen">Loading...</div>;
  if (error) return <div className="errorScreen">{error}</div>;

  const handleSearch = (searchTerm, selectedCategories, minPrice, maxPrice) => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (minPrice !== '') {
      const minPriceNum = parseFloat(minPrice);
      filtered = filtered.filter((product) => product.price >= minPriceNum);
    }

    if (maxPrice !== '') {
      const maxPriceNum = parseFloat(maxPrice);
      filtered = filtered.filter((product) => product.price <= maxPriceNum);
    }

    setFilteredProducts(filtered);
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        <aside className="searchFilter">
          <Filter onSearch={handleSearch} categories={uniqueCategories} />
        </aside>

        <div className="view">
          {/* Dashboard header with logout */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Dashboard</h1>
            <FiLogOut
              size={24}
              style={{ cursor: "pointer" }}
              title="Logout"
              onClick={() => {
                handleLogout(); // Clear role and storage
                navigate("/login"); // Redirect to login page
              }}
            />
          </div>

          <Button className="addButton" onClick={handleAdd}>Add Product</Button>

          <Table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Barcode</th>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.image ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${product.image}`}
                          alt={product.name}
                          style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                        />
                      ) : "No Image"}
                    </td>
                    <td>{product.barcode}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.description}</td>
                    <td>{`₱${Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="action-buttons">
                        <Button className="editButton" onClick={() => handleEdit(product)}>
                          <RiEdit2Fill />
                        </Button>
                        <Button className="deleteButton" onClick={() => handleDelete(product.id)}>
                          <RiDeleteBin5Fill />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No products found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <ProductForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        isEdit={isEdit}
        selectedProduct={selectedProduct}
        onProductSaved={handleProductSaved}
      />

      <DeletePrompt
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        confirmDelete={confirmDelete}
      />
    </>
  );
}
