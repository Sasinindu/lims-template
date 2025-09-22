import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TestTube,
  Package,
  User,
  Eye,
  Printer,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Building2,
  Calendar as CalendarIcon,
  Save,
  X,
  Edit3,
  ChevronDown,
  ChevronRight,
  Layers,
  DollarSign
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';

interface TestAssignment {
  id: string;
  sampleId: string;
  orderId: string;
  assignedAnalyst: string;
  status: string;
  tests: AssignedTest[];
  sampleDetails: {
    sampleName: string;
    sampleType: string;
    commodity: string;
    commodityCategory: string;
    description: string;
    sampleQuantity: string;
    sampleCondition: string;
    collectionDate: string;
    collectionSite: string;
  };
}

interface AssignedTest {
  id: string;
  testId: string;
  testName: string;
  testType: string;
  method: string;
  parameters: string[];
  specifications: string;
  price: number;
  group: string;
  analytes: string[];
  estimatedDuration: string;
  assignedAnalyst: string;
  status: string;
  priority: string;
  results?: TestResult[];
}

interface TestResult {
  parameter: string;
  value: string;
  unit: string;
  status: 'Pass' | 'Fail' | 'Pending';
  remarks?: string;
}

const Tests: React.FC = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<TestAssignment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());
  const [editingResults, setEditingResults] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{[testId: string]: TestResult[]}>({});

  // Mock data for test assignments
  const [testAssignments] = useState<TestAssignment[]>([
    {
      id: 'TA001',
      sampleId: 'SMP-001',
      orderId: 'ORD-2024-001',
      assignedAnalyst: 'Dr. John Smith',
      status: 'In Progress',
      sampleDetails: {
        sampleName: 'Raw Milk Sample',
        sampleType: 'Liquid',
        commodity: 'Milk',
        commodityCategory: 'Dairy Products',
        description: 'Fresh raw milk sample collected from dairy farm for microbiological and chemical analysis',
        sampleQuantity: '500ml',
        sampleCondition: 'Chilled at 4°C',
        collectionDate: '2024-01-15',
        collectionSite: 'Farm Collection Point A'
      },
      tests: [
        {
          id: 'T001',
          testId: 'TST-001',
          testName: 'Protein Content',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          parameters: ['Total Protein', 'Crude Protein'],
          specifications: '≥ 3.0%',
          price: 250.00,
          group: 'Standard',
          analytes: ['Total Protein', 'Nitrogen Content'],
          assignedAnalyst: 'Dr. John Smith',
          status: 'In Progress',
          priority: 'High',
          estimatedDuration: '4 hours'
        },
        {
          id: 'T002',
          testId: 'TST-002',
          testName: 'Fat Content',
          testType: 'Chemical Analysis',
          method: 'Soxhlet Extraction',
          parameters: ['Total Fat', 'Saturated Fat'],
          specifications: '3.0 - 4.0%',
          price: 200.00,
          group: 'Standard',
          analytes: ['Total Fat Content', 'Free Fatty Acids'],
          assignedAnalyst: 'Dr. John Smith',
          status: 'Pending',
          priority: 'Medium',
          estimatedDuration: '6 hours'
        }
      ]
    },
    {
      id: 'TA002',
      sampleId: 'SMP-002',
      orderId: 'ORD-2024-001',
      assignedAnalyst: 'Dr. Jane Doe',
      status: 'Completed',
      sampleDetails: {
        sampleName: 'Rice Grain Sample',
        sampleType: 'Solid',
        commodity: 'Rice',
        commodityCategory: 'Grains',
        description: 'Basmati rice sample for pesticide residue and heavy metal analysis',
        sampleQuantity: '1kg',
        sampleCondition: 'Dry storage in sealed container',
        collectionDate: '2024-01-16',
        collectionSite: 'Warehouse B'
      },
      tests: [
        {
          id: 'T003',
          testId: 'TST-003',
          testName: 'Pesticide Residue',
          testType: 'Chemical Analysis',
          method: 'GC-MS Method',
          parameters: ['Organochlorines', 'Organophosphates', 'Carbamates'],
          specifications: '≤ 0.01 mg/kg',
          price: 450.00,
          group: 'Premium',
          analytes: ['Pesticide Multi-residue Screen', 'Individual Pesticides'],
          assignedAnalyst: 'Dr. Jane Doe',
          status: 'Completed',
          priority: 'High',
          estimatedDuration: '8 hours'
        }
      ]
    },
    {
      id: 'TA003',
      sampleId: 'SMP-003',
      orderId: 'ORD-2024-002',
      assignedAnalyst: 'Dr. Alex Chen',
      status: 'Pending',
      sampleDetails: {
        sampleName: 'Cooking Oil Sample',
        sampleType: 'Liquid',
        commodity: 'Sunflower Oil',
        commodityCategory: 'Oils & Fats',
        description: 'Refined sunflower oil sample for quality analysis',
        sampleQuantity: '250ml',
        sampleCondition: 'Room temperature storage',
        collectionDate: '2024-01-17',
        collectionSite: 'Production Line C'
      },
      tests: [
        {
          id: 'T004',
          testId: 'TST-004',
          testName: 'Acid Value',
          testType: 'Chemical Analysis',
          method: 'Titration Method',
          parameters: ['Free Fatty Acids', 'Acid Number'],
          specifications: '≤ 0.5 mg KOH/g',
          price: 180.00,
          group: 'Standard',
          analytes: ['Free Acidity', 'Oleic Acid Equivalent'],
          assignedAnalyst: 'Dr. Alex Chen',
          status: 'Pending',
          priority: 'Medium',
          estimatedDuration: '2 hours'
        },
        {
          id: 'T005',
          testId: 'TST-005',
          testName: 'Peroxide Value',
          testType: 'Chemical Analysis',
          method: 'Iodometric Method',
          parameters: ['Primary Oxidation', 'Peroxide Value'],
          specifications: '≤ 10 meq O₂/kg',
          price: 160.00,
          group: 'Standard',
          analytes: ['Peroxide Value', 'Oxidative Stability'],
          assignedAnalyst: 'Dr. Alex Chen',
          status: 'Pending',
          priority: 'Medium',
          estimatedDuration: '3 hours'
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
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleViewDetails = (assignment: TestAssignment) => {
    setSelectedAssignment(assignment);
    setIsDrawerOpen(true);
  };

  const handlePrintWorksheet = (assignment: TestAssignment) => {
    console.log('Printing worksheet for:', assignment.sampleId);
    // Generate and print worksheet logic here
  };

  const toggleTestExpansion = (testId: string) => {
    setExpandedTests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
      }
      return newSet;
    });
  };

  const handleEditResults = (testId: string) => {
    setEditingResults(testId);
    // Initialize results if they don't exist
    if (!testResults[testId]) {
      const test = selectedAssignment?.tests.find(t => t.id === testId);
      if (test) {
        setTestResults(prev => ({
          ...prev,
          [testId]: test.parameters.map(param => ({
            parameter: param,
            value: '',
            unit: '',
            status: 'Pending' as const,
            remarks: ''
          }))
        }));
      }
    }
  };

  const handleSaveResults = (testId: string) => {
    setEditingResults(null);
    console.log('Saving results for test:', testId, testResults[testId]);
  };

  const updateTestResult = (testId: string, paramIndex: number, field: keyof TestResult, value: string) => {
    setTestResults(prev => ({
      ...prev,
      [testId]: prev[testId].map((result, index) => 
        index === paramIndex ? { ...result, [field]: value } : result
      )
    }));
  };

  const columns: Column[] = [
    {
      key: 'sampleId',
      title: 'Sample ID',
      render: (value: any, assignment: TestAssignment) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-gray-900 dark:text-white">{assignment.sampleId}</span>
        </div>
      )
    },
    {
      key: 'orderId',
      title: 'Order ID',
      render: (value: any, assignment: TestAssignment) => (
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{assignment.orderId}</span>
        </div>
      )
    },
    {
      key: 'assignedAnalyst',
      title: 'Assigned Analyst',
      render: (value: any, assignment: TestAssignment) => (
        <div className="flex items-center">
          <User className="w-4 h-4 text-green-500 mr-2" />
          <span className="text-sm text-gray-900 dark:text-white">{assignment.assignedAnalyst}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, assignment: TestAssignment) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
          {assignment.status}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, assignment: TestAssignment) => (
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => handleViewDetails(assignment)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
            title="View Test Details"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </motion.button>
          <motion.button
            onClick={() => handlePrintWorksheet(assignment)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200"
            title="Print Worksheet"
          >
            <Printer className="w-4 h-4 mr-1" />
            Print Worksheet
          </motion.button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tests</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage test assignments and enter results
          </p>
        </div>
      </motion.div>

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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{testAssignments.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <TestTube className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {testAssignments.filter(a => a.status === 'Pending').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {testAssignments.filter(a => a.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {testAssignments.filter(a => a.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <DataTable
          data={testAssignments}
          columns={columns}
          searchable
          pagination
        />
      </motion.div>

      {/* Test Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Test Details - ${selectedAssignment?.sampleId || ''}`}
        size="3xl"
      >
        {selectedAssignment && (
          <div className="p-6 space-y-6">
            {/* Sample Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    {selectedAssignment.sampleDetails.sampleName}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    {selectedAssignment.sampleId} - {selectedAssignment.orderId}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedAssignment.status)}`}>
                  {selectedAssignment.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Sample Type:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedAssignment.sampleDetails.sampleType}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Commodity:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedAssignment.sampleDetails.commodity}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Quantity:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedAssignment.sampleDetails.sampleQuantity}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Collection Date:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedAssignment.sampleDetails.collectionDate}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <span className="text-blue-700 dark:text-blue-300 font-medium">Description:</span>
                <p className="text-blue-900 dark:text-blue-100 mt-1">{selectedAssignment.sampleDetails.description}</p>
              </div>
            </div>

            {/* Tests List */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-primary-600" />
                Assigned Tests ({selectedAssignment.tests.length})
              </h4>
              
              {selectedAssignment.tests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                >
                  {/* Test Header */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          onClick={() => toggleTestExpansion(test.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          {expandedTests.has(test.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          )}
                        </motion.button>
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">{test.testName}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{test.testType} - {test.method}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            Rs. {test.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{test.group} Group</div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Test Details */}
                  <AnimatePresence>
                    {expandedTests.has(test.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 space-y-6"
                      >
                        {/* Test Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Parameters</h6>
                            <div className="flex flex-wrap gap-2">
                              {test.parameters.map((param, paramIndex) => (
                                <span
                                  key={paramIndex}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full"
                                >
                                  {param}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Analytes</h6>
                            <div className="flex flex-wrap gap-2">
                              {test.analytes.map((analyte, analyteIndex) => (
                                <span
                                  key={analyteIndex}
                                  className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full"
                                >
                                  {analyte}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Specifications</h6>
                          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-900 dark:text-white">{test.specifications}</p>
                          </div>
                        </div>

                        {/* Test Results Entry */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Test Results</h6>
                            {editingResults === test.id ? (
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => handleSaveResults(test.id)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                                >
                                  <Save className="w-4 h-4 mr-1" />
                                  Save Results
                                </motion.button>
                                <motion.button
                                  onClick={() => setEditingResults(null)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </motion.button>
                              </div>
                            ) : (
                              <motion.button
                                onClick={() => handleEditResults(test.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200"
                              >
                                <Edit3 className="w-4 h-4 mr-1" />
                                Enter Results
                              </motion.button>
                            )}
                          </div>

                          {/* Results Table */}
                          {testResults[test.id] && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Parameter</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Value</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unit</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {testResults[test.id].map((result, resultIndex) => (
                                    <tr key={resultIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                                        {result.parameter}
                                      </td>
                                      <td className="px-3 py-2">
                                        {editingResults === test.id ? (
                                          <Input
                                            type="text"
                                            value={result.value}
                                            onChange={(e) => updateTestResult(test.id, resultIndex, 'value', e.target.value)}
                                            className="w-full"
                                            placeholder="Enter value"
                                          />
                                        ) : (
                                          <span className="text-gray-900 dark:text-white">{result.value || '-'}</span>
                                        )}
                                      </td>
                                      <td className="px-3 py-2">
                                        {editingResults === test.id ? (
                                          <Input
                                            type="text"
                                            value={result.unit}
                                            onChange={(e) => updateTestResult(test.id, resultIndex, 'unit', e.target.value)}
                                            className="w-full"
                                            placeholder="Unit"
                                          />
                                        ) : (
                                          <span className="text-gray-900 dark:text-white">{result.unit || '-'}</span>
                                        )}
                                      </td>
                                      <td className="px-3 py-2">
                                        {editingResults === test.id ? (
                                          <CustomSelect
                                            value={result.status}
                                            onChange={(value) => updateTestResult(test.id, resultIndex, 'status', value)}
                                            options={[
                                              { value: 'Pass', label: 'Pass' },
                                              { value: 'Fail', label: 'Fail' },
                                              { value: 'Pending', label: 'Pending' }
                                            ]}
                                          />
                                        ) : (
                                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                                            {result.status}
                                          </span>
                                        )}
                                      </td>
                                      <td className="px-3 py-2">
                                        {editingResults === test.id ? (
                                          <Input
                                            type="text"
                                            value={result.remarks || ''}
                                            onChange={(e) => updateTestResult(test.id, resultIndex, 'remarks', e.target.value)}
                                            className="w-full"
                                            placeholder="Optional remarks"
                                          />
                                        ) : (
                                          <span className="text-gray-600 dark:text-gray-400">{result.remarks || '-'}</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Tests;
