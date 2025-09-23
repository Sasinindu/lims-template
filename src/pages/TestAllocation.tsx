import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TestTube,
  Package,
  Clock,
  UserCheck,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Building2,
  Eye,
  Edit,
  FileText,
  ArrowRight
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import { useNavigate } from 'react-router-dom';

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

const TestAllocation: React.FC = () => {
  const navigate = useNavigate();

  const [samples] = useState<Sample[]>([
    {
      id: 'S001',
      sampleId: 'SMP-001',
      orderId: 'ORD-2024-001',
      sampleName: 'Raw Milk Sample',
      sampleType: 'Liquid',
      commodity: 'Milk',
      commodityCategory: 'Dairy Products',
      description: 'Fresh raw milk sample for microbiological and chemical analysis',
      testsCount: 3,
      assignedTests: 0,
      status: 'Pending Allocation',
      createdAt: '2024-01-15',
      tests: [
        {
          id: 'T001',
          testId: 'TST-001',
          testName: 'Protein Content',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          parameters: ['Total Protein', 'Crude Protein'],
          specifications: '≥ 3.0%',
          estimatedDuration: '4 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: undefined
        },
        {
          id: 'T002',
          testId: 'TST-002',
          testName: 'Fat Content',
          testType: 'Chemical Analysis',
          method: 'Soxhlet Extraction',
          parameters: ['Total Fat', 'Saturated Fat'],
          specifications: '3.0 - 4.0%',
          estimatedDuration: '6 hours',
          priority: 'Medium',
          status: 'Pending',
          assignedAnalyst: undefined
        },
        {
          id: 'T003',
          testId: 'TST-003',
          testName: 'Microbiological Count',
          testType: 'Microbiological Analysis',
          method: 'Plate Count Method',
          parameters: ['Total Plate Count', 'Coliform Count'],
          specifications: '≤ 1.0 × 10⁵ CFU/ml',
          estimatedDuration: '48 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: undefined
        }
      ]
    },
    {
      id: 'S002',
      sampleId: 'SMP-002',
      orderId: 'ORD-2024-001',
      sampleName: 'Beef Sample',
      sampleType: 'Solid',
      commodity: 'Beef',
      commodityCategory: 'Meat Products',
      description: 'Fresh beef sample for moisture and protein analysis',
      testsCount: 2,
      assignedTests: 1,
      status: 'Partially Allocated',
      createdAt: '2024-01-15',
      tests: [
        {
          id: 'T004',
          testId: 'TST-004',
          testName: 'Moisture Content',
          testType: 'Chemical Analysis',
          method: 'Oven Drying Method',
          parameters: ['Moisture Content', 'Dry Matter'],
          specifications: '70.0 - 78.0%',
          estimatedDuration: '4 hours',
          priority: 'Medium',
          status: 'Assigned',
          assignedAnalyst: 'Dr. John Smith'
        },
        {
          id: 'T005',
          testId: 'TST-005',
          testName: 'Protein Analysis',
          testType: 'Chemical Analysis',
          method: 'Kjeldahl Method',
          parameters: ['Crude Protein', 'True Protein'],
          specifications: '≥ 20.0%',
          estimatedDuration: '5 hours',
          priority: 'High',
          status: 'Pending',
          assignedAnalyst: undefined
        }
      ]
    },
    {
      id: 'S003',
      sampleId: 'SMP-003',
      orderId: 'ORD-2024-002',
      sampleName: 'Rice Sample',
      sampleType: 'Solid',
      commodity: 'Rice',
      commodityCategory: 'Grains',
      description: 'Basmati rice sample for pesticide and heavy metal analysis',
      testsCount: 4,
      assignedTests: 4,
      status: 'Fully Allocated',
      createdAt: '2024-01-16',
      tests: [
        {
          id: 'T006',
          testId: 'TST-006',
          testName: 'Moisture Analysis',
          testType: 'Chemical Analysis',
          method: 'Oven Drying Method',
          parameters: ['Moisture Content', 'Water Activity'],
          specifications: '≤ 14.0%',
          estimatedDuration: '3 hours',
          priority: 'High',
          status: 'In Progress',
          assignedAnalyst: 'Dr. Jane Doe'
        },
        {
          id: 'T007',
          testId: 'TST-007',
          testName: 'Pesticide Residue',
          testType: 'Chemical Analysis',
          method: 'GC-MS Method',
          parameters: ['Organochlorines', 'Organophosphates', 'Carbamates'],
          specifications: '≤ 0.01 mg/kg',
          estimatedDuration: '8 hours',
          priority: 'High',
          status: 'Assigned',
          assignedAnalyst: 'Dr. Jane Doe'
        },
        {
          id: 'T008',
          testId: 'TST-008',
          testName: 'Heavy Metals',
          testType: 'Chemical Analysis',
          method: 'ICP-MS Method',
          parameters: ['Lead', 'Cadmium', 'Mercury', 'Arsenic'],
          specifications: '≤ 0.1 mg/kg',
          estimatedDuration: '6 hours',
          priority: 'Medium',
          status: 'Assigned',
          assignedAnalyst: 'Dr. Jane Doe'
        },
        {
          id: 'T009',
          testId: 'TST-009',
          testName: 'Aflatoxin Analysis',
          testType: 'Chemical Analysis',
          method: 'HPLC Method',
          parameters: ['Aflatoxin B1', 'Aflatoxin B2', 'Aflatoxin G1', 'Aflatoxin G2'],
          specifications: '≤ 5.0 μg/kg',
          estimatedDuration: '10 hours',
          priority: 'High',
          status: 'Assigned',
          assignedAnalyst: 'Dr. Jane Doe'
        }
      ]
    },
    {
      id: 'S004',
      sampleId: 'SMP-004',
      orderId: 'ORD-2024-003',
      sampleName: 'Cooking Oil Sample',
      sampleType: 'Liquid',
      commodity: 'Sunflower Oil',
      commodityCategory: 'Oils & Fats',
      description: 'Refined sunflower oil sample for quality analysis',
      testsCount: 2,
      assignedTests: 0,
      status: 'Pending Allocation',
      createdAt: '2024-01-17',
      tests: [
        {
          id: 'T010',
          testId: 'TST-010',
          testName: 'Acid Value',
          testType: 'Chemical Analysis',
          method: 'Titration Method',
          parameters: ['Free Fatty Acids', 'Acid Number'],
          specifications: '≤ 0.5 mg KOH/g',
          estimatedDuration: '2 hours',
          priority: 'Medium',
          status: 'Pending',
          assignedAnalyst: undefined
        },
        {
          id: 'T011',
          testId: 'TST-011',
          testName: 'Peroxide Value',
          testType: 'Chemical Analysis',
          method: 'Iodometric Method',
          parameters: ['Primary Oxidation', 'Peroxide Value'],
          specifications: '≤ 10 meq O₂/kg',
          estimatedDuration: '3 hours',
          priority: 'Medium',
          status: 'Pending',
          assignedAnalyst: undefined
        }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Allocation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Partially Allocated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Fully Allocated':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleAssignTests = (sample: Sample) => {
    navigate(`/test-allocation/assign/${sample.id}`, { 
      state: { sample } 
    });
  };

  const columns: Column[] = [
    {
      key: 'sampleId',
      title: 'Sample ID',
      render: (value: any, sample: Sample) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-primary-600 mr-2" />
          <div>
            <span className="font-medium text-gray-900 dark:text-white">{sample.sampleId}</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">{sample.sampleType}</div>
          </div>
        </div>
      )
    },
    {
      key: 'orderId',
      title: 'Order ID',
      render: (value: any, sample: Sample) => (
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.orderId}</span>
        </div>
      )
    },
    {
      key: 'sampleName',
      title: 'Sample Name',
      render: (value: any, sample: Sample) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{sample.sampleName}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{sample.commodity}</div>
        </div>
      )
    },
    {
      key: 'testsCount',
      title: 'Tests',
      render: (value: any, sample: Sample) => (
        <div className="text-center">
          <div className="flex items-center justify-center">
            <TestTube className="w-4 h-4 text-indigo-500 mr-1" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {sample.assignedTests}/{sample.testsCount}
            </span>
        </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {sample.assignedTests} assigned
        </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, sample: Sample) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sample.status)}`}>
          {sample.status}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (value: any, sample: Sample) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {sample.createdAt}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, sample: Sample) => (
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => handleAssignTests(sample)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200"
            title="Assign Tests to Analysts"
            >
            <UserPlus className="w-4 h-4 mr-1" />
            Assign Tests
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Allocation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assign tests to analysts for processing
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Partially Allocated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {samples.filter(s => s.status === 'Partially Allocated').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fully Allocated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {samples.filter(s => s.status === 'Fully Allocated').length}
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
        className="card"
      >
        <DataTable
          data={samples}
          columns={columns}
          searchable
          pagination
        />
      </motion.div>
    </div>
  );
};

export default TestAllocation;
