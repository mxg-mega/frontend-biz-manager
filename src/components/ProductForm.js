import React, { useState } from 'react';
import api from '../api';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    quantity: '',
    category: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send POST request to add a new product
    api.post('/products', formData)
      .then((response) => {
        console.log(response.data); // Log the response data
        alert('Product added successfully!');
      })
      .catch((error) => {
        console.error('Error adding product:', error.response.data); // Log the error response
        alert('Failed to add product.');
      });
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a New Product</h2>
      <div>
        <label>Name: </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description: </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Price: </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Cost Price: </label>
        <input
          type="number"
          name="cost_price"
          value={formData.cost_price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Quantity: </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Category: </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
