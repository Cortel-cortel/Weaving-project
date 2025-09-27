import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

export default function Filter({
  onSearch = () => {}, 
  categories = [], 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategories((prevState) =>
      prevState.includes(category)
        ? prevState.filter((item) => item !== category)
        : [...prevState, category]
    );
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // digits only
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // digits only
    setMaxPrice(value);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    onSearch("", [], "", ""); // reset all filters
  };

  useEffect(() => {
    onSearch(searchTerm, selectedCategories, minPrice, maxPrice);
  }, [searchTerm, selectedCategories, minPrice, maxPrice, onSearch]);

  return (
    <div className="filter">
      <h3>Search and Filter</h3>

      {/* Search Input */}
      <Form.Group className="filter-item">
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form.Group>

      <hr />

      <div className="filter-item mt-4">
        <h5>Categories</h5>
        <div className="category-list">
          {categories.length > 0 ? (
            [...categories]
              .sort((a, b) => a.localeCompare(b)) // safe sorting
              .map((category) => (
                <Form.Check
                  key={category}
                  type="checkbox"
                  value={category}
                  label={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                  inline
                />
              ))
          ) : (
            <p className="text-muted">No categories available.</p>
          )}
        </div>
      </div>

      <hr />

      {/* Price Range */}
      <div className="filter-item mt-4">
        <h5>Price Range</h5>
        <Row>
          <Col>
            <Form.Control
              className="filter-input"
              type="number"
              placeholder="₱ MIN"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </Col>
          <Col xs="auto" className="d-flex align-items-center">
            <span>-</span>
          </Col>
          <Col>
            <Form.Control
              className="filter-input"
              type="number"
              placeholder="₱ MAX"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </Col>
        </Row>
      </div>

      <hr />

      {/* Clear All Filters */}
      <Button variant="secondary" onClick={clearAllFilters}>
        Clear All Filters
      </Button>
    </div>
  );
}
