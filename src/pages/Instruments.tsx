import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Plus, Edit, Eye, Trash2, Save, X, Check, CircleXIcon } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import AddInstrumentForm from '../components/AddInstrumentForm';

const Instruments: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<any>(null);

  // Mock instrument data
  const [instruments, setInstruments] = useState([
    {
      id: 'I001',
      instrumentName: 'High Performance Liquid Chromatograph',
      instrumentCategory: 'Analytical Instruments',
      serialNumber: 'HPLC-2024-001',
      status: 'Active'
    },
    {
      id: 'I002',
      instrumentName: 'Gas Chromatograph Mass Spectrometer',
      instrumentCategory: 'Analytical Instruments',
      serialNumber: 'GCMS-2024-002',
      status: 'Active'
    },
    {
      id: 'I003',
      instrumentName: 'Atomic Absorption Spectrophotometer',
      instrumentCategory: 'Analytical Instruments',
      serialNumber: 'AAS-2024-003',
      status: 'Active'
    },
    {
      id: 'I004',
      instrumentName: 'Digital Balance',
      instrumentCategory: 'Measurement Equipment',
      serialNumber: 'BAL-2024-004',
      status: 'Active'
    },
    {
      id: 'I005',
      instrumentName: 'pH Meter',
      instrumentCategory: 'Measurement Equipment',
      serialNumber: 'PHM-2024-005',
      status: 'Inactive'
    },
    {
      id: 'I006',
      instrumentName: 'Centrifuge',
      instrumentCategory: 'Sample Preparation',
      serialNumber: 'CEN-2024-006',
      status: 'Active'
    },
    {
      id: 'I007',
      instrumentName: 'Environmental Monitor',
      instrumentCategory: 'Environmental Monitoring',
      serialNumber: 'ENV-2024-007',
      status: 'Active'
    },
    {
      id: 'I008',
      instrumentName: 'Safety Cabinet',
      instrumentCategory: 'Safety Equipment',
      serialNumber: 'SAF-2024-008',
      status: 'Active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const columns: Column[] = [
    {
      key: 'id',
      title: 'Instrument ID',
      dataIndex: 'id',
      width: '120px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Microscope className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-primary-600 dark:text-primary-400">{value}</span>
        </div>
      )
    },
    {
      key: 'instrumentName',
      title: 'Instrument Name',
      dataIndex: 'instrumentName',
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">{value}</div>
      )
    },
    {
      key: 'instrumentCategory',
      title: 'Category',
      dataIndex: 'instrumentCategory',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
          {value}
        </span>
      )
    },
    {
      key: 'serialNumber',
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{value}</span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: '100px',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    }
  ];

  const handleAddInstrument = () => {
    setEditingInstrument(null);
    setIsDrawerOpen(true);
  };

  const handleEditInstrument = (record: any) => {
    setEditingInstrument(record);
    setIsDrawerOpen(true);
  };

  const handleViewInstrument = (record: any) => {
    console.log('View instrument:', record.id);
  };

  const handleDeleteInstrument = (record: any) => {
    if (window.confirm(`Are you sure you want to delete instrument "${record.instrumentName}"?`)) {
      setInstruments(prev => prev.filter(inst => inst.id !== record.id));
    }
  };

  const handleSaveInstrument = (instrumentData: any) => {
    if (editingInstrument) {
      // Update existing instrument
      setInstruments(prev => 
        prev.map(inst => 
          inst.id === editingInstrument.id ? { ...instrumentData, id: editingInstrument.id } : inst
        )
      );
    } else {
      // Add new instrument
      setInstruments(prev => [...prev, instrumentData]);
    }
    setIsDrawerOpen(false);
    setEditingInstrument(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingInstrument(null);
  };

  // Footer component for the drawer
  const drawerFooter = (
    <div className="p-4">
      <div className="flex items-center justify-end space-x-3">
        <motion.button
          type="button"
          onClick={handleCloseDrawer}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          form="instrument-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingInstrument ? 'Update Instrument' : 'Add Instrument'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
   

      {/* Instrument Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Instruments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{instruments.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Microscope className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Instruments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {instruments.filter(i => i.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Instruments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {instruments.filter(i => i.status === 'Inactive').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <CircleXIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Instrument Data Table */}
      <DataTable
        columns={columns}
        data={instruments}
        loading={loading}
        searchPlaceholder="Search instruments..."
        addButtonText="Add Instrument"
        onAdd={handleAddInstrument}
        onEdit={handleEditInstrument}
        onView={handleViewInstrument}
        onDelete={handleDeleteInstrument}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit Instrument Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingInstrument ? 'Edit Instrument' : 'Add New Instrument'}
        size="md"
        footer={drawerFooter}
      >
        <AddInstrumentForm
          onSave={handleSaveInstrument}
          onCancel={handleCloseDrawer}
          isEditing={!!editingInstrument}
          initialData={editingInstrument}
        />
      </Drawer>
    </div>
  );
};

export default Instruments;
