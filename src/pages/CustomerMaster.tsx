import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Save, X, MapPin, Eye, Edit, MoreVertical, Trash2, Building2 } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';
import { useConfirmation } from '../hooks/useConfirmation';

const CustomerMaster: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Customer Master
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage customers and their sites
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Customers />
      </motion.div>
    </div>
  );
};

// Customers Component
const Customers: React.FC = () => {
  const [loading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isSitesDrawerOpen, setIsSitesDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});

  // Use confirmation hook
  const { confirmDelete } = useConfirmation();

  const [customers, setCustomers] = useState([
    { 
      id: 'C001', 
      customerName: 'ABC Corporation', 
      registrationNo: 'REG001', 
      group: 'Premium Customers', 
      customerType: 'Credit Customer',
      status: 'Active',
      sites: [
        { id: 'S001', siteName: 'Head Office', addressLine1: '123 Business St', addressLine2: 'Suite 100', city: 'New York', country: 'USA', phoneNumber: '+1-555-0123' },
        { id: 'S002', siteName: 'Branch Office', addressLine1: '456 Commerce Ave', addressLine2: '', city: 'Los Angeles', country: 'USA', phoneNumber: '+1-555-0456' }
      ]
    },
    { 
      id: 'C002', 
      customerName: 'XYZ Industries', 
      registrationNo: 'REG002', 
      group: 'Standard Customers', 
      customerType: 'Cash Customer',
      status: 'Active',
      sites: [
        { id: 'S003', siteName: 'Main Facility', addressLine1: '789 Industrial Blvd', addressLine2: 'Building A', city: 'Chicago', country: 'USA', phoneNumber: '+1-555-0789' }
      ]
    },
    { 
      id: 'C003', 
      customerName: 'Ministry of Health', 
      registrationNo: 'REG003', 
      group: 'Government Clients', 
      customerType: 'Credit Customer',
      status: 'Active',
      sites: []
    },
    { 
      id: 'C004', 
      customerName: 'University of Science', 
      registrationNo: 'REG004', 
      group: 'Research Institutions', 
      customerType: 'Credit Customer',
      status: 'Active',
      sites: []
    },
    { 
      id: 'C005', 
      customerName: 'Old Company Ltd', 
      registrationNo: 'REG005', 
      group: 'Inactive Groups', 
      customerType: 'Cash Customer',
      status: 'Inactive',
      sites: []
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

  const getCustomerTypeColor = (customerType: string) => {
    switch (customerType) {
      case 'Credit Customer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Cash Customer':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
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

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setViewingCustomer(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditCustomer = (record: any) => {
    setEditingCustomer(record);
    setViewingCustomer(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewCustomer = (record: any) => {
    setViewingCustomer(record);
    setEditingCustomer(null);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteCustomer = async (record: any) => {
    console.log('Delete button clicked for:', record.customerName); // Debug log
    
    const confirmed = await confirmDelete(record.customerName, 'customer');
    
    if (confirmed) {
      console.log('Delete customer:', record.id);
      setCustomers(prev => prev.filter(customer => customer.id !== record.id));
    }
  };

  const handleManageSites = (customer: any) => {
    setSelectedCustomer(customer);
    setIsSitesDrawerOpen(true);
  };

  const handleViewSites = (record: any) => {
    handleManageSites(record);
  };

  const columns: Column[] = [
    {
      key: 'customerName',
      title: 'Customer / Company Name',
      dataIndex: 'customerName',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Users className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'registrationNo',
      title: 'Registration No',
      dataIndex: 'registrationNo',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'customerType',
      title: 'Customer Type',
      dataIndex: 'customerType',
      width: '180px',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCustomerTypeColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'sites',
      title: 'Sites',
      dataIndex: 'sites',
      width: '100px',
      sortable: false,
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {record.sites?.length || 0}
          </span>
          <motion.button
            onClick={() => handleManageSites(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            title="Manage Sites"
          >
            <MapPin className="w-4 h-4" />
          </motion.button>
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
            onClick={() => handleViewCustomer(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="View Customer"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Edit Action - Pencil Icon */}
          <motion.button
            onClick={() => handleEditCustomer(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit Customer"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          {/* More Options - Vertical Ellipsis */}
          <div className="relative">
            <motion.button
              onClick={() => toggleActions(record.id)}
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
                className="absolute right-0 top-8 z-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
              >
                <button
                  onClick={() => {
                    handleViewSites(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Manage Sites
                </button>
                <button
                  onClick={() => {
                    handleDeleteCustomer(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Customer
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )
    }
  ];

  const handleSaveCustomer = (customerData: any) => {
    if (editingCustomer) {
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === editingCustomer.id ? { ...customerData, id: editingCustomer.id, sites: editingCustomer.sites || [] } : customer
        )
      );
    } else {
      const newCustomer = {
        ...customerData,
        id: `C${String(Date.now()).slice(-3)}`,
        sites: []
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
    setIsDrawerOpen(false);
    setEditingCustomer(null);
    setViewingCustomer(null);
    setIsViewMode(false);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCustomer(null);
    setViewingCustomer(null);
    setIsViewMode(false);
  };

  const handleCloseSitesDrawer = () => {
    setIsSitesDrawerOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveSites = (sites: any[]) => {
    if (selectedCustomer) {
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === selectedCustomer.id ? { ...customer, sites } : customer
        )
      );
    }
    setIsSitesDrawerOpen(false);
    setSelectedCustomer(null);
  };

  // Footer component for the customer drawer
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
          form="customer-form"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
        >
          <Save className="w-4 h-4 mr-2" />
          {editingCustomer ? 'Update Customer' : 'Add Customer'}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Customer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{customers.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.filter(c => c.status === 'Active').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.filter(c => c.status === 'Inactive').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <X className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Customers Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        searchPlaceholder="Search customers..."
        addButtonText="Add Customer"
        onAdd={handleAddCustomer}
        searchable={true}
        pagination={true}
        pageSize={10}
        
      />

      {/* Add/Edit/View Customer Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          isViewMode 
            ? `View Customer - ${viewingCustomer?.customerName || ''}` 
            : editingCustomer 
              ? 'Edit Customer' 
              : 'Add New Customer'
        }
        size="md"
        footer={drawerFooter}
      >
        <CustomerForm
          onSave={handleSaveCustomer}
          initialData={isViewMode ? viewingCustomer : editingCustomer}
          isViewMode={isViewMode}
        />
      </Drawer>

      {/* Sites Management Drawer */}
      <Drawer
        isOpen={isSitesDrawerOpen}
        onClose={handleCloseSitesDrawer}
        title={`Manage Sites - ${selectedCustomer?.customerName || ''}`}
        size="3xl"
      >
        <SitesManagement
          customer={selectedCustomer}
          onSave={handleSaveSites}
          onCancel={handleCloseSitesDrawer}
        />
      </Drawer>


    </div>
  );
};

// Sites Management Component
const SitesManagement: React.FC<{
  customer: any;
  onSave: (sites: any[]) => void;
  onCancel: () => void;
}> = ({ customer }) => {
  const [sites, setSites] = useState(customer?.sites || []);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<any>(null);
  const [viewingSite, setViewingSite] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [loading] = useState(false);
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});
  
  // Use confirmation hook for site deletion
  const { confirmDelete } = useConfirmation();

  // Update the data attribute when sites change
  React.useEffect(() => {
    const element = document.querySelector('[data-sites-management]');
    if (element) {
      element.setAttribute('data-sites', JSON.stringify(sites));
    }
  }, [sites]);

  const toggleActions = (id: string) => {
    setShowActions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddSite = () => {
    setEditingSite(null);
    setViewingSite(null);
    setIsViewMode(false);
    setIsAddSiteOpen(true);
  };

  const handleEditSite = (record: any) => {
    setEditingSite(record);
    setViewingSite(null);
    setIsViewMode(false);
    setIsAddSiteOpen(true);
  };

  const handleViewSite = (record: any) => {
    setViewingSite(record);
    setEditingSite(null);
    setIsViewMode(true);
    setIsAddSiteOpen(true);
  };

  const handleDeleteSite = async (record: any) => {
    console.log('Delete site button clicked for:', record.siteName); // Debug log
    
    const confirmed = await confirmDelete(record.siteName, 'site');
    
    if (confirmed) {
      console.log('Delete site:', record.id);
      setSites((prev: any[]) => prev.filter((site: any) => site.id !== record.id));
    }
  };

  const siteColumns: Column[] = [
    {
      key: 'siteName',
      title: 'Site Name',
      dataIndex: 'siteName',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'addressLine1',
      title: 'Address',
      dataIndex: 'addressLine1',
      sortable: true,
      render: (value: string, record: any) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div>{value}</div>
          {record.addressLine2 && <div>{record.addressLine2}</div>}
          <div>{record.city}, {record.country}</div>
        </div>
      )
    },
    {
      key: 'phoneNumber',
      title: 'Phone',
      dataIndex: 'phoneNumber',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
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
            onClick={() => handleViewSite(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="View Site"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Edit Action - Pencil Icon */}
          <motion.button
            onClick={() => handleEditSite(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit Site"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={() => handleDeleteSite(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Delete Site"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>

      
        </div>
      )
    }
  ];

  const handleSaveSite = (siteData: any) => {
    if (editingSite) {
      setSites((prev: any[]) => 
        prev.map((site: any) => 
          site.id === editingSite.id ? { ...siteData, id: editingSite.id } : site
        )
      );
    } else {
      const newSite = {
        ...siteData,
        id: `S${String(Date.now()).slice(-3)}`
      };
      setSites((prev: any[]) => [...prev, newSite]);
    }
    setIsAddSiteOpen(false);
    setEditingSite(null);
    setViewingSite(null);
    setIsViewMode(false);
  };

  const handleCloseAddSite = () => {
    setIsAddSiteOpen(false);
    setEditingSite(null);
    setViewingSite(null);
    setIsViewMode(false);
  };

  return (
    <div className="p-6 space-y-6" data-sites-management>
      {/* Add/Edit/View Site Form */}
      {isAddSiteOpen && (
        <div>
          <SiteForm
            onSave={handleSaveSite}
            onCancel={handleCloseAddSite}
            isEditing={!!editingSite}
            isViewMode={isViewMode}
            initialData={isViewMode ? viewingSite : editingSite}
          />
        </div>
      )}

      {/* Sites Data Table */}
      <div>
        <DataTable
          columns={siteColumns}
          data={sites}
          loading={loading}
          onAdd={() => setIsAddSiteOpen(true)}
          addButtonText="Add Site"
          hideAddButton={isAddSiteOpen}
        />
      </div>
    </div>
  );
};

// Site Form Component
const SiteForm: React.FC<{
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isViewMode?: boolean;
  initialData?: any;
}> = ({ onSave, onCancel, isEditing = false, isViewMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    siteName: initialData?.siteName || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    phoneNumber: initialData?.phoneNumber || '',
    contactPersonName: initialData?.contactPersonName || '',
    emailAddress: initialData?.emailAddress || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.siteName.trim()) newErrors.siteName = 'Site name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.emailAddress.trim()) newErrors.emailAddress = 'Email address is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Name */}
        <div>
          <Label htmlFor="siteName" required>
            Site Name
          </Label>
          <Input
            id="siteName"
            type="text"
            value={formData.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            placeholder="Enter site name"
            error={errors.siteName}
            disabled={isViewMode}
          />
        </div>

        {/* Contact Person Name */}
        <div>
          <Label htmlFor="contactPersonName" required>
            Contact Person Name
          </Label>
          <Input
            id="contactPersonName"
            type="text"
            value={formData.contactPersonName}
            onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
            placeholder="Enter contact person name"
            error={errors.contactPersonName}
            disabled={isViewMode}
          />
        </div>

        {/* Address Line 1 */}
        <div>
          <Label htmlFor="addressLine1" required>
            Address Line 1
          </Label>
          <Input
            id="addressLine1"
            type="text"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            placeholder="Enter address line 1"
            error={errors.addressLine1}
            disabled={isViewMode}
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <Label htmlFor="addressLine2">
            Address Line 2
          </Label>
          <Input
            id="addressLine2"
            type="text"
            value={formData.addressLine2}
            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            placeholder="Enter address line 2 (optional)"
            disabled={isViewMode}
          />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city" required>
            City
          </Label>
          <Input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter city"
            error={errors.city}
            disabled={isViewMode}
          />
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="country" required>
            Country
          </Label>
          <Input
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            placeholder="Enter country"
            error={errors.country}
            disabled={isViewMode}
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber" required>
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="Enter phone number"
            error={errors.phoneNumber}
            disabled={isViewMode}
          />
        </div>

        {/* Email Address */}
        <div>
          <Label htmlFor="emailAddress" required>
            Email Address
          </Label>
          <Input
            id="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={(e) => handleInputChange('emailAddress', e.target.value)}
            placeholder="Enter email address"
            error={errors.emailAddress}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Form Actions */}
      {!isViewMode && (
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Site' : 'Add Site'}
          </motion.button>
        </div>
      )}
    </form>
  );
};

// Customer Form Component
const CustomerForm: React.FC<{
  onSave: (data: any) => void;
  initialData?: any;
  isViewMode?: boolean;
}> = ({ onSave, initialData = null, isViewMode = false }) => {
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    registrationNo: initialData?.registrationNo || '',
    group: initialData?.group || '',
    customerType: initialData?.customerType || '',
    status: initialData?.status || 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const groupOptions = [
    { value: 'Premium Customers', label: 'Premium Customers' },
    { value: 'Standard Customers', label: 'Standard Customers' },
    { value: 'Government Clients', label: 'Government Clients' },
    { value: 'Research Institutions', label: 'Research Institutions' },
    { value: 'Inactive Groups', label: 'Inactive Groups' }
  ];

  const customerTypeOptions = [
    { value: 'Credit Customer', label: 'Credit Customer' },
    { value: 'Cash Customer', label: 'Cash Customer' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field: string, value: string) => {
    if (!isViewMode) {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.registrationNo.trim()) {
      newErrors.registrationNo = 'Registration number is required';
    }
    if (!formData.customerType) {
      newErrors.customerType = 'Customer type is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isViewMode && validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form id="customer-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      <div>
        <Label htmlFor="customerName" required>
          Customer / Company Name
        </Label>
        <Input
          value={formData.customerName}
          onChange={(e) => handleInputChange('customerName', e.target.value)}
          placeholder="Enter Customer / Company Name"
          error={errors.customerName}
          icon={<Users className="w-4 h-4 text-gray-400" />}
          disabled={isViewMode}
        />
      </div>
      <div>
        <Label htmlFor="registrationNo" required>
          Registration No
        </Label>
        <Input
          value={formData.registrationNo}
          onChange={(e) => handleInputChange('registrationNo', e.target.value)}
          placeholder="Enter Registration No"
          error={errors.registrationNo}
          disabled={isViewMode}
        />
      </div>
      <div>
        <Label htmlFor="group">
          Group
        </Label>
        <CustomSelect
          value={formData.group}
          onChange={(value) => handleInputChange('group', value)}
          options={groupOptions}
          placeholder="Select group"
          disabled={isViewMode}
        />
      </div>
      <div>
        <Label htmlFor="customerType" required>
          Customer Type
        </Label>
        <CustomSelect
          value={formData.customerType}
          onChange={(value) => handleInputChange('customerType', value)}
          options={customerTypeOptions}
          placeholder="Select customer type"
          error={errors.customerType}
          disabled={isViewMode}
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
          disabled={isViewMode}
        />
      </div>
    </form>
  );
};

export default CustomerMaster;
