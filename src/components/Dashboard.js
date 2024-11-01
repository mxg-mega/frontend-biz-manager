import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { formatCurrency } from '../lib/utils';

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

    // Fetch daily sales data
    api.get('/sales/daily')
      .then((response) => {
        setDailySales(response.data.totalSales);
      })
      .catch((error) => {
        console.error("Error fetching daily sales:", error);
      });

    // Fetch daily profit data
    api.get('/sales/profit')
      .then((response) => {
        setDailyProfit(response.data.totalProfit);
      })
      .catch((error) => {
        console.error("Error fetching daily profit:", error);
      });

    // Fetch monthly sales and profit data for the chart
    api.get('/sales/monthly')
      .then((response) => {
        const formattedMonthlyData = response.data.map((item) => ({
          month: item.month,
          sales: item.totalSales,
          profit: item.totalProfit,
        }));
        setMonthlyData(formattedMonthlyData);
      })
      .catch((error) => {
        console.error("Error fetching monthly data:", error);
      });
  }, []);

  return (
    <div className="dashboard">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

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
            <p className="text-3xl font-bold">{formatCurrency(dailySales)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(dailyProfit)}</p>
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
