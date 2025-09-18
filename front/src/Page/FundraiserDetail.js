import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel, Button, Form, Row, Col, Modal } from "react-bootstrap";

const fundraiserList = [
  { 
    id: 1, 
    name: "Kalinga Weaving Project", 
    description: `Support local Kalinga artisans and preserve their cultural weaving techniques. Your donation helps buy materials, maintain workshops, and support the weavers' livelihoods. The project also aims to document traditional patterns and teach younger generations the art of Kalinga weaving to ensure that these intricate designs are not lost over time.

By contributing, you help create sustainable income for the weavers, allowing them to continue their craft while fostering cultural pride in their communities. Funds are also used for marketing initiatives so that these handmade textiles reach wider audiences both locally and internationally.

Additionally, the project organizes exhibitions and cultural events to showcase the artistry of Kalinga weaving. This encourages cultural tourism and generates further opportunities for local artisans, strengthening the community’s identity and economy.`,
    images: ["/images/fundraiser1.jpg", "/images/fundraiser1_2.jpg"] 
  },
  { 
    id: 2, 
    name: "Cordillera Youth Group", 
    description: `Empower young leaders in the Cordillera region with skills training, mentorship, and community programs to create a better future. Donations fund educational workshops, leadership camps, and community engagement initiatives designed to develop confidence and civic responsibility.

The program emphasizes environmental stewardship and indigenous knowledge, helping youth contribute to preserving their cultural heritage and natural surroundings. Supporting this initiative ensures that Cordillera youth become capable leaders who can address challenges in their communities while promoting sustainable development.

Furthermore, participants are encouraged to organize local projects, advocate for social issues, and collaborate with neighboring communities. This holistic approach nurtures teamwork, innovation, and long-term positive impact on the Cordillera region.`,
    images: ["/images/fundraiser2.jpg", "/images/fundraiser2_2.jpg"] 
  },
  { 
    id: 3, 
    name: "Ikat Preservation", 
    description: `Preserve traditional Ikat weaving techniques while supporting local artisans in the Cordillera. Contributions provide threads, looms, and market access for artisans to thrive. This initiative emphasizes the importance of maintaining authentic cultural practices in an ever-modernizing world.

Funds also help organize workshops to teach younger generations the meticulous process of Ikat weaving, ensuring the transmission of knowledge and skill. Supporting this fundraiser safeguards a significant part of Cordillera heritage and promotes cultural pride among local communities.

The project additionally collaborates with designers and cultural institutions to create sustainable business opportunities. This approach not only preserves traditional craft but also allows artisans to adapt and succeed in modern markets.`,
    images: ["/images/fundraiser3.jpg", "/images/fundraiser3_2.jpg"] 
  },
  { 
    id: 4, 
    name: "Local Handicraft Support", 
    description: `Help Cordillera communities sustain traditional crafts and generate livelihoods. Donations contribute to workshops, marketing, and procurement of raw materials needed for artisans to continue their work.

The project helps artisans gain access to new markets, providing economic stability and the opportunity to showcase the unique craftsmanship of the Cordillera region. Your support ensures that these traditional skills remain viable and valued within the local economy.

Additionally, training programs are conducted to improve quality, innovation, and design adaptation. This encourages creativity while respecting heritage, allowing local handicrafts to thrive and reach broader audiences.`,
    images: ["/images/fundraiser4.jpg", "/images/fundraiser4_2.jpg"] 
  },
  { 
    id: 5, 
    name: "Community Learning Center", 
    description: `Support education initiatives in the Cordillera, including after-school programs, literacy workshops, and community libraries. Donations provide resources for children and adults, creating an inclusive learning environment that encourages curiosity and lifelong learning.

The center also runs cultural and environmental education programs, fostering awareness and pride in Cordillera heritage. Contributions help bridge educational gaps, empowering residents with skills and knowledge essential for personal and community growth.

Furthermore, the learning center organizes mentorship programs, community discussions, and skill-building workshops. These activities create networks of support and equip Cordillera residents to address local challenges effectively.`,
    images: ["/images/fundraiser5.jpg", "/images/fundraiser5_2.jpg"] 
  },
  { 
    id: 6, 
    name: "Sustainable Farming Project", 
    description: `Promote eco-friendly agricultural practices and community farming in the Cordillera region. Your support funds training, seeds, tools, and sustainable techniques that help farmers increase productivity while protecting the environment.

This project encourages local communities to practice food sovereignty and share knowledge on climate-resilient farming. By donating, you contribute to healthier communities, better crop yields, and the preservation of Cordillera’s rich natural resources for future generations.

Additionally, the initiative organizes workshops on organic farming, water management, and soil preservation. These programs aim to strengthen local economies, reduce environmental impact, and create models for sustainable agriculture in the Cordillera.`,
    images: ["/images/fundraiser6.jpg", "/images/fundraiser6_2.jpg"] 
  },
  // Fundraiser 7
  { 
    id: 7, 
    name: "Cordillera Cultural Festival", 
    description: `Celebrate the rich cultural heritage of the Cordillera region through festivals and traditional events. Contributions support local artists, performers, and organizers in maintaining authentic cultural expressions.

Funds are used to stage performances, exhibitions, and workshops that educate visitors and youth about Cordillera customs, music, and rituals. Supporting this initiative strengthens community bonds and promotes cultural tourism.

Additionally, the festival encourages youth participation, helping the next generation to engage with their heritage and become ambassadors of Cordillera culture. Your donations ensure these vibrant celebrations continue to thrive.`,
    images: ["/images/fundraiser7.jpg", "/images/fundraiser7_2.jpg"]
  },
  // Fundraiser 8
  { 
    id: 8, 
    name: "Mountain Conservation Project", 
    description: `Support environmental conservation efforts in the Cordillera mountains. Your donations fund reforestation, wildlife protection, and sustainable land management practices.

This initiative works with local communities to preserve natural resources, reduce soil erosion, and maintain biodiversity. By contributing, you help protect the fragile mountain ecosystem for future generations.

Workshops and community programs are conducted to educate residents and visitors about environmental stewardship. Supporting this project ensures the Cordillera mountains remain a source of pride and sustenance for local communities.`,
    images: ["/images/fundraiser8.jpg", "/images/fundraiser8_2.jpg"]
  },
  // Fundraiser 9
  { 
    id: 9, 
    name: "Indigenous Music Initiative", 
    description: `Preserve and promote traditional Cordillera music and instruments. Donations help fund music workshops, instrument making, and performances by local musicians.

The initiative also records and archives rare musical traditions to ensure they are not lost over time. Supporting this project gives artists a platform to share their culture locally and internationally.

By fostering musical education among youth, the program cultivates new talent while preserving the heritage and identity of Cordillera communities. Your contribution keeps these rhythms alive for generations to come.`,
    images: ["/images/fundraiser9.jpg", "/images/fundraiser9_2.jpg"]
  },
  // Fundraiser 10
  { 
    id: 10, 
    name: "Traditional Food Revival", 
    description: `Promote the preservation and appreciation of traditional Cordillera cuisine. Donations support cooking workshops, community kitchens, and cultural food events.

Funds also help document indigenous recipes and encourage local farmers to supply native ingredients. By supporting this project, you help sustain culinary heritage and community food culture.

The initiative fosters intergenerational knowledge transfer, ensuring that traditional food practices continue to be shared and celebrated. Your contribution strengthens both cultural identity and local economies.`,
    images: ["/images/fundraiser10.jpg", "/images/fundraiser10_2.jpg"]
  },
];

