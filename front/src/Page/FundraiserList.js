import React, { useState } from "react";
import { Card, Button, Modal, Form, Row, Col } from "react-bootstrap";

const fundraiserList = [
  { id: 1, name: "Kalinga Weaving Project", description: "Support local Kalinga artisans and preserve their cultural weaving techniques. Your donation helps buy materials, maintain workshops, and support the weavers' livelihoods.", image: "/images/fundraiser1.jpg" },
  { id: 2, name: "Cordillera Youth Group", description: "Empower young leaders with skills training, mentorship, and community programs to create a better future. Donations fund educational workshops and leadership camps.", image: "/images/fundraiser2.jpg" },
  { id: 3, name: "Ikat Preservation", description: "Preserve traditional Ikat weaving techniques while supporting local artisans. Contributions provide threads, looms, and market access for artisans to thrive.", image: "/images/fundraiser3.jpg" },
  { id: 4, name: "Local Handicraft Support", description: "Help communities sustain traditional crafts and generate livelihoods. Donations help with workshops, marketing, and raw materials.", image: "/images/fundraiser4.jpg" },
  { id: 5, name: "Community Learning Center", description: "Support education initiatives in the region, including after-school programs, literacy workshops, and community libraries. Donations provide resources for children and adults.", image: "/images/fundraiser5.jpg" },
  { id: 6, name: "Sustainable Farming Project", description: "Promote eco-friendly agricultural practices and community farming. Your support funds training, seeds, and sustainable tools.", image: "/images/fundraiser6.jpg" },
  { id: 7, name: "Cultural Festival", description: "Fund local festivals celebrating heritage and arts. Contributions go to organizing events, performances, and cultural exhibitions.", image: "/images/fundraiser7.jpg" },
  { id: 8, name: "Mountain Clean-Up", description: "Support environmental conservation and local community projects. Donations fund cleanup drives, equipment, and educational campaigns.", image: "/images/fundraiser8.jpg" },
  { id: 9, name: "Youth Coding Program", description: "Teach coding skills to youth in rural areas. Donations provide computers, software, and mentoring programs.", image: "/images/fundraiser9.jpg" },
  { id: 10, name: "Traditional Music Preservation", description: "Support local musicians and preserve traditional music forms. Contributions help fund workshops, instruments, and performances.", image: "/images/fundraiser10.jpg" },
];

export default function FundraiserList() {
  const [selectedId, setSelectedId] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [donorData, setDonorData] = useState({ name: "", email: "", contact: "", amount: "", message: "" });

  const selectedFundraiser = fundraiserList.find(f => f.id === selectedId);

  const handleInputChange = (e) => {
    setDonorData({ ...donorData, [e.target.name]: e.target.value });
  };

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    console.log("Donation Submitted:", donorData);
    setThankYouVisible(true);
    setDonorData({ name: "", email: "", contact: "", amount: "", message: "" });
  };

  const handleShare = async () => {
    if (!selectedFundraiser) return;

    const shareData = {
      title: selectedFundraiser.name,
      text: `Check out this fundraiser: ${selectedFundraiser.name}\n\n${selectedFundraiser.description}`,
      url: window.location.href,
    };

    const messageWithImage = `${shareData.text}\n\nImage: ${window.location.origin}${selectedFundraiser.image}`;

    if (navigator.share) {
      try {
        await navigator.share({ ...shareData, text: messageWithImage });
      } catch (err) {
        console.error("Share failed:", err.message);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.url}\n${messageWithImage}`);
      alert("Link copied to clipboard!");
    }
  };

  const cardStyle = (fundraiser) => ({
    width: "250px",
    height: "300px",
    cursor: "pointer",
    filter: selectedId && selectedId !== fundraiser.id ? "blur(4px)" : "none",
    transition: "all 0.3s",
    zIndex: 1,
  });

  return (
    <div>
      {/* Section Title */}
      <h2 style={{ textAlign: "center", marginTop: "60px", marginBottom: "20px" }}>
        Support Our Fundraisers
      </h2>

      {/* Fundraiser Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", padding: "30px" }}>
        {fundraiserList.map(fundraiser => (
          <Card
            key={fundraiser.id}
            style={cardStyle(fundraiser)}
            onClick={() => setSelectedId(fundraiser.id)}
          >
            <Card.Img
              variant="top"
              src={fundraiser.image}
              style={{
                height: "150px",
                objectFit: "cover",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            />
            <Card.Body>
              <Card.Title>{fundraiser.name}</Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Fundraiser Popup */}
      {selectedId && selectedFundraiser && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backdropFilter: "blur(5px)", zIndex: 998 }}></div>
          <div
            style={{
              position: "fixed",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "900px",
              height: "80%",
              backgroundColor: "#fff",
              zIndex: 999,
              borderRadius: "15px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* ✅ Close button moved inside popup but rendered above everything */}
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "1.8rem",
                fontWeight: "bold",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#333",
                zIndex: 1000,
              }}
              onClick={() => setSelectedId(null)}
              aria-label="Close"
            >
              ×
            </button>

            <img
              src={selectedFundraiser.image}
              alt={selectedFundraiser.name}
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
            <div style={{ padding: "20px", flexGrow: 1, overflowY: "auto" }}>
              <h3>{selectedFundraiser.name}</h3>
              <p style={{ lineHeight: "1.6" }}>{selectedFundraiser.description}</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <Button variant="danger" onClick={() => setShowDonateModal(true)}>Donate</Button>
                <Button variant="secondary" onClick={handleShare}>Share</Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Donate Modal */}
      <Modal show={showDonateModal} onHide={() => setShowDonateModal(false)} centered size="lg">
        <Modal.Header style={{ borderBottom: "none", position: "relative" }}>
          <Modal.Title>Donate to {selectedFundraiser?.name}</Modal.Title>
          <Button
            variant="light"
            onClick={() => setShowDonateModal(false)}
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              position: "absolute",
              top: "10px",
              right: "10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            ×
          </Button>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
          {!thankYouVisible ? (
            <Form onSubmit={handleDonateSubmit} style={{ width: "100%", maxWidth: "600px" }}>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={donorData.name} onChange={handleInputChange} required />
                </Col>
                <Col>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={donorData.email} onChange={handleInputChange} required />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control type="text" name="contact" value={donorData.contact} onChange={handleInputChange} required />
                </Col>
                <Col>
                  <Form.Label>Amount (₱)</Form.Label>
                  <Form.Control type="number" name="amount" value={donorData.amount} onChange={handleInputChange} min="1" required />
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Message (Optional)</Form.Label>
                <Form.Control as="textarea" name="message" value={donorData.message} onChange={handleInputChange} rows={3} />
              </Form.Group>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button type="submit" variant="success">Donate</Button>
              </div>
            </Form>
          ) : (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <h4>Thank you for your donation!</h4>
              <p>Your support helps sustain the fundraiser and empower communities.</p>
              <Button
                variant="primary"
                onClick={() => {
                  setThankYouVisible(false);
                  setShowDonateModal(false);
                  setSelectedId(null);
                }}
              >
                Close
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
