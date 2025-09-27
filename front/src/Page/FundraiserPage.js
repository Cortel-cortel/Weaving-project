import React, { useRef } from "react"; 
import { Carousel, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const fundraiserData = [
  { id: 1, name: "Kalinga Weaving Project", description: "Support local Kalinga artisans", image: "/images/fundraiser1.jpg" },
  { id: 2, name: "Cordillera Youth Group", description: "Empower young leaders in Cordillera", image: "/images/fundraiser2.jpg" },
  { id: 3, name: "Ikat Preservation", description: "Preserve traditional Ikat weaving techniques", image: "/images/fundraiser3.jpg" },
  { id: 4, name: "Local Handicraft Support", description: "Help local communities sustain traditional crafts", image: "/images/fundraiser4.jpg" },
  { id: 5, name: "Community Learning Center", description: "Support education initiatives in the region", image: "/images/fundraiser5.jpg" },
  { id: 6, name: "Sustainable Farming Project", description: "Promote eco-friendly agricultural practices", image: "/images/fundraiser6.jpg" },
];

export default function FundraiserPage() {
  const descriptionRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: "80px" }}>
      <Carousel interval={3000} controls indicators>
        <Carousel.Item>
          <img src="/images/fundraiser-banner1.jpg" className="d-block w-100" alt="Banner 1" style={{ maxHeight: "500px", objectFit: "cover" }} />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/images/fundraiser-banner2.jpg" className="d-block w-100" alt="Banner 2" style={{ maxHeight: "500px", objectFit: "cover" }} />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/images/fundraiser-banner3.jpg" className="d-block w-100" alt="Banner 3" style={{ maxHeight: "500px", objectFit: "cover" }} />
        </Carousel.Item>
      </Carousel>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", margin: "30px 0" }}>
        <Button
          style={{ backgroundColor: "#b71c1c", borderColor: "#b71c1c", fontWeight: "bold", padding: "10px 25px", borderRadius: "8px" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#8b1414")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#b71c1c")}
          onClick={() => navigate("/fundraiser-list")}
        >
          View All Fundraisers
        </Button>

        <Button
          style={{ backgroundColor: "#ff6666", borderColor: "#ff6666", fontWeight: "bold", padding: "10px 25px", borderRadius: "8px" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e65555")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff6666")}
          onClick={() => descriptionRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          Discover
        </Button>
      </div>

      <div ref={descriptionRef} style={{ padding: "50px 20px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Support Our Fundraisers</h2>
        <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.6", maxWidth: "800px", margin: "0 auto" }}>
          Our fundraisers aim to help artisans, communities, and local projects thrive. Browse through the initiatives, learn about their missions,
          and contribute to support cultural preservation, community development, and sustainable livelihoods.
        </p>
      </div>

      <Carousel interval={3000} controls indicators={false}>
        {fundraiserData.reduce((acc, _, index, array) => {
          if (index % 3 === 0) acc.push(array.slice(index, index + 3));
          return acc;
        }, []).map((slideCards, slideIndex) => (
          <Carousel.Item key={slideIndex}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "20px 0" }}>
              {slideCards.map((fundraiser) => (
                <Card
                  key={fundraiser.id}
                  style={{ width: "300px", height: "320px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", cursor: "pointer" }}
                  onClick={() => navigate(`/fundraiser/${fundraiser.id}`)}
                >
                  <Card.Img
                    variant="top"
                    src={fundraiser.image}
                    style={{ height: "200px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
                  />
                  <Card.Body>
                    <Card.Title>{fundraiser.name}</Card.Title>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#fff" }}>
        <h3 style={{ fontWeight: "bold", marginBottom: "15px" }}>Why Your Support Matters</h3>
        <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.6", maxWidth: "850px", margin: "0 auto" }}>
          Every donation contributes directly to projects that uplift communities, safeguard indigenous traditions, and empower future generations. 
          Whether it’s funding weaving initiatives, building learning centers, or supporting sustainable farming, your contribution creates long-lasting impact.
        </p>
      </div>

      <footer style={{ backgroundColor: "#333", color: "#fff", padding: "30px 20px", marginTop: "40px", textAlign: "center" }}>
        <p style={{ margin: "0", fontSize: "0.95rem" }}>
          © {new Date().getFullYear()} Cordillera Fundraisers. All Rights Reserved.
        </p>
        <p style={{ margin: "5px 0 0", fontSize: "0.85rem", color: "#ccc" }}>
          Preserving heritage • Supporting communities • Building a sustainable future
        </p>
      </footer>
    </div>
  );
}
