import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TestTube,
  Package,
  User,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AssignedTest {
  id: string;
  testId: string;
  testName: string;
  testType: string;
  method: string;
  analytes: string[];
  specifications: string;
  estimatedDuration: string;
  status: string;
  priority: string;
  assignedAnalyst: string;
  assignedDate: string;
}

interface SampleWithTests {
  id: string;
  sampleId: string;
  orderId: string;
  sampleName: string;
  sampleType: string;
  commodity: string;
  commodityCategory: string;
  description: string;
  sampleQuantity: string;
  sampleCondition: string;
  collectionDate: string;
  collectionSite: string;
  assignedAnalyst: string;
  status: string;
  assignedTests: AssignedTest[];
}

const Tests: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSamples, setExpandedSamples] = useState<Set<string>>(new Set());

  // Mock data for samples with assigned tests (analyst-focused view)
  const [samplesWithTests] = useState<SampleWithTests[]>([
    {
      id: 'S001',
      sampleId: 'SMP-001',
      orderId: 'ORD-2024-001',
      sampleName: 'Raw Milk Sample',
      sampleType: 'Liquid',
      commodity: 'Milk',
      commodityCategory: 'Dairy Products',
      description: 'Fresh raw milk sample collected from dairy farm for microbiological and chemical analysis',
      sampleQuantity: '500ml',
      sampleCondition: 'Chilled at 4°C',
      collectionDate: '2024-01-15',
      collectionSite: 'Farm Collection Point A',
      assignedAnalyst: 'Dr. John Smith',
      status: 'In Progress',
      assignedTests: [
        {
          id: 'T001',
          testId: 'TST-001',
          testName: 'Protein Content',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          analytes: ['Total Protein', 'Crude Protein'],
          specifications: '≥ 3.0%',
          estimatedDuration: '4 hours',
          status: 'Pending',
          priority: 'High',
          assignedAnalyst: 'Dr. John Smith',
          assignedDate: '2024-01-15'
        },
        {
          id: 'T002',
          testId: 'TST-002',
          testName: 'Fat Content',
          testType: 'Chemical Analysis',
          method: 'Soxhlet Extraction',
          analytes: ['Total Fat', 'Saturated Fat'],
          specifications: '3.0 - 4.0%',
          estimatedDuration: '6 hours',
          status: 'In Progress',
          priority: 'Medium',
          assignedAnalyst: 'Dr. John Smith',
          assignedDate: '2024-01-15'
        },
        {
          id: 'T003',
          testId: 'TST-003',
          testName: 'Microbiological Count',
          testType: 'Microbiological Analysis',
          method: 'Plate Count Method',
          analytes: ['Total Plate Count', 'Coliform Count', 'E.coli Count'],
          specifications: '≤ 1.0 × 10⁵ CFU/ml',
          estimatedDuration: '48 hours',
          status: 'Completed',
          priority: 'High',
          assignedAnalyst: 'Dr. John Smith',
          assignedDate: '2024-01-15'
        }
      ]
    },
    {
      id: 'S002',
      sampleId: 'SMP-002',
      orderId: 'ORD-2024-001',
      sampleName: 'Ground Beef Sample',
      sampleType: 'Solid',
      commodity: 'Beef',
      commodityCategory: 'Meat Products',
      description: 'Fresh beef sample for moisture and protein analysis',
      sampleQuantity: '250g',
      sampleCondition: 'Frozen at -18°C',
      collectionDate: '2024-01-15',
      collectionSite: 'Processing Plant A',
      assignedAnalyst: 'Dr. John Smith',
      status: 'Completed',
      assignedTests: [
        {
          id: 'T004',
          testId: 'TST-004',
          testName: 'Moisture Content',
          testType: 'Chemical Analysis',
          method: 'Oven Drying Method',
          analytes: ['Moisture Content', 'Dry Matter'],
          specifications: '70.0 - 78.0%',
          estimatedDuration: '4 hours',
          status: 'Completed',
          priority: 'Medium',
          assignedAnalyst: 'Dr. John Smith',
          assignedDate: '2024-01-15'
        },
        {
          id: 'T005',
          testId: 'TST-005',
          testName: 'Protein Analysis',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          analytes: ['Crude Protein', 'True Protein'],
          specifications: '≥ 20.0%',
          estimatedDuration: '5 hours',
          status: 'Completed',
          priority: 'High',
          assignedAnalyst: 'Dr. John Smith',
          assignedDate: '2024-01-15'
        }
      ]
    },
    {
      id: 'S003',
      sampleId: 'SMP-003',
      orderId: 'ORD-2024-002',
      sampleName: 'Basmati Rice Sample',
      sampleType: 'Grain',
      commodity: 'Rice',
      commodityCategory: 'Cereals & Grains',
      description: 'Premium basmati rice sample for pesticide residue and heavy metals analysis',
      sampleQuantity: '1kg',
      sampleCondition: 'Dry storage at room temperature',
      collectionDate: '2024-01-16',
      collectionSite: 'Storage Facility B',
      assignedAnalyst: 'Dr. John Smith',
      status: 'Pending',
      assignedTests: [
        {
          id: 'T006',
          testId: 'TST-006',
          testName: 'Pesticide Residue',
          testType: 'Chemical Analysis',
          method: 'GC-MS Method',
          analytes: ['Organochlorines', 'Organophosphates', 'Carbamates'],
          specifications: '≤ 0.01 mg/kg',
          estimatedDuration: '8 hours',
          status: 'Pending',
          priority: 'High',
          assignedAnalyst: 'Dr. John Smith',
          assignedDate: '2024-01-16'
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Completed':
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

  const handlePrintWorksheet = (sample: SampleWithTests) => {
    navigate(`/tests/sample/${sample.sampleId}/worksheet`, {
      state: { sample }
    });
  };

  const handleEnterResults = (sample: SampleWithTests, test: AssignedTest) => {
    navigate(`/tests/sample/${sample.sampleId}/test/${test.testId}`, {
      state: { sample, test }
    });
  };

  // Calculate summary statistics
  const totalTests = samplesWithTests.reduce((sum, sample) => sum + sample.assignedTests.length, 0);
  const pendingTests = samplesWithTests.reduce((sum, sample) => 
    sum + sample.assignedTests.filter(test => test.status === 'Pending').length, 0);
  const inProgressTests = samplesWithTests.reduce((sum, sample) => 
    sum + sample.assignedTests.filter(test => test.status === 'In Progress').length, 0);
  const completedTests = samplesWithTests.reduce((sum, sample) => 
    sum + sample.assignedTests.filter(test => test.status === 'Completed').length, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assigned Tests</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and manage your assigned test samples and enter results
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTests}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTests}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressTests}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTests}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assigned Tests by Sample */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your Assigned Tests</h3>
          <p className="text-gray-600 dark:text-gray-400">Tests grouped by sample - expand to see all tests for each sample</p>
        </div>

        <div className="space-y-4">
          {samplesWithTests.map((sample, sampleIndex) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sampleIndex * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
            >
              {/* Sample Header */}
              <div className="p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      onClick={() => toggleSampleExpansion(sample.sampleId)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      {expandedSamples.has(sample.sampleId) ? (
                        <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </motion.button>
                    <Package className="w-6 h-6 text-primary-600" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{sample.sampleId}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{sample.sampleName} - {sample.commodity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {sample.assignedTests.length} test{sample.assignedTests.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Order: {sample.orderId}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handlePrintWorksheet(sample)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                      title="Print Worksheet"
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Worksheet
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Expanded Tests List */}
              {expandedSamples.has(sample.sampleId) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="p-4 space-y-3">
                    {sample.assignedTests.map((test, testIndex) => (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: testIndex * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <TestTube className="w-5 h-5 text-indigo-500" />
                            <div>
                              <h5 className="font-semibold text-gray-900 dark:text-white">{test.testName}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{test.testType} - {test.method}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right text-sm">
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                {test.estimatedDuration}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {test.testId}
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                            <motion.button
                              onClick={() => handleEnterResults(sample, test)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Enter Results
                            </motion.button>
                          </div>
                        </div>

                        {/* Test Details */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Analytes:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {test.analytes.map((analyte, analyteIndex) => (
                                  <span
                                    key={analyteIndex}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full"
                                  >
                                    {analyte}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Specifications:</span>
                              <p className="text-gray-600 dark:text-gray-400 mt-1">{test.specifications}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Tests;
