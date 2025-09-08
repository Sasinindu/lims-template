import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckCircle, XCircle, Save, X } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import AddTestParameterForm from '../components/AddTestParameterForm';

const TestParameters: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTestParameter, setEditingTestParameter] = useState<any>(null);

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
    }
  ];

  const handleAddTestParameter = () => {
    setEditingTestParameter(null);
    setIsDrawerOpen(true);
  };

  const handleEditTestParameter = (record: any) => {
    setEditingTestParameter(record);
    setIsDrawerOpen(true);
  };

  const handleViewTestParameter = (record: any) => {
    console.log('View test parameter:', record.id);
  };

  const handleDeleteTestParameter = (record: any) => {
    if (window.confirm(`Are you sure you want to delete test parameter "${record.testName}"?`)) {
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
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Test Parameters
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure test parameters, chemicals, and protocols
        </p>
      </motion.div>

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
        onEdit={handleEditTestParameter}
        onView={handleViewTestParameter}
        onDelete={handleDeleteTestParameter}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit Test Parameter Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingTestParameter ? 'Edit Test Parameter' : 'Add New Test Parameter'}
        size="xl"
        footer={drawerFooter}
      >
        <AddTestParameterForm
          onSave={handleSaveTestParameter}
          onCancel={handleCloseDrawer}
          isEditing={!!editingTestParameter}
          initialData={editingTestParameter}
        />
      </Drawer>
    </div>
  );
};

export default TestParameters;
