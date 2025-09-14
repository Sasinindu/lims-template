import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Microscope, Plus, Edit, Eye, Trash2, Save, X, Check, CircleXIcon, MoreVertical, Calendar, History } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import AddInstrumentForm from '../components/AddInstrumentForm';
import AddCalibrationForm from '../components/AddCalibrationForm';
import CalibrationHistoryView from '../components/CalibrationHistoryView';
import { useConfirmation } from '../hooks/useConfirmation';

const Instruments: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<any>(null);
  const [viewingInstrument, setViewingInstrument] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showActions, setShowActions] = useState<{ [key: string]: boolean }>({});
  const [isCalibrationDrawerOpen, setIsCalibrationDrawerOpen] = useState(false);
  const [selectedInstrumentForCalibration, setSelectedInstrumentForCalibration] = useState<any>(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [selectedInstrumentForHistory, setSelectedInstrumentForHistory] = useState<any>(null);

  // Use confirmation hook
  const { confirmDelete } = useConfirmation();

  const toggleActions = (rowId: string) => {
    setShowActions(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  // Mock instrument data with calibration history
  const [instruments, setInstruments] = useState([
    {
      id: 'I001',
      instrumentName: 'High Performance Liquid Chromatograph',
      instrumentCategory: 'Analytical Instruments',
      serialNumber: 'HPLC-2024-001',
      status: 'Active',
      calibrationCycle: 'Quarterly',
      lastCalibrationDate: '2024-11-01',
      calibrationHistory: [
        {
          id: 'CAL001',
          calibrationDate: '2024-11-01',
          nextCalibrationDate: '2025-02-01',
          status: 'Passed',
          performedBy: 'John Smith',
          notes: 'All parameters within acceptable limits'
        },
        {
          id: 'CAL002',
          calibrationDate: '2024-08-01',
          nextCalibrationDate: '2024-11-01',
          status: 'Passed',
          performedBy: 'Jane Doe',
          notes: 'Minor adjustment made to flow rate'
        }
      ]
    },
    {
      id: 'I002',
      instrumentName: 'Gas Chromatograph Mass Spectrometer',
      instrumentCategory: 'Analytical Instruments',
      serialNumber: 'GCMS-2024-002',
      status: 'Active',
      calibrationCycle: 'Monthly',
      lastCalibrationDate: '2024-11-15',
      calibrationHistory: [
        {
          id: 'CAL003',
          calibrationDate: '2024-11-15',
          nextCalibrationDate: '2024-12-15',
          status: 'Passed',
          performedBy: 'Mike Johnson',
          notes: 'System operating within specifications'
        }
      ]
    },
    {
      id: 'I003',
      instrumentName: 'Atomic Absorption Spectrophotometer',
      instrumentCategory: 'Analytical Instruments',
      serialNumber: 'AAS-2024-003',
      status: 'Active',
      calibrationCycle: 'Annually',
      lastCalibrationDate: '2024-10-01',
      calibrationHistory: [
        {
          id: 'CAL004',
          calibrationDate: '2024-10-01',
          nextCalibrationDate: '2025-10-01',
          status: 'Passed',
          performedBy: 'Sarah Wilson',
          notes: 'Annual calibration completed successfully'
        }
      ]
    },
    {
      id: 'I004',
      instrumentName: 'Digital Balance',
      instrumentCategory: 'Measurement Equipment',
      serialNumber: 'BAL-2024-004',
      status: 'Active',
      calibrationCycle: 'Monthly',
      lastCalibrationDate: '2024-11-20',
      calibrationHistory: []
    },
    {
      id: 'I005',
      instrumentName: 'pH Meter',
      instrumentCategory: 'Measurement Equipment',
      serialNumber: 'PHM-2024-005',
      status: 'Inactive',
      calibrationCycle: 'Quarterly',
      lastCalibrationDate: '2024-09-15',
      calibrationHistory: []
    },
    {
      id: 'I006',
      instrumentName: 'Centrifuge',
      instrumentCategory: 'Sample Preparation',
      serialNumber: 'CEN-2024-006',
      status: 'Active',
      calibrationCycle: 'Semi-Annually',
      lastCalibrationDate: '2024-08-01',
      calibrationHistory: []
    },
    {
      id: 'I007',
      instrumentName: 'Environmental Monitor',
      instrumentCategory: 'Environmental Monitoring',
      serialNumber: 'ENV-2024-007',
      status: 'Active',
      calibrationCycle: 'Monthly',
      lastCalibrationDate: '2024-11-25',
      calibrationHistory: []
    },
    {
      id: 'I008',
      instrumentName: 'Safety Cabinet',
      instrumentCategory: 'Safety Equipment',
      serialNumber: 'SAF-2024-008',
      status: 'Active',
      calibrationCycle: 'Annually',
      lastCalibrationDate: '2024-06-01',
      calibrationHistory: []
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
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '130px',
      sortable: false,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          {/* View Action - Eye Icon */}
          <motion.button
            onClick={() => handleViewInstrument(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="View Instrument"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Edit Action - Pencil Icon */}
          <motion.button
            onClick={() => handleEditInstrument(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit Instrument"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          

          {/* More Options - Vertical Ellipsis */}
          <div className="relative">
            <motion.button
              onClick={() => toggleActions(record.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            {/* Dropdown Menu */}
            {showActions[record.id] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 z-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
              >
                <button
                  onClick={() => {
                    handleAddCalibration(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Add Calibration
                </button>
                <button
                  onClick={() => {
                    handleViewCalibrationHistory(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  Calibration History
                </button>
                <button
                  onClick={() => {
                    handleDeleteInstrument(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Instrument
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )
    }
  ];

  const handleAddInstrument = () => {
    setEditingInstrument(null);
    setViewingInstrument(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditInstrument = (record: any) => {
    setEditingInstrument(record);
    setViewingInstrument(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewInstrument = (record: any) => {
    setViewingInstrument(record);
    setEditingInstrument(null);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteInstrument = async (record: any) => {
    console.log('Delete instrument button clicked for:', record.instrumentName); // Debug log
    
    const confirmed = await confirmDelete(record.instrumentName, 'instrument');
    
    if (confirmed) {
      console.log('Delete instrument:', record.id);
      setInstruments(prev => prev.filter(inst => inst.id !== record.id));
    }
  };

  const handleAddCalibration = (record: any) => {
    setSelectedInstrumentForCalibration(record);
    setIsCalibrationDrawerOpen(true);
  };

  const handleViewCalibrationHistory = (record: any) => {
    setSelectedInstrumentForHistory(record);
    setIsHistoryDrawerOpen(true);
  };

  const handleSaveCalibration = (calibrationData: any) => {
    if (selectedInstrumentForCalibration) {
      const newCalibration = {
        id: `CAL-${Date.now()}`,
        ...calibrationData,
        instrumentId: selectedInstrumentForCalibration.id
      };

      setInstruments(prev =>
        prev.map(inst => {
          if (inst.id === selectedInstrumentForCalibration.id) {
            return {
              ...inst,
              calibrationHistory: [...(inst.calibrationHistory || []), newCalibration],
              lastCalibrationDate: calibrationData.calibrationDate
            };
          }
          return inst;
        })
      );

      setIsCalibrationDrawerOpen(false);
      setSelectedInstrumentForCalibration(null);
    }
  };

  const handleCloseCalibrationDrawer = () => {
    setIsCalibrationDrawerOpen(false);
    setSelectedInstrumentForCalibration(null);
  };

  const handleCloseHistoryDrawer = () => {
    setIsHistoryDrawerOpen(false);
    setSelectedInstrumentForHistory(null);
  };

  // Footer for calibration drawer
  const calibrationDrawerFooter = (
    <div className="p-4">
      <div className="flex items-center justify-end space-x-3">
        <motion.button
          type="button"
          onClick={handleCloseCalibrationDrawer}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          form="calibration-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          Add Calibration
        </motion.button>
      </div>
    </div>
  );

  // Footer for calibration history drawer
  const historyDrawerFooter = (
    <div className="p-4">
      <div className="flex justify-end">
        <motion.button
          onClick={handleCloseHistoryDrawer}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </motion.button>
      </div>
    </div>
  );

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
      const newInstrument = {
        ...instrumentData,
        id: `I${String(instruments.length + 1).padStart(3, '0')}`,
        calibrationCycle: 'Quarterly',
        lastCalibrationDate: '',
        calibrationHistory: []
      };
      setInstruments(prev => [...prev, newInstrument]);
    }
    setIsDrawerOpen(false);
    setEditingInstrument(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingInstrument(null);
    setViewingInstrument(null);
    setIsViewMode(false);
  };

  const drawerFooter = isViewMode ? (
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
          Close
        </motion.button>
      </div>
    </div>
  ) : (
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
 

      {/* Category Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Instruments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {instruments.length}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Microscope className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
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
        </motion.div>
      </motion.div>

      {/* Instrument Data Table */}
      <DataTable
        columns={columns}
        data={instruments}
        loading={loading}
        searchPlaceholder="Search instruments..."
        addButtonText="Add Instrument"
        onAdd={handleAddInstrument}
        searchable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit/View Instrument Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          isViewMode 
            ? `View Instrument - ${viewingInstrument?.instrumentName || ''}` 
            : editingInstrument 
              ? 'Edit Instrument' 
              : 'Add New Instrument'
        }
        size="md"
        footer={drawerFooter}
      >
        <AddInstrumentForm
          onSave={handleSaveInstrument}
          onCancel={handleCloseDrawer}
          isEditing={!!editingInstrument}
          initialData={isViewMode ? viewingInstrument : editingInstrument}
          isViewMode={isViewMode}
        />
      </Drawer>

      {/* Add Calibration Drawer */}
      <Drawer
        isOpen={isCalibrationDrawerOpen}
        onClose={handleCloseCalibrationDrawer}
        title={`Add Calibration - ${selectedInstrumentForCalibration?.instrumentName || 'Instrument'}`}
        size="lg"
        footer={calibrationDrawerFooter}
      >
        <AddCalibrationForm
          onSave={handleSaveCalibration}
          instrument={selectedInstrumentForCalibration}
        />
      </Drawer>

      {/* Calibration History Drawer */}
      <Drawer
        isOpen={isHistoryDrawerOpen}
        onClose={handleCloseHistoryDrawer}
        title={`Calibration History - ${selectedInstrumentForHistory?.instrumentName || 'Instrument'}`}
        size="3xl"
        footer={historyDrawerFooter}
      >
        <CalibrationHistoryView
          instrument={selectedInstrumentForHistory}
        />
      </Drawer>
    </div>
  );
};

export default Instruments;
