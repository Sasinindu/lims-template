import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Wheat, Apple, Carrot, Coffee } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';

const Commodities: React.FC = () => {
  const [loading] = useState(false);

  // Mock commodity data
  const [commodities] = useState([
    {
      id: 'C001',
      name: 'Wheat',
      category: 'Grains',
      origin: 'USA',
      harvestSeason: 'Summer',
      shelfLife: '12 months',
      storageTemp: '15-20°C',
      status: 'Active',
      description: 'High-quality wheat for food processing'
    },
    {
      id: 'C002',
      name: 'Coffee Beans',
      category: 'Beverages',
      origin: 'Colombia',
      harvestSeason: 'Year-round',
      shelfLife: '24 months',
      storageTemp: '10-15°C',
      status: 'Active',
      description: 'Premium Arabica coffee beans'
    },
    {
      id: 'C003',
      name: 'Apples',
      category: 'Fruits',
      origin: 'Chile',
      harvestSeason: 'Fall',
      shelfLife: '6 months',
      storageTemp: '0-4°C',
      status: 'Active',
      description: 'Fresh apples for export'
    },
    {
      id: 'C004',
      name: 'Carrots',
      category: 'Vegetables',
      origin: 'Netherlands',
      harvestSeason: 'Spring/Fall',
      shelfLife: '3 months',
      storageTemp: '0-2°C',
      status: 'Active',
      description: 'Organic carrots for retail'
    },
    {
      id: 'C005',
      name: 'Rice',
      category: 'Grains',
      origin: 'Thailand',
      harvestSeason: 'Year-round',
      shelfLife: '18 months',
      storageTemp: '15-20°C',
      status: 'Inactive',
      description: 'Long-grain white rice'
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Grains':
        return <Wheat className="w-4 h-4" />;
      case 'Fruits':
        return <Apple className="w-4 h-4" />;
      case 'Vegetables':
        return <Carrot className="w-4 h-4" />;
      case 'Beverages':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Grains':
        return 'text-yellow-600';
      case 'Fruits':
        return 'text-red-600';
      case 'Vegetables':
        return 'text-green-600';
      case 'Beverages':
        return 'text-brown-600';
      default:
        return 'text-gray-600';
    }
  };

  const columns: Column[] = [
    {
      key: 'id',
      title: 'Commodity ID',
      dataIndex: 'id',
      width: '120px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-primary-600 dark:text-primary-400">{value}</span>
        </div>
      )
    },
    {
      key: 'name',
      title: 'Commodity Name',
      dataIndex: 'name',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <div className={`mr-2 ${getCategoryColor(record.category)}`}>
            {getCategoryIcon(record.category)}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{record.description}</div>
          </div>
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
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {value}
        </span>
      )
    },
    {
      key: 'origin',
      title: 'Origin',
      dataIndex: 'origin',
      width: '100px',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'harvestSeason',
      title: 'Harvest Season',
      dataIndex: 'harvestSeason',
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'shelfLife',
      title: 'Shelf Life',
      dataIndex: 'shelfLife',
      width: '100px',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'storageTemp',
      title: 'Storage Temp',
      dataIndex: 'storageTemp',
      width: '120px',
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

  const handleAddCommodity = () => {
    console.log('Add new commodity');
  };

  const handleEditCommodity = (record: any) => {
    console.log('Edit commodity:', record.id);
  };

  const handleViewCommodity = (record: any) => {
    console.log('View commodity:', record.id);
  };

  const handleDeleteCommodity = (record: any) => {
    if (window.confirm(`Are you sure you want to delete commodity ${record.name}?`)) {
      console.log('Delete commodity:', record.id);
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
          Commodities
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage agricultural commodities and products
        </p>
      </motion.div>

      {/* Commodity Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Commodities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{commodities.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Commodities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {commodities.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Grains</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {commodities.filter(c => c.category === 'Grains').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-full">
              <Wheat className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fruits & Vegetables</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {commodities.filter(c => ['Fruits', 'Vegetables'].includes(c.category)).length}
              </p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <Apple className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Commodity Data Table */}
      <DataTable
        columns={columns}
        data={commodities}
        loading={loading}
        searchPlaceholder="Search commodities..."
        addButtonText="Add Commodity"
        onAdd={handleAddCommodity}
        onEdit={handleEditCommodity}
        onView={handleViewCommodity}
        onDelete={handleDeleteCommodity}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};

export default Commodities;
