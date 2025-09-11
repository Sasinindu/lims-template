import React from 'react';
import { motion } from 'framer-motion';
import TestParameters from './TestParameters';

const Tests: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tests
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage test parameters
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TestParameters />
      </motion.div>
    </div>
  );
};

export default Tests;
