import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  TestTube,
  Package,
  User,
  Clock,
  ArrowLeft,
  Printer,
  FileText,
  Calendar as CalendarIcon,
  MapPin,
  Building2
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

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

const SampleWorksheet: React.FC = () => {
  const { sampleId } = useParams<{ sampleId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [sample, setSample] = useState<SampleWithTests | null>(null);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    // Get sample data from location state or mock data
    if (location.state?.sample) {
      setSample(location.state.sample);
    } else {
      // Mock data for direct URL access
      const mockSample: SampleWithTests = {
        id: 'S001',
        sampleId: sampleId || 'SMP-001',
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
            status: 'Pending',
            priority: 'Medium',
            assignedAnalyst: 'Dr. John Smith',
            assignedDate: '2024-01-15'
          }
        ]
      };
      setSample(mockSample);
    }
  }, [sampleId, location.state]);

  const handleBackToTests = () => {
    navigate('/tests');
  };

  const handlePrintWorksheet = () => {
    setPrinting(true);
    // Simulate print process
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 500);
  };

  const handleStartTesting = () => {
    if (sample && sample.assignedTests.length > 0) {
      // Navigate to first test's enter results page
      const firstTest = sample.assignedTests[0];
      navigate(`/tests/sample/${sample.sampleId}/test/${firstTest.testId}`, {
        state: { sample, test: firstTest }
      });
    }
  };

  const getBreadcrumbItems = () => {
    return [
      { label: 'Tests', onClick: handleBackToTests },
      { label: `${sample?.sampleId || 'Sample'} - Worksheet`, isActive: true }
    ];
  };

  if (!sample) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Sample not found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            The requested sample could not be loaded.
          </p>
          <motion.button
            onClick={handleBackToTests}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200"
          >
            Back to Tests
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={getBreadcrumbItems()} />

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center"
      >
        <motion.button
          onClick={handleBackToTests}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </motion.button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sample Worksheet</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review sample details and print worksheet for {sample.sampleId}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={handlePrintWorksheet}
            disabled={printing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors duration-200"
          >
            <Printer className="w-4 h-4 mr-2" />
            {printing ? 'Printing...' : 'Print Worksheet'}
          </motion.button>
          <motion.button
            onClick={handleStartTesting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Start Testing
          </motion.button>
        </div>
      </motion.div>

      {/* Worksheet Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 print:shadow-none print:border-0">
        {/* Header Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Laboratory Worksheet</h2>
              <p className="text-gray-600 dark:text-gray-400">Sample Testing Instructions & Results Entry</p>
            </div>
            <div className="text-right text-sm text-gray-600 dark:text-gray-400">
              <div>Printed: {new Date().toLocaleDateString()}</div>
              <div>Time: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Sample Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary-600" />
            Sample Information
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Sample ID:</span>
                <p className="text-gray-900 dark:text-white font-semibold">{sample.sampleId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Order ID:</span>
                <p className="text-gray-900 dark:text-white">{sample.orderId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Sample Name:</span>
                <p className="text-gray-900 dark:text-white">{sample.sampleName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Sample Type:</span>
                <p className="text-gray-900 dark:text-white">{sample.sampleType}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Commodity:</span>
                <p className="text-gray-900 dark:text-white">{sample.commodity}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                <p className="text-gray-900 dark:text-white">{sample.commodityCategory}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                <p className="text-gray-900 dark:text-white">{sample.sampleQuantity}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Collection Date:</span>
                <p className="text-gray-900 dark:text-white">{sample.collectionDate}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
              <p className="text-gray-900 dark:text-white mt-1">{sample.description}</p>
            </div>
            <div className="mt-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">Sample Condition:</span>
              <p className="text-gray-900 dark:text-white mt-1">{sample.sampleCondition}</p>
            </div>
            <div className="mt-4 flex items-center space-x-6">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Collection Site: {sample.collectionSite}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Assigned Analyst: {sample.assignedAnalyst}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tests to Perform */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-primary-600" />
            Tests to Perform ({sample.assignedTests.length})
          </h3>
          <div className="space-y-4">
            {sample.assignedTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{test.testName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{test.testId} - {test.testType}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {test.estimatedDuration}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Method:</span>
                    <p className="text-gray-900 dark:text-white mt-1">{test.method}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Specifications:</span>
                    <p className="text-gray-900 dark:text-white mt-1">{test.specifications}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Analytes to Test:</span>
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

                {/* Results Entry Section (for manual completion) */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Results Entry (To be completed):</h5>
                  <div className="space-y-3">
                    {test.analytes.map((analyte, analyteIndex) => (
                      <div key={analyteIndex} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                        <span className="font-medium text-gray-900 dark:text-white">{analyte}:</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Value: _____________</span>
                          <span className="text-sm text-gray-500">Unit: ________</span>
                          <span className="text-sm text-gray-500">Status: ⬜ Pass ⬜ Fail</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instruments Used Section */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Instruments Used:</h5>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-500">_________________________________________________</span>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Notes/Remarks:</h5>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 min-h-[80px]">
                    <span className="text-sm text-gray-500">
                      _________________________________________________<br/>
                      _________________________________________________<br/>
                      _________________________________________________
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Analyst Signature:</h5>
              <div className="border-b border-gray-400 pb-2 mb-2">
                <span className="text-sm text-gray-500">_________________________________</span>
              </div>
              <div className="text-sm text-gray-500">Date: _______________</div>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Supervisor Approval:</h5>
              <div className="border-b border-gray-400 pb-2 mb-2">
                <span className="text-sm text-gray-500">_________________________________</span>
              </div>
              <div className="text-sm text-gray-500">Date: _______________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleWorksheet; 