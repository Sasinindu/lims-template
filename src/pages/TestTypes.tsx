import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, CheckCircle, XCircle, Save, X } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import AddTestTypeForm from '../components/AddTestTypeForm';

const TestTypes: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTestType, setEditingTestType] = useState<any>(null);

  // Mock test type data
  const [testTypes, setTestTypes] = useState([
    {
      id: 'TT001',
      name: 'Blood Chemistry',
      status: 'Active'
    },
    {
      id: 'TT002',
      name: 'Microbiology',
      status: 'Active'
    },
    {
      id: 'TT003',
      name: 'Hematology',
      status: 'Active'
    },
    {
      id: 'TT004',
      name: 'Immunology',
      status: 'Inactive'
    },
    {
      id: 'TT005',
      name: 'Pathology',
      status: 'Active'
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
      key: 'name',
      title: 'Test Name',
      dataIndex: 'name',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <TestTube className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
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
    }
  ];

  const handleAddTestType = () => {
    setEditingTestType(null);
    setIsDrawerOpen(true);
  };

  const handleEditTestType = (record: any) => {
    setEditingTestType(record);
    setIsDrawerOpen(true);
  };

  const handleViewTestType = (record: any) => {
    console.log('View test type:', record.id);
  };

  const handleDeleteTestType = (record: any) => {
    if (window.confirm(`Are you sure you want to delete test type "${record.name}"?`)) {
      setTestTypes(prev => prev.filter(testType => testType.id !== record.id));
    }
  };

  const handleSaveTestType = (testTypeData: any) => {
    if (editingTestType) {
      // Update existing test type
      setTestTypes(prev => 
        prev.map(testType => 
          testType.id === editingTestType.id ? { ...testTypeData, id: editingTestType.id } : testType
        )
      );
    } else {
      // Add new test type
      const newTestType = {
        ...testTypeData,
        id: `TT${String(Date.now()).slice(-3)}`
      };
      setTestTypes(prev => [...prev, newTestType]);
    }
    setIsDrawerOpen(false);
    setEditingTestType(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingTestType(null);
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
          form="test-type-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingTestType ? 'Update Test Type' : 'Add Test Type'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Test Types
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage laboratory test types and categories
        </p>
      </motion.div>

      {/* Test Type Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Test Types</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{testTypes.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <TestTube className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Test Types</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {testTypes.filter(t => t.status === 'Active').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Test Types</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {testTypes.filter(t => t.status === 'Inactive').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Test Type Data Table */}
      <DataTable
        columns={columns}
        data={testTypes}
        loading={loading}
        searchPlaceholder="Search test types..."
        addButtonText="Add Test Type"
        onAdd={handleAddTestType}
        onEdit={handleEditTestType}
        onView={handleViewTestType}
        onDelete={handleDeleteTestType}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit Test Type Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingTestType ? 'Edit Test Type' : 'Add New Test Type'}
        size="sm"
        footer={drawerFooter}
      >
        <AddTestTypeForm
          onSave={handleSaveTestType}
          onCancel={handleCloseDrawer}
          isEditing={!!editingTestType}
          initialData={editingTestType}
        />
      </Drawer>
    </div>
  );
};

export default TestTypes;
