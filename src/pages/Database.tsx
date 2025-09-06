import React from 'react';
import { motion } from 'framer-motion';
import { Database as DatabaseIcon, HardDrive, Server, Archive } from 'lucide-react';

const DatabasePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Database
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Database management and maintenance
        </p>
      </motion.div>

      {/* Database Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45,678</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <DatabaseIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Database Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2.4 GB</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Backups</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">7</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <Archive className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Server Status</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Online</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Server className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Database Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Database Performance
          </h2>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <DatabaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Performance metrics placeholder</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Backup Status
          </h2>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Archive className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Backup status placeholder</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DatabasePage;