export default function FundraiserDetail() {
  const { fundraiserId } = useParams();
  const fundraiser = fundraiserList.find(f => f.id === parseInt(fundraiserId));
  const [showDonate, setShowDonate] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [donorData, setDonorData] = useState({ name: "", email: "", contact: "", amount: "", message: "" });

  if (!fundraiser) {
    return <div style={{ textAlign: "center", marginTop: "120px" }}>Fundraiser not found.</div>;
  }

  const handleInputChange = (e) => setDonorData({ ...donorData, [e.target.name]: e.target.value });

  const handleDonateSubmit = (e) => {
    e.preventDefault();
    console.log("Donation Submitted:", donorData);
    setThankYouVisible(true);
    setShowDonate(false);
    setDonorData({ name: "", email: "", contact: "", amount: "", message: "" });
  };

  const handleShare = async () => {
    const shareData = { title: fundraiser.name, text: `${fundraiser.name}\n\n${fundraiser.description}`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } 
      catch (err) { console.error("Share failed:", err.message); }
    } else {
      navigator.clipboard.writeText(`${shareData.url}\n${shareData.text}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div style={{ padding: "120px 20px 50px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.4rem", fontWeight: "bold", textAlign: "center", marginBottom: "30px" }}>
        {fundraiser.name}
      </h1>

      {/* Image Carousel */}
      <Carousel fade>
        {fundraiser.images.map((img, idx) => (
          <Carousel.Item key={idx}>
            <img src={img} alt={`${fundraiser.name} ${idx + 1}`} style={{ width: "100%", height: "450px", objectFit: "cover", borderRadius: "12px" }} />
          </Carousel.Item>
        ))}
      </Carousel>

      <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.6", marginTop: "25px" }}>
        {fundraiser.description}
      </p>

      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <Button variant="info" onClick={handleShare}>Share</Button>
        <Button variant="success" onClick={() => setShowDonate(true)}>Donate</Button>
      </div>

{/* Donation Modal */}
<Modal
  show={showDonate}
  onHide={() => {
    setShowDonate(false);
    setThankYouVisible(false); // Reset thank-you visibility when closing
  }}
  dialogClassName="donate-modal"
  centered
  style={{ marginTop: "25px" }}
>
  <Modal.Header closeButton>
    <Modal.Title>Donate to {fundraiser.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {!thankYouVisible ? (
      <Form onSubmit={(e) => {
        e.preventDefault();
        console.log("Donation Submitted:", donorData);
        setThankYouVisible(true);
        setDonorData({ name: "", email: "", contact: "", amount: "", message: "" });

        // Auto-close modal after 3 seconds
        setTimeout(() => {
          setShowDonate(false);
          setThankYouVisible(false);
        }, 3000);
      }}>
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
        <Button type="submit" variant="success" style={{ width: "100%" }}>Donate</Button>
      </Form>
    ) : (
      <div style={{ textAlign: "center", padding: "30px" }}>
        <h4>Thank you for your donation!</h4>
        <p>Your support helps sustain the fundraiser and empower communities.</p>
        <Button
          variant="primary"
          onClick={() => {
            setShowDonate(false);
            setThankYouVisible(false);
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
