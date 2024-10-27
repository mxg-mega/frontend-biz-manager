import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Hash, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import api from '../api';



const ProductRegistration = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    quantity: '',
    category: '',
  });

  useEffect(() => {
    // Fetch the total products and categories from your backend
    api.get('/products/summary') 
      .then((response) => {
        setTotalProducts(response.data.totalProducts);
        setTotalCategories(response.data.totalCategories);
      })
      .catch((error) => {
        console.error('Error fetching inventory summary:', error);
      });
  }, []);
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setProduct({ ...product, category: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the product data to your backend
    console.log('Product submitted:', product);
    
    api.post('/products', product)
    .then((response) => {
      // Here you would typically send the product data to your backend
      console.log('Product added:', response.data);
      // Reset form after submission
      setProduct({ name: '', description: '', price: '', cost_price: '', quantity: '', category: '' });
    })
    .catch((error) => {
      console.error("Error adding product:", error);
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Sale Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={product.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                      id="cost_price"
                      name="cost_price"
                      type="number"
                      value={product.cost_price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <div className="relative">
                  <Hash className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={product.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={handleCategoryChange} value={product.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2" />
              Inventory Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-bold">{totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>


        <div className="mt-6">
          <Button type="submit" className="w-full">Add Product</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductRegistration;