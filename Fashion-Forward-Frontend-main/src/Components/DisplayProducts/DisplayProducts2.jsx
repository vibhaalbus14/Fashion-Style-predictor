import React, { useEffect, useState } from 'react';
import './DisplayProducts.css';
import { useLocation } from 'react-router-dom';

const DisplayProducts = () => {
  const location = useLocation();

  // State to hold the fetched products
  const [products, setProducts] = useState([]);
  const { abc } = location.state || {}; // Retrieve passed data

  // Ensure abc is an array before using map
  const productList = Array.isArray(abc) ? abc : []; // Fallback to empty array if abc is not an array

  
  return (
    <div className="display-products-container">
      <h1>Products Available</h1>

      <div className="products-container">
        {productList.length > 0 ? (
          productList.map((product) => (
            <div key={product.id} className="product-card">
              <img src={`http://localhost:8000${product.image_url}`} alt={product.description} className="product-image" />
              <div className="product-info">
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price}</p>

              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default DisplayProducts;
