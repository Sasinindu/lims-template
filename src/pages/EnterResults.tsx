import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  TestTube,
  Package,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Save,
  Send,
  X,
  Printer,
  Upload,
  FileText,
  Settings
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import MultiSelect from '../components/MultiSelect';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';

interface Sample {
  id: string;
  sampleId: string;
  orderId: string;
  sampleName: string;
  assignedAnalyst: string;
}

interface Test {
  id: string;
  testId: string;
  testName: string;
  testType: string;
  method: string;
  analytes: string[];
  specifications: string;
  estimatedDuration: string;
  status: string;
  assignedAnalyst: string;
}

interface Instrument {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: 'Available' | 'In Use' | 'Maintenance';
}

interface TestResult {
  analyte: string;
  value: string;
  unit: string;
  status: 'Pass' | 'Fail' | 'Pending';
  remarks?: string;
}

const EnterResults: React.FC = () => {
  const { sampleId, testId } = useParams<{ sampleId: string; testId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [sample, setSample] = useState<Sample | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [worksheetUploaded, setWorksheetUploaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const instruments: Instrument[] = [
    { id: 'INS001', name: 'GC-MS System', model: 'Agilent 7890B', serialNumber: 'AG001', status: 'Available' },
    { id: 'INS002', name: 'HPLC System', model: 'Waters Alliance', serialNumber: 'WT002', status: 'Available' },
    { id: 'INS003', name: 'ICP-MS', model: 'PerkinElmer NexION', serialNumber: 'PE003', status: 'In Use' },
    { id: 'INS004', name: 'UV-Vis Spectrophotometer', model: 'Shimadzu UV-1800', serialNumber: 'SH004', status: 'Available' },
    { id: 'INS005', name: 'Kjeldahl Analyzer', model: 'VELP UDK 149', serialNumber: 'VE005', status: 'Available' },
    { id: 'INS006', name: 'Moisture Analyzer', model: 'Sartorius MA35', serialNumber: 'SA006', status: 'Maintenance' }
  ];

  useEffect(() => {
    // Get data from location state or mock data
    if (location.state?.sample && location.state?.test) {
      setSample(location.state.sample);
      setTest(location.state.test);
      
      // Initialize test results with analytes
      const initialResults = location.state.test.analytes.map((analyte: string) => ({
        analyte,
        value: '',
        unit: '',
        status: 'Pending' as const,
        remarks: ''
      }));
      setTestResults(initialResults);
    } else {
      // Mock data for direct URL access
      const mockSample: Sample = {
        id: 'S001',
        sampleId: sampleId || 'SMP-001',
        orderId: 'ORD-2024-001',
        sampleName: 'Raw Milk Sample',
        assignedAnalyst: 'Dr. John Smith'
      };
      
      const mockTest: Test = {
        id: 'T001',
        testId: testId || 'TST-001',
        testName: 'Protein Content',
        testType: 'Chemical Analysis',
        method: 'Kjeldahl Method',
        analytes: ['Total Protein', 'Crude Protein'],
        specifications: '≥ 3.0%',
        estimatedDuration: '4 hours',
        status: 'In Progress',
        assignedAnalyst: 'Dr. John Smith'
      };
      
      setSample(mockSample);
      setTest(mockTest);
      
      const initialResults = mockTest.analytes.map((analyte: string) => ({
        analyte,
        value: '',
        unit: '',
        status: 'Pending' as const,
        remarks: ''
      }));
      setTestResults(initialResults);
    }
  }, [sampleId, testId, location.state]);

  const getInstrumentOptions = () => {
    return instruments
      .filter(instrument => instrument.status === 'Available')
      .map(instrument => ({
        value: instrument.id,
        label: `${instrument.name} - ${instrument.model} (${instrument.serialNumber})`
      }));
  };

  const handleBackToSample = () => {
    navigate('/tests');
  };

  const handleBackToTests = () => {
    navigate('/tests');
  };

  const updateTestResult = (index: number, field: keyof TestResult, value: string) => {
    setTestResults(prev => prev.map((result, i) => 
      i === index ? { ...result, [field]: value } : result
    ));
  };

  const handlePrintWorksheet = () => {
    console.log('Printing worksheet for test:', test?.testId);
    // Implement print functionality
  };

  const handleWorksheetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploading worksheet:', file.name);
      setWorksheetUploaded(true);
      // Implement actual upload logic
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving results:', testResults);
      // Implement save logic
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting results for approval:', testResults);
      // Navigate back to sample details
      navigate(`/tests/sample/${sampleId}`, {
        state: { sample }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/tests');
  };

  const getBreadcrumbItems = () => {
    return [
      { label: 'Tests', onClick: handleBackToTests },
      { label: `${sample?.sampleId}`, onClick: handleBackToSample },
      { label: `${test?.testId} - Enter Results`, isActive: true }
    ];
  };

  const isFormValid = () => {
    return testResults.every(result => result.value.trim() !== '' && result.unit.trim() !== '') && 
           selectedInstruments.length > 0;
  };

  if (!sample || !test) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Test not found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            The requested test could not be loaded.
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
          onClick={handleBackToSample}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sample Details
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Enter Test Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Enter results for {test.testName} - {sample.sampleId}
          </p>
        </div>
      </motion.div>

      {/* Test Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
              {test.testName}
            </h3>
            <p className="text-green-700 dark:text-green-300">
              {test.testId} - {test.method}
            </p>
          </div>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {test.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-green-700 dark:text-green-300 font-medium">Test Type:</span>
            <p className="text-green-900 dark:text-green-100">{test.testType}</p>
          </div>
          <div>
            <span className="text-green-700 dark:text-green-300 font-medium">Protocol:</span>
            <p className="text-green-900 dark:text-green-100">{test.method}</p>
          </div>
          <div>
            <span className="text-green-700 dark:text-green-300 font-medium">Duration:</span>
            <p className="text-green-900 dark:text-green-100">{test.estimatedDuration}</p>
          </div>
          <div>
            <span className="text-green-700 dark:text-green-300 font-medium">Specifications:</span>
            <p className="text-green-900 dark:text-green-100">{test.specifications}</p>
          </div>
        </div>
      </motion.div>

      {/* Instrument Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-primary-600" />
            Instrument Selection
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Select the instruments used for this test</p>
        </div>

        <div className="max-w-xl">
          <Label htmlFor="instruments" required>
            Instruments Used
          </Label>
          <MultiSelect
            options={getInstrumentOptions()}
            value={selectedInstruments}
            onChange={setSelectedInstruments}
            placeholder="Select instruments"
            maxDisplay={2}
            className="mt-1"
          />
        </div>
      </motion.div>

      {/* Worksheet Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary-600" />
            Worksheet Management
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Print worksheet before starting, upload completed worksheet after testing</p>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={handlePrintWorksheet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Worksheet
          </motion.button>

          <div className="relative">
            <input
              type="file"
              id="worksheet-upload"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleWorksheetUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <motion.label
              htmlFor="worksheet-upload"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-colors duration-200 ${
                worksheetUploaded
                  ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'text-gray-600 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {worksheetUploaded ? 'Worksheet Uploaded' : 'Upload Completed Worksheet'}
            </motion.label>
          </div>
        </div>
      </motion.div>

      {/* Results Entry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-primary-600" />
            Test Results Entry
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Enter results for each analyte</p>
        </div>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <motion.div
              key={result.analyte}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center mb-3">
                <TestTube className="w-4 h-4 text-indigo-500 mr-2" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{result.analyte}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`value-${index}`} required>
                    Result Value
                  </Label>
                  <Input
                    id={`value-${index}`}
                    type="text"
                    value={result.value}
                    onChange={(e) => updateTestResult(index, 'value', e.target.value)}
                    placeholder="Enter value"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`unit-${index}`} required>
                    Unit
                  </Label>
                  <Input
                    id={`unit-${index}`}
                    type="text"
                    value={result.unit}
                    onChange={(e) => updateTestResult(index, 'unit', e.target.value)}
                    placeholder="e.g., mg/L, %"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`status-${index}`}>
                    Status
                  </Label>
                  <CustomSelect
                    value={result.status}
                    onChange={(value) => updateTestResult(index, 'status', value)}
                    options={[
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Pass', label: 'Pass' },
                      { value: 'Fail', label: 'Fail' }
                    ]}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`remarks-${index}`}>
                    Remarks
                  </Label>
                  <Input
                    id={`remarks-${index}`}
                    type="text"
                    value={result.remarks || ''}
                    onChange={(e) => updateTestResult(index, 'remarks', e.target.value)}
                    placeholder="Optional remarks"
                    className="mt-1"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center justify-end space-x-4 pt-4"
      >
        <motion.button
          onClick={handleCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </motion.button>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Draft'}
        </motion.button>

        <motion.button
          onClick={handleSubmit}
          disabled={!isFormValid() || submitting}
          whileHover={{ scale: isFormValid() && !submitting ? 1.02 : 1 }}
          whileTap={{ scale: isFormValid() && !submitting ? 0.98 : 1 }}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
        >
          <Send className="w-4 h-4 mr-2" />
          {submitting ? 'Submitting...' : 'Submit for Approval'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EnterResults; 