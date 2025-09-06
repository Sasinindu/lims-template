import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current page from the URL path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    if (path.startsWith('/customers')) return 'customers';
    if (path.startsWith('/tests')) return 'tests';
    if (path.startsWith('/commodities')) return 'commodities';
    if (path.startsWith('/chemicals')) return 'chemicals';
    return path.substring(1); // Remove leading slash
  };

  const currentPage = getCurrentPage();

  const handlePageChange = (page: string) => {
    // Map page IDs to actual routes
    const routeMap: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'lab-tests': '/lab-tests',
      'reports': '/reports',
      'analytics': '/analytics',
      'calendar': '/calendar',
      'database': '/database',
      'users': '/users',
      'settings': '/settings',
      'customers': '/customers',
      'tests': '/tests',
      'commodities': '/commodities',
      'chemicals': '/chemicals'
    };

    const route = routeMap[page];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
