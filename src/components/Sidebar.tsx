import React, { useState } from 'react';
import {
  motion, AnimatePresence
} from 'framer-motion';
import {
  LayoutDashboard,
  TestTube,
  FileText,
  BarChart3,
  Calendar,
  Database,
  Users,
  Settings,
  ChevronRight,
  Building2,
  FlaskConical,
  Package,
  Droplets,
  Microscope,
  Menu,
  Settings as SettingsIcon,
  ShoppingCart,
  Box,
  UserCheck,
  ClipboardList,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (pageId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'master-data': false
  });

  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'order-registration', label: 'Order Registration', icon: ClipboardList },
    { id: 'order-approval', label: 'Order Approval', icon: CheckCircle2 },
    { id: 'test-allocation', label: 'Test Allocation', icon: UserPlus },
    { id: 'tests', label: 'Tests', icon: TestTube },
    // { id: 'lab-tests', label: 'Lab Tests', icon: TestTube },
    // { id: 'reports', label: 'Reports', icon: FileText },
    // { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    // { id: 'calendar', label: 'Calendar', icon: Calendar },
    // { id: 'database', label: 'Database', icon: Database },
    { id: 'users', label: 'Users', icon: Users },
    // { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'results-approval', label: 'Results Approval', icon: UserCheck },
  ];

  const masterDataItems = [
    { id: 'instrument-master', label: 'Instrument Master', icon: Microscope },
    { id: 'chemicals', label: 'Chemical Master', icon: Droplets },
    { id: 'commodities', label: 'Commodity Master', icon: ShoppingCart },
    { id: 'test-parameters', label: 'Test Master', icon: TestTube },
    { id: 'customer-master', label: 'Customer Master', icon: UserCheck },
    { id: 'group-master', label: 'Group Master', icon: Users },
  ];

  const toggleSection = (sectionId: string) => {
    if (collapsed) return; // Don't toggle when collapsed
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isActive = (itemId: string) => currentPage === itemId;

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'
        }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button - Same height as header */}
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto ${collapsed ? 'p-2' : 'p-4'} space-y-2`}>
          {/* Main Menu Items */}
          {mainMenuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: collapsed ? 1.05 : 1.02, x: collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center rounded-lg transition-all duration-200 ${collapsed
                ? 'justify-center px-2 py-3'
                : 'space-x-3 px-4 py-3'
                } ${isActive(item.id)
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              title={collapsed ? item.label : undefined}
            >
              <div className={`rounded-lg ${collapsed
                ? 'p-2'
                : 'p-2'
                } ${isActive(item.id)
                  ? 'bg-primary-500/20 dark:bg-primary-500/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
                }`}>
                <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
              </div>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-sm font-medium ${isActive(item.id)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          ))}

          {/* Master Data Section - Only show when not collapsed */}
          {!collapsed && (
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSection('master-data')}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <div className="p-2 rounded-lg text-gray-600 dark:text-gray-400">
                  <Database className="w-5 h-5" />
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Master Data
                </motion.span>
                <motion.div
                  animate={{ rotate: expandedSections['master-data'] ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              </motion.button>

              {/* Master Data Sub-items */}
              <AnimatePresence>
                {expandedSections['master-data'] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 mt-2 space-y-1"
                  >
                    {masterDataItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onPageChange(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.id)
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive(item.id)
                          ? 'bg-primary-500/20 dark:bg-primary-500/30 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400'
                          }`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`text-sm font-medium ${isActive(item.id)
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300'
                            }`}
                        >
                          {item.label}
                        </motion.span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Collapsed Master Data Items */}
          {collapsed && (
            <div className="pt-4">
              <div className="p-2 rounded-lg text-gray-600 dark:text-gray-400 mb-2">
                <Database className="w-5 h-5 mx-auto" />
              </div>
              {masterDataItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex justify-center px-2 py-3 rounded-lg transition-all duration-200 mb-1 ${isActive(item.id)
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  title={item.label}
                >
                  <div className={`p-2 rounded-lg ${isActive(item.id)
                    ? 'bg-primary-500/20 dark:bg-primary-500/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
