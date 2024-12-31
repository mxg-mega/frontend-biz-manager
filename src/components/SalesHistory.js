import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Filter, Trash2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../api';
import { formatCurrency } from '../lib/utils';
import { Pagination } from "./ui/Pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

const SalesHistoryPage = () => {
  const [dateRange, setDateRange] = useState('Today');
  const [filterCategory, setFilterCategory] = useState('All');
  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchSalesData();
  }, [dateRange, filterCategory, currentPage]);

  const fetchSalesData = () => {
    setIsLoading(true);
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

    api.get('/sales/report', {params: {
      start_date: startDate,
      end_date: endDate,
      business_id: localStorage.getItem('business_id'),
      page: currentPage,
      per_page: itemsPerPage
    }})
      .then((response) => {
        let filteredData = response.data.sales;
        if (filterCategory !== 'All') {
          filteredData = filteredData.filter(sale => sale.category === filterCategory);
        }
        setSalesData(filteredData);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
        setSalesData([]);
        setIsLoading(false);
      });
  };

  const handleDeleteClick = (sale) => {
    setSaleToDelete(sale);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!saleToDelete) return;

    try {
      await api.delete(`/sales/${saleToDelete.id}`, {
        params: { business_id: localStorage.getItem('business_id') }
      });
      
      // Refresh the data
      fetchSalesData();
      setDeleteDialogOpen(false);
      setSaleToDelete(null);
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  // Calculate total sales and average sales from the data
  const totalSales = salesData ? salesData.reduce((sum, sale) => sum + (sale.total_price || 0), 0) : 0;
  const averageSales = salesData && salesData.length > 0 ? totalSales / salesData.length : 0;
  const totalProfit = salesData ? salesData.reduce((sum, sale) => sum + (sale.profit || 0), 0) : 0;

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Sales History</h1>

      {/* Filters and Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center">
          <Calendar className="mr-2" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <Filter className="mr-2" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>All</option>
            <option>electronics</option>
            <option>clothing</option>
            <option>appliances</option>
          </select>
        </div>

        <button
          onClick={() => handleExport('excel')}
          className="flex items-center justify-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Download className="mr-2" />
          Export to Excel
        </button>

        <button
          onClick={() => handleExport('pdf')}
          className="flex items-center justify-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Download className="mr-2" />
          Export to PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Total Sales</h3>
          <p className="text-xl font-bold">{formatCurrency(totalSales.toFixed(2))}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Average Daily Sales</h3>
          <p className="text-xl font-bold">{formatCurrency(averageSales.toFixed(2))}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Total Profit</h3>
          <p className="text-xl font-bold">{formatCurrency(totalProfit.toFixed(2))}</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sales Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Recent Sales</h2>
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Products</th>
              <th className="text-left p-3">Sales Price</th>
              <th className="text-left p-3">Cost Price</th>
              <th className="text-left p-3">Quantity</th>
              <th className="text-left p-3">Profit</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesData && salesData.map((sale, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{sale.date}</td>
                <td className="p-3">{sale.product_name ? (Array.isArray(sale.product_name) ? sale.product_name.join(', ') : sale.product_name) : 'N/A'}</td>
                <td className="p-3">{formatCurrency(sale.total_price?.toFixed(2) ?? 'N/A')}</td>
                <td className="p-3">{formatCurrency(sale.total_cost_price?.toFixed(2) ?? 'N/A')}</td>
                <td className="p-3">{sale.quantity_sold?.toFixed(2) ?? 'N/A'}</td>
                <td className="p-3">{formatCurrency(sale.profit?.toFixed(2) ?? 'N/A')}</td>
                <td className="p-3">{sale.category}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteClick(sale)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sale? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};


export default SalesHistoryPage;
