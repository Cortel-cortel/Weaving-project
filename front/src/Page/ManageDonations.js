// src/Page/ManageDonations.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { FiLogOut } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import DeletePrompt from "../Component/DeletePrompt";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManageDonations({ handleLogout }) {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/donations");
        setDonations(response.data.data || []); // fallback to empty array
      } catch {
        setError("Failed to fetch donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Delete donation
  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/donations/${selectedId}`);
      setDonations(donations.filter((donation) => donation.id !== selectedId));
    } catch {
      setError("Failed to delete donation.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="loadingScreen">Loading...</div>;
  if (error) return <div className="errorScreen">{error}</div>;

  return (
    <>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 30px",
          backgroundColor: "#343a40",
          color: "#fff",
        }}
      >
        <h2 style={{ margin: 0 }}>Manage Donations</h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <Button variant="light" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
          <FiLogOut
            size={24}
            style={{ cursor: "pointer" }}
            title="Logout"
            onClick={() => {
              handleLogout();
              navigate("/login");
            }}
          />
        </div>
      </nav>

      {/* Donations Table */}
      <div className="view" style={{ padding: "20px" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Donor Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Fundraiser</th>
              <th>Message</th>
              <th>Date</th>
              <th style={{ width: "100px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.id}</td>
                  <td>{donation.name}</td>
                  <td>{donation.email || "—"}</td>
                  <td>{donation.phone || "—"}</td>
                  <td>
                    {`₱${Number(donation.amount).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}`}
                  </td>
                  <td>{donation.fundraiser || "—"}</td>
                  <td>{donation.message || "—"}</td>
                  <td>
                    {donation.donated_at
                      ? new Date(donation.donated_at).toLocaleString("en-PH")
                      : "—"}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(donation.id)}
                    >
                      <RiDeleteBin5Fill />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No available donations.
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
    </>
  );
}
