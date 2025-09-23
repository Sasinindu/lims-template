import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  TestTube,
  Package,
  User,
  Calendar as CalendarIcon,
  Eye,
  X,
  Download,
  XCircle,
  CheckCircle2,
  Search,
  ArrowLeft} from 'lucide-react';
import Drawer from '../components/Drawer';
import Breadcrumb from '../components/Breadcrumb';
import DataTable, { Column } from '../components/DataTable';

interface Sample {
  id: string;
  sampleId: string;
  sampleName: string;
  sampleType: string;
  description: string;
  orderId: string;
  commodity: string;
  commodityCategory: string;
  sampleQuantity: string;
  sampleCondition: string;
  assignedAnalyst: string;
  dueDate: string;
  status: string;
  testsCount: number;
  collectionDate: string;
  collectionSite: string;
  tests: Test[];
}

interface Test {
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
  assignedAnalyst?: string;
  status: string;
  completedDate?: string;
  result?: string;
  unit?: string;
  passStatus?: 'Pass' | 'Fail' | 'Pending';
  reviewStatus: 'Approved' | 'Rejected' | 'Returned' | 'Pending Review';
  returnReason?: string;
  testNotes?: string;
  attachments?: string[];
}

const ResultsApproval: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [expandedSamples, setExpandedSamples] = useState<Set<string>>(new Set());
  const [loading] = useState(false);
  
  // Test Details Drawer
  const [isTestDetailsOpen, setIsTestDetailsOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  
  // Sample Report View
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false);
  const [reportSample, setReportSample] = useState<Sample | null>(null);
  


  // All samples from all orders (flattened for direct sample-level access)
  const [samples] = useState<Sample[]>([
    {
      id: 'S001',
      sampleId: 'SMP-001',
      sampleName: 'Raw Milk Sample',
      sampleType: 'Liquid',
      description: 'Fresh raw milk sample for testing',
      orderId: 'ORD-2024-001',
      commodity: 'Milk',
      commodityCategory: 'Dairy Products',
      sampleQuantity: '500ml',
      sampleCondition: 'Chilled at 4°C',
      assignedAnalyst: 'Dr. John Smith',
      dueDate: '2024-01-20',
      status: 'Results Pending Review',
      testsCount: 3,
      collectionDate: '2024-01-15',
      collectionSite: 'Farm Collection Point A',
      tests: [
        {
          id: 'T001',
          testId: 'TST-001',
          testName: 'Protein Content',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          parameters: ['Total Protein', 'Crude Protein'],
          specifications: '≥ 3.0%',
          price: 125.00,
          group: 'Nutritional Analysis',
          analytes: ['Total Protein', 'Crude Protein'],
          assignedAnalyst: 'Dr. John Smith',
          status: 'Completed',
          completedDate: '2024-01-17',
          result: '3.2%',
          unit: '%',
          passStatus: 'Pass',
          reviewStatus: 'Pending Review',
          testNotes: 'Sample tested under standard laboratory conditions',
          attachments: ['protein_analysis_report.pdf', 'instrument_calibration.pdf']
        },
        {
          id: 'T002',
          testId: 'TST-002',
          testName: 'Fat Content',
          testType: 'Chemical Analysis',
          method: 'Soxhlet Extraction',
          parameters: ['Total Fat', 'Saturated Fat'],
          specifications: '3.0 - 4.0%',
          price: 100.00,
          group: 'Nutritional Analysis',
          analytes: ['Total Fat', 'Saturated Fat'],
          assignedAnalyst: 'Dr. John Smith',
          status: 'Completed',
          completedDate: '2024-01-17',
          result: '3.5%',
          unit: '%',
          passStatus: 'Pass',
          reviewStatus: 'Approved',
          testNotes: 'Results within acceptable range'
        },
        {
          id: 'T003',
          testId: 'TST-003',
          testName: 'Microbiological Count',
          testType: 'Microbiological Analysis',
          method: 'Plate Count Method',
          parameters: ['Total Plate Count', 'Coliform Count'],
          specifications: '≤ 1.0 × 10⁵ CFU/ml',
          price: 150.00,
          group: 'Microbiological Analysis',
          analytes: ['Total Plate Count', 'Coliform Count', 'E.coli Count'],
          assignedAnalyst: 'Dr. John Smith',
          status: 'Completed',
          completedDate: '2024-01-18',
          result: '5.2 × 10⁴ CFU/ml',
          unit: 'CFU/ml',
          passStatus: 'Pass',
          reviewStatus: 'Pending Review'
        }
      ]
    },
    {
      id: 'S002',
      sampleId: 'SMP-002',
      sampleName: 'Ground Beef Sample',
      sampleType: 'Solid',
      description: 'Fresh beef sample for moisture and protein analysis',
      orderId: 'ORD-2024-001',
      commodity: 'Beef',
      commodityCategory: 'Meat Products',
      sampleQuantity: '250g',
      sampleCondition: 'Frozen at -18°C',
      assignedAnalyst: 'Dr. Jane Doe',
      dueDate: '2024-01-20',
      status: 'Results Pending Review',
      testsCount: 2,
      collectionDate: '2024-01-15',
      collectionSite: 'Processing Plant A',
      tests: [
        {
          id: 'T004',
          testId: 'TST-004',
          testName: 'Moisture Content',
          testType: 'Chemical Analysis',
          method: 'Oven Drying Method',
          parameters: ['Moisture Content', 'Dry Matter'],
          specifications: '70.0 - 78.0%',
          price: 75.00,
          group: 'Physical Analysis',
          analytes: ['Moisture Content', 'Dry Matter'],
          assignedAnalyst: 'Dr. Jane Doe',
          status: 'Completed',
          completedDate: '2024-01-17',
          result: '74.2%',
          unit: '%',
          passStatus: 'Pass',
          reviewStatus: 'Pending Review'
        },
        {
          id: 'T005',
          testId: 'TST-005',
          testName: 'Protein Analysis',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          parameters: ['Crude Protein', 'True Protein'],
          specifications: '≥ 20.0%',
          price: 125.00,
          group: 'Nutritional Analysis',
          analytes: ['Crude Protein', 'True Protein'],
          assignedAnalyst: 'Dr. Jane Doe',
          status: 'Completed',
          completedDate: '2024-01-18',
          result: '22.1%',
          unit: '%',
          passStatus: 'Pass',
          reviewStatus: 'Returned',
          returnReason: 'Requires additional analysis for true protein content verification'
        }
      ]
    },
    {
      id: 'S003',
      sampleId: 'SMP-003',
      sampleName: 'Basmati Rice Sample',
      sampleType: 'Grain',
      description: 'Premium basmati rice sample for pesticide residue analysis',
      orderId: 'ORD-2024-002',
      commodity: 'Rice',
      commodityCategory: 'Cereals & Grains',
      sampleQuantity: '1kg',
      sampleCondition: 'Dry storage at room temperature',
      assignedAnalyst: 'Dr. Mike Johnson',
      dueDate: '2024-01-25',
      status: 'Testing In Progress',
      testsCount: 4,
      collectionDate: '2024-01-16',
      collectionSite: 'Storage Facility B',
      tests: [
        {
          id: 'T006',
          testId: 'TST-006',
          testName: 'Pesticide Residue',
          testType: 'Chemical Analysis',
          method: 'GC-MS Method',
          parameters: ['Organochlorines', 'Organophosphates'],
          specifications: '≤ 0.01 mg/kg',
          price: 300.00,
          group: 'Residue Analysis',
          analytes: ['Organochlorines', 'Organophosphates', 'Carbamates'],
          assignedAnalyst: 'Dr. Mike Johnson',
          status: 'In Progress',
          reviewStatus: 'Pending Review'
        },
        {
          id: 'T007',
          testId: 'TST-007',
          testName: 'Heavy Metals',
          testType: 'Chemical Analysis',
          method: 'ICP-MS Method',
          parameters: ['Lead', 'Cadmium', 'Mercury'],
          specifications: 'As per regulatory limits',
          price: 250.00,
          group: 'Contaminant Analysis',
          analytes: ['Lead', 'Cadmium', 'Mercury', 'Arsenic'],
          assignedAnalyst: 'Dr. Mike Johnson',
          status: 'Pending',
          reviewStatus: 'Pending Review'
        },
        {
          id: 'T008',
          testId: 'TST-008',
          testName: 'Aflatoxin Detection',
          testType: 'Chemical Analysis',
          method: 'HPLC Method',
          parameters: ['Aflatoxin B1', 'Aflatoxin B2'],
          specifications: '≤ 5.0 μg/kg',
          price: 200.00,
          group: 'Mycotoxin Analysis',
          analytes: ['Aflatoxin B1', 'Aflatoxin B2', 'Aflatoxin G1', 'Aflatoxin G2'],
          assignedAnalyst: 'Dr. Mike Johnson',
          status: 'Pending',
          reviewStatus: 'Pending Review'
        },
        {
          id: 'T009',
          testId: 'TST-009',
          testName: 'Moisture Content',
          testType: 'Physical Analysis',
          method: 'Oven Drying Method',
          parameters: ['Moisture Content'],
          specifications: '≤ 14.0%',
          price: 50.00,
          group: 'Physical Analysis',
          analytes: ['Moisture Content'],
          assignedAnalyst: 'Dr. Mike Johnson',
          status: 'Completed',
          completedDate: '2024-01-19',
          result: '12.8%',
          unit: '%',
          passStatus: 'Pass',
          reviewStatus: 'Approved'
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Results Pending Review':
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Testing In Progress':
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Returned':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
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
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Returned':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getBreadcrumbItems = () => {
    const items: Array<{ label: string; onClick?: () => void; isActive?: boolean }> = [
      { label: 'Results Approval', onClick: () => setSelectedSample(null) }
    ];

    if (selectedSample) {
      items.push({ label: `${selectedSample.sampleId} - Test Results`, isActive: true });
    }

    return items;
  };

  const handleViewTests = (sample: Sample) => {
    setSelectedSample(sample);
  };

  const handleBackToSamples = () => {
    setSelectedSample(null);
  };

  const handleTestDetails = (test: Test) => {
    setSelectedTest(test);
    setIsTestDetailsOpen(true);
  };

  const handleViewSampleReport = (sample: Sample) => {
    setReportSample(sample);
    setIsSampleReportOpen(true);
  };

  const handleApproveTest = (testId: string) => {
    console.log('Approving test:', testId);
    // Update test status logic here
  };

  const handleRejectTest = (testId: string) => {
    console.log('Rejecting test:', testId);
    // Update test status logic here
  };

  const handleReturnTest = (testId: string, reason: string) => {
    console.log('Returning test for rework:', testId, reason);
    // Update test status logic here
  };

  // Define columns for the Tests DataTable
  const getTestColumns = (): Column[] => [
    {
      key: 'testDetails',
      title: 'Test Details',
      render: (value: any, test: Test) => (
        <div className="flex items-start">
          <TestTube className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{test.testName}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{test.testId}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{test.testType}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, test: Test) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(test.status)}`}>
          {test.status}
        </span>
      )
    },
    {
      key: 'reviewStatus',
      title: 'Review Status',
      render: (value: any, test: Test) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReviewStatusColor(test.reviewStatus)}`}>
          {test.reviewStatus}
        </span>
      )
    },
    {
      key: 'result',
      title: 'Result',
      render: (value: any, test: Test) => {
        if (test.result) {
          return (
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {test.result} {test.unit}
              </div>
              {test.passStatus && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  test.passStatus === 'Pass' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {test.passStatus}
                </span>
              )}
            </div>
          );
        }
        return <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>;
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, test: Test) => (
        <div className="flex items-center justify-center">
          <motion.button
            onClick={() => handleTestDetails(test)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>
      )
    }
  ];

  // Define columns for the DataTable
  const sampleColumns: Column[] = [
    {
      key: 'sampleDetails',
      title: 'Sample Details',
      render: (value: any, sample: Sample) => (
        <div className="flex items-center">
          <Package className="w-5 h-5 text-blue-500 mr-3" />
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{sample.sampleId}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{sample.sampleName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{sample.commodity}</div>
          </div>
        </div>
      )
    },
    {
      key: 'orderInfo',
      title: 'Order Info',
      render: (value: any, sample: Sample) => (
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-green-500 mr-2" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{sample.orderId}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{sample.testsCount} tests</div>
          </div>
        </div>
      )
    },
    {
      key: 'assignedAnalyst',
      title: 'Assigned Analyst',
      render: (value: any, sample: Sample) => (
        <div className="flex items-center">
          <User className="w-4 h-4 text-purple-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{sample.assignedAnalyst}</span>
        </div>
      )
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      render: (value: any, sample: Sample) => (
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 text-orange-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{sample.dueDate}</span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, sample: Sample) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(sample.status)}`}>
          {sample.status}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, sample: Sample) => (
        <div className="flex items-center justify-center space-x-2">
          <motion.button
            onClick={() => handleViewTests(sample)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Tests"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => handleViewSampleReport(sample)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            title="Sample Report"
          >
            <FileText className="w-4 h-4" />
          </motion.button>
        </div>
      )
    }
  ];

  // Main Samples View (starting point)
  const renderSamplesView = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <DataTable
          data={samples}
          columns={sampleColumns}
          searchable
          pagination
          searchPlaceholder="Search..."
        />
      </motion.div>
    );
  };

  const renderTestsView = () => {
    if (!selectedSample) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Sample Information Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {selectedSample.sampleName}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-lg">
                {selectedSample.sampleId} • {selectedSample.sampleType}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedSample.status)}`}>
                {selectedSample.status}
              </span>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
                Order: {selectedSample.orderId}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Commodity:</span>
              <p className="text-blue-900 dark:text-blue-100">{selectedSample.commodity}</p>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Assigned Analyst:</span>
              <p className="text-blue-900 dark:text-blue-100">{selectedSample.assignedAnalyst}</p>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Collection Date:</span>
              <p className="text-blue-900 dark:text-blue-100">{selectedSample.collectionDate}</p>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300 font-medium">Due Date:</span>
              <p className="text-blue-900 dark:text-blue-100">{selectedSample.dueDate}</p>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-blue-700 dark:text-blue-300 font-medium">Description:</span>
            <p className="text-blue-900 dark:text-blue-100 mt-1">{selectedSample.description}</p>
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
            data={selectedSample.tests}
            columns={getTestColumns()}
            searchable
            pagination
            searchPlaceholder="Search..."
          />
        </motion.div>
      </motion.div>
    );
  };

    return (
    <div className="p-6 space-y-6">
       {/* Dynamic Breadcrumb Navigation */}
       <Breadcrumb items={getBreadcrumbItems()} />
       
      {/* Back Button - Show when viewing test results for a specific sample */}
      {selectedSample && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center"
        >
          <motion.button
            onClick={handleBackToSamples}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results Approval
          </motion.button>
        </motion.div>
      )}

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
            Review and approve test results for samples awaiting approval
          </p>
        </div>
      </motion.div>

      {/* Conditional Views */}
      {!selectedSample && renderSamplesView()}
      {selectedSample && renderTestsView()}

      {/* Test Details Drawer */}
      <Drawer
        isOpen={isTestDetailsOpen}
        onClose={() => setIsTestDetailsOpen(false)}
        title={`Test Details - ${selectedTest?.testId || ''}`}
        size="3xl"
      >
        {selectedTest && (
          <div className="p-6 space-y-6">
            {/* Test Information Header */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {selectedTest.testName}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-lg">
                    {selectedTest.testId} • {selectedTest.testType}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedTest.status)}`}>
                    {selectedTest.status}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReviewStatusColor(selectedTest.reviewStatus)}`}>
                    {selectedTest.reviewStatus}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Method:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.method}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Assigned Analyst:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.assignedAnalyst || 'Not assigned'}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Price:</span>
                  <p className="text-blue-900 dark:text-blue-100">${selectedTest.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Group:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedTest.group}</p>
                </div>
              </div>
            </div>

            {/* Test Parameters */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Parameters</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTest.parameters.map((param, index) => (
                  <span key={index} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                    {param}
                  </span>
                ))}
              </div>
            </div>

            {/* Analytes */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytes</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTest.analytes.map((analyte, index) => (
                  <span key={index} className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                    {analyte}
                  </span>
                ))}
              </div>
            </div>

            {/* Test Results */}
            {selectedTest.result && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Result:</span>
                    <p className="text-gray-900 dark:text-white font-semibold text-lg">{selectedTest.result} {selectedTest.unit}</p>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Pass/Fail Status:</span>
                    <p className={`font-semibold text-lg ${
                      selectedTest.passStatus === 'Pass' 
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {selectedTest.passStatus}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Completed:</span>
                    <p className="text-gray-900 dark:text-white">{selectedTest.completedDate}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Specifications:</span>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedTest.specifications}</p>
                </div>
              </div>
            )}

            {/* Test Notes */}
            {selectedTest.testNotes && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Test Notes</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedTest.testNotes}
                </p>
              </div>
            )}

            {/* Attachments */}
            {selectedTest.attachments && selectedTest.attachments.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attachments</h4>
                <div className="space-y-2">
                  {selectedTest.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-500 mr-3" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{attachment}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Return Reason */}
            {selectedTest.reviewStatus === 'Returned' && selectedTest.returnReason && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">Return Reason</h4>
                <p className="text-orange-800 dark:text-orange-200">{selectedTest.returnReason}</p>
              </div>
            )}

            {/* Action Buttons */}
            {selectedTest.reviewStatus === 'Pending Review' && selectedTest.status === 'Completed' && (
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  onClick={() => {
                    handleReturnTest(selectedTest.id, 'Requires additional analysis');
                    setIsTestDetailsOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 rounded-lg transition-colors duration-200"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Return for Rework
                </motion.button>
                <motion.button
                  onClick={() => {
                    handleRejectTest(selectedTest.id);
                    setIsTestDetailsOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject Test
                </motion.button>
                <motion.button
                  onClick={() => {
                    handleApproveTest(selectedTest.id);
                    setIsTestDetailsOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve Test
                </motion.button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Sample Report Drawer */}
      <Drawer
        isOpen={isSampleReportOpen}
        onClose={() => setIsSampleReportOpen(false)}
        title={`Sample Report - ${reportSample?.sampleId || ''}`}
        size="3xl"
      >
        {reportSample && (
          <div className="p-6 space-y-6">
            {/* Sample Information Header */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {reportSample.sampleName}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-lg">
                    {reportSample.sampleId} • {reportSample.sampleType}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(reportSample.status)}`}>
                    {reportSample.status}
                  </span>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
                    Order: {reportSample.orderId}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Commodity:</span>
                  <p className="text-blue-900 dark:text-blue-100">{reportSample.commodity}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Assigned Analyst:</span>
                  <p className="text-blue-900 dark:text-blue-100">{reportSample.assignedAnalyst}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Collection Date:</span>
                  <p className="text-blue-900 dark:text-blue-100">{reportSample.collectionDate}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Due Date:</span>
                  <p className="text-blue-900 dark:text-blue-100">{reportSample.dueDate}</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-blue-700 dark:text-blue-300 font-medium">Description:</span>
                <p className="text-blue-900 dark:text-blue-100 mt-1">{reportSample.description}</p>
              </div>

              <div className="mt-4 flex items-center space-x-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Assigned Analyst: {reportSample.assignedAnalyst}</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Quantity: {reportSample.sampleQuantity}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Condition: {reportSample.sampleCondition}</span>
                </div>
              </div>
            </div>

            {/* Tests and Results */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-primary-600" />
                Test Results Summary ({reportSample.tests.length} tests)
              </h4>

              {reportSample.tests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Test Header */}
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{index + 1}</span>
                        </div>
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">{test.testName}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{test.testId} - {test.testType}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReviewStatusColor(test.reviewStatus)}`}>
                          {test.reviewStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Test Details and Results */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Method:</span>
                        <p className="text-gray-900 dark:text-white mt-1">{test.method}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Specifications:</span>
                        <p className="text-gray-900 dark:text-white mt-1">{test.specifications}</p>
                      </div>
                    </div>

                    {/* Analytes */}
                    <div className="mb-6">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Analytes:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {test.analytes.map((analyte, analyteIndex) => (
                          <span
                            key={analyteIndex}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full"
                          >
                            {analyte}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Test Results */}
                    {test.result && (
                      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Test Results:</h6>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Result:</span>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {test.result} {test.unit}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Pass/Fail:</span>
                            <p className={`text-lg font-semibold ${
                              test.passStatus === 'Pass' 
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {test.passStatus}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
                            <p className="text-sm text-gray-900 dark:text-white">{test.completedDate}</p>
                          </div>
                        </div>
                        {test.testNotes && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Notes:</span>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">{test.testNotes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Return Reason */}
                    {test.reviewStatus === 'Returned' && test.returnReason && (
                      <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <h6 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Return Reason:</h6>
                        <p className="text-orange-800 dark:text-orange-200">{test.returnReason}</p>
                      </div>
                    )}

                    {/* Action Buttons for Individual Tests */}
                    {test.reviewStatus === 'Pending Review' && test.status === 'Completed' && (
                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <motion.button
                          onClick={() => {
                            handleReturnTest(test.id, 'Requires additional analysis');
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 rounded-lg transition-colors duration-200"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Return for Rework
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            handleRejectTest(test.id);
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject Test
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            handleApproveTest(test.id);
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
                </motion.div>
              ))}
            </div>

            {/* Bulk Actions for Sample */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 -mx-6 -mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{reportSample.tests.length} tests total</span> • 
                  <span className="ml-1">
                    {reportSample.tests.filter(t => t.reviewStatus === 'Pending Review').length} pending review
                  </span> • 
                  <span className="ml-1">
                    {reportSample.tests.filter(t => t.reviewStatus === 'Approved').length} approved
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => setIsSampleReportOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors duration-200"
                  >
                    Close Report
                  </motion.button>
                  
                  {reportSample.tests.some(t => t.reviewStatus === 'Pending Review' && t.status === 'Completed') && (
                    <>
                      <motion.button
                        onClick={() => {
                          const pendingTests = reportSample.tests.filter(t => t.reviewStatus === 'Pending Review' && t.status === 'Completed');
                          pendingTests.forEach(test => handleReturnTest(test.id, 'Sample requires additional review'));
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 rounded-lg transition-colors duration-200"
                      >
                        Return All Pending
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          const pendingTests = reportSample.tests.filter(t => t.reviewStatus === 'Pending Review' && t.status === 'Completed');
                          pendingTests.forEach(test => handleApproveTest(test.id));
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                      >
                        Approve All Pending
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ResultsApproval; 