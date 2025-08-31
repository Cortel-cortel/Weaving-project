import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductForm from "../components/ProductForm";

export default function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${productId}`);
        const product = response.data.data;

        // Transform images for preview
        product.images = product.images?.length
          ? product.images.map((img) => `http://127.0.0.1:8000/storage/${img}`)
          : [];

        setProductData(product);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch product.");
      }
    };
    fetchProduct();
  }, [productId]);

  if (!productData) return <div>Loading...</div>;

  return <ProductForm productData={productData} onSubmitSuccess={() => navigate("/dashboard")} />;
}
