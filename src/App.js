import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AppBar from './components/AppBar';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProductRegistration from './components/ProductRegistration';
import ProductList from './components/ProductList';
import SalesEntryPage from './components/SalesEntryPage';
import SalesHistory from './components/SalesHistory';
import ProfitLossSummary from './components/ProfitLossSummary';
import UserManagement from './components/UserManagement';
import SettingsPage from './components/SettingsPage';
import CheckoutAndReceiptPage from './components/CheckoutAndReceiptPage';
import UserUpdate from './components/UserUpdate';
import UserRegistration from './components/UserRegistration';
import ProductEditPage from './components/ProductEditPage';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

 const handleLogin = (userRole) => {
    setIsAuthenticated(true);
    setIsAdmin(userRole === 'admin'); // Update isAdmin based on userRole
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('token'); // Clear token
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {isAuthenticated && (
        <div className={`md:hidden fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out z-50`}>
          <Sidebar onClose={handleSidebarClose} isMobile={true} onLogout={handleLogout} isAdmin={isAdmin} />
        </div>
      )}

      {sidebarOpen && isAuthenticated && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={handleSidebarClose}></div>
      )}

      {isAuthenticated && (
        <div className="hidden md:block md:w-55">
          <Sidebar onLogout={handleLogout} isAdmin={isAdmin} />
        </div>
      )}

      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {isAuthenticated && <AppBar setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/" element={<Navigate to="/login" />} /> {/* Default route to login */}
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/products" element={isAuthenticated ? <ProductList /> : <Navigate to="/login" />} />
              <Route path="/product-registration" element={isAuthenticated ? <ProductRegistration /> : <Navigate to="/login" />} />
              <Route path="/sales" element={isAuthenticated ? <SalesEntryPage /> : <Navigate to="/login" />} />
              <Route path="/sales-history" element={isAuthenticated ? <SalesHistory /> : <Navigate to="/login" />} />
              <Route path="/profit-loss" element={isAuthenticated ? <ProfitLossSummary /> : <Navigate to="/login" />} />
              <Route path="/users" element={ isAdmin ? <UserManagement /> : <Navigate to="/login" />} />
              <Route path="/settings" element={isAdmin ? <SettingsPage /> : <Navigate to="/login" />} />
              <Route path="/checkout" element={isAuthenticated ? <CheckoutAndReceiptPage /> : <Navigate to="/login" />} />
              <Route path="/users/:userId/edit" element={isAuthenticated ? <UserUpdate /> : <Navigate to="/login" />} />
              <Route path="/users/user-registration" element={isAuthenticated ? <UserRegistration /> : <Navigate to="/login" />} />
              <Route path="/products/:id/edit" element={<ProductEditPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;