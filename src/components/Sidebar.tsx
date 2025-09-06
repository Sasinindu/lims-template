import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  TestTube, 
  FileText, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  Calendar,
  Database,
  ChevronDown,
  ChevronUp,
  Building2,
  Package,
  FlaskConical,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]); // Empty by default

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-600' },
    { id: 'lab-tests', icon: TestTube, label: 'Lab Tests', color: 'text-green-600' },
    { id: 'reports', icon: FileText, label: 'Reports', color: 'text-purple-600' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'text-orange-600' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', color: 'text-red-600' },
    { id: 'database', icon: Database, label: 'Database', color: 'text-indigo-600' },
    { id: 'users', icon: Users, label: 'Users', color: 'text-pink-600' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'text-gray-600' },
  ];

  const masterDataItems = [
    { id: 'customers', icon: Building2, label: 'Customers', color: 'text-blue-600' },
    { id: 'tests', icon: TestTube, label: 'Tests', color: 'text-green-600' },
    { id: 'commodities', icon: Package, label: 'Commodities', color: 'text-yellow-600' },
    { id: 'chemicals', icon: FlaskConical, label: 'Chemicals', color: 'text-purple-600' },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  const isMasterDataPage = (pageId: string) => masterDataItems.some(item => item.id === pageId);

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
    >
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </motion.button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Main Menu Items */}
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-medium"
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        ))}

        {/* Master Data Section - No separator line */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSection('master-data')}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                isMasterDataPage(currentPage)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="font-medium">Master Data</span>
              </div>
              {isSectionExpanded('master-data') ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </motion.button>

            <AnimatePresence>
              {isSectionExpanded('master-data') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 mt-2 space-y-1"
                >
                  {masterDataItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onPageChange(item.id)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                        currentPage === item.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-600'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Collapsed Master Data Icon */}
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange('customers')}
              className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                isMasterDataPage(currentPage)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              title="Master Data"
            >
              <Database className="w-5 h-5 text-indigo-600" />
            </motion.button>
          </motion.div>
        )}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Control Union Lab</p>
            <p>v1.0.0</p>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
