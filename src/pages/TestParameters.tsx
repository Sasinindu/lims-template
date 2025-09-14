import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckCircle, XCircle, Save, X, Eye, Edit, MoreVertical, Trash2 } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import AddTestParameterForm from '../components/AddTestParameterForm';
import { useConfirmation } from '../hooks/useConfirmation';

const TestParameters: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTestParameter, setEditingTestParameter] = useState<any>(null);
  const [viewingTestParameter, setViewingTestParameter] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showActions, setShowActions] = useState<{ [key: string]: boolean }>({});
  const [dropdownPositions, setDropdownPositions] = useState<{ [key: string]: 'bottom' | 'top' }>({});

  // Use confirmation hook
  const { confirmDelete } = useConfirmation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown-container]')) {
        setShowActions({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleActions = (rowId: string, event?: React.MouseEvent) => {
    const isCurrentlyOpen = showActions[rowId];
    
    setShowActions(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));

    // Calculate dropdown position when opening
    if (!isCurrentlyOpen && event) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 120; // Estimated dropdown height (2 items * ~50px each + padding)
      const spaceBelow = viewportHeight - rect.bottom - 10; // 10px buffer
      const spaceAbove = rect.top - 10; // 10px buffer

      // Open upward if there's not enough space below but enough space above
      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight;
      
      setDropdownPositions(prev => ({
        ...prev,
        [rowId]: shouldOpenUpward ? 'top' : 'bottom'
      }));
    }
  };

  // Mock test parameter data
  const [testParameters, setTestParameters] = useState([
    {
      id: 'TP001',
      testName: 'Blood Chemistry Panel',
      testType: 'Blood Chemistry Panel',
      protocol: 'Standard CBC Protocol',
      analytes: ['Hemoglobin', 'Hematocrit', 'WBC', 'RBC'],
      reference: 'Clinical Laboratory Standards',
      chemicals: [
        { name: 'EDTA', quantity: '2ml' },
        { name: 'Sodium Citrate', quantity: '1ml' }
      ],
      costGroups: [
        { group: 'Standard', price: 150 },
        { group: 'Premium', price: 200 }
      ],
      instruments: ['Hematology Analyzer', 'Centrifuge'],
      status: 'Active'
    },
    {
      id: 'TP002',
      testName: 'Microbiology Culture',
      testType: 'Microbiology Culture',
      protocol: 'Aerobic Culture Protocol',
      analytes: ['Bacteria', 'Fungi', 'Pathogens'],
      reference: 'Microbiology Standards',
      chemicals: [
        { name: 'Agar', quantity: '50g' },
        { name: 'Antibiotic Discs', quantity: '10 discs' }
      ],
      costGroups: [
        { group: 'Standard', price: 300 },
        { group: 'Premium', price: 400 }
      ],
      instruments: ['Incubator', 'Microscope'],
      status: 'Active'
    },
    {
      id: 'TP003',
      testName: 'Immunology Test',
      testType: 'Immunology Test',
      protocol: 'ELISA Protocol',
      analytes: ['Antibodies', 'Antigens'],
      reference: 'Immunology Guidelines',
      chemicals: [
        { name: 'ELISA Buffer', quantity: '100ml' },
        { name: 'Substrate', quantity: '25ml' }
      ],
      costGroups: [
        { group: 'Standard', price: 250 },
        { group: 'Premium', price: 350 }
      ],
      instruments: ['ELISA Reader', 'Plate Washer'],
      status: 'Inactive'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const columns: Column[] = [
    {
      key: 'testName',
      title: 'Test Type',
      dataIndex: 'testName',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Settings className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'protocol',
      title: 'Protocol',
      dataIndex: 'protocol',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'analytes',
      title: 'Analytes',
      dataIndex: 'analytes',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={Array.isArray(value) ? value.join(', ') : value}>
          {Array.isArray(value) ? `${value.length} items` : value}
        </span>
      )
    },
    {
      key: 'chemicals',
      title: 'Chemicals',
      dataIndex: 'chemicals',
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value.length} items
        </span>
      )
    },
    {
      key: 'instruments',
      title: 'Instruments',
      dataIndex: 'instruments',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value.length} items
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
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'actions',
      width: '120px',
      render: (_, record) => (
        <div className="flex items-center space-x-1">
          {/* View Action - Eye Icon */}
          <motion.button
            onClick={() => handleViewTestParameter(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="View Test Parameter"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Edit Action - Pencil Icon */}
          <motion.button
            onClick={() => handleEditTestParameter(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit Test Parameter"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={() => handleDeleteTestParameter(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Delete "
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>

          {/* More Options - Vertical Ellipsis */}
          
        </div>
      )
    }
  ];

  const handleAddTestParameter = () => {
    setEditingTestParameter(null);
    setViewingTestParameter(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditTestParameter = (record: any) => {
    setEditingTestParameter(record);
    setViewingTestParameter(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewTestParameter = (record: any) => {
    setViewingTestParameter(record);
    setEditingTestParameter(null);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteTestParameter = async (record: any) => {
    const confirmed = await confirmDelete(record.testName, 'test');
    if (confirmed) {
      setTestParameters(prev => prev.filter(testParam => testParam.id !== record.id));
    }
  };

  const handleSaveTestParameter = (testParameterData: any) => {
    if (editingTestParameter) {
      // Update existing test parameter
      setTestParameters(prev => 
        prev.map(testParam => 
          testParam.id === editingTestParameter.id ? { ...testParameterData, id: editingTestParameter.id } : testParam
        )
      );
    } else {
      // Add new test parameter
      const newTestParameter = {
        ...testParameterData,
        id: `TP${String(Date.now()).slice(-3)}`
      };
      setTestParameters(prev => [...prev, newTestParameter]);
    }
    setIsDrawerOpen(false);
    setEditingTestParameter(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingTestParameter(null);
    setViewingTestParameter(null);
    setIsViewMode(false);
  };

  // Footer component for the drawer
  const drawerFooter = isViewMode ? (
    <div className="p-4">
      <div className="flex justify-end">
        <motion.button
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
          form="test-parameter-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingTestParameter ? 'Update Test Parameter' : 'Add Test Parameter'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
     

      {/* Test Parameter Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Parameters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{testParameters.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Parameters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {testParameters.filter(t => t.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Parameters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {testParameters.filter(t => t.status === 'Inactive').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Test Parameter Data Table */}
      <DataTable
        columns={columns}
        data={testParameters}
        loading={loading}
        searchPlaceholder="Search test parameters..."
        addButtonText="Add Test Parameter"
        onAdd={handleAddTestParameter}
        searchable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit/View Test Parameter Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          isViewMode 
            ? `View Test Parameter - ${viewingTestParameter?.testName || 'Test Parameter'}`
            : editingTestParameter 
              ? 'Edit Test Parameter' 
              : 'Add New Test Parameter'
        }
        size="xl"
        footer={drawerFooter}
      >
        <AddTestParameterForm
          onSave={handleSaveTestParameter}
          onCancel={handleCloseDrawer}
          isEditing={!!editingTestParameter}
          initialData={editingTestParameter || viewingTestParameter}
          isViewMode={isViewMode}
        />
      </Drawer>
    </div>
  );
};

export default TestParameters;
