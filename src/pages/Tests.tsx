import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, FlaskConical, Clock, CheckCircle } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';

const Tests: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Mock test data
  const [tests] = useState([
    {
      id: 'T001',
      name: 'Pesticide Residue Analysis',
      category: 'Chemistry',
      method: 'GC-MS',
      duration: '24 hours',
      cost: '$150.00',
      status: 'Active',
      description: 'Analysis of pesticide residues in agricultural products'
    },
    {
      id: 'T002',
      name: 'Heavy Metal Testing',
      category: 'Chemistry',
      method: 'ICP-MS',
      duration: '48 hours',
      cost: '$200.00',
      status: 'Active',
      description: 'Detection of heavy metals in soil and water samples'
    },
    {
      id: 'T003',
      name: 'Microbiological Analysis',
      category: 'Microbiology',
      method: 'Culture Method',
      duration: '72 hours',
      cost: '$100.00',
      status: 'Active',
      description: 'Detection of pathogenic microorganisms'
    },
    {
      id: 'T004',
      name: 'Nutritional Analysis',
      category: 'Chemistry',
      method: 'HPLC',
      duration: '36 hours',
      cost: '$180.00',
      status: 'Inactive',
      description: 'Analysis of nutritional content in food products'
    },
    {
      id: 'T005',
      name: 'Allergen Testing',
      category: 'Immunology',
      method: 'ELISA',
      duration: '12 hours',
      cost: '$120.00',
      status: 'Active',
      description: 'Detection of food allergens'
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Chemistry':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Microbiology':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Immunology':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const columns: Column[] = [
    {
      key: 'id',
      title: 'Test ID',
      dataIndex: 'id',
      width: '100px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <TestTube className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-primary-600 dark:text-primary-400">{value}</span>
        </div>
      )
    },
    {
      key: 'name',
      title: 'Test Name',
      dataIndex: 'name',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{record.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      width: '120px',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'method',
      title: 'Method',
      dataIndex: 'method',
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'duration',
      title: 'Duration',
      dataIndex: 'duration',
      width: '100px',
      render: (value) => (
        <div className="flex items-center text-sm">
          <Clock className="w-3 h-3 text-gray-400 mr-1" />
          <span className="text-gray-600 dark:text-gray-400">{value}</span>
        </div>
      )
    },
    {
      key: 'cost',
      title: 'Cost',
      dataIndex: 'cost',
      width: '100px',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-white">{value}</span>
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

  const handleAddTest = () => {
    console.log('Add new test');
  };

  const handleEditTest = (record: any) => {
    console.log('Edit test:', record.id);
  };

  const handleViewTest = (record: any) => {
    console.log('View test:', record.id);
  };

  const handleDeleteTest = (record: any) => {
    if (window.confirm(`Are you sure you want to delete test ${record.name}?`)) {
      console.log('Delete test:', record.id);
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
          Tests
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage laboratory test procedures and methods
        </p>
      </motion.div>

      {/* Test Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tests.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <TestTube className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {tests.filter(t => t.status === 'Active').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chemistry Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {tests.filter(t => t.category === 'Chemistry').length}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Microbiology Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {tests.filter(t => t.category === 'Microbiology').length}
              </p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <TestTube className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Test Data Table */}
      <DataTable
        columns={columns}
        data={tests}
        loading={loading}
        title="Test Procedures"
        searchPlaceholder="Search tests..."
        addButtonText="Add Test"
        onAdd={handleAddTest}
        onEdit={handleEditTest}
        onView={handleViewTest}
        onDelete={handleDeleteTest}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};

export default Tests;
