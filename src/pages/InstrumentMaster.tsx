import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Building2, ChevronRight } from 'lucide-react';
import InstrumentCategories from './InstrumentCategories';
import Instruments from './Instruments';

const InstrumentMaster: React.FC = () => {
  const [activeSection, setActiveSection] = useState('instrument-categories');

  const sections = [
    {
      id: 'instrument-categories',
      title: 'Instrument Categories',
      description: 'Manage instrument categories',
      icon: Building2
    },
    {
      id: 'instruments',
      title: 'Instruments',
      description: 'Manage instruments',
      icon: Microscope
    }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'instrument-categories':
        return <InstrumentCategories />;
      case 'instruments':
        return <Instruments />;
      default:
        return <InstrumentCategories />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Instrument Master
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage instrument categories and instruments
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs opacity-75">{section.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentMaster;
