import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, AlertTriangle, Shield, Droplets } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';

const Chemicals: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Mock chemical data
  const [chemicals] = useState([
    {
      id: 'CH001',
      name: 'Sodium Hydroxide',
      formula: 'NaOH',
      category: 'Base',
      concentration: '99.5%',
      hazardLevel: 'High',
      storageTemp: 'Room Temperature',
      expiryDate: '2025-12-31',
      supplier: 'ChemSupply Inc',
      status: 'Active',
      description: 'Strong base for pH adjustment'
    },
    {
      id: 'CH002',
      name: 'Hydrochloric Acid',
      formula: 'HCl',
      category: 'Acid',
      concentration: '37%',
      hazardLevel: 'High',
      storageTemp: 'Room Temperature',
      expiryDate: '2025-06-30',
      supplier: 'AcidCorp Ltd',
      status: 'Active',
      description: 'Strong acid for sample preparation'
    },
    {
      id: 'CH003',
      name: 'Ethanol',
      formula: 'C2H5OH',
      category: 'Solvent',
      concentration: '95%',
      hazardLevel: 'Medium',
      storageTemp: 'Cool Storage',
      expiryDate: '2025-03-15',
      supplier: 'Solvent Solutions',
      status: 'Active',
      description: 'Organic solvent for extractions'
    },
    {
      id: 'CH004',
      name: 'Potassium Permanganate',
      formula: 'KMnO4',
      category: 'Oxidizing Agent',
      concentration: '99%',
      hazardLevel: 'High',
      storageTemp: 'Cool Storage',
      expiryDate: '2024-12-31',
      supplier: 'OxidChem Corp',
      status: 'Expired',
      description: 'Strong oxidizing agent for titrations'
    },
    {
      id: 'CH005',
      name: 'Sodium Chloride',
      formula: 'NaCl',
      category: 'Salt',
      concentration: '99.9%',
      hazardLevel: 'Low',
      storageTemp: 'Room Temperature',
      expiryDate: '2026-01-01',
      supplier: 'SaltWorks Inc',
      status: 'Active',
      description: 'Standard salt for calibration'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getHazardColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Acid':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Base':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Solvent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Oxidizing Agent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Salt':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const columns: Column[] = [
    {
      key: 'id',
      title: 'Chemical ID',
      dataIndex: 'id',
      width: '100px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FlaskConical className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-primary-600 dark:text-primary-400">{value}</span>
        </div>
      )
    },
    {
      key: 'name',
      title: 'Chemical Name',
      dataIndex: 'name',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{record.formula}</div>
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
      key: 'concentration',
      title: 'Concentration',
      dataIndex: 'concentration',
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'hazardLevel',
      title: 'Hazard Level',
      dataIndex: 'hazardLevel',
      width: '120px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <AlertTriangle className={`w-3 h-3 mr-1 ${
            value === 'High' ? 'text-red-500' : 
            value === 'Medium' ? 'text-yellow-500' : 'text-green-500'
          }`} />
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getHazardColor(value)}`}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'storageTemp',
      title: 'Storage Temp',
      dataIndex: 'storageTemp',
      width: '140px',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'expiryDate',
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      width: '120px',
      sortable: true,
      render: (value) => {
        const isExpired = new Date(value) < new Date();
        return (
          <span className={`text-sm ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'supplier',
      title: 'Supplier',
      dataIndex: 'supplier',
      width: '140px',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
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

  const handleAddChemical = () => {
    console.log('Add new chemical');
  };

  const handleEditChemical = (record: any) => {
    console.log('Edit chemical:', record.id);
  };

  const handleViewChemical = (record: any) => {
    console.log('View chemical:', record.id);
  };

  const handleDeleteChemical = (record: any) => {
    if (window.confirm(`Are you sure you want to delete chemical ${record.name}?`)) {
      console.log('Delete chemical:', record.id);
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
          Chemicals
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage laboratory chemicals and reagents
        </p>
      </motion.div>

      {/* Chemical Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Chemicals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{chemicals.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Chemicals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chemicals.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Hazard</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chemicals.filter(c => c.hazardLevel === 'High').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chemicals.filter(c => c.status === 'Expired').length}
              </p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <Droplets className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chemical Data Table */}
      <DataTable
        columns={columns}
        data={chemicals}
        loading={loading}
        title="Chemical Inventory"
        searchPlaceholder="Search chemicals..."
        addButtonText="Add Chemical"
        onAdd={handleAddChemical}
        onEdit={handleEditChemical}
        onView={handleViewChemical}
        onDelete={handleDeleteChemical}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};

export default Chemicals;
