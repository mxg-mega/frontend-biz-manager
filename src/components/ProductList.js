import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import api from '../api';



const ProductListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    api.delete(`/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Product Inventory</h1>

      {/* Inventory Overview */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Inventory Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'gray' }}>Total Products</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{products.length}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'gray' }}>Total Quantity</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {products.reduce((sum, product) => sum + product.quantity, 0)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'gray' }}>Total Value</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              ${products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Add New Product */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', width: '250px' }}>
          <Search style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'gray' }} />
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <Link to="/product-registration" style={{ padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add New Product
        </Link>
      </div>

      {/* Product List */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Price</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Quantity</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{product.name}</td>
                <td style={{ padding: '0.75rem' }}>{product.category}</td>
                <td style={{ padding: '0.75rem' }}>${product.price.toFixed(2)}</td>
                <td style={{ padding: '0.75rem' }}>{product.quantity}</td>
                <td style={{ padding: '0.75rem' }}>
                  <button style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListPage;
