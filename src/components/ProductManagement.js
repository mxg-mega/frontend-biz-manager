import React from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const ProductManagement = () => {
  return (
    <div className="product-management">
      <h1>Product Management</h1>
      <ProductForm />
      <ProductList />
    </div>
  );
};

export default ProductManagement;
