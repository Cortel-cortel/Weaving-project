import React, { useState, useEffect } from "react";
import axios from "axios";
import DeletePrompt from "../Component/DeletePrompt";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { RiEdit2Fill, RiDeleteBin5Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard({ handleLogout }) {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    barcode: "",
    category: "",
    description: "",
    details: "",
    trivia: "",
    price: "",
    stock: "",
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      const productsWithImages = response.data.data.map((p) => ({
        ...p,
        images: p.images
          ? p.images.map((img) => `http://127.0.0.1:8000/storage/${img}`)
          : [],
      }));
      setProducts(productsWithImages);
      setFilteredProducts(productsWithImages);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  useEffect(() => {
    if (!filterCategory) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === filterCategory));
    }
  }, [filterCategory, products]);

  const generateBarcode = () =>
    "BC" + Math.floor(100000 + Math.random() * 900000);

  // Open add modal
  const openAddModal = () => {
    setIsEditing(false);
    setProductData({
      name: "",
      barcode: generateBarcode(),
      category: "",
      description: "",
      details: "",
      trivia: "",
      price: "",
      stock: "",
      images: [],
    });
    setNewImages([]);
    setNewPreviews([]);
    setExistingImages([]);
    setShowProductModal(true);
  };

  // Open edit modal
  const openEditModal = (product) => {
    setIsEditing(true);
    setProductData({ ...product });
    setNewImages([]);
    setNewPreviews([]);
    setExistingImages(product.images || []);
    setShowProductModal(true);
  };

  // Handle input changes
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle new image uploads
  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setNewPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Save product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let savedProduct;

      if (isEditing) {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/products/${productData.id}`,
          {
            name: productData.name,
            barcode: productData.barcode,
            category: productData.category,
            description: productData.description,
            details: productData.details,
            trivia: productData.trivia,
            price: productData.price,
            stock: productData.stock,
          }
        );
        savedProduct = response.data.data;
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/products",
          {
            name: productData.name,
            barcode: productData.barcode,
            category: productData.category,
            description: productData.description,
            details: productData.details,
            trivia: productData.trivia,
            price: productData.price,
            stock: productData.stock,
          }
        );
        savedProduct = response.data.data;
      }

      // Upload new images
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((img) => formData.append("images[]", img));
        await axios.post(
          `http://127.0.0.1:8000/api/products/${savedProduct.id}/images`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      fetchProducts();
      setShowProductModal(false);
      setNewImages([]);
      setNewPreviews([]);
      setExistingImages([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save product.");
    }
  };

  // Delete product
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${selectedId}`);
      fetchProducts();
    } catch {
      setError("Failed to delete product.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="loadingScreen">Loading...</div>;
  if (error) return <div className="errorScreen">{error}</div>;

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "15px 30px",
          backgroundColor: "#343a40",
          color: "#fff",
        }}
      >
        <h2>Admin Dashboard</h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button variant="light" onClick={() => navigate("/manage-orders")}>
            Manage Orders
          </Button>
          <Button variant="light" onClick={() => navigate("/donations")}>
            Manage Donations
          </Button>
          <FiLogOut
            size={24}
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleLogout();
              navigate("/login");
            }}
          />
        </div>
      </nav>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h5>Total Products: {products.length}</h5>
          <h6>
            Total Stock:{" "}
            {products.reduce((sum, product) => sum + product.stock, 0)}
          </h6>
        </div>

        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <Form.Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">-- All Categories --</option>
            <option value="Cordillera Inabel">Cordillera Inabel</option>
            <option value="Kalinga Weaving">Kalinga Weaving</option>
            <option value="Ikat">Ikat</option>
          </Form.Select>
          <Button
            variant="primary"
            onClick={openAddModal}
            style={{ minWidth: "150px" }}
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="view" style={{ padding: "20px" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Images</th>
              <th>Barcode</th>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Details</th>
              <th>Trivia</th>
              <th>Price</th>
              <th>Stock</th>
              <th style={{ width: "120px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.images &&
                    product.images.filter((img) => img && img.trim() !== "")
                      .length > 0 ? (
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {product.images
                          .filter((img) => img && img.trim() !== "")
                          .map((img, idx) => (
                            <img
                              key={idx}
                              src={`${img}?t=${new Date().getTime()}`}
                              alt={product.name}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                            />
                          ))}
                      </div>
                    ) : (
                      <img
                        src="/images/no-image.jpg"
                        alt="No Image"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    )}
                  </td>
                  <td>{product.barcode}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.description}</td>
                  <td>{product.details}</td>
                  <td>{product.trivia}</td>
                  <td>
                    ₱
                    {Number(product.price).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(product)}
                      >
                        <RiEdit2Fill />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <RiDeleteBin5Fill />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePrompt
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        confirmDelete={confirmDelete}
      />

      {/* Add/Edit Modal */}
      <Modal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Product" : "Add New Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProductSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Barcode</Form.Label>
                  <Form.Control
                    type="text"
                    name="barcode"
                    value={productData.barcode}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={productData.category}
                    onChange={handleProductChange}
                    required
                  >
                    <option value="">-- Select Category --</option>
                    <option value="Cordillera Inabel">Cordillera Inabel</option>
                    <option value="Kalinga Weaving">Kalinga Weaving</option>
                    <option value="Ikat">Ikat</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price (₱)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={productData.price}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={productData.stock}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Images</Form.Label>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <Button
                      variant="secondary"
                      onClick={() => document.getElementById("imageUpload").click()}
                    >
                      + Add Images
                    </Button>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleNewImagesChange}
                    />

                    {existingImages.length > 0 &&
                      existingImages.map((img, idx) => (
                        <div
                          key={idx}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                          <img
                            src={img}
                            alt={`Existing ${idx}`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              marginBottom: "5px",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              setExistingImages((prev) => prev.filter((_, i) => i !== idx))
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      ))}

                    {newPreviews.length > 0 &&
                      newPreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                          <img
                            src={preview}
                            alt={`Preview ${idx}`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                              marginBottom: "5px",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
                              setNewImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={productData.description}
                onChange={handleProductChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="details"
                value={productData.details}
                onChange={handleProductChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trivia</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="trivia"
                value={productData.trivia}
                onChange={handleProductChange}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowProductModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="ms-2">
                {isEditing ? "Update Product" : "Save Product"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
