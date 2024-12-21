import React, { useState } from 'react';
import './Form.css';

const Form = ({ selectedProduct, setShowForm }) => {
  const [formData, setFormData] = useState({
    description: selectedProduct.description || '',
    color: selectedProduct.color || '',
    shopName: selectedProduct.shopName || '',
    gender: selectedProduct.gender || '',
    category: selectedProduct.category || '',
    price: selectedProduct.price || '',
  });
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("access_token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('id', selectedProduct.id);
    if (formData.color) formDataToSend.append('color', formData.color);
    if (formData.gender) formDataToSend.append('gender', formData.gender);
    if (formData.shopName) formDataToSend.append('brandName', formData.shopName);
    if (formData.category) formDataToSend.append('category', formData.category);
    if (formData.description) formDataToSend.append('description', formData.description);
    if (formData.price) formDataToSend.append('price', formData.price);
    if (file) formDataToSend.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/update_product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Product Updated Successfully");
        setShowForm(false);
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Product Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Description (optional):</label>
            <textarea
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Color (optional):</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Brand Name (optional):</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Gender (optional):</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-field">
            <label>Category Name (optional):</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Price (optional):</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Upload Image (optional):</label>
            <input type="file" name="file" onChange={handleFileChange} />
          </div>

          <button type="submit">Update Product</button>
        </form>
        <button className="close-modal" onClick={() => setShowForm(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Form;
