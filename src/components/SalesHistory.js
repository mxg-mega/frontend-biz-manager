import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../api';
import { formatCurrency } from '../lib/utils';

const SalesHistoryPage = () => {
  const [dateRange, setDateRange] = useState('Today');
  const [filterCategory, setFilterCategory] = useState('All');
  const [salesData, setSalesData] = useState([]);


  useEffect(() => {
    fetchSalesData();
  }, [dateRange, filterCategory]);

  const fetchSalesData = () => {
    let startDate, endDate;
    const today = new Date();

    switch (dateRange) {
      case 'Today':
        startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        endDate = new Date(today.setHours(23, 59, 59, 999)).toISOString();
        break;
      case 'This Week':
        startDate = new Date(today.setDate(today.getDate() - today.getDay())).toISOString();
        endDate = new Date(today.setDate(today.getDate() + 6)).toISOString();
        break;
      case 'This Month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();
        break;
      case 'Last 3 Months':
        startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString();
        endDate = new Date().toISOString();
        break;
      case 'This Year':
        startDate = new Date(today.getFullYear(), 0, 1).toISOString();
        endDate = new Date(today.getFullYear(), 11, 31).toISOString();
        break;
      default:
        startDate = '';
        endDate = '';
    }

    api.get('/sales/report', { params: { start_date: startDate, end_date: endDate, business_id: localStorage.getItem('business_id') } })
      .then((response) => {
        let filteredData = response.data;
        if (filterCategory !== 'All') {
          filteredData = filteredData.filter(sale => sale.category === filterCategory);
        }
        console.log('Sales Data:', filteredData);
        setSalesData(filteredData);
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
      });
  };

  // Calculate total sales and average sales from the data
  const totalSales = salesData.reduce((sum, sale) => sum + (sale.total_price || 0), 0);
  const averageSales = salesData.length > 0 ? totalSales / salesData.length : 0;
  const totalProfit = salesData.reduce((sum, sale) => sum + (sale.profit || 0), 0);

  // Export function for Excel and PDF formats
  const handleExport = (format) => {
    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(salesData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SalesData');
      XLSX.writeFile(wb, 'sales_data.xlsx');
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Sales Data', 10, 10);
      const tableData = salesData.map(sale => [sale.date, sale.product_name, sale.quantity_sold, sale.total_price, sale.total_cost_price, sale.profit, sale.category, ]);
      doc.autoTable({
        head: [['Date', 'Products', 'Quantity Sold', 'Total Sales', 'Total Cost', 'Profit', 'Category', ]],
        body: tableData,
        startY: 20,
      });
      doc.save('sales_data.pdf');
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Sales History</h1>

      {/* Filter and export controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Calendar style={{ marginRight: '0.5rem' }} />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Filter style={{ marginRight: '0.5rem' }} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option>All</option>
            <option>electronics</option>
            <option>clothing</option>
            <option>appliances</option>
          </select>
        </div>
        <button
          onClick={() => handleExport('excel')}
          style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}
        >
          <Download style={{ marginRight: '0.5rem' }} />
          Export to Excel
        </button>
        <button
          onClick={() => handleExport('pdf')}
          style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          <Download style={{ marginRight: '0.5rem' }} />
          Export to PDF
        </button>
      </div>

      {/* Total Sales and Average Sales Summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1rem', color: 'gray' }}>Total Sales</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(totalSales.toFixed(2))}</p>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1rem', color: 'gray' }}>Average Daily Sales</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(averageSales.toFixed(2))}</p>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1rem', color: 'gray' }}>Total Profit</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(totalProfit.toFixed(2))}</p>
        </div>
      </div>


      {/* Sales Data Chart */}
      <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '1rem', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_price" stroke="#8884d8" /> {/* Corrected data key for total sales */}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Sales Table */}
      <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Sales</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Products</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Sales Price</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Cost Price</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Quantity Sold</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Profit</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Category</th>
              
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.75rem' }}>{sale.date}</td>
                <td style={{ padding: '0.75rem' }}>{sale.product_name ? (Array.isArray(sale.product_name) ? sale.product_name.join(', ') : sale.product_name) : 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>{sale.total_price ? formatCurrency(sale.total_price.toFixed(2)) : 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>{sale.total_cost_price ? formatCurrency(sale.total_cost_price.toFixed(2)) : 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>{sale.quantity_sold ? sale.quantity_sold.toFixed(2) : 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>{sale.profit ? formatCurrency(sale.profit.toFixed(2)) : 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>{sale.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesHistoryPage;
