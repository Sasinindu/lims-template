import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  TestTube,
  Package,
  User,
  UserCheck,
  UserPlus,
  ArrowLeft,
  Save,
  X,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import Breadcrumb from '../components/Breadcrumb';

interface Sample {
  id: string;
  sampleId: string;
  orderId: string;
  sampleName: string;
  sampleType: string;
  commodity: string;
  commodityCategory: string;
  description: string;
  testsCount: number;
  assignedTests: number;
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
  parameters: string[];
  specifications: string;
  estimatedDuration: string;
  priority: string;
  status: string;
  assignedAnalyst?: string;
}

interface Analyst {
  id: string;
  name: string;
  department: string;
  specialization: string[];
  email: string;
}

const TestAssignment: React.FC = () => {
  const { sampleId } = useParams<{ sampleId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [sample, setSample] = useState<Sample | null>(null);
  const [editingTest, setEditingTest] = useState<string | null>(null);
  const [testAssignments, setTestAssignments] = useState<{
    [testId: string]: {
      analyst: string;
    }
  }>({});

  const analysts: Analyst[] = [
    {
      id: 'A001',
      name: 'Dr. John Smith',
      department: 'Chemical Analysis',
      specialization: ['Protein Analysis', 'Moisture Content', 'Fat Analysis'],
      email: 'john.smith@lab.com'
    },
    {
      id: 'A002',
      name: 'Dr. Jane Doe',
      department: 'Chemical Analysis',
      specialization: ['Pesticide Analysis', 'Heavy Metals', 'Aflatoxins'],
      email: 'jane.doe@lab.com'
    },
    {
      id: 'A003',
      name: 'Dr. Mike Johnson',
      department: 'Microbiological Analysis',
      specialization: ['Microbiology', 'Pathogen Detection', 'Food Safety'],
      email: 'mike.johnson@lab.com'
    },
    {
      id: 'A004',
      name: 'Dr. Sarah Wilson',
      department: 'Instrumental Analysis',
      specialization: ['GC-MS', 'HPLC', 'ICP-MS'],
      email: 'sarah.wilson@lab.com'
    },
    {
      id: 'A005',
      name: 'Dr. Alex Chen',
      department: 'Quality Control',
      specialization: ['Method Validation', 'Quality Assurance', 'Calibration'],
      email: 'alex.chen@lab.com'
    }
  ];

  useEffect(() => {
    // Get sample data from location state or fetch from API
    if (location.state?.sample) {
      setSample(location.state.sample);
      
      // Initialize test assignments with current assignments
      const initialAssignments: { [testId: string]: { analyst: string } } = {};
      location.state.sample.tests.forEach((test: Test) => {
        if (test.assignedAnalyst) {
          initialAssignments[test.id] = {
            analyst: test.assignedAnalyst
          };
        }
      });
      setTestAssignments(initialAssignments);
    }
  }, [location.state]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleBackToAllocation = () => {
    navigate('/test-allocation');
  };

  const handleEditTest = (testId: string) => {
    setEditingTest(testId);
    // Initialize assignment if it doesn't exist
    if (!testAssignments[testId]) {
      const test = sample?.tests.find(t => t.id === testId);
      if (test) {
        setTestAssignments(prev => ({
          ...prev,
          [testId]: {
            analyst: test.assignedAnalyst || ''
          }
        }));
      }
    }
  };

  const handleSaveAssignment = (testId: string) => {
    setEditingTest(null);
    
    // Update the test in the sample
    if (sample) {
      const updatedSample = {
        ...sample,
        tests: sample.tests.map(test => 
          test.id === testId 
            ? {
                ...test,
                assignedAnalyst: testAssignments[testId]?.analyst || undefined,
                status: testAssignments[testId]?.analyst ? 'Assigned' : 'Pending'
              }
            : test
        )
      };
      
      // Update assigned tests count
      const assignedCount = updatedSample.tests.filter(t => t.assignedAnalyst).length;
      updatedSample.assignedTests = assignedCount;
      
      // Update sample status
      if (assignedCount === updatedSample.testsCount) {
        updatedSample.status = 'Fully Allocated';
      } else if (assignedCount > 0) {
        updatedSample.status = 'Partially Allocated';
      } else {
        updatedSample.status = 'Pending Allocation';
      }
      
      setSample(updatedSample);
    }
    
    console.log('Saving assignment for test:', testId, testAssignments[testId]);
  };

  const handleCancelEdit = () => {
    setEditingTest(null);
  };

  const updateTestAssignment = (testId: string, analyst: string) => {
    setTestAssignments(prev => ({
      ...prev,
      [testId]: {
        analyst
      }
    }));
  };

  const getAnalystOptions = () => {
    return analysts.map(analyst => ({
      value: analyst.name,
      label: `${analyst.name} - ${analyst.department}`
    }));
  };

  const getBreadcrumbItems = () => {
    return [
      { label: 'Test Allocation', onClick: handleBackToAllocation },
      { label: `${sample?.sampleId || 'Sample'} - Test Assignment`, isActive: true }
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
            onClick={handleBackToAllocation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200"
          >
            Back to Test Allocation
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
          onClick={handleBackToAllocation}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Test Allocation
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Assignment</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assign individual tests to analysts for {sample.sampleId}
          </p>
        </div>
      </motion.div>

      {/* Sample Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {sample.sampleName}
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              {sample.sampleId} - Order: {sample.orderId}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(sample.status)}`}>
            {sample.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Sample Type:</span>
            <p className="text-blue-900 dark:text-blue-100">{sample.sampleType}</p>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Commodity:</span>
            <p className="text-blue-900 dark:text-blue-100">{sample.commodity}</p>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Total Tests:</span>
            <p className="text-blue-900 dark:text-blue-100">{sample.testsCount}</p>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Assigned Tests:</span>
            <p className="text-blue-900 dark:text-blue-100">{sample.assignedTests}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="text-blue-700 dark:text-blue-300 font-medium">Description:</span>
          <p className="text-blue-900 dark:text-blue-100 mt-1">{sample.description}</p>
        </div>
      </motion.div>

      {/* Assignment Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sample.testsCount}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <TestTube className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sample.assignedTests}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sample.testsCount - sample.assignedTests}</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-full">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Test Assignment</h3>
          <p className="text-gray-600 dark:text-gray-400">Assign each test to an appropriate analyst</p>
        </div>

        <div className="space-y-4">
          {sample.tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <TestTube className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{test.testName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{test.testType} - {test.method}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {test.estimatedDuration}
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      test.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      test.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {test.priority} Priority
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {editingTest === test.id ? (
                    <div className="flex items-center space-x-3">
                      <div className="min-w-[250px]">
                        <CustomSelect
                          value={testAssignments[test.id]?.analyst || ''}
                          onChange={(value) => updateTestAssignment(test.id, value)}
                          options={getAnalystOptions()}
                          placeholder="Select Analyst"
                        />
                      </div>
                      <motion.button
                        onClick={() => handleSaveAssignment(test.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </motion.button>
                      <motion.button
                        onClick={handleCancelEdit}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="text-right min-w-[200px]">
                        {test.assignedAnalyst ? (
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <UserCheck className="w-4 h-4 text-green-500 mr-2" />
                            <div>
                              <div className="font-medium">{test.assignedAnalyst}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {analysts.find(a => a.name === test.assignedAnalyst)?.department}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Not assigned
                          </div>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                      <motion.button
                        onClick={() => handleEditTest(test.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        {test.assignedAnalyst ? 'Reassign' : 'Assign'}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Test Details */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Parameters:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
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
                    <span className="font-medium text-gray-700 dark:text-gray-300">Specifications:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{test.specifications}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TestAssignment; 