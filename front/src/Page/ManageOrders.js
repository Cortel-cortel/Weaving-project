// src/Page/ManageOrders.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("token");

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to fetch orders. Make sure the backend is running and you're logged in."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Delete order
  const handleDelete = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/orders/${selectedOrderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to delete order.");
    }
  };

  // Update order status
  const openUpdateModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "Pending");
    setShowUpdateModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/orders/${selectedOrder.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      setShowUpdateModal(false);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update order."
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Orders</h2>

      {loading && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <Spinner animation="border" size="sm" /> Loading orders...
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search & Filter */}
      <div className="d-flex gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="Search by user name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Form.Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </Form.Select>
        <Button
          variant="secondary"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("");
          }}
        >
          Reset
        </Button>
      </div>

      {/* Orders Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Products</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th style={{ width: "160px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_name} ({order.user_email})</td>
                <td>
                  {order.items?.map(
                    (item) => `${item.product_name} x${item.quantity}`
                  ).join(", ")}
                </td>
                <td>
                  ₱{Number(order.total)?.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at)?.toLocaleString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => openUpdateModal(order)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(order.id)}
                    >
                      <RiDeleteBin5Fill />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No orders to display
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Status Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateStatus}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="ms-2">
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
