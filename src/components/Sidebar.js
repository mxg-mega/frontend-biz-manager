import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Users, Settings, X } from 'lucide-react';
import { Button } from "./ui/button";
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onClose, isMobile, onLogout, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define the navigation items
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, link: '/dashboard' },
    { name: 'Add Product', icon: Package, link: '/product-registration' },
    { name: 'Product List', icon: Package, link: '/products' },
    { name: 'New Sale', icon: ShoppingCart, link: '/sales' },
    { name: 'Sales History', icon: ShoppingCart, link: '/sales-history' },
    { name: 'Profit/Loss', icon: DollarSign, link: '/profit-loss' },
    { name: 'Users', icon: Users, link: '/users' },
    { name: 'Settings', icon: Settings, link: '/settings' },
    { name: 'Logout', icon: X, action: onLogout } // Add Logout item here
  ];

  // Filter nav items based on user role
  const filteredNavItems = isAdmin ? navItems : navItems.filter(item => item.name === 'New Sale');

  return (
    <div className="bg-gray-800 text-white w-64 h-screen space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform transition-transform duration-200 ease-in-out z-50">
      {isMobile && (
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-2xl font-bold text-blue-500">BizManager</h1>
      </div>
      <nav className="overflow-y-auto h-[calc(100vh-8rem)]">
        {filteredNavItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={`w-full justify-start my-2 ${
              location.pathname === item.link ? 'bg-blue-500 text-white' : 'text-gray-300'
            }`}
            onClick={() => {
              if (item.action) {
                item.action(); // Call the action for Logout
              } else {
                navigate(item.link);
                if (isMobile) onClose();
              }
            }}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;