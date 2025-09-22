import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Building2,
  TestTube,
  Package,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Clock,
  User,
  UserCheck,
  Calendar as CalendarIcon,
  Eye,
  Check,
  X,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  BarChart3,
  FileCheck,
  Download
} from 'lucide-react';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';
import Breadcrumb from '../components/Breadcrumb';

interface Order {
  id: string;
  orderId: string;
  companyName: string;
  siteName: string;
  poNumber: string;
  totalSamples: number;
  totalTests: number;
  status: string;
  createdAt: string;
  samples: Sample[];
}

interface Sample {
  id: string;
  sampleId: string;
  orderId: string;
  commodity: string;
  commodityCategory: string;
  assignedAnalyst: string;
  dueDate: string;
  status: string;
  testsCount: number;
  tests: Test[];
}

interface Test {
  id: string;
  testId: string;
  testName: string;
  method: string;
  assignedAnalyst: string;
  status: string;
  priority: string;
  completedDate?: string;
  result?: string;
  unit?: string;
  specification?: string;
  passStatus?: 'Pass' | 'Fail' | 'Pending';
}

type ViewLevel = 'orders' | 'samples' | 'tests';

const ResultsApproval: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewLevel>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [expandedSamples, setExpandedSamples] = useState<Set<string>>(new Set());
  const [loading] = useState(false);

  // Results viewing drawer state
  const [isResultsDrawerOpen, setIsResultsDrawerOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      orderId: 'ORD-2024-001',
      companyName: 'ABC Corporation',
      siteName: 'Head Office',
      poNumber: 'PO-2024-001',
      totalSamples: 3,
      totalTests: 8,
      status: 'Results Pending',
      createdAt: '2024-01-15',
      samples: [
        {
          id: 'S001',
          sampleId: 'SMP-001',
          orderId: 'ORD-2024-001',
          commodity: 'Milk',
          commodityCategory: 'Food Products',
          assignedAnalyst: 'Dr. John Smith',
          dueDate: '2024-01-25',
          status: 'Testing Complete',
          testsCount: 3,
          tests: [
            {
              id: 'T001',
              testId: 'TST-001',
              testName: 'Protein Content',
              method: 'Kjeldahl Method',
              assignedAnalyst: 'Dr. John Smith',
              status: 'Completed',
              priority: 'High',
              completedDate: '2024-01-22',
              result: '3.2',
              unit: '%',
              specification: '≥ 3.0',
              passStatus: 'Pass'
            },
            {
              id: 'T002',
              testId: 'TST-002',
              testName: 'Fat Content',
              method: 'Soxhlet Extraction',
              assignedAnalyst: 'Dr. John Smith',
              status: 'Completed',
              priority: 'Medium',
              completedDate: '2024-01-23',
              result: '3.8',
              unit: '%',
              specification: '3.0 - 4.0',
              passStatus: 'Pass'
            },
            {
              id: 'T003',
              testId: 'TST-003',
              testName: 'Microbiological Count',
              method: 'Plate Count Method',
              assignedAnalyst: 'Dr. John Smith',
              status: 'Completed',
              priority: 'High',
              completedDate: '2024-01-24',
              result: '1.2 × 10⁴',
              unit: 'CFU/ml',
              specification: '≤ 1.0 × 10⁵',
              passStatus: 'Pass'
            }
          ]
        },
        {
          id: 'S002',
          sampleId: 'SMP-002',
          orderId: 'ORD-2024-001',
          commodity: 'Beef',
          commodityCategory: 'Food Products',
          assignedAnalyst: 'Dr. Jane Doe',
          dueDate: '2024-01-26',
          status: 'Testing Complete',
          testsCount: 2,
          tests: [
            {
              id: 'T004',
              testId: 'TST-004',
              testName: 'Moisture Content',
              method: 'Oven Drying Method',
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'Completed',
              priority: 'Medium',
              completedDate: '2024-01-25',
              result: '75.2',
              unit: '%',
              specification: '70.0 - 78.0',
              passStatus: 'Pass'
            },
            {
              id: 'T005',
              testId: 'TST-005',
              testName: 'Protein Analysis',
              method: 'Kjeldahl Method',
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'Completed',
              priority: 'High',
              completedDate: '2024-01-25',
              result: '18.5',
              unit: '%',
              specification: '≥ 20.0',
              passStatus: 'Fail'
            }
          ]
        },
        {
          id: 'S003',
          sampleId: 'SMP-003',
          orderId: 'ORD-2024-001',
          commodity: 'Rice',
          commodityCategory: 'Food Products',
          assignedAnalyst: 'Dr. Sarah Wilson',
          dueDate: '2024-01-27',
          status: 'Results Approved',
          testsCount: 3,
          tests: [
            {
              id: 'T006',
              testId: 'TST-006',
              testName: 'Moisture Analysis',
              method: 'Oven Drying Method',
              assignedAnalyst: 'Dr. Sarah Wilson',
              status: 'Approved',
              priority: 'High',
              completedDate: '2024-01-26',
              result: '12.5',
              unit: '%',
              specification: '≤ 14.0',
              passStatus: 'Pass'
            },
            {
              id: 'T007',
              testId: 'TST-007',
              testName: 'Pesticide Residue',
              method: 'GC-MS Method',
              assignedAnalyst: 'Dr. Sarah Wilson',
              status: 'Approved',
              priority: 'High',
              completedDate: '2024-01-26',
              result: 'Not Detected',
              unit: 'mg/kg',
              specification: '≤ 0.01',
              passStatus: 'Pass'
            },
            {
              id: 'T008',
              testId: 'TST-008',
              testName: 'Heavy Metals',
              method: 'ICP-MS Method',
              assignedAnalyst: 'Dr. Sarah Wilson',
              status: 'Approved',
              priority: 'Medium',
              completedDate: '2024-01-26',
              result: '0.05',
              unit: 'mg/kg',
              specification: '≤ 0.1',
              passStatus: 'Pass'
            }
          ]
        }
      ]
    },
    {
      id: 'ORD002',
      orderId: 'ORD-2024-002',
      companyName: 'XYZ Industries',
      siteName: 'Main Facility',
      poNumber: 'PO-2024-002',
      totalSamples: 2,
      totalTests: 5,
      status: 'Results Approved',
      createdAt: '2024-01-16',
      samples: [
        {
          id: 'S004',
          sampleId: 'SMP-004',
          orderId: 'ORD-2024-002',
          commodity: 'Wheat',
          commodityCategory: 'Food Products',
          assignedAnalyst: 'Dr. Mike Johnson',
          dueDate: '2024-01-28',
          status: 'Results Approved',
          testsCount: 3,
          tests: [
            {
              id: 'T009',
              testId: 'TST-009',
              testName: 'Gluten Content',
              method: 'Washing Method',
              assignedAnalyst: 'Dr. Mike Johnson',
              status: 'Approved',
              priority: 'High',
              completedDate: '2024-01-27',
              result: '12.8',
              unit: '%',
              specification: '≥ 12.0',
              passStatus: 'Pass'
            },
            {
              id: 'T010',
              testId: 'TST-010',
              testName: 'Protein Analysis',
              method: 'Kjeldahl Method',
              assignedAnalyst: 'Dr. Mike Johnson',
              status: 'Approved',
              priority: 'Medium',
              completedDate: '2024-01-27',
              result: '11.2',
              unit: '%',
              specification: '10.0 - 14.0',
              passStatus: 'Pass'
            },
            {
              id: 'T011',
              testId: 'TST-011',
              testName: 'Moisture Content',
              method: 'Oven Drying Method',
              assignedAnalyst: 'Dr. Mike Johnson',
              status: 'Approved',
              priority: 'Low',
              completedDate: '2024-01-27',
              result: '13.5',
              unit: '%',
              specification: '≤ 14.0',
              passStatus: 'Pass'
            }
          ]
        },
        {
          id: 'S005',
          sampleId: 'SMP-005',
          orderId: 'ORD-2024-002',
          commodity: 'Corn',
          commodityCategory: 'Food Products',
          assignedAnalyst: 'Dr. Lisa Brown',
          dueDate: '2024-01-29',
          status: 'Results Approved',
          testsCount: 2,
          tests: [
            {
              id: 'T012',
              testId: 'TST-012',
              testName: 'Aflatoxin Analysis',
              method: 'HPLC Method',
              assignedAnalyst: 'Dr. Lisa Brown',
              status: 'Approved',
              priority: 'High',
              completedDate: '2024-01-28',
              result: 'Not Detected',
              unit: 'μg/kg',
              specification: '≤ 5.0',
              passStatus: 'Pass'
            },
            {
              id: 'T013',
              testId: 'TST-013',
              testName: 'Moisture Analysis',
              method: 'Oven Drying Method',
              assignedAnalyst: 'Dr. Lisa Brown',
              status: 'Approved',
              priority: 'Medium',
              completedDate: '2024-01-28',
              result: '15.2',
              unit: '%',
              specification: '≤ 16.0',
              passStatus: 'Pass'
            }
          ]
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Results Approved':
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Results Pending':
      case 'Testing Complete':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Returned':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPassStatusColor = (passStatus: string) => {
    switch (passStatus) {
      case 'Pass':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Fail':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
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

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleSampleExpansion = (sampleId: string) => {
    setExpandedSamples(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sampleId)) {
        newSet.delete(sampleId);
      } else {
        newSet.add(sampleId);
      }
      return newSet;
    });
  };

  const handleViewSamples = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView('samples');
  };

  const handleViewTests = (sample: Sample) => {
    setSelectedSample(sample);
    setCurrentView('tests');
  };

  const handleViewTestResults = (test: Test) => {
    setSelectedTest(test);
    setIsResultsDrawerOpen(true);
  };

  const handleBackToOrders = () => {
    setCurrentView('orders');
    setSelectedOrder(null);
    setSelectedSample(null);
  };

  const handleBackToSamples = () => {
    setCurrentView('samples');
    setSelectedSample(null);
  };

  const handleApproveTest = (testId: string) => {
    setOrders(prev =>
      prev.map(order => ({
        ...order,
        samples: order.samples.map(sample => ({
          ...sample,
          tests: sample.tests.map(test =>
            test.id === testId ? { ...test, status: 'Approved' } : test
          )
        }))
      }))
    );
  };

  const handleReturnTest = (testId: string) => {
    setOrders(prev =>
      prev.map(order => ({
        ...order,
        samples: order.samples.map(sample => ({
          ...sample,
          tests: sample.tests.map(test =>
            test.id === testId ? { ...test, status: 'Returned' } : test
          )
        }))
      }))
    );
  };

  const getBreadcrumbItems = () => {
    const items = [];
    
    if (currentView === 'orders') {
      items.push({ label: 'Orders', isActive: true });
    } else if (currentView === 'samples') {
      items.push(
        { label: 'Orders', onClick: handleBackToOrders },
        { label: selectedOrder?.orderId || '', isActive: true }
      );
    } else if (currentView === 'tests') {
      items.push(
        { label: 'Orders', onClick: handleBackToOrders },
        { label: selectedOrder?.orderId || '', onClick: handleBackToSamples },
        { label: selectedSample?.sampleId || '', isActive: true }
      );
    }
    
    return items;
  };

  const renderOrdersView = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Results Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'Results Pending').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Testing Complete</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.samples.some(s => s.status === 'Testing Complete')).length}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Results Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'Results Approved').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
        
        <div className="relative">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PO Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Samples</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order, orderIndex) => (
                  <React.Fragment key={order.id}>
                    {/* Order Row */}
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: orderIndex * 0.1 }}
                      className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 ${
                        orderIndex % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/30' : 'bg-white/30 dark:bg-gray-900/30'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <motion.button
                          onClick={() => toggleOrderExpansion(order.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          {expandedOrders.has(order.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </motion.button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white">{order.orderId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{order.companyName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-orange-500 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{order.siteName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{order.poNumber}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{order.totalSamples}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <TestTube className="w-4 h-4 text-indigo-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{order.totalTests}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleViewSamples(order)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                            title="View Samples"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          {order.status === 'Results Approved' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                              title="Download Report"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>

                    {/* Expanded Samples */}
                    <AnimatePresence>
                      {expandedOrders.has(order.id) && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan={9} className="px-0 py-0">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700"
                            >
                              <div className="px-6 py-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                  <Package className="w-4 h-4 mr-2 text-primary-600" />
                                  Samples in Order {order.orderId}
                                </h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b border-gray-200 dark:border-gray-600">
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sample ID</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commodity</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Analyst</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                      {order.samples.map((sample, sampleIndex) => (
                                        <motion.tr
                                          key={sample.id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: sampleIndex * 0.05 }}
                                          className={`hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                                            sampleIndex % 2 === 0 ? 'bg-white/50 dark:bg-gray-900/50' : 'bg-gray-50/50 dark:bg-gray-800/50'
                                          }`}
                                        >
                                          <td className="px-3 py-3">
                                            <div className="flex items-center">
                                              <Package className="w-3 h-3 text-primary-600 mr-2" />
                                              <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.sampleId}</span>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                              <div className="font-medium">{sample.commodity}</div>
                                              <div className="text-xs">{sample.commodityCategory}</div>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <div className="flex items-center">
                                              <TestTube className="w-3 h-3 text-green-500 mr-1" />
                                              <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.testsCount}</span>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <div className="flex items-center">
                                              <User className="w-3 h-3 text-purple-500 mr-1" />
                                              <span className="text-sm text-gray-600 dark:text-gray-400">{sample.assignedAnalyst}</span>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <div className="flex items-center">
                                              <CalendarIcon className="w-3 h-3 text-orange-500 mr-1" />
                                              <span className="text-sm text-gray-600 dark:text-gray-400">{sample.dueDate}</span>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sample.status)}`}>
                                              {sample.status}
                                            </span>
                                          </td>
                                          <td className="px-3 py-3">
                                            <motion.button
                                              onClick={() => handleViewTests(sample)}
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                                              title="View Tests"
                                            >
                                              <Eye className="w-3 h-3" />
                                            </motion.button>
                                          </td>
                                        </motion.tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderSamplesView = () => {
    if (!selectedOrder) return null;

    return (
      <div className="space-y-6">
        {/* Back Button and Order Info */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handleBackToOrders}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </motion.button>
          
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedOrder.orderId}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.companyName} - {selectedOrder.siteName}</p>
          </div>
        </div>

        {/* Samples Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
          
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sample ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commodity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Analyst</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedOrder.samples.map((sample, index) => (
                    <motion.tr
                      key={sample.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/30' : 'bg-white/30 dark:bg-gray-900/30'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white">{sample.sampleId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="font-medium">{sample.commodity}</div>
                          <div className="text-xs">{sample.commodityCategory}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <TestTube className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.testsCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{sample.assignedAnalyst}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 text-orange-500 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{sample.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sample.status)}`}>
                          {sample.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <motion.button
                          onClick={() => handleViewTests(sample)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          title="View Tests"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderTestsView = () => {
    if (!selectedSample) return null;

    return (
      <div className="space-y-6">
        {/* Back Button and Sample Info */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handleBackToSamples}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Samples
          </motion.button>
          
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedSample.sampleId}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSample.commodity} - {selectedSample.commodityCategory}</p>
          </div>
        </div>

        {/* Tests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
          
          <div className="relative">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Test ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Test Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Analyst</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedSample.tests.map((test, index) => (
                    <motion.tr
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/30' : 'bg-white/30 dark:bg-gray-900/30'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <TestTube className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white">{test.testId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{test.testName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{test.method}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{test.assignedAnalyst}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(test.priority)}`}>
                          {test.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          {test.result && (
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {test.result} {test.unit}
                            </span>
                          )}
                          {test.passStatus && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPassStatusColor(test.passStatus)}`}>
                              {test.passStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleViewTestResults(test)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                            title="View Test Results"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          {test.status === 'Completed' && (
                            <>
                              <motion.button
                                onClick={() => handleApproveTest(test.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                                title="Approve Test"
                              >
                                <Check className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleReturnTest(test.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                title="Return Test"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Results Approval
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and approve test results across orders, samples, and individual tests
          </p>
        </div>
      </motion.div>

      {/* Breadcrumb Navigation */}
      <Breadcrumb items={getBreadcrumbItems()} />

      {/* Current View */}
      {currentView === 'orders' && renderOrdersView()}
      {currentView === 'samples' && renderSamplesView()}
      {currentView === 'tests' && renderTestsView()}

      {/* Test Results Drawer */}
      <Drawer
        isOpen={isResultsDrawerOpen}
        onClose={() => setIsResultsDrawerOpen(false)}
        title={`Test Results - ${selectedTest?.testId || ''}`}
        size="xl"
      >
        {selectedTest && (
          <div className="p-6 space-y-6">
            {/* Test Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Test Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Test Name:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.testName}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Method:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.method}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Analyst:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.assignedAnalyst}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Completed:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.completedDate}</p>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Result</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedTest.result} {selectedTest.unit}
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <FileCheck className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Specification</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedTest.specification}
                  </div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                  {selectedTest.passStatus === 'Pass' ? (
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                  <div className={`text-lg font-bold ${
                    selectedTest.passStatus === 'Pass' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedTest.passStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedTest.status === 'Completed' && (
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  onClick={() => handleReturnTest(selectedTest.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                >
                  Return Test
                </motion.button>
                <motion.button
                  onClick={() => handleApproveTest(selectedTest.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                >
                  Approve Test
                </motion.button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ResultsApproval; 