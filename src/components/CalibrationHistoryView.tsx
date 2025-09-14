import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import SimpleTable from './SimpleTable';

interface CalibrationHistoryViewProps {
  instrument: any;
}

const CalibrationHistoryView: React.FC<CalibrationHistoryViewProps> = ({ instrument }) => {
  const getCalibrationStatusColor = (status: string) => {
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

  // Table column definitions for calibration history
  const calibrationColumns = [
    { 
      key: 'calibrationDate', 
      title: 'Calibration Date',
      render: (value: string) => (
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-primary-600 mr-2" />
          <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      key: 'nextCalibrationDate', 
      title: 'Next Calibration',
      render: (value: string) => (
        <span className="text-sm">{value ? new Date(value).toLocaleDateString() : 'N/A'}</span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCalibrationStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'performedBy', 
      title: 'Performed By',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    { 
      key: 'notes', 
      title: 'Notes',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs" title={value}>
          {value || 'N/A'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Instrument Info Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <CheckCircle className="w-5 h-5 mr-2 text-primary-600" />
          Calibration History
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Instrument:</span> {instrument?.instrumentName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Serial Number:</span> {instrument?.serialNumber}
          </p>
        </div>
      </div>

      {/* Calibration History Table */}
      <div>
        <SimpleTable
          columns={calibrationColumns}
          data={instrument?.calibrationHistory || []}
          emptyMessage="No calibration history available"
          showActions={false}
        />
      </div>
    </div>
  );
};

export default CalibrationHistoryView; 