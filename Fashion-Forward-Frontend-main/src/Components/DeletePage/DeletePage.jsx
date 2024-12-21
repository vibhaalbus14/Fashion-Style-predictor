import React, { useEffect, useState } from 'react';
import './DeletePage.css';

const DeletePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const token = localStorage.getItem("access_token");


  // Fetching products from the backend (simulated here)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the backend API
        const response = await fetch('http://localhost:8000/get_product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({}), // Empty request body
        });

        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns an array of products under the 'products' key
          setProducts(data.products || []);
        } else {
          console.error('Failed to fetch products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowDeleteConfirmation(true);  // Show the delete confirmation when a product is selected
  };

  // Handle product deletion (API call)
  const handleDelete = async () => {
    if (!selectedProduct) return;

    const token = localStorage.getItem("access_token");

    // Make the API call to delete the product
    try {
      const response = await fetch(`http://localhost:8000/delete_product?id=${selectedProduct.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Product deleted:', data);

        // Show success prompt
        alert('Product deleted successfully');

        // Remove the deleted product from the local state
        setProducts(products.filter(product => product.id !== selectedProduct.id));
      } else {
        const errorData = await response.json();
        console.error('Error deleting product:', errorData);
        alert('Failed to delete the product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the product');
    }

    // Hide the delete confirmation and reset selected product
    setShowDeleteConfirmation(false);
    setSelectedProduct(null);
  };


  return (
    <div className="delete-page-container">
      <h1>Delete Product</h1>

      {/* Display list of products */}
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card" onClick={() => handleProductSelect(product)}>
            <img src={`http://localhost:8000${product.image_url}`} alt={product.description} className="product-image" />
            <div className="product-info">
              <p>{product.description}</p>
              <p><strong>Price:</strong> {product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show delete confirmation */}
      {showDeleteConfirmation && selectedProduct && (
        <div className="delete-confirmation">
          <h3>Are you sure you want to delete this product?</h3>
          <button onClick={handleDelete} className="delete-button">Delete</button>
          <button onClick={() => setShowDeleteConfirmation(false)} className="cancel-button">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DeletePage;
