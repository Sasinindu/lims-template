import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock, User } from 'lucide-react';
import DataTable, { Column } from './DataTable';

interface CalibrationRecord {
  id: string;
  calibrationDate: string;
  nextCalibrationDate: string;
  status: 'Passed' | 'Failed' | 'Conditional' | 'Pending';
  performedBy: string;
  notes: string;
}

interface CalibrationHistoryViewProps {
  instrument: any;
}

const CalibrationHistoryView: React.FC<CalibrationHistoryViewProps> = ({ instrument }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Conditional':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'Conditional':
        return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns: Column[] = [
    {
      key: 'calibrationDate',
      title: 'Calibration Date',
      dataIndex: 'calibrationDate',
      width: '180px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDate(value)}
          </span>
        </div>
      )
    },
    {
      key: 'nextCalibrationDate',
      title: 'Next Due Date',
      dataIndex: 'nextCalibrationDate',
      width: '150px',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: '120px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(value)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'performedBy',
      title: 'Performed By',
      dataIndex: 'performedBy',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <User className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'notes',
      title: 'Notes',
      dataIndex: 'notes',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={value}>
            {value || 'No notes available'}
          </p>
        </div>
      )
    }
  ];

  const calibrationHistory = instrument?.calibrationHistory || [];

  return (
    <div className="p-6 space-y-6">
      {/* Instrument Information Header */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800 p-6">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Instrument Name</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {instrument?.instrumentName || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Serial Number</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">
              {instrument?.serialNumber || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Calibration Cycle</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {instrument?.calibrationCycle || 'N/A'}
            </p>
          </div>
        </div>
      </div>

     

      {/* Calibration History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Calibration Records
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Detailed history of all calibration activities
          </p>

           {/* Calibration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Passed</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {calibrationHistory.filter((record: CalibrationRecord) => record.status === 'Passed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {calibrationHistory.filter((record: CalibrationRecord) => record.status === 'Failed').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conditional</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {calibrationHistory.filter((record: CalibrationRecord) => record.status === 'Conditional').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Calibration</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {instrument?.lastCalibrationDate ? formatDate(instrument.lastCalibrationDate) : 'N/A'}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-primary-500" />
          </div>
        </motion.div>
      </div>
        </div>
        
        <DataTable
          columns={columns}
          data={calibrationHistory}
          loading={false}
          searchPlaceholder="Search calibration records..."
          searchable={true}
          pagination={true}
          pageSize={10}
        />
      </div>

      {/* Empty State */}
      {calibrationHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Calibration History
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This instrument has no calibration records yet.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CalibrationHistoryView; 