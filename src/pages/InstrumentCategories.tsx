import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Edit, Eye, Trash2, Save, X, Check, CircleXIcon, MoreVertical } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import AddInstrumentCategoryForm from '../components/AddInstrumentCategoryForm';
import { useConfirmation } from '../hooks/useConfirmation';

const InstrumentCategories: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [viewingCategory, setViewingCategory] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});

  // Use confirmation hook
  const { confirmDelete } = useConfirmation();

  // Mock instrument category data
  const [categories, setCategories] = useState([
    {
      id: 'IC001',
      categoryName: 'Analytical Instruments',
      status: 'Active',
      description: 'Instruments for chemical analysis and testing'
    },
    {
      id: 'IC002',
      categoryName: 'Measurement Equipment',
      status: 'Active',
      description: 'Precision measurement and calibration equipment'
    },
    {
      id: 'IC003',
      categoryName: 'Sample Preparation',
      status: 'Active',
      description: 'Equipment for sample preparation and processing'
    },
    {
      id: 'IC004',
      categoryName: 'Environmental Monitoring',
      status: 'Inactive',
      description: 'Instruments for environmental parameter monitoring'
    },
    {
      id: 'IC005',
      categoryName: 'Safety Equipment',
      status: 'Active',
      description: 'Safety and protective equipment for laboratory use'
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

  const toggleActions = (id: string) => {
    setShowActions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const columns: Column[] = [
    {
      key: 'id',
      title: 'Category ID',
      dataIndex: 'id',
      width: '120px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Building2 className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-primary-600 dark:text-primary-400">{value}</span>
        </div>
      )
    },
    {
      key: 'categoryName',
      title: 'Category Name',
      dataIndex: 'categoryName',
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900 dark:text-white">{value}</div>
      )
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
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
    },
    {
      key: 'actions',
      title: 'Actions',
      width: '200px',
      sortable: false,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          {/* View Action - Eye Icon */}
          <motion.button
            onClick={() => handleViewCategory(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="View Category"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Edit Action - Pencil Icon */}
          <motion.button
            onClick={() => handleEditCategory(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={() => handleDeleteCategory(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      )
    }
  ];

  const handleAddCategory = () => {
    setEditingCategory(null);
    setViewingCategory(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditCategory = (record: any) => {
    setEditingCategory(record);
    setViewingCategory(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewCategory = (record: any) => {
    setViewingCategory(record);
    setEditingCategory(null);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteCategory = async (record: any) => {
    console.log('Delete category button clicked for:', record.categoryName); // Debug log
    
    const confirmed = await confirmDelete(record.categoryName, 'instrument');
    
    if (confirmed) {
      console.log('Delete category:', record.id);
      setCategories(prev => prev.filter(cat => cat.id !== record.id));
    }
  };

  const handleSaveCategory = (categoryData: any) => {
    if (editingCategory) {
      // Update existing category
      setCategories(prev => 
        prev.map(cat => 
          cat.id === editingCategory.id ? { ...categoryData, id: editingCategory.id } : cat
        )
      );
    } else {
      // Add new category
      setCategories(prev => [...prev, categoryData]);
    }
    setIsDrawerOpen(false);
    setEditingCategory(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCategory(null);
    setViewingCategory(null);
    setIsViewMode(false);
  };

  // Footer component for the drawer
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
          form="category-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingCategory ? 'Update Category' : 'Add Category'}
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
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.filter(c => c.status === 'Active').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.filter(c => c.status === 'Inactive').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <CircleXIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Data Table */}
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        searchPlaceholder="Search categories..."
        addButtonText="Add Category"
        onAdd={handleAddCategory}
        searchable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit/View Category Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          isViewMode 
            ? `View Category - ${viewingCategory?.categoryName || ''}` 
            : editingCategory 
              ? 'Edit Category' 
              : 'Add New Category'
        }
        size="md"
        footer={drawerFooter}
      >
        <AddInstrumentCategoryForm
          onSave={handleSaveCategory}
          onCancel={handleCloseDrawer}
          isEditing={!!editingCategory}
          initialData={isViewMode ? viewingCategory : editingCategory}
          isViewMode={isViewMode}
        />
      </Drawer>
    </div>
  );
};

export default InstrumentCategories;
