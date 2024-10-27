import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";

const generateMonthlyData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('default', { month: 'short' }),
    revenue: Math.floor(Math.random() * 20000) + 10000,
    expenses: Math.floor(Math.random() * 15000) + 5000,
    profit: Math.floor(Math.random() * 10000),
  }));
};

const generateDailyData = () => {
  return {
    revenue: Math.floor(Math.random() * 2000) + 500,
    expenses: Math.floor(Math.random() * 1500) + 300,
    profit: Math.floor(Math.random() * 1000) + 100,
  };
};

const ProfitLossSummary = () => {
  const [timeFrame, setTimeFrame] = useState('yearly');
  const [financialData] = useState(generateMonthlyData());
  const [dailyData] = useState(generateDailyData());

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
                <p className="text-2xl font-bold">${dailyData.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold">${dailyData.expenses.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit</p>
                <p className="text-2xl font-bold">${dailyData.profit.toLocaleString()}</p>
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
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">${totalProfit.toLocaleString()}</p>
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