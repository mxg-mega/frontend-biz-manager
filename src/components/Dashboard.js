import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [dailySales, setDailySales] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Fetch products and update total products count
    api.get('/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    // Fetch sales and update daily sales and profit (mocked data for now)
    setDailySales(500);  // Replace with actual data from API
    setDailyProfit(150);  // Replace with actual data from API

    // Mocked monthly data (replace with API data)
    setMonthlyData([
      { month: 'Jan', sales: 10000, profit: 4000 },
      { month: 'Feb', sales: 8000, profit: 3000 },
      { month: 'Mar', sales: 12000, profit: 5000 },
      // Add more months...
    ]);
  }, []);

  return (
    <div className="dashboard">
      <h1 className="text-3xl font-bold mb-6">Hello and Welcome to the Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${dailySales}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${dailyProfit}</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Chart */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
                <Bar dataKey="profit" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
