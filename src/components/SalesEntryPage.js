import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, ShoppingCart, Search, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { formatCurrency } from '../lib/utils';

const SalesEntryPage = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  const profit = total - totalCost;

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems: cart,
        total: total,
        profit: profit
      }
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Sale</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Product list card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="mb-2">{formatCurrency(product.price.toFixed(2))}</p>
                    <Button onClick={() => addToCart(product)} className="w-full">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cart card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2" />
              Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p>{formatCurrency(item.price.toFixed(2))}</p>
                </div>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus size={16} />
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(total.toFixed(2))}</span>
              </div>
              <div className="flex justify-between mb-2 font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total.toFixed(2))}</span>
              </div>
              <div className="flex justify-between mb-2 text-green-600">
                <span>Profit:</span>
                <span>{formatCurrency(profit.toFixed(2))}</span>
              </div>
            </div>
            <Button onClick={handleProceedToCheckout} className="w-full mt-4" disabled={cart.length === 0}>
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesEntryPage;
