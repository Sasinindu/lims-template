import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Building2,
  MapPin,
  ShoppingCart,
  TestTube,
  Package,
  ChevronRight,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Save,
  Plus,
  Trash2,
  Edit,
  X,
  Eye,
  MoreVertical,
  Printer,
  Download,
  DollarSign,
  Info
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';
import SimpleTable from '../components/SimpleTable';
import { useConfirmation } from '../hooks/useConfirmation';

// Mock Group Master data for filtering
const groupMasterData = [
  {
    id: 'GM001',
    customer: { id: 'C001', name: 'ABC Corporation' },
    commodityCategory: { id: 'CC001', name: 'Food Products' },
    commoditySubCategory: { id: 'CSC001', name: 'Dairy Products' },
    commodity: { id: 'COM001', name: 'Milk' },
    testParameter: { 
      id: 'TP001', 
      name: 'Microbiological Testing',
      analytes: [
        'Total Plate Count',
        'Coliform Count', 
        'E.coli Count',
        'Yeast & Mold Count',
        'Salmonella',
        'Listeria monocytogenes'
      ]
    },
    costGroups: [
      { group: 'Standard', price: 250.00 },
      { group: 'Premium', price: 350.00 }
    ],
    status: 'Active'
  },
  {
    id: 'GM002',
    customer: { id: 'C001', name: 'ABC Corporation' },
    commodityCategory: { id: 'CC001', name: 'Food Products' },
    commoditySubCategory: { id: 'CSC002', name: 'Meat Products' },
    commodity: { id: 'COM002', name: 'Beef' },
    testParameter: { 
      id: 'TP002', 
      name: 'Chemical Analysis',
      analytes: [
        'Protein Content',
        'Fat Content', 
        'Moisture Content',
        'Ash Content',
        'pH Level',
        'Water Activity (aw)'
      ]
    },
    costGroups: [
      { group: 'Standard', price: 180.00 },
      { group: 'Premium', price: 280.00 }
    ],
    status: 'Active'
  },
  {
    id: 'GM003',
    customer: { id: 'C002', name: 'XYZ Industries' },
    commodityCategory: { id: 'CC001', name: 'Food Products' },
    commoditySubCategory: { id: 'CSC003', name: 'Cereals & Grains' },
    commodity: { id: 'COM003', name: 'Rice' },
    testParameter: { 
      id: 'TP003', 
      name: 'Pesticide Residue Analysis',
      analytes: [
        'Organochlorines',
        'Organophosphates', 
        'Carbamates',
        'Pyrethroids',
        'Triazines',
        'Glyphosate',
        '2,4-D',
        'Atrazine'
      ]
    },
    costGroups: [
      { group: 'Standard', price: 320.00 },
      { group: 'Premium', price: 450.00 }
    ],
    status: 'Active'
  },
  {
    id: 'GM004',
    customer: { id: 'C003', name: 'DEF Manufacturing' },
    commodityCategory: { id: 'CC001', name: 'Food Products' },
    commoditySubCategory: { id: 'CSC003', name: 'Cereals & Grains' },
    commodity: { id: 'COM004', name: 'Wheat' },
    testParameter: { 
      id: 'TP004', 
      name: 'Nutritional Analysis',
      analytes: [
        'Protein',
        'Carbohydrates', 
        'Total Fat',
        'Saturated Fat',
        'Dietary Fiber',
        'Sugars',
        'Sodium',
        'Calories',
        'Ash Content',
        'Gluten Content'
      ]
    },
    costGroups: [
      { group: 'Standard', price: 150.00 },
      { group: 'Premium', price: 220.00 }
    ],
    status: 'Active'
  },
  {
    id: 'GM005',
    customer: { id: 'C001', name: 'ABC Corporation' },
    commodityCategory: { id: 'CC001', name: 'Food Products' },
    commoditySubCategory: { id: 'CSC001', name: 'Dairy Products' },
    commodity: { id: 'COM005', name: 'Cheese' },
    testParameter: { 
      id: 'TP005', 
      name: 'Heavy Metals Analysis',
      analytes: [
        'Lead (Pb)',
        'Cadmium (Cd)', 
        'Mercury (Hg)',
        'Arsenic (As)',
        'Chromium (Cr)',
        'Zinc (Zn)',
        'Copper (Cu)',
        'Iron (Fe)'
      ]
    },
    costGroups: [
      { group: 'Standard', price: 380.00 },
      { group: 'Premium', price: 520.00 }
    ],
    status: 'Active'
  },
  {
    id: 'GM006',
    customer: { id: 'C002', name: 'XYZ Industries' },
    commodityCategory: { id: 'CC001', name: 'Food Products' },
    commoditySubCategory: { id: 'CSC004', name: 'Beverages' },
    commodity: { id: 'COM006', name: 'Fruit Juice' },
    testParameter: { 
      id: 'TP006', 
      name: 'Vitamin Analysis',
      analytes: [
        'Vitamin A',
        'Vitamin C (Ascorbic Acid)', 
        'Vitamin D',
        'Vitamin E',
        'Thiamine (B1)',
        'Riboflavin (B2)',
        'Niacin (B3)',
        'Vitamin B6',
        'Folate',
        'Vitamin B12'
      ]
    },
    costGroups: [
      { group: 'Standard', price: 290.00 },
      { group: 'Premium', price: 390.00 }
    ],
    status: 'Active'
  }
];

const OrderRegistration: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Order Registration
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Register and manage laboratory test orders
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Orders />
      </motion.div>
    </div>
  );
};

