import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TestTube,
  Package,
  ChevronRight,
  ChevronDown,
  Clock,
  User,
  UserCheck,
  UserPlus,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Building2,
  Eye,
  Edit,
  FileText,
  MapPin
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';
import Breadcrumb from '../components/Breadcrumb';

interface Sample {
  id: string;
  sampleId: string;
  orderId: string;
  companyName: string;
  siteName: string;
  commodity: string;
  commodityCategory: string;
  testsCount: number;
  assignedAnalyst?: string;
  dueDate?: string;
  status: string;
  createdAt: string;
  tests: Test[];
}

interface Test {
  id: string;
  testId: string;
  testName: string;
  testType: string;
  method: string;
  estimatedDuration: string;
  priority: string;
  status: string;
  assignedAnalyst?: string;
  dueDate?: string;
}

const TestAllocation: React.FC = () => {
  const [expandedSamples, setExpandedSamples] = useState<Set<string>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [loading] = useState(false);
  
  // Test allocation drawer state
  const [isAllocationDrawerOpen, setIsAllocationDrawerOpen] = useState(false);
  const [selectedSampleForAllocation, setSelectedSampleForAllocation] = useState<Sample | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [allocationLoading, setAllocationLoading] = useState(false);

  const [samples, setSamples] = useState<Sample[]>([
    {
      id: 'S001',
      sampleId: 'SMP-001',
      orderId: 'ORD-2024-001',
      companyName: 'ABC Corporation',
      siteName: 'Head Office',
      commodity: 'Milk',
      commodityCategory: 'Food Products',
      testsCount: 3,
      assignedAnalyst: undefined,
      dueDate: undefined,
      status: 'Pending Allocation',
      createdAt: '2024-01-15',
      tests: [
        {
          id: 'T001',
          testId: 'TST-001',
          testName: 'Protein Content',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          estimatedDuration: '4 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: undefined,
          dueDate: undefined
        },
        {
          id: 'T002',
          testId: 'TST-002',
          testName: 'Fat Content',
          testType: 'Chemical Analysis',
          method: 'Soxhlet Extraction',
          estimatedDuration: '6 hours',
          priority: 'Medium',
          status: 'Pending',
          assignedAnalyst: undefined,
          dueDate: undefined
        },
        {
          id: 'T003',
          testId: 'TST-003',
          testName: 'Microbiological Count',
          testType: 'Microbiological Analysis',
          method: 'Plate Count Method',
          estimatedDuration: '48 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: undefined,
          dueDate: undefined
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
      testsCount: 2,
      assignedAnalyst: 'Dr. John Smith',
      dueDate: '2024-01-25',
      status: 'Allocated',
      createdAt: '2024-01-15',
      tests: [
        {
          id: 'T004',
          testId: 'TST-004',
          testName: 'Moisture Content',
          testType: 'Chemical Analysis',
          method: 'Oven Drying Method',
          estimatedDuration: '4 hours',
          priority: 'Medium',
          status: 'Allocated',
          assignedAnalyst: 'Dr. John Smith',
          dueDate: '2024-01-25'
        },
        {
          id: 'T005',
          testId: 'TST-005',
          testName: 'Protein Analysis',
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
      testsCount: 4,
      assignedAnalyst: 'Dr. Jane Doe',
      dueDate: '2024-01-26',
      status: 'In Progress',
      createdAt: '2024-01-16',
      tests: [
        {
          id: 'T006',
          testId: 'TST-006',
          testName: 'Moisture Analysis',
          testType: 'Chemical Analysis',
          method: 'Oven Drying Method',
          estimatedDuration: '4 hours',
          priority: 'High',
          status: 'Completed',
          assignedAnalyst: 'Dr. Jane Doe',
          dueDate: '2024-01-26'
        },
        {
          id: 'T007',
          testId: 'TST-007',
          testName: 'Pesticide Residue',
          testType: 'Chemical Analysis',
          method: 'GC-MS Method',
          estimatedDuration: '8 hours',
          priority: 'High',
          status: 'In Progress',
          assignedAnalyst: 'Dr. Jane Doe',
          dueDate: '2024-01-26'
        },
        {
          id: 'T008',
          testId: 'TST-008',
          testName: 'Heavy Metals',
          testType: 'Chemical Analysis',
          method: 'ICP-MS Method',
          estimatedDuration: '6 hours',
          priority: 'Medium',
          status: 'Allocated',
          assignedAnalyst: 'Dr. Jane Doe',
          dueDate: '2024-01-26'
        },
        {
          id: 'T009',
          testId: 'TST-009',
          testName: 'Aflatoxin Analysis',
          testType: 'Chemical Analysis',
          method: 'HPLC Method',
          estimatedDuration: '10 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: undefined,
          dueDate: undefined
        }
      ]
    }
  ]);

  const analysts = [
    { value: 'dr-john-smith', label: 'Dr. John Smith' },
    { value: 'dr-jane-doe', label: 'Dr. Jane Doe' },
    { value: 'dr-sarah-wilson', label: 'Dr. Sarah Wilson' },
    { value: 'dr-mike-johnson', label: 'Dr. Mike Johnson' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Allocated':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Pending Allocation':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Returned':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
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

  const handleViewSample = (sample: Sample) => {
    setSelectedSample(sample);
    setIsDrawerOpen(true);
  };

  const handleAllocateTest = (sample: Sample, test?: Test) => {
    setSelectedSampleForAllocation(sample);
    setSelectedTest(test || null);
    setIsAllocationDrawerOpen(true);
  };

  const handleAllocateSample = (sample: Sample) => {
    setSelectedSampleForAllocation(sample);
    setSelectedTest(null);
    setIsAllocationDrawerOpen(true);
  };

  const handleSaveAllocation = () => {
    // Save allocation logic would go here
    setIsAllocationDrawerOpen(false);
    setSelectedSampleForAllocation(null);
    setSelectedTest(null);
  };

  const getBreadcrumbItems = () => [
    { label: 'Test Allocation', isActive: true }
  ];

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
          Test Allocation
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Allocate individual tests to analysts for testing
        </p>
        </div>
      </motion.div>

      {/* Breadcrumb Navigation */}
      <Breadcrumb items={getBreadcrumbItems()} />

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
                {samples.filter(s => s.status === 'Pending Allocation').length}
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
                {samples.filter(s => s.status === 'Allocated').length}
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
                {samples.filter(s => s.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Samples Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
        
        <div className="relative">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sample ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commodity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Analyst</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {samples.map((sample, sampleIndex) => (
                  <React.Fragment key={sample.id}>
                    {/* Sample Row */}
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: sampleIndex * 0.1 }}
                      className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 ${
                        sampleIndex % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/30' : 'bg-white/30 dark:bg-gray-900/30'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <motion.button
                          onClick={() => toggleSampleExpansion(sample.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          {expandedSamples.has(sample.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </motion.button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white">{sample.sampleId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.orderId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-medium text-gray-900 dark:text-white">{sample.companyName}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <MapPin className="w-3 h-3 text-orange-500 mr-1" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{sample.siteName}</span>
                          </div>
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
                          <TestTube className="w-4 h-4 text-indigo-500 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.testsCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {sample.assignedAnalyst ? (
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-purple-500 mr-1" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{sample.assignedAnalyst}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sample.status)}`}>
                          {sample.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleViewSample(sample)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                            title="View Sample"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          {sample.status === 'Pending Allocation' && (
                            <motion.button
                              onClick={() => handleAllocateSample(sample)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                              title="Allocate Sample"
                            >
                              <UserPlus className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
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
                          <td colSpan={10} className="px-0 py-0">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700"
                            >
                              <div className="px-6 py-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                  <TestTube className="w-4 h-4 mr-2 text-primary-600" />
                                  Tests for Sample {sample.sampleId}
                                </h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b border-gray-200 dark:border-gray-600">
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Test ID</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Test Name</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Analyst</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                      {sample.tests.map((test, testIndex) => (
                                        <motion.tr
                                          key={test.id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: testIndex * 0.05 }}
                                          className={`hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                                            testIndex % 2 === 0 ? 'bg-white/50 dark:bg-gray-900/50' : 'bg-gray-50/50 dark:bg-gray-800/50'
                                          }`}
                                        >
                                          <td className="px-3 py-3">
                                            <div className="flex items-center">
                                              <TestTube className="w-3 h-3 text-primary-600 mr-2" />
                                              <span className="text-sm font-medium text-gray-900 dark:text-white">{test.testId}</span>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <div className="text-sm">
                                              <div className="font-medium text-gray-900 dark:text-white">{test.testName}</div>
                                              <div className="text-xs text-gray-500 dark:text-gray-400">{test.testType}</div>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{test.method}</span>
                                          </td>
                                          <td className="px-3 py-3">
                                            <div className="flex items-center">
                                              <Clock className="w-3 h-3 text-orange-500 mr-1" />
                                              <span className="text-sm text-gray-600 dark:text-gray-400">{test.estimatedDuration}</span>
                                            </div>
                                          </td>
                                          <td className="px-3 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(test.priority)}`}>
                                              {test.priority}
                                            </span>
                                          </td>
                                          <td className="px-3 py-3">
                                            {test.assignedAnalyst ? (
                                              <div className="flex items-center">
                                                <User className="w-3 h-3 text-purple-500 mr-1" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{test.assignedAnalyst}</span>
                                              </div>
                                            ) : (
                                              <span className="text-sm text-gray-400 dark:text-gray-500">Not assigned</span>
                                            )}
                                          </td>
                                          <td className="px-3 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                                              {test.status}
                                            </span>
                                          </td>
                                          <td className="px-3 py-3">
                                            <div className="flex items-center space-x-1">
                                              {test.status === 'Pending' && (
                                                <motion.button
                                                  onClick={() => handleAllocateTest(sample, test)}
                                                  whileHover={{ scale: 1.05 }}
                                                  whileTap={{ scale: 0.95 }}
                                                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                                                  title="Allocate Test"
                                                >
                                                  <UserPlus className="w-3 h-3" />
                                                </motion.button>
                                              )}
                                              <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                                                title="Edit Test"
                                              >
                                                <Edit className="w-3 h-3" />
                                              </motion.button>
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

      {/* Sample Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Sample Details - ${selectedSample?.sampleId || ''}`}
        size="xl"
      >
        {selectedSample && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Sample ID</Label>
                <Input value={selectedSample.sampleId} disabled />
          </div>
          <div>
            <Label>Order ID</Label>
                <Input value={selectedSample.orderId} disabled />
          </div>
          <div>
                <Label>Company</Label>
                <Input value={selectedSample.companyName} disabled />
          </div>
          <div>
                <Label>Site</Label>
                <Input value={selectedSample.siteName} disabled />
          </div>
          <div>
                <Label>Commodity</Label>
                <Input value={selectedSample.commodity} disabled />
          </div>
          <div>
                <Label>Category</Label>
                <Input value={selectedSample.commodityCategory} disabled />
              </div>
            </div>
            
                <div>
              <Label>Tests ({selectedSample.tests.length})</Label>
              <div className="mt-2 space-y-2">
                {selectedSample.tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                      <div className="font-medium text-sm">{test.testName}</div>
                      <div className="text-xs text-gray-500">{test.method}</div>
                </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                        {test.status}
                </div>
                {test.assignedAnalyst && (
                        <div className="text-xs text-gray-500 mt-1">{test.assignedAnalyst}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
        )}
      </Drawer>

      {/* Allocation Drawer */}
    <Drawer
        isOpen={isAllocationDrawerOpen}
        onClose={() => setIsAllocationDrawerOpen(false)}
        title={`Allocate ${selectedTest ? 'Test' : 'Sample'}`}
      size="xl"
      >
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              {selectedTest ? 'Test Allocation' : 'Sample Allocation'}
          </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {selectedTest 
                ? `Allocating test "${selectedTest.testName}" from sample ${selectedSampleForAllocation?.sampleId}`
                : `Allocating all tests for sample ${selectedSampleForAllocation?.sampleId}`
              }
            </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="analyst" required>Assigned Analyst</Label>
              <CustomSelect
                value=""
                onChange={() => {}}
                options={analysts}
                placeholder="Select analyst"
              />
            </div>
            <div>
              <Label htmlFor="dueDate" required>Due Date</Label>
              <Input type="date" />
            </div>
                  </div>
                  
                  <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Add any special instructions or notes..."
                    />
                  </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsAllocationDrawerOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <motion.button
              onClick={handleSaveAllocation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={allocationLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {allocationLoading ? 'Allocating...' : 'Allocate'}
            </motion.button>
          </div>
        </div>
    </Drawer>
    </div>
  );
};

export default TestAllocation;
