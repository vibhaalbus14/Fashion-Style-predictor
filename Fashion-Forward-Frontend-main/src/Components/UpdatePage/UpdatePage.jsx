import React, { useEffect, useState } from 'react';
import Form from './Form';
import './UpdatePage.css';

const UpdatePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [colors, setColors] = useState([]);
  const [shopNames, setShopNames] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedShopName, setSelectedShopName] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const token = localStorage.getItem("access_token");

  // Fetch the color and shop data only once (on initial load)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch colors list
        const colorResponse = await fetch('http://localhost:8000/get_colour_names', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (colorResponse.ok) {
          const colorData = await colorResponse.json();
          setColors(Object.keys(colorData)); // Extract keys (color names) from the object
        } else {
          console.error('Failed to fetch colors:', colorResponse.statusText);
        }

        // Fetch shop names list
        const shopResponse = await fetch('http://localhost:8000/get_brandNames', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (shopResponse.ok) {
          const shopData = await shopResponse.json();
          setShopNames(Object.keys(shopData)); // Extract keys (shop names) from the object
        } else {
          console.error('Failed to fetch shop names:', shopResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);


  // Fetching products from the backend (simulated here)
  const fetchFilteredProducts = async () => {
    // Dynamically build the request body, including only the filters that are selected
    let requestBody = {};  // Use 'let' here instead of 'const'

    if (selectedColor) {
      requestBody.color = selectedColor;
    }
    if (selectedGender) {
      requestBody.gender = selectedGender;
    }
    if (selectedShopName) {
      requestBody.brandName = selectedShopName;
    }

    // If no filters are selected, send an empty request body
    if (!selectedColor && !selectedGender && !selectedShopName) {
      requestBody = {}; // Empty body for fetching all products
    }

    console.log('Request Body:', requestBody);

    try {
      const response = await fetch('http://localhost:8000/get_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody), // Sending the selected filters or an empty body
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        console.log('Filtered Products:', data); // Debugging log
        console.log(setProducts)
        console.log(setProducts.length)

      } else {
        console.error('Failed to fetch filtered products:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  // Trigger fetchFilteredProducts when any filter changes or on initial load
  useEffect(() => {
    fetchFilteredProducts(); // Fetch filtered products based on selected filters
  }, [selectedColor, selectedShopName, selectedGender]); // Trigger when filters change

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowForm(true);  // Show the form when a product is selected
  };

  return (
    <div className="update-page-container">
      <h1>Update Product</h1>
      <div className="filters-container">
        <div className="filter">
          <label>Color</label>
          <select onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
            <option value="">All</option>
            {colors.length > 0 ? (
              colors.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))
            ) : (
              <option disabled>No colors available</option>
            )}
          </select>
        </div>

        <div className="filter">
          <label>Brand Name</label>
          <select onChange={(e) => setSelectedShopName(e.target.value)} value={selectedShopName}>
            <option value="">All</option>
            {shopNames.length > 0 ? (
              shopNames.map((shopName, index) => (
                <option key={index} value={shopName}>
                  {shopName}
                </option>
              ))
            ) : (
              <option disabled>No brand available</option>
            )}
          </select>
        </div>

        <div className="filter">
          <label>Gender</label>
          <select onChange={(e) => setSelectedGender(e.target.value)} value={selectedGender}>
            <option value="">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
      </div>

      
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

      {/* Show Form Component if product is selected */}
      {showForm && selectedProduct && (
        <Form selectedProduct={selectedProduct} setShowForm={setShowForm} />
      )}
    </div>
  );
};

export default UpdatePage;
