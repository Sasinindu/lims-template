import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, TestTube, DollarSign, Save, X, Eye, Edit, MoreVertical, Trash2, Plus } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import AddGroupMasterForm from '../components/AddGroupMasterForm';
import { useConfirmation } from '../hooks/useConfirmation';

const GroupMaster: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [viewingGroup, setViewingGroup] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});
  const [dropdownPositions, setDropdownPositions] = useState<Record<string, 'top' | 'bottom'>>({});

  // Use confirmation hook
  const { confirmDelete } = useConfirmation();

  // Click outside handler for dropdowns
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

  // Mock group master data
  const [groups, setGroups] = useState([
    {
      id: 'GM001',
      customer: { id: 'C001', name: 'ABC Corporation' },
      commodityCategory: { id: 'CC001', name: 'Food Products' },
      commoditySubCategory: { id: 'CSC001', name: 'Dairy Products' },
      commodity: { id: 'COM001', name: 'Milk Powder' },
      testParameter: { id: 'TP001', name: 'Microbiological Testing' },
      price: 250.00,
      status: 'Active'
    },
    {
      id: 'GM002',
      customer: { id: 'C002', name: 'XYZ Industries' },
      commodityCategory: { id: 'CC002', name: 'Chemical Products' },
      commoditySubCategory: { id: 'CSC002', name: 'Industrial Chemicals' },
      commodity: { id: 'COM002', name: 'Sodium Hydroxide' },
      testParameter: { id: 'TP002', name: 'Chemical Analysis' },
      price: 180.00,
      status: 'Active'
    },
    {
      id: 'GM003',
      customer: { id: 'C003', name: 'Ministry of Health' },
      commodityCategory: { id: 'CC003', name: 'Pharmaceutical' },
      commoditySubCategory: { id: 'CSC003', name: 'Tablets' },
      commodity: { id: 'COM003', name: 'Paracetamol Tablets' },
      testParameter: { id: 'TP003', name: 'Drug Potency Test' },
      price: 320.00,
      status: 'Active'
    },
    {
      id: 'GM004',
      customer: { id: 'C004', name: 'University of Science' },
      commodityCategory: { id: 'CC001', name: 'Food Products' },
      commoditySubCategory: { id: 'CSC004', name: 'Beverages' },
      commodity: { id: 'COM004', name: 'Fruit Juice' },
      testParameter: { id: 'TP004', name: 'Nutritional Analysis' },
      price: 150.00,
      status: 'Active'
    },
    {
      id: 'GM005',
      customer: { id: 'C005', name: 'Old Company Ltd' },
      commodityCategory: { id: 'CC002', name: 'Chemical Products' },
      commoditySubCategory: { id: 'CSC005', name: 'Cleaning Agents' },
      commodity: { id: 'COM005', name: 'Detergent Powder' },
      testParameter: { id: 'TP005', name: 'Quality Control Test' },
      price: 95.00,
      status: 'Inactive'
    }
  ]);

  const toggleActions = (id: string, event: React.MouseEvent) => {
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const dropdownHeight = 160; // Approximate height of dropdown
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    setDropdownPositions(prev => ({
      ...prev,
      [id]: spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'top' : 'bottom'
    }));
    
    setShowActions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setViewingGroup(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditGroup = (record: any) => {
    setEditingGroup(record);
    setViewingGroup(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewGroup = (record: any) => {
    setViewingGroup(record);
    setEditingGroup(null);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteGroup = async (record: any) => {
    const confirmed = await confirmDelete(record.customer.name + ' - ' + record.commodity.name, 'generic');
    if (confirmed) {
      setGroups(prev => prev.filter(group => group.id !== record.id));
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingGroup(null);
    setViewingGroup(null);
    setIsViewMode(false);
  };

  const columns: Column[] = [
    {
      key: 'customer',
      title: 'Customer',
      dataIndex: 'customer',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value.name}</span>
        </div>
      )
    },
    {
      key: 'commodityCategory',
      title: 'Category',
      dataIndex: 'commodityCategory',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value.name}</span>
      )
    },
    {
      key: 'commodity',
      title: 'Commodity',
      dataIndex: 'commodity',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm text-gray-900 dark:text-white">{value.name}</span>
        </div>
      )
    },
    {
      key: 'testParameter',
      title: 'Test Parameter',
      dataIndex: 'testParameter',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <TestTube className="w-4 h-4 text-purple-600 mr-2" />
          <span className="text-sm text-gray-900 dark:text-white">{value.name}</span>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      width: '120px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Rs. {value.toFixed(2)}
          </span>
        </div>
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
            onClick={() => handleViewGroup(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="View Group"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Edit Action - Pencil Icon */}
          <motion.button
            onClick={() => handleEditGroup(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit Group"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={() => handleDeleteGroup(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Delete Group"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>

         
        </div>
      )
    }
  ];

  const handleSaveGroup = (groupData: any) => {
    if (editingGroup) {
      // Update existing group
      setGroups(prev =>
        prev.map(group =>
          group.id === editingGroup.id ? { ...groupData, id: editingGroup.id } : group
        )
      );
    } else {
      // Add new group
      const newGroup = {
        ...groupData,
        id: `GM${String(Date.now()).slice(-3)}`
      };
      setGroups(prev => [...prev, newGroup]);
    }
    handleCloseDrawer();
  };

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
          form="group-master-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingGroup ? 'Update Group' : 'Save Group'}
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Group Master</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer-commodity-test parameter groups and pricing</p>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Groups</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {groups.length}
              </p>
            </div>
            <div className="p-3 bg-primary-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Groups</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {groups.filter(g => g.status === 'Active').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Rs. {(groups.reduce((sum, g) => sum + g.price, 0) / groups.length).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Test Parameters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(groups.map(g => g.testParameter.id)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <TestTube className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Group Master Data Table */}
      <DataTable
        columns={columns}
        data={groups}
        loading={loading}
        searchPlaceholder="Search groups..."
        addButtonText="Add Group"
        onAdd={handleAddGroup}
        searchable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit/View Group Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          isViewMode 
            ? `View Group - ${viewingGroup?.customer?.name || 'Group'}`
            : editingGroup 
              ? 'Edit Group' 
              : 'Add New Group'
        }
        size="lg"
        footer={drawerFooter}
      >
        <AddGroupMasterForm
          onSave={handleSaveGroup}
          onCancel={handleCloseDrawer}
          isEditing={!!editingGroup}
          initialData={editingGroup || viewingGroup}
          isViewMode={isViewMode}
        />
      </Drawer>
    </div>
  );
};

export default GroupMaster; 