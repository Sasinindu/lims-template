import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Building2,
  TestTube,
  Package,
  Clock,
  User,
  UserCheck,
  UserPlus,
  X,
  Eye,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';

const TestAllocation: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);
  const [loading] = useState(false);
  
  // Test allocation drawer state
  const [isAllocationDrawerOpen, setIsAllocationDrawerOpen] = useState(false);
  const [selectedSampleForAllocation, setSelectedSampleForAllocation] = useState<any>(null);
  const [allocationLoading, setAllocationLoading] = useState(false);

  const [samples, setSamples] = useState([
    {
      id: 'S001',
      sampleId: 'SMP-001',
      orderId: 'ORD-2024-001',
      companyName: 'ABC Corporation',
      siteName: 'Head Office',
      commodity: 'Milk',
      commodityCategory: 'Food Products',
      commoditySubCategory: 'Dairy Products',
      sampleQuantity: '500',
      sampleCondition: 'Chilled',
      dateCollected: '2024-01-15',
      status: 'Pending Allocation',
      testsCount: 3,
      assignedAnalyst: null,
      dueDate: null,
      createdAt: '2024-01-15',
      tests: [
        {
          id: 'T001',
          testName: 'Protein Content',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          estimatedDuration: '4 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: null,
          dueDate: null
        },
        {
          id: 'T002',
          testName: 'Fat Content',
          testType: 'Chemical Analysis',
          method: 'Soxhlet Extraction',
          estimatedDuration: '6 hours',
          priority: 'Medium',
          status: 'Pending',
          assignedAnalyst: null,
          dueDate: null
        },
        {
          id: 'T003',
          testName: 'Microbiological Count',
          testType: 'Microbiological Analysis',
          method: 'Plate Count Method',
          estimatedDuration: '48 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: null,
          dueDate: null
        }
      ]
    },
    {
      id: 'S002',
      sampleId: 'SMP-002',
      orderId: 'ORD-2024-001',
      companyName: 'ABC Corporation',
      siteName: 'Head Office',
      commodity: 'Beef',
      commodityCategory: 'Food Products',
      commoditySubCategory: 'Meat Products',
      sampleQuantity: '250',
      sampleCondition: 'Frozen',
      dateCollected: '2024-01-15',
      status: 'Allocated',
      testsCount: 2,
      assignedAnalyst: 'Dr. John Smith',
      dueDate: '2024-01-25',
      createdAt: '2024-01-15',
      tests: [
        {
          id: 'T004',
          testName: 'Moisture Content',
          testType: 'Physical Analysis',
          method: 'Oven Drying Method',
          estimatedDuration: '24 hours',
          priority: 'Medium',
          status: 'Allocated',
          assignedAnalyst: 'Dr. John Smith',
          dueDate: '2024-01-25'
        },
        {
          id: 'T005',
          testName: 'Protein Content',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          estimatedDuration: '4 hours',
          priority: 'High',
          status: 'Allocated',
          assignedAnalyst: 'Dr. John Smith',
          dueDate: '2024-01-25'
        }
      ]
    },
    {
      id: 'S003',
      sampleId: 'SMP-003',
      orderId: 'ORD-2024-002',
      companyName: 'XYZ Industries',
      siteName: 'Main Facility',
      commodity: 'Rice',
      commodityCategory: 'Food Products',
      commoditySubCategory: 'Cereals & Grains',
      sampleQuantity: '1000',
      sampleCondition: 'Dry',
      dateCollected: '2024-01-16',
      status: 'In Progress',
      testsCount: 4,
      assignedAnalyst: 'Dr. Jane Doe',
      dueDate: '2024-01-26',
      createdAt: '2024-01-16',
      tests: [
        {
          id: 'T006',
          testName: 'Moisture Content',
          testType: 'Physical Analysis',
          method: 'Oven Drying Method',
          estimatedDuration: '24 hours',
          priority: 'High',
          status: 'In Progress',
          assignedAnalyst: 'Dr. Jane Doe',
          dueDate: '2024-01-26'
        },
        {
          id: 'T007',
          testName: 'Protein Content',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          estimatedDuration: '4 hours',
          priority: 'Medium',
          status: 'Pending',
          assignedAnalyst: null,
          dueDate: null
        },
        {
          id: 'T008',
          testName: 'Ash Content',
          testType: 'Chemical Analysis',
          method: 'Muffle Furnace Method',
          estimatedDuration: '6 hours',
          priority: 'Low',
          status: 'Pending',
          assignedAnalyst: null,
          dueDate: null
        },
        {
          id: 'T009',
          testName: 'Pesticide Residue',
          testType: 'Chemical Analysis',
          method: 'GC-MS Method',
          estimatedDuration: '8 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: null,
          dueDate: null
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending Allocation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Allocated':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Allocated':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const columns: Column[] = [
    {
      key: 'sampleId',
      title: 'Sample ID',
      dataIndex: 'sampleId',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'orderId',
      title: 'Order ID',
      dataIndex: 'orderId',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
        </div>
      )
    },
    {
      key: 'companyName',
      title: 'Company',
      dataIndex: 'companyName',
      sortable: true,
      render: (value, record) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="font-medium">{value}</div>
          <div className="text-xs">{record.siteName}</div>
        </div>
      )
    },
    {
      key: 'commodity',
      title: 'Commodity',
      dataIndex: 'commodity',
      sortable: true,
      render: (value, record) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="font-medium">{value}</div>
          <div className="text-xs">{record.commodityCategory}</div>
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
      key: 'assignedAnalyst',
      title: 'Assigned Analyst',
      dataIndex: 'assignedAnalyst',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          {value ? (
            <>
              <User className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">Not assigned</span>
          )}
        </div>
      )
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      dataIndex: 'dueDate',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          {value ? (
            <>
              <CalendarIcon className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500">Not set</span>
          )}
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
      render: (_, record: any) => (
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleViewSample(record)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
            title="View Sample Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {record.status === 'Pending Allocation' && (
            <button
              type="button"
              onClick={() => handleAllocateSample(record)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
              title="Allocate Tests to Analysts"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const handleViewSample = (record: any) => {
    setSelectedSample(record);
    setIsDrawerOpen(true);
  };

  const handleAllocateSample = (record: any) => {
    setSelectedSampleForAllocation(record);
    setIsAllocationDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSample(null);
  };

  const handleCloseAllocationDrawer = () => {
    setIsAllocationDrawerOpen(false);
    setSelectedSampleForAllocation(null);
  };

  const handleConfirmAllocation = async (testAllocations: any[]) => {
    setAllocationLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update sample and test statuses
      if (selectedSampleForAllocation) {
        setSamples(prev =>
          prev.map(sample =>
            sample.id === selectedSampleForAllocation.id 
              ? { 
                  ...sample, 
                  status: 'Allocated',
                  tests: sample.tests.map(test => {
                    const allocation = testAllocations.find(ta => ta.testId === test.id);
                    if (allocation) {
                      return {
                        ...test,
                        status: 'Allocated',
                        assignedAnalyst: allocation.analyst,
                        dueDate: allocation.dueDate
                      };
                    }
                    return test;
                  })
                }
              : sample
          )
        );
      }
      
      // Close drawer
      setIsAllocationDrawerOpen(false);
      setSelectedSampleForAllocation(null);
      
      // Show success message (you can add a toast notification here)
      console.log('Tests allocated successfully');
      
    } catch (error) {
      console.error('Error allocating tests:', error);
      // Handle error (show error message)
    } finally {
      setAllocationLoading(false);
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
          Test Allocation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Allocate individual tests to analysts for testing
        </p>
      </motion.div>

      {/* Sample Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Samples</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{samples.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Allocation</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {samples.filter(sample => sample.status === 'Pending Allocation').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Allocated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {samples.filter(sample => sample.status === 'Allocated').length}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {samples.filter(sample => sample.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <TestTube className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Samples Data Table */}
      <DataTable
        columns={columns}
        data={samples}
        loading={loading}
        searchPlaceholder="Search samples..."
        searchable={true}
        exportable={true}
        pagination={true}
        pageSize={10}
      />

      {/* Sample Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Sample Details"
        size="2xl"
      >
        {selectedSample && <SampleDetailsView sample={selectedSample} />}
      </Drawer>

      {/* Test Allocation Drawer */}
      <TestAllocationDrawer
        isOpen={isAllocationDrawerOpen}
        onClose={handleCloseAllocationDrawer}
        onConfirm={handleConfirmAllocation}
        sample={selectedSampleForAllocation}
        loading={allocationLoading}
      />
    </div>
  );
};

// Sample Details View Component
const SampleDetailsView: React.FC<{ sample: any }> = ({ sample }) => {
  return (
    <div className="space-y-6 p-6">
      {/* Sample Information */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Package className="w-5 h-5 mr-2 text-primary-600" />
          Sample Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Sample ID</Label>
            <div className="flex items-center mt-1">
              <Package className="w-4 h-4 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.sampleId}</span>
            </div>
          </div>
          <div>
            <Label>Order ID</Label>
            <div className="flex items-center mt-1">
              <FileText className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{sample.orderId}</span>
            </div>
          </div>
          <div>
            <Label>Commodity</Label>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <div className="font-medium">{sample.commodity}</div>
              <div className="text-xs">{sample.commodityCategory} - {sample.commoditySubCategory}</div>
            </div>
          </div>
          <div>
            <Label>Sample Quantity</Label>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1 block">{sample.sampleQuantity} g</span>
          </div>
          <div>
            <Label>Sample Condition</Label>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mt-1 inline-block">
              {sample.sampleCondition}
            </span>
          </div>
          <div>
            <Label>Date Collected</Label>
            <div className="flex items-center mt-1">
              <CalendarIcon className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{sample.dateCollected}</span>
            </div>
          </div>
        </div>
      </div>

      

      {/* Test Information */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <TestTube className="w-5 h-5 mr-2 text-primary-600" />
          Test Information
        </h3>
        <div className="space-y-4">
          {sample.tests?.map((test: any) => (
            <div key={test.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">{test.testName}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${test.status === 'Pending' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : test.status === 'Allocated'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {test.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${test.priority === 'High' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : test.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {test.priority}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Type:</span> {test.testType}
                </div>
                <div>
                  <span className="font-medium">Protocol:</span> {test.method}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {test.estimatedDuration}
                </div>
                {test.assignedAnalyst && (
                  <div>
                    <span className="font-medium">Analyst:</span> {test.assignedAnalyst}
                  </div>
                )}
                {test.dueDate && (
                  <div>
                    <span className="font-medium">Due Date:</span> {test.dueDate}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Test Allocation Drawer Component
const TestAllocationDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (testAllocations: any[]) => void;
  sample: any;
  loading: boolean;
}> = ({ isOpen, onClose, onConfirm, sample, loading }) => {
  const [testAllocations, setTestAllocations] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const analystOptions = [
    { value: 'Dr. John Smith', label: 'Dr. John Smith' },
    { value: 'Dr. Jane Doe', label: 'Dr. Jane Doe' },
    { value: 'Dr. Michael Johnson', label: 'Dr. Michael Johnson' },
    { value: 'Dr. Sarah Wilson', label: 'Dr. Sarah Wilson' },
    { value: 'Dr. Robert Brown', label: 'Dr. Robert Brown' },
    { value: 'Dr. Emily Davis', label: 'Dr. Emily Davis' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const handleTestAllocationChange = (testId: string, field: string, value: string) => {
    setTestAllocations(prev => {
      const existing = prev.find(ta => ta.testId === testId);
      if (existing) {
        return prev.map(ta => 
          ta.testId === testId ? { ...ta, [field]: value } : ta
        );
      } else {
        return [...prev, { testId, [field]: value }];
      }
    });

    // Clear error for this test
    if (errors[`${testId}_${field}`]) {
      setErrors(prev => ({ ...prev, [`${testId}_${field}`]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Check if at least one test is being allocated
    if (testAllocations.length === 0) {
      newErrors.general = 'Please allocate at least one test to an analyst';
    }

    // Validate each allocation
    testAllocations.forEach(allocation => {
      if (!allocation.analyst?.trim()) {
        newErrors[`${allocation.testId}_analyst`] = 'Analyst is required';
      }
      if (!allocation.dueDate?.trim()) {
        newErrors[`${allocation.testId}_dueDate`] = 'Due date is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(testAllocations);
    }
  };

  // Reset form when sample changes
  React.useEffect(() => {
    setTestAllocations([]);
    setErrors({});
  }, [sample]);

  // Drawer Footer Component
  const drawerFooter = (
    <div className="p-4">
      <div className="flex items-center justify-end space-x-3">
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          form="test-allocation-form"
          disabled={testAllocations.length === 0 || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Allocating...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Allocate Tests
            </>
          )}
        </motion.button>
      </div>
    </div>
  );

  if (!sample) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Allocate Tests - ${sample.sampleId}`}
      size="xl"
      footer={drawerFooter}
    >
      <form id="test-allocation-form" onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Sample Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary-600" />
            Sample Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Sample ID:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{sample.sampleId}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Commodity:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{sample.commodity}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Tests:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{sample.testsCount}</span>
            </div>
          </div>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-300">{errors.general}</span>
            </div>
          </div>
        )}

        {/* Tests List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-primary-600" />
            Available Tests
          </h3>
          <div className="space-y-4">
            {sample.tests?.map((test: any) => (
              <div key={test.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{test.testName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{test.testType} - {test.method}</p>
                  </div>
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`analyst_${test.id}`} required>Select Analyst</Label>
                    <CustomSelect
                      value={testAllocations.find(ta => ta.testId === test.id)?.analyst || ''}
                      onChange={(value) => handleTestAllocationChange(test.id, 'analyst', value)}
                      options={analystOptions}
                      placeholder="Select analyst for this test"
                      error={errors[`${test.id}_analyst`]}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`dueDate_${test.id}`} required>Due Date</Label>
                    <Input 
                      type="date" 
                      value={testAllocations.find(ta => ta.testId === test.id)?.dueDate || ''}
                      onChange={(e) => handleTestAllocationChange(test.id, 'dueDate', e.target.value)}
                      error={errors[`${test.id}_dueDate`]}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </form>
    </Drawer>
  );
};

export default TestAllocation;
