// src/components/AppBar.js
import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from "./ui/button";
import { Link } from 'react-router-dom';

const AppBar = ({ setSidebarOpen, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    onLogout(); // Call the onLogout function passed from App.js
    setDropdownOpen(false); // Close the dropdown
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
      <Button variant="ghost" className="md:hidden" onClick={() => setSidebarOpen(prev => !prev)}>
        <Menu className="h-8 w-8" />
      </Button>
      <h1 className="text-xl font-bold">Business Management System</h1>
      <div className="relative">
        <Button variant="ghost" onClick={() => setDropdownOpen(prev => !prev)}>
          <User  className="h-6 w-6" />
        </Button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
            <ul>
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                  onClick={handleLogout} // Call handleLogout on click
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppBar;