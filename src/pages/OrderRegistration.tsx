import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';
import SimpleTable from '../components/SimpleTable';

const OrderRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [loading] = useState(false);
  const [selectedSampleForTest, setSelectedSampleForTest] = useState<any>(null);

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
    }
  ];

  const handleAddOrder = () => {
    setEditingOrder(null);
    setIsDrawerOpen(true);
  };

  const handleEditOrder = (record: any) => {
    setEditingOrder(record);
    setIsDrawerOpen(true);
  };

  const handleViewOrder = (record: any) => {
    console.log('View order:', record.id);
  };

  const handleDeleteOrder = (record: any) => {
    if (window.confirm(`Are you sure you want to delete order "${record.orderId}"?`)) {
      setOrders(prev => prev.filter(order => order.id !== record.id));
    }
  };

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
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingOrder(null);
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
        return <OrderInformationStep />;
      case 2:
        return <SamplesStep onAddTestForSample={handleAddTestForSample} />;
      case 3:
        return <TestsStep selectedSample={selectedSampleForTest} onTestAdded={() => setSelectedSampleForTest(null)} />;
      case 4:
        return <ReviewStep />;
      default:
        return <OrderInformationStep />;
    }
  };

  // Drawer Footer Component
  const drawerFooter = (
    <div className="p-4">
      <div className="flex items-center justify-between space-x-3">
        <motion.button
          type="button"
          onClick={handleCloseDrawer}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
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
              <Save className="w-4 h-4" />
              <span>{editingOrder ? 'Update Order' : 'Submit Order'}</span>
            </motion.button>
          )}
        </div>
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
          Order Registration
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Register and manage laboratory test orders
        </p>
      </motion.div>

      {/* Orders Data Table */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        searchPlaceholder="Search orders..."
        addButtonText="New Order"
        onAdd={handleAddOrder}
        onEdit={handleEditOrder}
        onView={handleViewOrder}
        onDelete={handleDeleteOrder}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Order Registration Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingOrder ? 'Edit Order' : 'New Order Registration'}
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
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : isCompleted
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isActive
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
const OrderInformationStep: React.FC = () => {
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
              value=""
              onChange={() => {}}
              options={[
                { value: 'ABC Corporation', label: 'ABC Corporation' },
                { value: 'XYZ Industries', label: 'XYZ Industries' },
                { value: 'Ministry of Health', label: 'Ministry of Health' },
                { value: 'University of Science', label: 'University of Science' }
              ]}
              placeholder="Select Company"
            />
          </div>
          <div>
            <Label htmlFor="siteName" required>Site Name</Label>
            <CustomSelect
              value=""
              onChange={() => {}}
              options={[
                { value: 'Head Office', label: 'Head Office' },
                { value: 'Branch Office', label: 'Branch Office' },
                { value: 'Main Facility', label: 'Main Facility' },
                { value: 'Research Lab', label: 'Research Lab' }
              ]}
              placeholder="Select Site"
            />
          </div>
          <div>
            <Label htmlFor="addressLine1" required>Address Line 1</Label>
            <Input value="" onChange={() => {}} placeholder="Enter address line 1" />
          </div>
          <div>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input value="" onChange={() => {}} placeholder="Enter address line 2" />
          </div>
          <div>
            <Label htmlFor="city" required>City</Label>
            <CustomSelect
              value=""
              onChange={() => {}}
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
              onChange={() => {}}
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

      {/* Site Details Section */}
      {/* <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary-600" />
          Site Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
        </div>
      </div> */}

      {/* Contact Information Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary-600" />
          Report to be issued to
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="contactPersonName" required>Contact Person Name</Label>
            <Input value="" onChange={() => {}} placeholder="Enter contact person name" />
          </div>
          <div>
            <Label htmlFor="phoneNumber" required>Phone Number</Label>
            <Input type="tel" value="" onChange={() => {}} placeholder="Enter phone number" />
          </div>
          <div>
            <Label htmlFor="email" required>Email</Label>
            <Input type="email" value="" onChange={() => {}} placeholder="Enter email address" />
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
            <Input value="" onChange={() => {}} placeholder="Enter contact person name" />
          </div>
          <div>
            <Label htmlFor="invoicePhoneNumber" required>Phone Number</Label>
            <Input type="tel" value="" onChange={() => {}} placeholder="Enter phone number" />
          </div>
          <div>
            <Label htmlFor="invoiceEmail" required>Email</Label>
            <Input type="email" value="" onChange={() => {}} placeholder="Enter email address" />
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
            <Input value="ORD-2024-001" onChange={() => {}} disabled />
          </div>
          <div>
            <Label htmlFor="poNumber">PO Number</Label>
            <Input value="" onChange={() => {}} placeholder="Enter PO number" />
          </div>
          <div>
            <Label htmlFor="quotationNumber">Quotation Number (Optional)</Label>
            <Input value="" onChange={() => {}} placeholder="Enter quotation number" />
          </div>
          <div>
            <Label htmlFor="samplingBy" required>Sampling by</Label>
            <div className="flex space-x-6 mt-2">
              <label className="flex items-center">
                <input type="radio" name="samplingBy" value="client" className="mr-2" />
                <span className="text-sm">Client</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="samplingBy" value="lab" className="mr-2" />
                <span className="text-sm">Lab Representative</span>
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="dateCollected" required>Date Sample Collected/Submitted</Label>
            <Input type="date" value="" onChange={() => {}} />
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
            <Input value="" onChange={() => {}} placeholder="Enter receiver name" />
          </div>
          <div>
            <Label htmlFor="dateOfReceipt">Date of Receipt</Label>
            <Input type="date" value="" onChange={() => {}} />
          </div>
          <div>
            <Label htmlFor="timeOfReceipt">Time of Receipt</Label>
            <Input type="time" value="" onChange={() => {}} />
          </div>
          <div>
            <Label htmlFor="packing">Packing</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Poly Bag</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Plastic Container</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Glass Container</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Other</span>
              </label>
            </div>
          </div>
          <div>
            <Label htmlFor="testBasis" required>Test Basis</Label>
            <CustomSelect
              value=""
              onChange={() => {}}
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
                <span className="text-sm">Hard Copy</span>
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
            <Input type="email" value="" onChange={() => {}} placeholder="Enter email address" />
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
const SamplesStep: React.FC<{ onAddTestForSample: (sample: any) => void }> = ({ onAddTestForSample }) => {
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
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Yes' 
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

      {/* Samples List */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary-600" />
            Samples List
          </h3>
          <motion.button
            onClick={handleAddSample}
            whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
            <Plus className="w-4 h-4 mr-2" />
            Add Sample
          </motion.button>
        </div>

        {samples.length > 0 ? (
          <SimpleTable
            columns={sampleColumns}
            data={samples}
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
    </div>
  );
};

// Tests Step Component
const TestsStep: React.FC<{ selectedSample?: any; onTestAdded: () => void }> = ({ selectedSample, onTestAdded }) => {
  const [tests, setTests] = useState([
    {
      id: 'T001',
      testId: 'TST-001',
      sampleId: 'SMP-001',
      testParameter: 'Microbiological Analysis',
      testMethod: 'ISO 4833-1:2013',
      specification: 'Total Plate Count < 10,000 CFU/g',
      reference: 'Food Safety Standards'
    },
    {
      id: 'T002',
      testId: 'TST-002',
      sampleId: 'SMP-001',
      testParameter: 'Chemical Analysis',
      testMethod: 'AOAC 991.25',
      specification: 'Protein Content > 3.0%',
      reference: 'Nutritional Standards'
    },
    {
      id: 'T003',
      testId: 'TST-003',
      sampleId: 'SMP-002',
      testParameter: 'Pathogen Detection',
      testMethod: 'ISO 6579:2017',
      specification: 'Salmonella: Absent in 25g',
      reference: 'Food Safety Standards'
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
      key: 'testMethod',
      title: 'Test Method',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
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

      {/* Tests Management */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-primary-600" />
            Tests Management
          </h3>
          <motion.button
            onClick={handleAddTest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Test Parameters</span>
          </motion.button>
        </div>

        {tests.length > 0 ? (
          <SimpleTable
            columns={testColumns}
            data={tests}
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

      {/* Add/Edit Test Form */}
      {isAddTestOpen && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <TestForm
            onSave={handleSaveTest}
            onCancel={handleCloseAddTest}
            isEditing={!!editingTest}
            initialData={editingTest}
            selectedSample={selectedSample}
          />
        </div>
      )}
    </div>
  );
};

// Review Step Component
const ReviewStep: React.FC = () => {
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
                <div>Test Basis: Normal</div>
                <div>Sampling: Client</div>
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
    { value: 'Cereals & Grains', label: 'Cereals & Grains' }
  ];

  const commodityOptions = [
    { value: 'Milk', label: 'Milk' },
    { value: 'Beef', label: 'Beef' },
    { value: 'Chicken', label: 'Chicken' },
    { value: 'Bread', label: 'Bread' },
    { value: 'Rice', label: 'Rice' }
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
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isEditing ? 'Update Sample' : 'Add Sample'}</span>
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
}> = ({ onSave, onCancel, isEditing = false, initialData = null, selectedSample = null }) => {
  const [formData, setFormData] = useState({
    sampleId: selectedSample?.sampleId || initialData?.sampleId || '',
    testParameter: initialData?.testParameter || '',
    testMethod: initialData?.testMethod || '',
    specification: initialData?.specification || '',
    reference: initialData?.reference || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sampleIdOptions = [
    { value: 'SMP-001', label: 'SMP-001' },
    { value: 'SMP-002', label: 'SMP-002' },
    { value: 'SMP-003', label: 'SMP-003' }
  ];

  const testParameterOptions = [
    { value: 'Microbiological Analysis', label: 'Microbiological Analysis' },
    { value: 'Chemical Analysis', label: 'Chemical Analysis' },
    { value: 'Pathogen Detection', label: 'Pathogen Detection' },
    { value: 'Nutritional Analysis', label: 'Nutritional Analysis' },
    { value: 'Heavy Metals', label: 'Heavy Metals' }
  ];

  const testMethodOptions = [
    { value: 'ISO 4833-1:2013', label: 'ISO 4833-1:2013' },
    { value: 'AOAC 991.25', label: 'AOAC 991.25' },
    { value: 'ISO 6579:2017', label: 'ISO 6579:2017' },
    { value: 'ISO 21528-1:2017', label: 'ISO 21528-1:2017' },
    { value: 'EPA 200.8', label: 'EPA 200.8' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
    if (!formData.testMethod) {
      newErrors.testMethod = 'Test method is required';
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
            onChange={(value) => handleInputChange('testParameter', value)}
            options={testParameterOptions}
            placeholder="Select test parameter"
            error={errors.testParameter}
          />
        </div>

        <div>
          <Label htmlFor="testMethod" required>
            Test Method
          </Label>
          <CustomSelect
            value={formData.testMethod}
            onChange={(value) => handleInputChange('testMethod', value)}
            options={testMethodOptions}
            placeholder="Select test method"
            error={errors.testMethod}
          />
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
          error={errors.specification}
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isEditing ? 'Update Test' : 'Add Test'}</span>
        </motion.button>
      </div>
    </form>
  );
};
