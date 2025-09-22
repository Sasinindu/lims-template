import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      <motion.button
        onClick={items[0]?.onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
      </motion.button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <motion.button
            onClick={item.onClick}
            whileHover={item.onClick ? { scale: 1.05 } : {}}
            whileTap={item.onClick ? { scale: 0.95 } : {}}
            disabled={item.isActive || !item.onClick}
            className={`transition-colors duration-200 ${
              item.isActive
                ? 'text-primary-600 font-medium cursor-default'
                : item.onClick
                  ? 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 hover:underline cursor-pointer'
                  : 'text-gray-500 dark:text-gray-400 cursor-default'
            }`}
          >
            {item.label}
          </motion.button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 