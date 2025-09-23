import React from 'react';
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

  const getCurrentPage = () => {
    const path = location.pathname.substring(1); // Remove leading slash
    
    // Handle nested routes by checking if path starts with known route prefix
    if (path.startsWith('test-allocation')) {
      return 'test-allocation';
    }
    if (path.startsWith('order-approval')) {
      return 'order-approval';
    }
    if (path.startsWith('order-registration')) {
      return 'order-registration';
    }
    if (path.startsWith('customer-master')) {
      return 'customer-master';
    }
    if (path.startsWith('group-master')) {
      return 'group-master';
    }
    if (path.startsWith('instrument-master')) {
      return 'instrument-master';
    }
    if (path.startsWith('test-parameters')) {
      return 'test-parameters';
    }
    
    // Map exact paths to sidebar item IDs
    const pathMap: { [key: string]: string } = {
      'dashboard': 'dashboard',
      'results-approval': 'results-approval',
      'tests': 'tests',
      'lab-tests': 'lab-tests',
      'reports': 'reports',
      'analytics': 'analytics',
      'calendar': 'calendar',
      'database': 'database',
      'users': 'users',
      'settings': 'settings',
      'chemicals': 'chemicals',
      'commodities': 'commodities',
    };
    return pathMap[path] || 'dashboard'; // Default to dashboard
  };

  const handlePageChange = (pageId: string) => {
    const routeMap: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'order-registration': '/order-registration',
      'order-approval': '/order-approval',
      'test-allocation': '/test-allocation',
      'results-approval': '/results-approval',
      'tests': '/tests',
      'lab-tests': '/lab-tests',
      'reports': '/reports',
      'analytics': '/analytics',
      'calendar': '/calendar',
      'database': '/database',
      'users': '/users',
      'settings': '/settings',
      'customer-master': '/customer-master',
      'group-master': '/group-master',
      'test-types': '/test-types',
      'chemicals': '/chemicals',
      'commodities': '/commodities',
      'instrument-master': '/instrument-master',
    };
    const path = routeMap[pageId];
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      <Sidebar currentPage={getCurrentPage()} onPageChange={handlePageChange} />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-8xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
