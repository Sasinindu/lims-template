import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight, CheckCircle, XCircle, Save, X } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';

const Commodities: React.FC = () => {
  const [activeSection, setActiveSection] = useState('categories');

  const sections = [
    {
      id: 'categories',
      title: 'Commodity Categories',
      description: 'Manage commodity categories',
      icon: Package
    },
    {
      id: 'subcategories',
      title: 'Commodity Sub Categories',
      description: 'Manage commodity sub categories',
      icon: Package
    },
    {
      id: 'commodities',
      title: 'Commodities',
      description: 'Manage commodities',
      icon: Package
    }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'categories':
        return <CommodityCategories />;
      case 'subcategories':
        return <CommoditySubCategories />;
      case 'commodities':
        return <CommoditiesForm />;
      default:
        return <CommodityCategories />;
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
          Manage commodity categories, sub categories, and commodities
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sections
            </h3>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{section.title}</div>
                        <div className="text-xs opacity-75">{section.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Commodity Categories Component
const CommodityCategories: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [categories, setCategories] = useState([
    { id: 'CC001', name: 'Food & Beverages', status: 'Active' },
    { id: 'CC002', name: 'Pharmaceuticals', status: 'Active' },
    { id: 'CC003', name: 'Chemicals', status: 'Active' },
    { id: 'CC004', name: 'Textiles', status: 'Inactive' },
    { id: 'CC005', name: 'Electronics', status: 'Active' }
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
      key: 'name',
      title: 'Category Name',
      dataIndex: 'name',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-primary-600 mr-2" />
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

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsDrawerOpen(true);
  };

  const handleEditCategory = (record: any) => {
    setEditingCategory(record);
    setIsDrawerOpen(true);
  };

  const handleViewCategory = (record: any) => {
    console.log('View category:', record.id);
  };

  const handleDeleteCategory = (record: any) => {
    if (window.confirm(`Are you sure you want to delete category "${record.name}"?`)) {
      setCategories(prev => prev.filter(cat => cat.id !== record.id));
    }
  };

  const handleSaveCategory = (categoryData: any) => {
    if (editingCategory) {
      setCategories(prev => 
        prev.map(cat => 
          cat.id === editingCategory.id ? { ...categoryData, id: editingCategory.id } : cat
        )
      );
    } else {
      const newCategory = {
        ...categoryData,
        id: `CC${String(Date.now()).slice(-3)}`
      };
      setCategories(prev => [...prev, newCategory]);
    }
    setIsDrawerOpen(false);
    setEditingCategory(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCategory(null);
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
              <Package className="w-6 h-6 text-white" />
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
              <CheckCircle className="w-6 h-6 text-white" />
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
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories Data Table */}
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        searchPlaceholder="Search categories..."
        addButtonText="Add Category"
        onAdd={handleAddCategory}
        onEdit={handleEditCategory}
        onView={handleViewCategory}
        onDelete={handleDeleteCategory}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit Category Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
        footer={drawerFooter}
      >
        <CategoryForm
          onSave={handleSaveCategory}
          onCancel={handleCloseDrawer}
          isEditing={!!editingCategory}
          initialData={editingCategory}
        />
      </Drawer>
    </div>
  );
};

// Commodity Sub Categories Component
const CommoditySubCategories: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

  const [subCategories, setSubCategories] = useState([
    { id: 'CSC001', name: 'Dairy Products', category: 'Food & Beverages', status: 'Active' },
    { id: 'CSC002', name: 'Medicines', category: 'Pharmaceuticals', status: 'Active' },
    { id: 'CSC003', name: 'Laboratory Chemicals', category: 'Chemicals', status: 'Active' },
    { id: 'CSC004', name: 'Cotton', category: 'Textiles', status: 'Inactive' },
    { id: 'CSC005', name: 'Mobile Phones', category: 'Electronics', status: 'Active' }
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
      key: 'name',
      title: 'Sub Category Name',
      dataIndex: 'name',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
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

  const handleAddSubCategory = () => {
    setEditingSubCategory(null);
    setIsDrawerOpen(true);
  };

  const handleEditSubCategory = (record: any) => {
    setEditingSubCategory(record);
    setIsDrawerOpen(true);
  };

  const handleViewSubCategory = (record: any) => {
    console.log('View sub category:', record.id);
  };

  const handleDeleteSubCategory = (record: any) => {
    if (window.confirm(`Are you sure you want to delete sub category "${record.name}"?`)) {
      setSubCategories(prev => prev.filter(sub => sub.id !== record.id));
    }
  };

  const handleSaveSubCategory = (subCategoryData: any) => {
    if (editingSubCategory) {
      setSubCategories(prev => 
        prev.map(sub => 
          sub.id === editingSubCategory.id ? { ...subCategoryData, id: editingSubCategory.id } : sub
        )
      );
    } else {
      const newSubCategory = {
        ...subCategoryData,
        id: `CSC${String(Date.now()).slice(-3)}`
      };
      setSubCategories(prev => [...prev, newSubCategory]);
    }
    setIsDrawerOpen(false);
    setEditingSubCategory(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingSubCategory(null);
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
          form="subcategory-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingSubCategory ? 'Update Sub Category' : 'Add Sub Category'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sub Category Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sub Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{subCategories.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sub Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {subCategories.filter(sc => sc.status === 'Active').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Sub Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {subCategories.filter(sc => sc.status === 'Inactive').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sub Categories Data Table */}
      <DataTable
        columns={columns}
        data={subCategories}
        loading={loading}
        searchPlaceholder="Search sub categories..."
        addButtonText="Add Sub Category"
        onAdd={handleAddSubCategory}
        onEdit={handleEditSubCategory}
        onView={handleViewSubCategory}
        onDelete={handleDeleteSubCategory}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Add/Edit Sub Category Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingSubCategory ? 'Edit Sub Category' : 'Add New Sub Category'}
        size="md"
        footer={drawerFooter}
      >
        <SubCategoryForm
          onSave={handleSaveSubCategory}
          onCancel={handleCloseDrawer}
          isEditing={!!editingSubCategory}
          initialData={editingSubCategory}
        />
      </Drawer>
    </div>
  );
};

// Commodities Form Component
const CommoditiesForm: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCommodity, setEditingCommodity] = useState<any>(null);

  const [commodities, setCommodities] = useState([
    { id: 'C001', category: 'Food & Beverages', subCategory: 'Dairy Products', commodity: 'Milk', status: 'Active' },
    { id: 'C002', category: 'Pharmaceuticals', subCategory: 'Medicines', commodity: 'Paracetamol', status: 'Active' },
    { id: 'C003', category: 'Chemicals', subCategory: 'Laboratory Chemicals', commodity: 'Sodium Chloride', status: 'Active' },
    { id: 'C004', category: 'Textiles', subCategory: 'Cotton', commodity: 'Cotton Fabric', status: 'Inactive' },
    { id: 'C005', category: 'Electronics', subCategory: 'Mobile Phones', commodity: 'iPhone', status: 'Active' }
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
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'subCategory',
      title: 'Sub Category',
      dataIndex: 'subCategory',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'commodity',
      title: 'Commodity',
      dataIndex: 'commodity',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-primary-600 mr-2" />
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

  const handleAddCommodity = () => {
    setEditingCommodity(null);
    setIsDrawerOpen(true);
  };

  const handleEditCommodity = (record: any) => {
    setEditingCommodity(record);
    setIsDrawerOpen(true);
  };

  const handleViewCommodity = (record: any) => {
    console.log('View commodity:', record.id);
  };

  const handleDeleteCommodity = (record: any) => {
    if (window.confirm(`Are you sure you want to delete commodity "${record.commodity}"?`)) {
      setCommodities(prev => prev.filter(com => com.id !== record.id));
    }
  };

  const handleSaveCommodity = (commodityData: any) => {
    if (editingCommodity) {
      setCommodities(prev => 
        prev.map(com => 
          com.id === editingCommodity.id ? { ...commodityData, id: editingCommodity.id } : com
        )
      );
    } else {
      const newCommodity = {
        ...commodityData,
        id: `C${String(Date.now()).slice(-3)}`
      };
      setCommodities(prev => [...prev, newCommodity]);
    }
    setIsDrawerOpen(false);
    setEditingCommodity(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCommodity(null);
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
          form="commodity-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingCommodity ? 'Update Commodity' : 'Add Commodity'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Commodity Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Commodities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {commodities.filter(c => c.status === 'Inactive').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Commodities Data Table */}
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

      {/* Add/Edit Commodity Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingCommodity ? 'Edit Commodity' : 'Add New Commodity'}
        size="md"
        footer={drawerFooter}
      >
        <CommodityForm
          onSave={handleSaveCommodity}
          onCancel={handleCloseDrawer}
          isEditing={!!editingCommodity}
          initialData={editingCommodity}
        />
      </Drawer>
    </div>
  );
};

// Form Components using same components as AddTestParameterForm
const CategoryForm: React.FC<{
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}> = ({ onSave, onCancel, isEditing = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    status: initialData?.status || 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form id="category-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <Label htmlFor="name" required>
          Category Name
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter category name"
          error={errors.name}
        />
      </div>
      <div>
        <Label htmlFor="status" required>
          Status
        </Label>
        <CustomSelect
          value={formData.status}
          onChange={(value) => handleInputChange('status', value)}
          options={statusOptions}
          placeholder="Select status"
          error={errors.status}
        />
      </div>
    </form>
  );
};

const SubCategoryForm: React.FC<{
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}> = ({ onSave, onCancel, isEditing = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    status: initialData?.status || 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { value: 'Food & Beverages', label: 'Food & Beverages' },
    { value: 'Pharmaceuticals', label: 'Pharmaceuticals' },
    { value: 'Chemicals', label: 'Chemicals' },
    { value: 'Textiles', label: 'Textiles' },
    { value: 'Electronics', label: 'Electronics' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Sub category name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form id="subcategory-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <Label htmlFor="name" required>
          Sub Category Name
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter sub category name"
          error={errors.name}
        />
      </div>
      <div>
        <Label htmlFor="category" required>
          Category
        </Label>
        <CustomSelect
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          options={categoryOptions}
          placeholder="Select category"
          error={errors.category}
        />
      </div>
      <div>
        <Label htmlFor="status" required>
          Status
        </Label>
        <CustomSelect
          value={formData.status}
          onChange={(value) => handleInputChange('status', value)}
          options={statusOptions}
          placeholder="Select status"
          error={errors.status}
        />
      </div>
    </form>
  );
};

const CommodityForm: React.FC<{
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}> = ({ onSave, onCancel, isEditing = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    subCategory: initialData?.subCategory || '',
    commodity: initialData?.commodity || '',
    status: initialData?.status || 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { value: 'Food & Beverages', label: 'Food & Beverages' },
    { value: 'Pharmaceuticals', label: 'Pharmaceuticals' },
    { value: 'Chemicals', label: 'Chemicals' },
    { value: 'Textiles', label: 'Textiles' },
    { value: 'Electronics', label: 'Electronics' }
  ];

  const subCategoryOptions = [
    { value: 'Dairy Products', label: 'Dairy Products' },
    { value: 'Medicines', label: 'Medicines' },
    { value: 'Laboratory Chemicals', label: 'Laboratory Chemicals' },
    { value: 'Cotton', label: 'Cotton' },
    { value: 'Mobile Phones', label: 'Mobile Phones' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.subCategory) {
      newErrors.subCategory = 'Sub category is required';
    }
    if (!formData.commodity.trim()) {
      newErrors.commodity = 'Commodity name is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form id="commodity-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <Label htmlFor="category" required>
          Category
        </Label>
        <CustomSelect
          value={formData.category}
          onChange={(value) => handleInputChange('category', value)}
          options={categoryOptions}
          placeholder="Select category"
          error={errors.category}
        />
      </div>
      <div>
        <Label htmlFor="subCategory" required>
          Sub Category
        </Label>
        <CustomSelect
          value={formData.subCategory}
          onChange={(value) => handleInputChange('subCategory', value)}
          options={subCategoryOptions}
          placeholder="Select sub category"
          error={errors.subCategory}
        />
      </div>
      <div>
        <Label htmlFor="commodity" required>
          Commodity
        </Label>
        <Input
          value={formData.commodity}
          onChange={(e) => handleInputChange('commodity', e.target.value)}
          placeholder="Enter commodity name"
          error={errors.commodity}
        />
      </div>
      <div>
        <Label htmlFor="status" required>
          Status
        </Label>
        <CustomSelect
          value={formData.status}
          onChange={(value) => handleInputChange('status', value)}
          options={statusOptions}
          placeholder="Select status"
          error={errors.status}
        />
      </div>
    </form>
  );
};

export default Commodities;
