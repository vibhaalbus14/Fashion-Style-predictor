import React, { useState } from "react";
import "./Form.css";

const Form = () => {
  const [formData, setFormData] = useState({
    color: '',
    shopName: '',
    gender: '',
    category: '',
    image: null,
    description: '',
    price: ''
  });

  const [errors, setErrors] = useState({
    color: '',
    shopName: '',
    gender: '',
    category: '',
    image: '',
    description: '',
    price: ''
  });

  const [responseMessage, setResponseMessage] = useState(""); // For success/error messages

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const validate = () => {
    let formErrors = {};
    let isValid = true;

    // Validate Color (required)
    if (!formData.color) {
      formErrors.color = 'Color is required.';
      isValid = false;
    }

    // Validate Shop Name (required)
    if (!formData.shopName) {
      formErrors.shopName = 'Shop name is required.';
      isValid = false;
    }

    // Validate Gender (required)
    if (!formData.gender) {
      formErrors.gender = 'Gender is required.';
      isValid = false;
    }

    // Validate Category (required)
    if (!formData.category) {
      formErrors.category = 'Category is required.';
      isValid = false;
    }

    // Validate Price (required and number)
    if (!formData.price || isNaN(formData.price)) {
      formErrors.price = 'Price must be a valid number.';
      isValid = false;
    }

    // Validate Image (type and size)
    if (!formData.image) {
      formErrors.image = 'Image is required.';
      isValid = false;
    } else {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(formData.image.type)) {
        formErrors.image = 'Only JPG, JPEG, and PNG formats are allowed.';
        isValid = false;
      } else if (formData.image.size > 5 * 1024 * 1024) { // 5MB size limit
        formErrors.image = 'Image size must be less than 5MB.';
        isValid = false;
      }
    }

    // Validate Description (required)
    if (!formData.description) {
      formErrors.description = 'Description is required.';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (validate()) {

      const token = localStorage.getItem("access_token"); // Replace with your actual token
      const url = "http://localhost:8000/create_product";

      // Prepare FormData for the API request
      const data = new FormData();
      data.append('color', formData.color);
      data.append('gender', formData.gender);
      data.append('brandName', formData.shopName);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('file', formData.image);
      // Log individual form data
      for (let [key, value] of data.entries()) {
        console.log(key + ": " + value);
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
          body: data,
        });
        console.log("Hi");

        if (response.ok) {
          const result = await response.json();
          alert("Product added successfully")
          console.log("Response:", result);
          // Reset form to its initial state
          setFormData({
            color: '',
            shopName: '',
            gender: '',
            category: '',
            image: null,
            description: '',
            price: ''
          });

          setErrors({}); // Clear errors
        } else {
          const error = await response.json();
          setResponseMessage(`Error: ${error.message}`);
          console.error("Error response:", error);
        }
      } catch (err) {
        setResponseMessage("An error occurred while adding the product.");
        console.error("Error:", err);
      }
    }
  };

  return (
    <div className="create-page-container">
      <h1>Create New Item</h1>
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="form-control"
          />
          {errors.color && <span className="error-text">{errors.color}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="shopName">Shop Name</label>
          <input
            type="text"
            id="shopName"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            className="form-control"
          />
          {errors.shopName && <span className="error-text">{errors.shopName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-control"
          />
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
          />
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="image">Image (JPG, JPEG, PNG - Max 5MB)</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="form-control"
          />
          {errors.image && <span className="error-text">{errors.image}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="4"
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default Form;