// Orders Component
const Orders: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [loading] = useState(false);
  const [selectedSampleForTest, setSelectedSampleForTest] = useState<any>(null);
  const [showActions, setShowActions] = useState<Record<string, boolean>>({});
  const [dropdownPositions, setDropdownPositions] = useState<{ [key: string]: 'bottom' | 'top' }>({});

  // Order form data state
  const [orderFormData, setOrderFormData] = useState({
    companyName: '',
    siteName: '',
    commodityCategory: '',
    commoditySubCategory: '',
    commodity: ''
  });

  // Use confirmation hook
  const { confirmDelete } = useConfirmation();

  // Close dropdown when clicking outside
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

  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      orderId: 'ORD-2024-001',
      companyName: 'ABC Corporation',
      siteName: 'Head Office',
      poNumber: 'PO-2024-001',
      samplingBy: 'Client',
      dateCollected: '2024-01-15',
      testBasis: 'Normal',
      status: 'In Progress',
      samplesCount: 3,
      testsCount: 8,
      createdAt: '2024-01-15'
    },
    {
      id: 'ORD002',
      orderId: 'ORD-2024-002',
      companyName: 'XYZ Industries',
      siteName: 'Main Facility',
      poNumber: 'PO-2024-002',
      samplingBy: 'Lab Representative',
      dateCollected: '2024-01-16',
      testBasis: 'Urgent',
      status: 'Completed',
      samplesCount: 2,
      testsCount: 5,
      createdAt: '2024-01-16'
    }
  ]);

  const steps = [
    {
      id: 1,
      title: 'Order Information',
      description: 'Company, Site & Order Details',
      icon: FileText,
      sections: ['Company Details', 'Site Details', 'Order Details', 'Reports & Communication']
    },
    {
      id: 2,
      title: 'Samples',
      description: 'Add Sample Information',
      icon: Package,
      sections: ['Sample Details', 'Sample Conditions']
    },
    {
      id: 3,
      title: 'Tests',
      description: 'Assign Tests to Samples',
      icon: TestTube,
      sections: ['Test Parameters', 'Test Methods']
    },
    {
      id: 4,
      title: 'Review & Submit',
      description: 'Review and Submit Order',
      icon: CheckCircle,
      sections: ['Order Summary', 'Final Review']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const toggleActions = (id: string, event?: React.MouseEvent) => {
    const isCurrentlyOpen = showActions[id];

    setShowActions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));

    // Calculate dropdown position when opening
    if (!isCurrentlyOpen && event) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 120; // Estimated dropdown height
      const spaceBelow = viewportHeight - rect.bottom - 10;
      const spaceAbove = rect.top - 10;

      const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight;

      setDropdownPositions(prev => ({
        ...prev,
        [id]: shouldOpenUpward ? 'top' : 'bottom'
      }));
    }
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setViewingOrder(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleEditOrder = (record: any) => {
    setEditingOrder(record);
    setViewingOrder(null);
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleViewOrder = (record: any) => {
    setViewingOrder(record);
    setEditingOrder(null);
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteOrder = async (record: any) => {
    console.log('Delete button clicked for:', record.orderId);

    const confirmed = await confirmDelete(record.orderId, 'order');

    if (confirmed) {
      console.log('Delete order:', record.id);
      setOrders(prev => prev.filter(order => order.id !== record.id));
    }
  };

  const handlePrintOrder = (record: any) => {
    console.log('Print order:', record.id);
    // You can implement print logic here
  };

  const handleDownloadReport = (record: any) => {
    console.log('Download report for order:', record.id);
    // You can implement download logic here
  };

  const columns: Column[] = [
    {
      key: 'orderId',
      title: 'Order ID',
      dataIndex: 'orderId',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'companyName',
      title: 'Company',
      dataIndex: 'companyName',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'siteName',
      title: 'Site',
      dataIndex: 'siteName',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'poNumber',
      title: 'PO Number',
      dataIndex: 'poNumber',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'samplesCount',
      title: 'Samples',
      dataIndex: 'samplesCount',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-blue-500 mr-1" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'testsCount',
      title: 'Tests',
      dataIndex: 'testsCount',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <TestTube className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
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
            onClick={() => handleViewOrder(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="View Order"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          {/* Edit Action - Pencil Icon */}
          <motion.button
            onClick={() => handleEditOrder(record)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit Order"
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
                className={`absolute right-0 z-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 ${dropdownPositions[record.id] === 'top' ? 'bottom-8' : 'top-8'
                  }`}
              >
                <button
                  onClick={() => {
                    handlePrintOrder(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Order
                </button>
                <button
                  onClick={() => {
                    handleDownloadReport(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                <button
                  onClick={() => {
                    handleDeleteOrder(record);
                    setShowActions(prev => ({ ...prev, [record.id]: false }));
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Order
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )
    }
  ];

  const handleSaveOrder = (orderData: any) => {
    if (editingOrder) {
      setOrders(prev =>
        prev.map(order =>
          order.id === editingOrder.id ? { ...orderData, id: editingOrder.id } : order
        )
      );
    } else {
      const newOrder = {
        ...orderData,
        id: `ORD${String(Date.now()).slice(-3)}`,
        orderId: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
        status: 'In Progress',
        samplesCount: 0,
        testsCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setOrders(prev => [...prev, newOrder]);
    }
    setIsDrawerOpen(false);
    setEditingOrder(null);
    setViewingOrder(null);
    setIsViewMode(false);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingOrder(null);
    setViewingOrder(null);
    setIsViewMode(false);
    setSelectedSampleForTest(null);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleAddTestForSample = (sample: any) => {
    setSelectedSampleForTest(sample);
    setCurrentStep(3); // Switch to Tests step
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OrderInformationStep 
          isViewMode={isViewMode} 
          initialData={isViewMode ? viewingOrder : editingOrder}
          onFormDataChange={setOrderFormData}
        />;
      case 2:
        return <SamplesStep onAddTestForSample={handleAddTestForSample} isViewMode={isViewMode} />;
      case 3:
        return <TestsStep 
          selectedSample={selectedSampleForTest} 
          onTestAdded={() => setSelectedSampleForTest(null)} 
          isViewMode={isViewMode}
          orderFormData={orderFormData}
        />;
      case 4:
        return <ReviewStep isViewMode={isViewMode} />;
      default:
        return <OrderInformationStep 
          isViewMode={isViewMode} 
          initialData={isViewMode ? viewingOrder : editingOrder}
          onFormDataChange={setOrderFormData}
        />;
    }
  };

  // Footer component for the order drawer
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
      <div className="flex items-center justify-between space-x-3">
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

        <div className="flex items-center space-x-3">
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Previous</span>
            </motion.button>
          )}

          {currentStep < 4 ? (
            <motion.button
              type="button"
              onClick={() => setCurrentStep(prev => prev + 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={() => handleSaveOrder({})}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingOrder ? 'Update Order' : 'Submit Order'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'Completed').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Samples</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.reduce((sum, order) => sum + order.samplesCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Data Table */}

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        searchPlaceholder="Search groups..."
        addButtonText="New Order"
        onAdd={handleAddOrder}
        searchable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Order Registration Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          isViewMode
            ? `View Order - ${viewingOrder?.orderId || ''}`
            : editingOrder
              ? 'Edit Order'
              : 'New Order Registration'
        }
        size="3xl"
        footer={drawerFooter}
      >
        <div className="h-full flex flex-col">
          {/* Progress Steps */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <motion.button
                      onClick={() => handleStepChange(step.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : isCompleted
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive
                        ? 'bg-primary-500/20 dark:bg-primary-500/30'
                        : isCompleted
                          ? 'bg-primary-500/20 dark:bg-primary-500/30'
                          : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs opacity-75">{step.description}</div>
                      </div>
                    </motion.button>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-auto p-6">
            {renderStepContent()}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default OrderRegistration;

// Step Components
const OrderInformationStep: React.FC<{
  isViewMode?: boolean;
  initialData?: any;
  onFormDataChange?: (data: any) => void;
}> = ({ isViewMode = false, initialData = null, onFormDataChange }) => {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    siteName: initialData?.siteName || '',
    commodityCategory: '',
    commoditySubCategory: '',
    commodity: '',
    samplingBy: 'client',
    packing: 'poly-bag'
  });

  const handleFormChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Information</h2>
        <p className="text-gray-600 dark:text-gray-400">Complete the order details and company information.</p>
      </div>

      {/* Company Details Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-primary-600" />
          Company Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="companyName" required>Company Name</Label>
            <CustomSelect
              value={formData.companyName}
              onChange={(value) => handleFormChange('companyName', value)}
              options={[
                { value: 'ABC Corporation', label: 'ABC Corporation' },
                { value: 'XYZ Industries', label: 'XYZ Industries' },
                { value: 'DEF Manufacturing', label: 'DEF Manufacturing' },
                { value: 'Ministry of Health', label: 'Ministry of Health' },
                { value: 'University of Science', label: 'University of Science' }
              ]}
              placeholder="Select Company"
            />
          </div>
          <div>
            <Label htmlFor="siteName" required>Site Name</Label>
            <CustomSelect
              value={formData.siteName}
              onChange={(value) => handleFormChange('siteName', value)}
              options={[
                { value: 'Head Office', label: 'Head Office' },
                { value: 'Branch Office', label: 'Branch Office' },
                { value: 'Main Facility', label: 'Main Facility' },
                { value: 'Production Unit A', label: 'Production Unit A' },
                { value: 'Research Lab', label: 'Research Lab' }
              ]}
              placeholder="Select Site"
            />
          </div>
          <div>
            <Label htmlFor="commodityCategory" required>Commodity Category</Label>
            <CustomSelect
              value={formData.commodityCategory}
              onChange={(value) => handleFormChange('commodityCategory', value)}
              options={[
                { value: 'Food Products', label: 'Food Products' },
                { value: 'Beverages', label: 'Beverages' },
                { value: 'Pharmaceuticals', label: 'Pharmaceuticals' },
                { value: 'Cosmetics', label: 'Cosmetics' },
                { value: 'Chemicals', label: 'Chemicals' }
              ]}
              placeholder="Select Commodity Category"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This helps filter relevant test parameters for your samples
            </p>
          </div>
          <div>
            <Label htmlFor="commoditySubCategory">Commodity Sub Category</Label>
            <CustomSelect
              value={formData.commoditySubCategory}
              onChange={(value) => handleFormChange('commoditySubCategory', value)}
              options={[
                { value: 'Dairy Products', label: 'Dairy Products' },
                { value: 'Meat Products', label: 'Meat Products' },
                { value: 'Bakery Products', label: 'Bakery Products' },
                { value: 'Fruits & Vegetables', label: 'Fruits & Vegetables' },
                { value: 'Cereals & Grains', label: 'Cereals & Grains' },
                { value: 'Beverages', label: 'Beverages' },
                { value: 'Seafood', label: 'Seafood' },
                { value: 'Oils & Fats', label: 'Oils & Fats' }
              ]}
              placeholder="Select Commodity Sub Category"
            />
          </div>
          <div>
            <Label htmlFor="addressLine1" required>Address Line 1</Label>
            <Input value="" onChange={() => { }} placeholder="Enter address line 1" disabled={isViewMode} />
          </div>
          <div>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input value="" onChange={() => { }} placeholder="Enter address line 2" />
          </div>
          <div>
            <Label htmlFor="city" required>City</Label>
            <CustomSelect
              value=""
              onChange={() => { }}
              options={[
                { value: 'New York', label: 'New York' },
                { value: 'Los Angeles', label: 'Los Angeles' },
                { value: 'Chicago', label: 'Chicago' },
                { value: 'Houston', label: 'Houston' }
              ]}
              placeholder="Select City"
            />
          </div>
          <div>
            <Label htmlFor="country" required>Country</Label>
            <CustomSelect
              value=""
              onChange={() => { }}
              options={[
                { value: 'USA', label: 'USA' },
                { value: 'Canada', label: 'Canada' },
                { value: 'Mexico', label: 'Mexico' },
                { value: 'UK', label: 'United Kingdom' }
              ]}
              placeholder="Select Country"
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary-600" />
          Report to be issued to
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="contactPersonName" required>Contact Person Name</Label>
            <Input value="" onChange={() => { }} placeholder="Enter contact person name" />
          </div>
          <div>
            <Label htmlFor="phoneNumber" required>Phone Number</Label>
            <Input type="tel" value="" onChange={() => { }} placeholder="Enter phone number" />
          </div>
          <div>
            <Label htmlFor="email" required>Email</Label>
            <Input type="email" value="" onChange={() => { }} placeholder="Enter email address" />
          </div>
        </div>
      </div>

      {/* Invoice Information Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-primary-600" />
          Invoice to be Issued to
        </h3>
        <div className="mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Same as Previous</span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="invoiceContactPersonName" required>Contact Person Name</Label>
            <Input value="" onChange={() => { }} placeholder="Enter contact person name" />
          </div>
          <div>
            <Label htmlFor="invoicePhoneNumber" required>Phone Number</Label>
            <Input type="tel" value="" onChange={() => { }} placeholder="Enter phone number" />
          </div>
          <div>
            <Label htmlFor="invoiceEmail" required>Email</Label>
            <Input type="email" value="" onChange={() => { }} placeholder="Enter email address" />
          </div>
        </div>
      </div>

      {/* Order Details Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-primary-600" />
          Order Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="orderId">Order ID</Label>
            <Input value="ORD-2024-001" onChange={() => { }} disabled />
          </div>
          <div>
            <Label htmlFor="poNumber">PO Number</Label>
            <Input value="" onChange={() => { }} placeholder="Enter PO number" />
          </div>
          <div>
            <Label htmlFor="quotationNumber">Quotation Number (Optional)</Label>
            <Input value="" onChange={() => { }} placeholder="Enter quotation number" />
          </div>
          <div>
            <Label htmlFor="samplingBy" required>Sampling by</Label>
            <div className="flex space-x-6 mt-2">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="samplingBy" 
                  value="client" 
                  checked={formData.samplingBy === 'client'}
                  onChange={(e) => handleFormChange('samplingBy', e.target.value)}
                  className="mr-2" 
                />
                <span className="text-sm">Client</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="samplingBy" 
                  value="lab" 
                  checked={formData.samplingBy === 'lab'}
                  onChange={(e) => handleFormChange('samplingBy', e.target.value)}
                  className="mr-2" 
                />
                <span className="text-sm">Lab Representative</span>
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="dateCollected" required>Date Sample Collected/Submitted</Label>
            <Input type="date" value="" onChange={() => { }} />
          </div>
          <div>
            <Label htmlFor="storageRequirements">Storage Requirements/Handling Requirement</Label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              rows={3}
              placeholder="Enter storage requirements"
            />
          </div>
          <div>
            <Label htmlFor="receivedBy">Received By</Label>
            <Input value="" onChange={() => { }} placeholder="Enter receiver name" />
          </div>
          <div>
            <Label htmlFor="dateOfReceipt">Date of Receipt</Label>
            <Input type="date" value="" onChange={() => { }} />
          </div>
          <div>
            <Label htmlFor="timeOfReceipt">Time of Receipt</Label>
            <Input type="time" value="" onChange={() => { }} />
          </div>
          <div>
            <Label htmlFor="packing">Packing</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="packing" 
                  value="poly-bag"
                  checked={formData.packing === 'poly-bag'}
                  onChange={(e) => handleFormChange('packing', e.target.value)}
                  className="mr-2" 
                />
                <span className="text-sm">Poly Bag</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="packing" 
                  value="plastic-container"
                  checked={formData.packing === 'plastic-container'}
                  onChange={(e) => handleFormChange('packing', e.target.value)}
                  className="mr-2" 
                />
                <span className="text-sm">Plastic Container</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="packing" 
                  value="glass-container"
                  checked={formData.packing === 'glass-container'}
                  onChange={(e) => handleFormChange('packing', e.target.value)}
                  className="mr-2" 
                />
                <span className="text-sm">Glass Container</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="packing" 
                  value="other"
                  checked={formData.packing === 'other'}
                  onChange={(e) => handleFormChange('packing', e.target.value)}
                  className="mr-2" 
                />
                <span className="text-sm">Other</span>
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="testBasis" required>Test Basis</Label>
            <CustomSelect
              value=""
              onChange={() => { }}
              options={[
                { value: 'Normal', label: 'Normal' },
                { value: 'Urgent', label: 'Urgent' }
              ]}
              placeholder="Select Test Basis"
            />
          </div>
        </div>
      </div>

      {/* Reports & Communication Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-primary-600" />
          Reports & Communication
        </h3>
        <div className="space-y-6">
          <div>
            <Label htmlFor="reportDelivery">Report Delivery Format</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Email</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Courier</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">To be collected by client</span>
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="emailReport">Email for report</Label>
            <Input type="email" value="" onChange={() => { }} placeholder="Enter email address" />
          </div>
          <div>
            <Label htmlFor="remarks">Remarks / Other Instructions</Label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              rows={4}
              placeholder="Enter remarks or instructions"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Samples Step Component
const SamplesStep: React.FC<{
  onAddTestForSample: (sample: any) => void;
  isViewMode?: boolean;
}> = ({ onAddTestForSample, isViewMode = false }) => {
  const [samples, setSamples] = useState([
    {
      id: 'S001',
      sampleId: 'SMP-001',
      commodityCategory: 'Food Products',
      commoditySubCategory: 'Dairy Products',
      commodity: 'Milk',
      sampleQuantity: '500',
      sampleCondition: 'Chilled',
      remarks: 'Fresh sample collected',
      statementOfConformity: 'Yes'
    },
    {
      id: 'S002',
      sampleId: 'SMP-002',
      commodityCategory: 'Food Products',
      commoditySubCategory: 'Meat Products',
      commodity: 'Beef',
      sampleQuantity: '250',
      sampleCondition: 'Frozen',
      remarks: 'Frozen sample',
      statementOfConformity: 'No'
    }
  ]);

  const [isAddSampleOpen, setIsAddSampleOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<any>(null);

  const sampleColumns = [
    {
      key: 'sampleId',
      title: 'Sample ID',
      render: (value: string) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'commodity',
      title: 'Commodity',
      render: (value: string, record: any) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="font-medium">{value}</div>
          <div className="text-xs">{record.commodityCategory} - {record.commoditySubCategory}</div>
        </div>
      )
    },
    {
      key: 'sampleQuantity',
      title: 'Quantity',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value} g</span>
      )
    },
    {
      key: 'sampleCondition',
      title: 'Condition',
      render: (value: string) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
          {value}
        </span>
      )
    },
    {
      key: 'statementOfConformity',
      title: 'Statement Required',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'Yes'
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Add Tests',
      render: (value: string, record: any) => (
        <motion.button
          onClick={() => onAddTestForSample(record)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
          title="Add Tests for this Sample"
        >
          <TestTube className="w-3 h-3 mr-1" />
          Add Tests
        </motion.button>
      )
    }
  ];

  const handleAddSample = () => {
    setEditingSample(null);
    setIsAddSampleOpen(true);
  };

  const handleEditSample = (sample: any) => {
    setEditingSample(sample);
    setIsAddSampleOpen(true);
  };

  const handleRemoveSample = (index: number) => {
    setSamples(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveSample = (sampleData: any) => {
    if (editingSample) {
      setSamples(prev =>
        prev.map((sample, index) =>
          sample.id === editingSample.id ? { ...sampleData, id: editingSample.id } : sample
        )
      );
    } else {
      const newSample = {
        ...sampleData,
        id: `S${String(Date.now()).slice(-3)}`,
        sampleId: `SMP-${String(samples.length + 1).padStart(3, '0')}`
      };
      setSamples(prev => [...prev, newSample]);
    }
    setIsAddSampleOpen(false);
    setEditingSample(null);
  };

  const handleCloseAddSample = () => {
    setIsAddSampleOpen(false);
    setEditingSample(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Samples</h2>
        <p className="text-gray-600 dark:text-gray-400">Add sample information and conditions. Click "Add Tests" to assign tests to specific samples.</p>
      </div>


      {/* Add/Edit Sample Form */}
      {isAddSampleOpen && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <SampleForm
            onSave={handleSaveSample}
            onCancel={handleCloseAddSample}
            isEditing={!!editingSample}
            initialData={editingSample}
          />
        </div>
      )}

      {/* Samples List */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary-600" />
            Samples List
          </h3>

          {!isAddSampleOpen && (
            <motion.button
              onClick={handleAddSample}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sample
            </motion.button>
          )}

        </div>

        {samples.length > 0 ? (
          <SimpleTable
            columns={sampleColumns}
            data={samples}
            onEdit={handleEditSample}
            onRemove={handleRemoveSample}
            showActions={true}
            emptyMessage="No samples added yet."
          />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No samples added yet. Click "Add Sample" to get started.</p>
          </div>
        )}

      </div>


    </div>
  );
};

// Tests Step Component
const TestsStep: React.FC<{
  selectedSample?: any;
  onTestAdded: () => void;
  isViewMode?: boolean;
  orderFormData?: any;
}> = ({ selectedSample, onTestAdded, isViewMode = false, orderFormData }) => {
  const [tests, setTests] = useState([
    {
      id: 'T001',
      testId: 'TST-001',
      sampleId: 'SMP-001',
      testParameter: 'Microbiological Testing',
      group: 'Standard',
      specification: 'Total Plate Count < 10,000 CFU/g',
      reference: 'Food Safety Standards',
      price: 250.00,
      analytes: ['Total Plate Count', 'Coliform Count', 'E.coli Count']
    },
    {
      id: 'T002',
      testId: 'TST-002',
      sampleId: 'SMP-001',
      testParameter: 'Chemical Analysis',
      group: 'Premium',
      specification: 'Protein Content > 3.0%',
      reference: 'Nutritional Standards',
      price: 280.00,
      analytes: ['Protein Content', 'Fat Content', 'Moisture Content']
    },
    {
      id: 'T003',
      testId: 'TST-003',
      sampleId: 'SMP-002',
      testParameter: 'Pesticide Residue Analysis',
      group: 'Standard',
      specification: 'Pesticide residues within acceptable limits',
      reference: 'Food Safety Standards',
      price: 320.00,
      analytes: ['Organochlorines', 'Organophosphates', 'Carbamates']
    }
  ]);

  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);

  const testColumns = [
    {
      key: 'testId',
      title: 'Test ID',
      render: (value: string) => (
        <div className="flex items-center">
          <TestTube className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'sampleId',
      title: 'Sample ID',
      render: (value: string) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
        </div>
      )
    },
    {
      key: 'testParameter',
      title: 'Test Parameter',
      render: (value: string) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
      )
    },
    {
      key: 'group',
      title: 'Group',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Premium' 
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value: number) => (
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Rs. {value.toFixed(2)}</span>
        </div>
      )
    },
    {
      key: 'specification',
      title: 'Specification/Reference',
      render: (value: string, record: any) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="font-medium">{value}</div>
          <div className="text-xs">{record.reference}</div>
        </div>
      )
    }
  ];

  const handleAddTest = () => {
    setEditingTest(null);
    setIsAddTestOpen(true);
  };

  const handleEditTest = (test: any) => {
    setEditingTest(test);
    setIsAddTestOpen(true);
  };

  const handleRemoveTest = (index: number) => {
    setTests(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTest = (testData: any) => {
    if (editingTest) {
      setTests(prev =>
        prev.map((test, index) =>
          test.id === editingTest.id ? { ...testData, id: editingTest.id } : test
        )
      );
    } else {
      const newTest = {
        ...testData,
        id: `T${String(Date.now()).slice(-3)}`,
        testId: `TST-${String(tests.length + 1).padStart(3, '0')}`
      };
      setTests(prev => [...prev, newTest]);
    }
    setIsAddTestOpen(false);
    setEditingTest(null);
    onTestAdded(); // Clear selected sample after adding test
  };

  const handleCloseAddTest = () => {
    setIsAddTestOpen(false);
    setEditingTest(null);
    onTestAdded(); // Clear selected sample when canceling
  };

  // Auto-open test form if a sample is selected
  React.useEffect(() => {
    if (selectedSample && !isAddTestOpen) {
      setIsAddTestOpen(true);
    }
  }, [selectedSample, isAddTestOpen]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tests</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {selectedSample
            ? `Adding tests for sample: ${selectedSample.sampleId} (${selectedSample.commodity})`
            : 'Assign tests to samples. Tests are linked to specific samples.'
          }
        </p>
      </div>

      {/* Add/Edit Test Form */}
      {isAddTestOpen && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <TestForm
            onSave={handleSaveTest}
            onCancel={handleCloseAddTest}
            isEditing={!!editingTest}
            initialData={editingTest}
            selectedSample={selectedSample}
            orderFormData={orderFormData}
          />
        </div>
      )}

      {/* Tests List */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-primary-600" />
            Tests List
          </h3>

          {!isAddTestOpen && (
            <motion.button
              onClick={handleAddTest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Test Parameters
            </motion.button>
          )}
        </div>

        {tests.length > 0 ? (
          <SimpleTable
            columns={testColumns}
            data={tests}
            onEdit={handleEditTest}
            onRemove={handleRemoveTest}
            showActions={true}
            emptyMessage="No tests added yet."
          />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tests added yet. Click "Add Test Parameters" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Review Step Component
const ReviewStep: React.FC<{
  isViewMode?: boolean;
}> = ({ isViewMode = false }) => {
  // Mock test data with pricing - Order level urgency applied
  const testPricing = [
    {
      testId: 'TST-001',
      sampleId: 'SMP-001',
      testParameter: 'Microbiological Testing',
      basePrice: 250.00,
      finalPrice: 250.00
    },
    {
      testId: 'TST-002',
      sampleId: 'SMP-001',
      testParameter: 'Chemical Analysis',
      basePrice: 180.00,
      finalPrice: 180.00
    },
    {
      testId: 'TST-003',
      sampleId: 'SMP-002',
      testParameter: 'Pesticide Residue Analysis',
      basePrice: 320.00,
      finalPrice: 320.00
    }
  ];

  const baseSubtotal = testPricing.reduce((sum, test) => sum + test.finalPrice, 0);
  const urgencyRate = 0.5; // 50% urgency surcharge
  const urgencyFee = baseSubtotal * urgencyRate;
  const subtotal = baseSubtotal + urgencyFee;
  const taxRate = 0.15; // 15% tax
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Review & Submit</h2>
        <p className="text-gray-600 dark:text-gray-400">Review all information before submitting the order.</p>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-primary-600" />
          Order Summary
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Information</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>Order ID: ORD-2024-001</div>
                <div>Company: ABC Corporation</div>
                <div>Site: Head Office</div>
                <div>PO Number: PO-2024-001</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Samples & Tests</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>Total Samples: 2</div>
                <div>Total Tests: 3</div>
                <div>Test Basis: Urgent</div>
                <div>Sampling: Client</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Price Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="w-5 h-5 mr-2 text-primary-600 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-xs font-bold">Rs</span>
          Estimated Price Breakdown
        </h3>

        {/* Test-wise Price Details */}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Test ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Sample ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Test Parameter</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {testPricing.map((test, index) => (
                  <tr key={test.testId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <TestTube className="w-4 h-4 text-primary-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{test.testId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{test.sampleId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-900 dark:text-white">{test.testParameter}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Rs. {test.finalPrice.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-end">
              <div className="w-full max-w-md space-y-2">
                {/* Base Price */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Base Price ({testPricing.length} tests):
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    Rs. {baseSubtotal.toFixed(2)}
                  </span>
                </div>

                {/* Urgency Fee */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Urgency Fee (50% surcharge):
                  </span>
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    +Rs. {urgencyFee.toFixed(2)}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">
                    Rs. {subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (15%):</span>
                  <span className="text-gray-900 dark:text-white">
                    Rs. {taxAmount.toFixed(2)}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                      Total Amount:
                    </span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      Rs. {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Price Notes */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="w-5 h-5 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-xs font-bold">i</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Price Information</h4>
                <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Prices are estimates and may vary based on actual testing requirements</li>
                    <li>Urgent orders may incur additional charges (50% surcharge)</li>
                    <li>Normal orders are processed within standard timeframes (5-7 business days)</li>
                    <li>Urgent orders are processed within 24-48 hours</li>
                    <li>Final invoice will be generated upon test completion</li>
                    <li>Payment terms: Net 30 days from invoice date</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample Form Component
const SampleForm: React.FC<{
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}> = ({ onSave, onCancel, isEditing = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    commodityCategory: initialData?.commodityCategory || '',
    commoditySubCategory: initialData?.commoditySubCategory || '',
    commodity: initialData?.commodity || '',
    sampleQuantity: initialData?.sampleQuantity || '',
    sampleCondition: initialData?.sampleCondition || '',
    remarks: initialData?.remarks || '',
    statementOfConformity: initialData?.statementOfConformity || 'Yes'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const commodityCategoryOptions = [
    { value: 'Food Products', label: 'Food Products' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Pharmaceuticals', label: 'Pharmaceuticals' },
    { value: 'Cosmetics', label: 'Cosmetics' },
    { value: 'Chemicals', label: 'Chemicals' }
  ];

  const commoditySubCategoryOptions = [
    { value: 'Dairy Products', label: 'Dairy Products' },
    { value: 'Meat Products', label: 'Meat Products' },
    { value: 'Bakery Products', label: 'Bakery Products' },
    { value: 'Fruits & Vegetables', label: 'Fruits & Vegetables' },
    { value: 'Cereals & Grains', label: 'Cereals & Grains' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Seafood', label: 'Seafood' },
    { value: 'Oils & Fats', label: 'Oils & Fats' }
  ];

  const commodityOptions = [
    { value: 'Milk', label: 'Milk' },
    { value: 'Cheese', label: 'Cheese' },
    { value: 'Yogurt', label: 'Yogurt' },
    { value: 'Beef', label: 'Beef' },
    { value: 'Chicken', label: 'Chicken' },
    { value: 'Pork', label: 'Pork' },
    { value: 'Bread', label: 'Bread' },
    { value: 'Rice', label: 'Rice' },
    { value: 'Wheat', label: 'Wheat' },
    { value: 'Corn', label: 'Corn' },
    { value: 'Fruit Juice', label: 'Fruit Juice' },
    { value: 'Soft Drinks', label: 'Soft Drinks' },
    { value: 'Water', label: 'Water' }
  ];

  const sampleConditionOptions = [
    { value: 'Dry', label: 'Dry' },
    { value: 'Frozen', label: 'Frozen' },
    { value: 'Solid', label: 'Solid' },
    { value: 'Chilled', label: 'Chilled' },
    { value: 'Liquid', label: 'Liquid' },
    { value: 'Room temperature', label: 'Room temperature' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.commodityCategory) {
      newErrors.commodityCategory = 'Commodity category is required';
    }
    if (!formData.commoditySubCategory) {
      newErrors.commoditySubCategory = 'Commodity sub category is required';
    }
    if (!formData.commodity) {
      newErrors.commodity = 'Commodity is required';
    }
    if (!formData.sampleQuantity) {
      newErrors.sampleQuantity = 'Sample quantity is required';
    }
    if (!formData.sampleCondition) {
      newErrors.sampleCondition = 'Sample condition is required';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sample Details</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="commodityCategory" required>
            Commodity Category
          </Label>
          <CustomSelect
            value={formData.commodityCategory}
            onChange={(value) => handleInputChange('commodityCategory', value)}
            options={commodityCategoryOptions}
            placeholder="Select commodity category"
            error={errors.commodityCategory}
          />
        </div>

        <div>
          <Label htmlFor="commoditySubCategory" required>
            Commodity Sub Category
          </Label>
          <CustomSelect
            value={formData.commoditySubCategory}
            onChange={(value) => handleInputChange('commoditySubCategory', value)}
            options={commoditySubCategoryOptions}
            placeholder="Select commodity sub category"
            error={errors.commoditySubCategory}
          />
        </div>

        <div>
          <Label htmlFor="commodity" required>
            Commodity
          </Label>
          <CustomSelect
            value={formData.commodity}
            onChange={(value) => handleInputChange('commodity', value)}
            options={commodityOptions}
            placeholder="Select commodity"
            error={errors.commodity}
          />
        </div>

        <div>
          <Label htmlFor="sampleQuantity" required>
            Sample Quantity
          </Label>
          <Input
            value={formData.sampleQuantity}
            onChange={(e) => handleInputChange('sampleQuantity', e.target.value)}
            placeholder="Enter sample quantity"
            error={errors.sampleQuantity}
          />
        </div>

        <div>
          <Label htmlFor="sampleCondition" required>
            Sample Condition
          </Label>
          <CustomSelect
            value={formData.sampleCondition}
            onChange={(value) => handleInputChange('sampleCondition', value)}
            options={sampleConditionOptions}
            placeholder="Select sample condition"
            error={errors.sampleCondition}
          />
        </div>

        <div>
          <Label htmlFor="statementOfConformity" required>
            Statement of conformity required
          </Label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="statementOfConformity"
                value="Yes"
                checked={formData.statementOfConformity === 'Yes'}
                onChange={(e) => handleInputChange('statementOfConformity', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="statementOfConformity"
                value="No"
                checked={formData.statementOfConformity === 'No'}
                onChange={(e) => handleInputChange('statementOfConformity', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="remarks">
          Remarks (if any)
        </Label>
        <textarea
          value={formData.remarks}
          onChange={(e) => handleInputChange('remarks', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          rows={3}
          placeholder="Enter remarks if any"
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
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
          {isEditing ? 'Update Sample' : 'Add Sample'}
        </motion.button>
      </div>
    </form>
  );
};

// Test Form Component
const TestForm: React.FC<{
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
  selectedSample?: any;
  orderFormData?: any;
}> = ({ onSave, onCancel, isEditing = false, initialData = null, selectedSample = null, orderFormData }) => {
  const [formData, setFormData] = useState({
    sampleId: selectedSample?.sampleId || initialData?.sampleId || '',
    testParameter: initialData?.testParameter || '',
    group: initialData?.group || 'Standard',
    specification: initialData?.specification || '',
    reference: initialData?.reference || '',
    price: initialData?.price || 0,
    analytes: initialData?.analytes || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sampleIdOptions = [
    { value: 'SMP-001', label: 'SMP-001' },
    { value: 'SMP-002', label: 'SMP-002' },
    { value: 'SMP-003', label: 'SMP-003' }
  ];

  const groupOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Premium', label: 'Premium' }
  ];

  // Filter test parameters based on order form data (company, commodity category, etc.)
  const getFilteredTestParameters = () => {
    // If no company or commodity category selected, show a helpful message
    if (!orderFormData?.companyName || !orderFormData?.commodityCategory) {
      return [];
    }

    const filtered = groupMasterData
      .filter(item => 
        item.customer.name === orderFormData.companyName &&
        item.commodityCategory.name === orderFormData.commodityCategory &&
        item.status === 'Active'
      )
      .map(item => ({
        value: item.testParameter.name,
        label: item.testParameter.name,
        costGroups: item.costGroups,
        analytes: item.testParameter.analytes
      }));

    // If no exact matches found, try to find by company only
    if (filtered.length === 0 && orderFormData.companyName) {
      return groupMasterData
        .filter(item => 
          item.customer.name === orderFormData.companyName &&
          item.status === 'Active'
        )
        .map(item => ({
          value: item.testParameter.name,
          label: item.testParameter.name,
          costGroups: item.costGroups,
          analytes: item.testParameter.analytes
        }));
    }

    return filtered;
  };

  const filteredTestParameters = getFilteredTestParameters();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTestParameterChange = (value: string) => {
    const selectedTest = filteredTestParameters.find(test => test.value === value);
    if (selectedTest) {
      // Get price for the currently selected group
      const selectedGroupPrice = selectedTest.costGroups.find(cg => cg.group === formData.group);
      setFormData(prev => ({
        ...prev,
        testParameter: value,
        price: selectedGroupPrice?.price || 0,
        analytes: selectedTest.analytes
      }));
    }
  };

  const handleGroupChange = (value: string) => {
    setFormData(prev => ({ ...prev, group: value }));
    
    // Update price based on selected group and test parameter
    if (formData.testParameter) {
      const selectedTest = filteredTestParameters.find(test => test.value === formData.testParameter);
      if (selectedTest) {
        const selectedGroupPrice = selectedTest.costGroups.find(cg => cg.group === value);
        setFormData(prev => ({ ...prev, price: selectedGroupPrice?.price || 0 }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sampleId) {
      newErrors.sampleId = 'Sample ID is required';
    }
    if (!formData.testParameter) {
      newErrors.testParameter = 'Test parameter is required';
    }
    if (!formData.group) {
      newErrors.group = 'Group selection is required';
    }
    if (!formData.specification) {
      newErrors.specification = 'Specification is required';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {selectedSample ? `Test Details for ${selectedSample.sampleId}` : 'Test Details'}
      </h4>

      {selectedSample && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Sample: {selectedSample.sampleId} - {selectedSample.commodity}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {selectedSample.commodityCategory} - {selectedSample.commoditySubCategory}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="sampleId" required>
            Sample ID
          </Label>
          <CustomSelect
            value={formData.sampleId}
            onChange={(value) => handleInputChange('sampleId', value)}
            options={sampleIdOptions}
            placeholder="Select sample ID"
            error={errors.sampleId}
            disabled={!!selectedSample}
          />
          {selectedSample && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sample ID is auto-filled from the selected sample
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="testParameter" required>
            Test Parameter
          </Label>
          <CustomSelect
            value={formData.testParameter}
            onChange={handleTestParameterChange}
            options={filteredTestParameters}
            placeholder="Select test parameter"
            error={errors.testParameter}
          />
          {filteredTestParameters.length === 0 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              No test parameters available. Please ensure Company Name and Commodity Category are selected in the Order Information step.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="group" required>
            Group
          </Label>
          <CustomSelect
            value={formData.group}
            onChange={handleGroupChange}
            options={groupOptions}
            placeholder="Select group"
            error={errors.group}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Different groups have different pricing tiers
          </p>
        </div>

        <div>
          <Label htmlFor="price">
            Price (Auto-populated)
          </Label>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-green-500 mr-2" />
            <Input
              value={`Rs. ${formData.price.toFixed(2)}`}
              onChange={() => {}}
              disabled
              className="bg-gray-50 dark:bg-gray-700"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Price is automatically updated based on selected group and test parameter
          </p>
        </div>

        <div>
          <Label htmlFor="reference">
            Reference
          </Label>
          <Input
            value={formData.reference}
            onChange={(e) => handleInputChange('reference', e.target.value)}
            placeholder="Enter reference"
          />
        </div>
      </div>

      {/* Analytes Information */}
      {formData.analytes.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                Analytes included in this test:
              </h5>
              <div className="flex flex-wrap gap-2">
                {formData.analytes.map((analyte: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full"
                  >
                    {analyte}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Pricing Information */}
      {formData.testParameter && filteredTestParameters.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Available pricing groups for {formData.testParameter}:
              </h5>
              <div className="flex flex-wrap gap-2">
                {filteredTestParameters
                  .find(test => test.value === formData.testParameter)
                  ?.costGroups.map((costGroup: any, index: number) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        costGroup.group === formData.group
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-2 ring-blue-500'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}
                    >
                      {costGroup.group}: Rs. {costGroup.price.toFixed(2)}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="specification" required>
          Specification/Reference
        </Label>
        <textarea
          value={formData.specification}
          onChange={(e) => handleInputChange('specification', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          rows={3}
          placeholder="Enter specification or reference"
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
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
          {isEditing ? 'Update Test' : 'Add Test'}
        </motion.button>
      </div>
    </form>
  );
};
