import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { formatCurrency } from '../lib/utils';
import api from '../api';

const ProfitLossSummary = () => {
  const [timeFrame, setTimeFrame] = useState('yearly');
  const [financialData, setFinancialData] = useState([]); // Monthly data
  const [dailyData, setDailyData] = useState({ revenue: 0, expenses: 0, profit: 0 });

  useEffect(() => {
    // Fetch monthly financial data for the chart
    api.get('/sales/monthly')
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          month: item.month,
          revenue: item.totalSales,
          expenses: item.totalCost,
          profit: item.totalProfit,
        }));
        setFinancialData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching monthly financial data:", error);
      });

    // Fetch daily financial data
    api.get('/sales/daily')
      .then((response) => {
        setDailyData({
          revenue: response.data.totalSales,
          expenses: response.data.totalCost,  // Adjust based on your API response
          profit: response.data.totalProfit,
        });
      })
      .catch((error) => {
        console.error("Error fetching daily financial data:", error);
      });
  }, []);

  // Calculate total revenue, expenses, and profit for the selected timeframe
  const totalRevenue = financialData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = financialData.reduce((sum, data) => sum + data.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profit/Loss Summary</h1>
      
      <div className="mb-6">
        <Select onValueChange={(value) => setTimeFrame(value)} defaultValue={timeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(dailyData.revenue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(dailyData.expenses)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(dailyData.profit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">{timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Financial Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="#ffc658" name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitLossSummary;
