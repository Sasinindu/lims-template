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
  Download,
  Home,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';

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
  reviewStatus?: 'Approved' | 'Returned' | 'Pending Review';
  returnReason?: string;
}

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

const ResultsApproval: React.FC = () => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [expandedSamples, setExpandedSamples] = useState<Set<string>>(new Set());
  const [currentLevel, setCurrentLevel] = useState<'orders' | 'samples' | 'tests'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  
  // Test Results Drawer
  const [isTestResultsOpen, setIsTestResultsOpen] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      orderId: 'ORD-2024-001',
      companyName: 'ABC Corporation',
      siteName: 'Head Office',
      poNumber: 'PO-2024-001',
      totalSamples: 3,
      totalTests: 8,
      status: 'Results Pending Review',
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
              specification: '≥ 3.0%',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review'
            },
            {
              id: 'T002',
              testId: 'TST-002',
              testName: 'Fat Content',
              method: 'Soxhlet Extraction',
              assignedAnalyst: 'Dr. John Smith',
              status: 'Completed',
              priority: 'Medium',
              completedDate: '2024-01-22',
              result: '3.8',
              unit: '%',
              specification: '3.0 - 4.0%',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review'
            },
            {
              id: 'T003',
              testId: 'TST-003',
              testName: 'Microbiological Count',
              method: 'Plate Count Method',
              assignedAnalyst: 'Dr. Mike Johnson',
              status: 'Completed',
              priority: 'High',
              completedDate: '2024-01-23',
              result: '8.5 × 10⁴',
              unit: 'CFU/ml',
              specification: '≤ 1.0 × 10⁵ CFU/ml',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review'
            }
          ]
        },
        {
          id: 'S002',
          sampleId: 'SMP-002',
          orderId: 'ORD-2024-001',
          commodity: 'Beef',
          commodityCategory: 'Meat Products',
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
              completedDate: '2024-01-24',
              result: '75.2',
              unit: '%',
              specification: '70.0 - 78.0%',
              passStatus: 'Pass',
              reviewStatus: 'Approved'
            },
            {
              id: 'T005',
              testId: 'TST-005',
              testName: 'Protein Analysis',
              method: 'Kjeldahl Method',
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'Completed',
              priority: 'High',
              completedDate: '2024-01-24',
              result: '18.5',
              unit: '%',
              specification: '≥ 20.0%',
              passStatus: 'Fail',
              reviewStatus: 'Returned',
              returnReason: 'Result below specification - requires retesting'
            }
          ]
        },
        {
          id: 'S003',
          sampleId: 'SMP-003',
          orderId: 'ORD-2024-001',
          commodity: 'Rice',
          commodityCategory: 'Grains',
          assignedAnalyst: 'Dr. Alex Chen',
          dueDate: '2024-01-27',
          status: 'Results Approved',
          testsCount: 3,
          tests: [
            {
              id: 'T006',
              testId: 'TST-006',
              testName: 'Moisture Analysis',
              method: 'Oven Drying Method',
              assignedAnalyst: 'Dr. Alex Chen',
              status: 'Completed',
              priority: 'High',
              completedDate: '2024-01-25',
              result: '12.8',
              unit: '%',
              specification: '≤ 14.0%',
              passStatus: 'Pass',
              reviewStatus: 'Approved'
            },
            {
              id: 'T007',
              testId: 'TST-007',
              testName: 'Pesticide Residue',
              method: 'GC-MS Method',
              assignedAnalyst: 'Dr. Sarah Wilson',
              status: 'Completed',
              priority: 'High',
              completedDate: '2024-01-25',
              result: '0.008',
              unit: 'mg/kg',
              specification: '≤ 0.01 mg/kg',
              passStatus: 'Pass',
              reviewStatus: 'Approved'
            },
            {
              id: 'T008',
              testId: 'TST-008',
              testName: 'Heavy Metals',
              method: 'ICP-MS Method',
              assignedAnalyst: 'Dr. Sarah Wilson',
              status: 'Completed',
              priority: 'Medium',
              completedDate: '2024-01-25',
              result: '0.05',
              unit: 'mg/kg',
              specification: '≤ 0.1 mg/kg',
              passStatus: 'Pass',
              reviewStatus: 'Approved'
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
      status: 'Partially Approved',
      createdAt: '2024-01-16',
      samples: [
        {
          id: 'S004',
          sampleId: 'SMP-004',
          orderId: 'ORD-2024-002',
          commodity: 'Sunflower Oil',
          commodityCategory: 'Oils & Fats',
          assignedAnalyst: 'Dr. Emma Davis',
          dueDate: '2024-01-28',
          status: 'Testing Complete',
          testsCount: 3,
          tests: [
            {
              id: 'T009',
              testId: 'TST-009',
              testName: 'Acid Value',
              method: 'Titration Method',
              assignedAnalyst: 'Dr. Emma Davis',
              status: 'Completed',
              priority: 'Medium',
              completedDate: '2024-01-26',
              result: '0.3',
              unit: 'mg KOH/g',
              specification: '≤ 0.5 mg KOH/g',
              passStatus: 'Pass',
              reviewStatus: 'Approved'
            },
            {
              id: 'T010',
              testId: 'TST-010',
              testName: 'Peroxide Value',
              method: 'Iodometric Method',
              assignedAnalyst: 'Dr. Emma Davis',
              status: 'Completed',
              priority: 'Medium',
              completedDate: '2024-01-26',
              result: '8.5',
              unit: 'meq O₂/kg',
              specification: '≤ 10 meq O₂/kg',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review'
            },
            {
              id: 'T011',
              testId: 'TST-011',
              testName: 'Moisture Content',
              method: 'Karl Fischer Method',
              assignedAnalyst: 'Dr. Emma Davis',
              status: 'Completed',
              priority: 'Low',
              completedDate: '2024-01-26',
              result: '0.15',
              unit: '%',
              specification: '≤ 0.2%',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review'
            }
          ]
        },
        {
          id: 'S005',
          sampleId: 'SMP-005',
          orderId: 'ORD-2024-002',
          commodity: 'Wheat Flour',
          commodityCategory: 'Grains',
          assignedAnalyst: 'Dr. Tom Wilson',
          dueDate: '2024-01-29',
          status: 'In Progress',
          testsCount: 2,
          tests: [
            {
              id: 'T012',
              testId: 'TST-012',
              testName: 'Protein Content',
              method: 'Kjeldahl Method',
              assignedAnalyst: 'Dr. Tom Wilson',
              status: 'In Progress',
              priority: 'High',
              reviewStatus: 'Pending Review'
            },
            {
              id: 'T013',
              testId: 'TST-013',
              testName: 'Gluten Content',
              method: 'Glutomatic Method',
              assignedAnalyst: 'Dr. Tom Wilson',
              status: 'Pending',
              priority: 'Medium',
              reviewStatus: 'Pending Review'
            }
          ]
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Results Pending Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Partially Approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Results Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Testing Complete':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getReviewStatusColor = (reviewStatus: string) => {
    switch (reviewStatus) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Returned':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
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

  const handleViewTestResults = (test: Test) => {
    setSelectedTest(test);
    setIsTestResultsOpen(true);
  };

  const handleApproveTest = (testId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => ({
        ...order,
        samples: order.samples.map(sample => ({
          ...sample,
          tests: sample.tests.map(test =>
            test.id === testId
              ? { ...test, reviewStatus: 'Approved' as const }
              : test
          )
        }))
      }))
    );
  };

  const handleReturnTest = (testId: string, reason: string = 'Requires review') => {
    setOrders(prevOrders =>
      prevOrders.map(order => ({
        ...order,
        samples: order.samples.map(sample => ({
          ...sample,
          tests: sample.tests.map(test =>
            test.id === testId
              ? { ...test, reviewStatus: 'Returned' as const, returnReason: reason }
              : test
          )
        }))
      }))
    );
  };

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Results Approval', onClick: () => setCurrentLevel('orders') }
    ];

    if (selectedOrder) {
      items.push({
        label: selectedOrder.orderId,
        onClick: () => setCurrentLevel('samples')
      });
    }

    if (selectedSample) {
      items.push({
        label: selectedSample.sampleId,
        onClick: () => setCurrentLevel('tests')
      });
    }

    // Mark the last item as active
    if (items.length > 0) {
      items[items.length - 1].isActive = true;
    }

    return items;
  };

  const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
    <nav className="flex items-center space-x-2 text-sm bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
      <Home className="w-4 h-4 text-gray-400" />
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <motion.button
            onClick={item.onClick}
            whileHover={item.onClick && !item.isActive ? { scale: 1.05 } : {}}
            whileTap={item.onClick && !item.isActive ? { scale: 0.95 } : {}}
            disabled={item.isActive || !item.onClick}
            className={`transition-colors duration-200 ${
              item.isActive
                ? 'text-primary-600 font-medium cursor-default'
                : item.onClick
                  ? 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 hover:underline cursor-pointer'
                  : 'text-gray-500 dark:text-gray-400 cursor-default'
            }`}
          >
            {item.label}
          </motion.button>
        </React.Fragment>
      ))}
    </nav>
  );

  return (
    <div className="p-6 space-y-6">
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

      {/* Dynamic Breadcrumb Navigation */}
      <Breadcrumb items={getBreadcrumbItems()} />

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PO Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Samples</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Tests</th>
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
                      <div className="flex items-center">
                        <motion.button
                          onClick={() => toggleOrderExpansion(order.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          {expandedOrders.has(order.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </motion.button>
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
                          onClick={() => toggleOrderExpansion(order.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          title={expandedOrders.has(order.id) ? "Collapse Samples" : "View Samples"}
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
                        <td colSpan={8} className="px-0 py-0">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700"
                          >
                            <div className="px-6 py-4">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                <Package className="w-4 h-4 mr-2 text-primary-600" />
                                Samples ({order.samples.length})
                              </h4>
                              
                              {/* Samples Table */}
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sample ID</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Commodity</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tests</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Assigned Analyst</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Due Date</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {order.samples.map((sample, sampleIndex) => (
                                      <React.Fragment key={sample.id}>
                                        {/* Sample Row */}
                                        <motion.tr
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: sampleIndex * 0.05 }}
                                          className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                        >
                                          <td className="px-4 py-3">
                                            <div className="flex items-center">
                                              <motion.button
                                                onClick={() => toggleSampleExpansion(sample.id)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                              >
                                                {expandedSamples.has(sample.id) ? (
                                                  <ChevronDown className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                                ) : (
                                                  <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                                )}
                                              </motion.button>
                                              <Package className="w-3 h-3 text-primary-600 mr-2" />
                                              <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.sampleId}</span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <span className="text-sm text-gray-900 dark:text-white">{sample.commodity}</span>
                                          </td>
                                          <td className="px-4 py-3">
                                            <div className="flex items-center">
                                              <TestTube className="w-3 h-3 text-indigo-500 mr-1" />
                                              <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.testsCount}</span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <div className="flex items-center">
                                              <User className="w-3 h-3 text-purple-500 mr-1" />
                                              <span className="text-sm text-gray-600 dark:text-gray-400">{sample.assignedAnalyst}</span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <div className="flex items-center">
                                              <CalendarIcon className="w-3 h-3 text-orange-500 mr-1" />
                                              <span className="text-sm text-gray-600 dark:text-gray-400">{sample.dueDate}</span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sample.status)}`}>
                                              {sample.status}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3">
                                            <motion.button
                                              onClick={() => toggleSampleExpansion(sample.id)}
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                                              title={expandedSamples.has(sample.id) ? "Collapse Tests" : "View Tests"}
                                            >
                                              <Eye className="w-3 h-3" />
                                            </motion.button>
                                          </td>
                                        </motion.tr>

                                        {/* Expanded Tests */}
                                        <AnimatePresence>
                                          {expandedSamples.has(sample.id) && (
                                            <motion.tr
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: 'auto' }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.3 }}
                                            >
                                              <td colSpan={7} className="px-0 py-0">
                                                <motion.div
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  exit={{ opacity: 0 }}
                                                  className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
                                                >
                                                  <div className="px-8 py-4">
                                                    <h5 className="text-xs font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                                      <TestTube className="w-3 h-3 mr-2 text-primary-600" />
                                                      Tests ({sample.tests.length})
                                                    </h5>
                                                    
                                                    {/* Tests Table */}
                                                    <div className="overflow-x-auto">
                                                      <table className="w-full">
                                                        <thead>
                                                          <tr className="border-b border-gray-200 dark:border-gray-700">
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Test ID</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Test Name</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Method</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Analyst</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Result</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Review</th>
                                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                                                          </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                          {sample.tests.map((test, testIndex) => (
                                                            <motion.tr
                                                              key={test.id}
                                                              initial={{ opacity: 0, x: -10 }}
                                                              animate={{ opacity: 1, x: 0 }}
                                                              transition={{ delay: testIndex * 0.02 }}
                                                              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                                            >
                                                              <td className="px-3 py-2">
                                                                <div className="flex items-center">
                                                                  <TestTube className="w-3 h-3 text-primary-600 mr-2" />
                                                                  <span className="text-xs font-medium text-gray-900 dark:text-white">{test.testId}</span>
                                                                </div>
                                                              </td>
                                                              <td className="px-3 py-2">
                                                                <span className="text-xs text-gray-900 dark:text-white">{test.testName}</span>
                                                              </td>
                                                              <td className="px-3 py-2">
                                                                <span className="text-xs text-gray-600 dark:text-gray-400">{test.method}</span>
                                                              </td>
                                                              <td className="px-3 py-2">
                                                                <div className="flex items-center">
                                                                  <User className="w-3 h-3 text-purple-500 mr-1" />
                                                                  <span className="text-xs text-gray-600 dark:text-gray-400">{test.assignedAnalyst}</span>
                                                                </div>
                                                              </td>
                                                              <td className="px-3 py-2">
                                                                <div className="flex items-center space-x-2">
                                                                  {test.result && (
                                                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
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
                                                              <td className="px-3 py-2">
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                                                                  {test.status}
                                                                </span>
                                                              </td>
                                                              <td className="px-3 py-2">
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReviewStatusColor(test.reviewStatus || 'Pending Review')}`}>
                                                                  {test.reviewStatus || 'Pending Review'}
                                                                </span>
                                                              </td>
                                                              <td className="px-3 py-2">
                                                                <div className="flex items-center space-x-1">
                                                                  <motion.button
                                                                    onClick={() => handleViewTestResults(test)}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                                                                    title="View Test Results"
                                                                  >
                                                                    <Eye className="w-3 h-3" />
                                                                  </motion.button>
                                                                  {test.reviewStatus === 'Pending Review' && test.status === 'Completed' && (
                                                                    <>
                                                                      <motion.button
                                                                        onClick={() => handleApproveTest(test.id)}
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                                                                        title="Approve Test"
                                                                      >
                                                                        <CheckCircle2 className="w-3 h-3" />
                                                                      </motion.button>
                                                                      <motion.button
                                                                        onClick={() => handleReturnTest(test.id)}
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                                                        title="Return Test"
                                                                      >
                                                                        <XCircle className="w-3 h-3" />
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
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Test Results Drawer */}
      <Drawer
        isOpen={isTestResultsOpen}
        onClose={() => setIsTestResultsOpen(false)}
        title={`Test Results - ${selectedTest?.testId || ''}`}
        size="xl"
      >
        {selectedTest && (
          <div className="p-6 space-y-6">
            {/* Test Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    {selectedTest.testName}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    {selectedTest.testId} - {selectedTest.method}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTest.status)}`}>
                    {selectedTest.status}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReviewStatusColor(selectedTest.reviewStatus || 'Pending Review')}`}>
                    {selectedTest.reviewStatus || 'Pending Review'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Assigned Analyst:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.assignedAnalyst}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Priority:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.priority}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Completed Date:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.completedDate || 'Not completed'}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Method:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.method}</p>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {selectedTest.result && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result</h5>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedTest.result} {selectedTest.unit}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specification</h5>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedTest.specification}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pass/Fail Status</h5>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPassStatusColor(selectedTest.passStatus || 'Pending')}`}>
                      {selectedTest.passStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Return Reason */}
            {selectedTest.reviewStatus === 'Returned' && selectedTest.returnReason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Return Reason</h4>
                <p className="text-red-800 dark:text-red-200">{selectedTest.returnReason}</p>
              </div>
            )}

            {/* Action Buttons */}
            {selectedTest.reviewStatus === 'Pending Review' && selectedTest.status === 'Completed' && (
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  onClick={() => {
                    handleReturnTest(selectedTest.id);
                    setIsTestResultsOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Return for Rework
                </motion.button>
                <motion.button
                  onClick={() => {
                    handleApproveTest(selectedTest.id);
                    setIsTestResultsOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
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