import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Package, CheckCircle, AlertCircle, Save, X, Eye, Edit, MoreVertical, Trash2, ShoppingCart, Plus, Minus, History, TrendingUp, User } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import AddChemicalForm from '../components/AddChemicalForm';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';
import { useConfirmation } from '../hooks/useConfirmation';

const Chemicals: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingChemical, setEditingChemical] = useState<any>(null);
  const [viewingChemical, setViewingChemical] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});
  const [dropdownPositions, setDropdownPositions] = useState<Record<string, 'top' | 'bottom'>>({});

  // Inventory management state
  const [isInventoryDrawerOpen, setIsInventoryDrawerOpen] = useState(false);
  const [selectedChemicalForInventory, setSelectedChemicalForInventory] = useState<any>(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [selectedChemicalForHistory, setSelectedChemicalForHistory] = useState<any>(null);

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

  // Mock chemical data with inventory tracking
  const [chemicals, setChemicals] = useState([
    {
      id: 'CH001',
      name: 'Sodium Hydroxide',
      unit: 'kg',
      availability: 'In Stock',
      volume: 5.5,
      reorderQuantity: 10.0,
      price: 45.99,
      status: 'Active',
      inventoryHistory: [
        { id: 'IH001', date: '2024-01-15', type: 'Stock In', quantity: 20.0, reason: 'Initial stock', user: 'Admin', balance: 20.0 },
        { id: 'IH002', date: '2024-02-01', type: 'Usage', quantity: -5.0, reason: 'Lab Test - Sample Analysis', user: 'Lab Tech 1', balance: 15.0 },
        { id: 'IH003', date: '2024-02-15', type: 'Usage', quantity: -9.5, reason: 'Quality Control Testing', user: 'Lab Tech 2', balance: 5.5 }
      ]
    },
    {
      id: 'CH002',
      name: 'Hydrochloric Acid',
      unit: 'l',
      availability: 'Low Stock',
      volume: 2.3,
      reorderQuantity: 5.0,
      price: 32.50,
      status: 'Active',
      inventoryHistory: [
        { id: 'IH004', date: '2024-01-10', type: 'Stock In', quantity: 10.0, reason: 'Monthly supply', user: 'Admin', balance: 10.0 },
        { id: 'IH005', date: '2024-01-25', type: 'Usage', quantity: -3.2, reason: 'pH Testing', user: 'Lab Tech 1', balance: 6.8 },
        { id: 'IH006', date: '2024-02-10', type: 'Usage', quantity: -4.5, reason: 'Titration Analysis', user: 'Lab Tech 3', balance: 2.3 }
      ]
    },
    {
      id: 'CH003',
      name: 'Ethanol',
      unit: 'l',
      availability: 'In Stock',
      volume: 10.0,
      reorderQuantity: 15.0,
      price: 28.75,
      status: 'Active',
      inventoryHistory: [
        { id: 'IH007', date: '2024-01-20', type: 'Stock In', quantity: 25.0, reason: 'Bulk purchase', user: 'Admin', balance: 25.0 },
        { id: 'IH008', date: '2024-02-05', type: 'Usage', quantity: -8.0, reason: 'Sample preparation', user: 'Lab Tech 2', balance: 17.0 },
        { id: 'IH009', date: '2024-02-18', type: 'Usage', quantity: -7.0, reason: 'Equipment cleaning', user: 'Lab Tech 1', balance: 10.0 }
      ]
    },
    {
      id: 'CH004',
      name: 'Potassium Permanganate',
      unit: 'g',
      availability: 'Out of Stock',
      volume: 0,
      reorderQuantity: 500.0,
      price: 15.20,
      status: 'Inactive',
      inventoryHistory: [
        { id: 'IH010', date: '2024-01-05', type: 'Stock In', quantity: 1000.0, reason: 'Annual stock', user: 'Admin', balance: 1000.0 },
        { id: 'IH011', date: '2024-01-30', type: 'Usage', quantity: -500.0, reason: 'Oxidation tests', user: 'Lab Tech 3', balance: 500.0 },
        { id: 'IH012', date: '2024-02-20', type: 'Usage', quantity: -500.0, reason: 'Water treatment analysis', user: 'Lab Tech 2', balance: 0 }
      ]
    },
    {
      id: 'CH005',
      name: 'Sodium Chloride',
      unit: 'kg',
      availability: 'In Stock',
      volume: 25.0,
      reorderQuantity: 10.0,
      price: 12.99,
      status: 'Active',
      inventoryHistory: [
        { id: 'IH013', date: '2024-01-12', type: 'Stock In', quantity: 50.0, reason: 'Quarterly supply', user: 'Admin', balance: 50.0 },
        { id: 'IH014', date: '2024-02-01', type: 'Usage', quantity: -15.0, reason: 'Standard solution preparation', user: 'Lab Tech 1', balance: 35.0 },
        { id: 'IH015', date: '2024-02-12', type: 'Usage', quantity: -10.0, reason: 'Calibration standards', user: 'Lab Tech 3', balance: 25.0 }
      ]
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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const toggleActions = (id: string, event: React.MouseEvent) => {
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    const dropdownHeight = 200; // Approximate height of dropdown
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

  const handleAddChemical = () => {
    setEditingChemical(null);
    setViewingChemical(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditChemical = (record: any) => {
    setEditingChemical(record);
    setViewingChemical(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewChemical = (record: any) => {
    setViewingChemical(record);
    setEditingChemical(null);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteChemical = async (record: any) => {
    const confirmed = await confirmDelete(record.name, 'chemical');
    if (confirmed) {
      setChemicals(prev => prev.filter(chem => chem.id !== record.id));
    }
  };

  const handleOrderChemical = (record: any) => {
    console.log('Order chemical:', record.id);
    // You can implement order logic here
  };

  // Inventory management handlers
  const handleInventoryAdjustment = (record: any) => {
    setSelectedChemicalForInventory(record);
    setIsInventoryDrawerOpen(true);
  };

  const handleViewInventoryHistory = (record: any) => {
    setSelectedChemicalForHistory(record);
    setIsHistoryDrawerOpen(true);
  };

  const handleCloseInventoryDrawer = () => {
    setIsInventoryDrawerOpen(false);
    setSelectedChemicalForInventory(null);
  };

  const handleCloseHistoryDrawer = () => {
    setIsHistoryDrawerOpen(false);
    setSelectedChemicalForHistory(null);
  };

  const handleSaveInventoryAdjustment = (adjustmentData: any) => {
    if (selectedChemicalForInventory) {
      const newHistoryEntry = {
        id: `IH${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: adjustmentData.type,
        quantity: adjustmentData.type === 'Usage' ? -Math.abs(adjustmentData.quantity) : Math.abs(adjustmentData.quantity),
        reason: adjustmentData.reason,
        user: adjustmentData.user || 'Current User',
        balance: 0 // Will be calculated
      };

      setChemicals(prev => prev.map(chem => {
        if (chem.id === selectedChemicalForInventory.id) {
          const newVolume = chem.volume + newHistoryEntry.quantity;
          newHistoryEntry.balance = newVolume;

          // Update availability based on new volume
          let newAvailability = 'In Stock';
          if (newVolume <= 0) {
            newAvailability = 'Out of Stock';
          } else if (newVolume <= chem.reorderQuantity) {
            newAvailability = 'Low Stock';
          }

          return {
            ...chem,
            volume: Math.max(0, newVolume), // Prevent negative volume
            availability: newAvailability,
            inventoryHistory: [...chem.inventoryHistory, newHistoryEntry]
          };
        }
        return chem;
      }));
    }
    handleCloseInventoryDrawer();
  };

  const columns: Column[] = [
    {
      key: 'name',
      title: 'Chemical Name',
      dataIndex: 'name',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FlaskConical className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'unit',
      title: 'Unit',
      dataIndex: 'unit',
      width: '100px',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
          {value}
        </span>
      )
    },
    {
      key: 'availability',
      title: 'Availability',
      dataIndex: 'availability',
      width: '120px',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'volume',
      title: 'Volume',
      dataIndex: 'volume',
      width: '100px',
      sortable: true,
      render: (value, record) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value} {record.unit}
        </span>
      )
    },
    {
      key: 'price',
      title: 'Unit Price',
      dataIndex: 'price',
      width: '110px',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          ${value?.toFixed(2)}
        </span>
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
            onClick={() => handleViewChemical(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="View Chemical"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Edit Action - Pencil Icon */}
          <motion.button
            onClick={() => handleEditChemical(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit Chemical"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          {/* More Options - Vertical Ellipsis */}
          <div className="relative" data-dropdown-container>
            <motion.button
              onClick={(e) => toggleActions(record.id, e)}
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
                className={`absolute right-0 z-10 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 ${
                  dropdownPositions[record.id] === 'top' ? 'bottom-8' : 'top-8'
                }`}
              >
                <button
                  onClick={() => {
                    handleInventoryAdjustment(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Update Inventory
                </button>
                <button
                  onClick={() => {
                    handleViewInventoryHistory(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  View Inventory History
                </button>
                <button
                  onClick={() => {
                    handleDeleteChemical(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Chemical
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )
    }
  ];

  const handleSaveChemical = (chemicalData: any) => {
    if (editingChemical) {
      // Update existing chemical
      setChemicals(prev =>
        prev.map(chem =>
          chem.id === editingChemical.id ? { ...chemicalData, id: editingChemical.id } : chem
        )
      );
    } else {
      // Add new chemical
      const newChemical = {
        ...chemicalData,
        id: `CH${String(Date.now()).slice(-3)}`
      };
      setChemicals(prev => [...prev, newChemical]);
    }
    setIsDrawerOpen(false);
    setEditingChemical(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingChemical(null);
    setViewingChemical(null);
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
          form="chemical-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingChemical ? 'Update Chemical' : 'Add Chemical'}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chemicals.filter(c => c.availability === 'In Stock').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chemicals.filter(c => c.availability === 'Low Stock').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-full">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chemicals.filter(c => c.availability === 'Out of Stock').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chemical Data Table */}
      <DataTable
        columns={columns}
        data={chemicals}
        loading={loading}
        searchPlaceholder="Search chemicals..."
        addButtonText="Add Chemical"
        onAdd={handleAddChemical}
        searchable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit/View Chemical Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          isViewMode
            ? `View Chemical - ${viewingChemical?.name || 'Chemical'}`
            : editingChemical
              ? 'Edit Chemical'
              : 'Add New Chemical'
        }
        size="md"
        footer={drawerFooter}
      >
        <AddChemicalForm
          onSave={handleSaveChemical}
          onCancel={handleCloseDrawer}
          isEditing={!!editingChemical}
          initialData={editingChemical || viewingChemical}
          isViewMode={isViewMode}
        />
      </Drawer>

      {/* Inventory Adjustment Drawer */}
      <Drawer
        isOpen={isInventoryDrawerOpen}
        onClose={handleCloseInventoryDrawer}
        title={`Update Inventory - ${selectedChemicalForInventory?.name || 'Chemical'}`}
        size="lg"
        footer={
          <div className="p-4">
            <div className="flex items-center justify-end space-x-3">
              <motion.button
                type="button"
                onClick={handleCloseInventoryDrawer}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                form="inventory-adjustment-form"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Inventory
              </motion.button>
            </div>
          </div>
        }
      >
        <InventoryAdjustmentForm
          chemical={selectedChemicalForInventory}
          onSave={handleSaveInventoryAdjustment}
          onCancel={handleCloseInventoryDrawer}
        />
      </Drawer>

      {/* Inventory History Drawer */}
      <Drawer
        isOpen={isHistoryDrawerOpen}
        onClose={handleCloseHistoryDrawer}
        title={`Inventory History - ${selectedChemicalForHistory?.name || 'Chemical'}`}
        size="3xl"
        footer={
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
        }
      >
        <InventoryHistoryView
          chemical={selectedChemicalForHistory}
        />
      </Drawer>
    </div>
  );
};

// Inventory Adjustment Form Component
const InventoryAdjustmentForm: React.FC<{
  chemical: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ chemical, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'Stock In',
    quantity: '',
    reason: '',
    user: 'Current User'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const adjustmentTypes = [
    { value: 'Stock In', label: 'Stock In (Add Stock)' },
    { value: 'Usage', label: 'Usage (Remove Stock)' },
    { value: 'Waste', label: 'Waste/Disposal' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    if (!formData.user.trim()) {
      newErrors.user = 'User is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        quantity: parseFloat(formData.quantity)
      });
    }
  };

  return (
    <form id="inventory-adjustment-form" onSubmit={handleSubmit} className="space-y-6 p-6">
       <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800 p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Chemical:</span>
            <span className="ml-2 font-medium">{chemical?.name}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Current Volume:</span>
            <span className="ml-2 font-medium">{chemical?.volume} {chemical?.unit}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Availability:</span>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${chemical?.availability === 'In Stock' ? 'bg-green-100 text-green-800' : chemical?.availability === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {chemical?.availability}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Reorder Level:</span>
            <span className="ml-2 font-medium">{chemical?.reorderQuantity} {chemical?.unit}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label htmlFor="type" required>Type</Label>
          <CustomSelect
            value={formData.type}
            onChange={(value) => handleInputChange('type', value)}
            options={adjustmentTypes}
            placeholder="Select adjustment type"
            error={errors.type}
          />
        </div>

        <div>
          <Input
            label="Quantity"
            required
            type="number"
            min="0"
            step="0.1"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder={`Enter quantity in ${chemical?.unit}`}
            error={errors.quantity}
          />
        </div>
      </div>

      <div>
        <Input
          label="Reason"
          required
          value={formData.reason}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          placeholder="Enter reason for adjustment"
          error={errors.reason}
        />
      </div>

      <div>
        <Input
          label="User"
          required
          value={formData.user}
          onChange={(e) => handleInputChange('user', e.target.value)}
          placeholder="Enter user name"
          error={errors.user}
        />
      </div>
    </form>
  );
};

// Inventory History View Component
const InventoryHistoryView: React.FC<{
  chemical: any;
}> = ({ chemical }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Stock In':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Usage':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Adjustment':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Waste':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Stock In':
        return <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'Usage':
        return <Minus className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Adjustment':
        return <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'Waste':
        return <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const inventoryHistory = chemical?.inventoryHistory || [];

  const columns: Column[] = [
    {
      key: 'date',
      title: 'Date',
      dataIndex: 'date',
      width: '180px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FlaskConical className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDate(value)}
          </span>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      width: '120px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getTypeIcon(value)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(value)}`}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'quantity',
      title: 'Quantity',
      dataIndex: 'quantity',
      width: '120px',
      sortable: true,
      render: (value, record) => (
        <div className="text-left">
          <div className={`text-sm font-medium ${value > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {value > 0 ? '+' : ''}{value} {chemical?.unit}
          </div>
        </div>
      )
    },
    {
      key: 'balance',
      title: 'Balance',
      dataIndex: 'balance',
      width: '120px',
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {value} {chemical?.unit}
        </span>
      )
    },
    {
      key: 'user',
      title: 'Performed By',
      dataIndex: 'user',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <User className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'reason',
      title: 'Reason',
      dataIndex: 'reason',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={value}>
            {value || 'No reason provided'}
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Chemical Information Header */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chemical Name</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {chemical?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Stock</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">
              {chemical?.volume} {chemical?.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reorder Level</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {chemical?.reorderQuantity} {chemical?.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Availability</p>
            <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${chemical?.availability === 'In Stock' ? 'bg-green-100 text-green-800' : chemical?.availability === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
              {chemical?.availability}
            </p>
          </div>
        </div>
      </div>

      {/* Inventory Statistics */}

      {/* Inventory History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Records
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Detailed history of all inventory transactions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock In</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {inventoryHistory.filter((record: any) => record.type === 'Stock In').length}
                  </p>
                </div>
                <Plus className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usage</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {inventoryHistory.filter((record: any) => record.type === 'Usage').length}
                  </p>
                </div>
                <Minus className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Updates</p>
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {inventoryHistory.filter((record: any) => record.type === 'Adjustment').length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Update </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {inventoryHistory.length > 0 ? formatDate(inventoryHistory[inventoryHistory.length - 1]?.date) : 'N/A'}
                  </p>
                </div>
                <History className="w-8 h-8 text-primary-500" />
              </div>
            </motion.div>
          </div>

        </div>

        <DataTable
          columns={columns}
          data={inventoryHistory}
          loading={false}
          searchPlaceholder="Search inventory records..."
          searchable={true}
          pagination={true}
          pageSize={10}
        />
      </div>

      {/* Empty State */}
      {inventoryHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Inventory History
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This chemical has no inventory transactions recorded yet.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Chemicals;