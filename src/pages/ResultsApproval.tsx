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
  DollarSign,
  Search} from 'lucide-react';
import Drawer from '../components/Drawer';
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [expandedSamples, setExpandedSamples] = useState<Set<string>>(new Set());
  const [loading] = useState(false);
  
  // Test Details Drawer
  const [isTestDetailsOpen, setIsTestDetailsOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  
  // Search and pagination for samples
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
          sampleName: 'Whole Milk Sample',
          sampleType: 'Liquid',
          description: 'Fresh whole milk sample for comprehensive nutritional analysis',
          orderId: 'ORD-2024-001',
          commodity: 'Milk',
          commodityCategory: 'Dairy Products',
          sampleQuantity: '500ml',
          sampleCondition: 'Refrigerated at 4°C',
          assignedAnalyst: 'Dr. John Smith',
          dueDate: '2024-01-25',
          status: 'Testing Complete',
          testsCount: 3,
          collectionDate: '2024-01-15',
          collectionSite: 'Dairy Farm A',
          tests: [
            {
              id: 'T001',
              testId: 'TST-001',
              testName: 'Protein Content',
              testType: 'Chemical Analysis',
              method: 'Kjeldahl Method',
              parameters: ['Crude Protein', 'True Protein'],
              specifications: '≥ 3.0%',
              price: 200.00,
              group: 'Standard',
              analytes: ['Total Protein', 'Casein', 'Whey Protein'],
              assignedAnalyst: 'Dr. John Smith',
              status: 'Completed',
              completedDate: '2024-01-22',
              result: '3.2',
              unit: '%',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review',
              testNotes: 'Sample tested under standard conditions. Results within expected range.',
              attachments: ['protein_analysis_report.pdf', 'chromatogram.png']
            },
            {
              id: 'T002',
              testId: 'TST-002',
              testName: 'Fat Content',
              testType: 'Chemical Analysis',
              method: 'Soxhlet Extraction',
              parameters: ['Total Fat', 'Saturated Fat'],
              specifications: '3.0 - 4.0%',
              price: 180.00,
              group: 'Standard',
              analytes: ['Total Fat', 'Free Fatty Acids'],
              assignedAnalyst: 'Dr. John Smith',
              status: 'Completed',
              completedDate: '2024-01-22',
              result: '3.8',
              unit: '%',
              passStatus: 'Pass',
              reviewStatus: 'Approved',
              testNotes: 'Fat content analysis completed successfully.'
            },
            {
              id: 'T003',
              testId: 'TST-003',
              testName: 'Microbiological Count',
              testType: 'Microbiological Analysis',
              method: 'Plate Count Method',
              parameters: ['Total Viable Count', 'Coliform Count'],
              specifications: '≤ 1.0 × 10⁵ CFU/ml',
              price: 250.00,
              group: 'Premium',
              analytes: ['Total Bacteria', 'E. coli', 'Coliforms'],
              assignedAnalyst: 'Dr. Mike Johnson',
              status: 'Completed',
              completedDate: '2024-01-23',
              result: '8.5 × 10⁴',
              unit: 'CFU/ml',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review',
              testNotes: 'Microbiological analysis shows acceptable levels.'
            }
          ]
        },
        {
          id: 'S002',
          sampleId: 'SMP-002',
          sampleName: 'Ground Beef Sample',
          sampleType: 'Solid',
          description: 'Ground beef sample for moisture content and protein analysis testing',
          orderId: 'ORD-2024-001',
          commodity: 'Beef',
          commodityCategory: 'Meat Products',
          sampleQuantity: '250g',
          sampleCondition: 'Frozen at -18°C',
          assignedAnalyst: 'Dr. Jane Doe',
          dueDate: '2024-01-26',
          status: 'Testing Complete',
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
              price: 150.00,
              group: 'Standard',
              analytes: ['Total Moisture', 'Water Activity'],
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'Completed',
              completedDate: '2024-01-24',
              result: '75.2',
              unit: '%',
              passStatus: 'Pass',
              reviewStatus: 'Approved',
              testNotes: 'Moisture content within acceptable range.'
            },
            {
              id: 'T005',
              testId: 'TST-005',
              testName: 'Protein Analysis',
              testType: 'Chemical Analysis',
              method: 'Kjeldahl Method',
              parameters: ['Crude Protein', 'True Protein'],
              specifications: '≥ 20.0%',
              price: 280.00,
              group: 'Standard',
              analytes: ['Total Protein', 'Amino Acids'],
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'Completed',
              completedDate: '2024-01-24',
              result: '18.5',
              unit: '%',
              passStatus: 'Fail',
              reviewStatus: 'Returned',
              returnReason: 'Result below specification - requires retesting with fresh sample',
              testNotes: 'Protein content below minimum requirement. Sample may need to be retested.'
            }
          ]
        },
        {
          id: 'S003',
          sampleId: 'SMP-003',
          sampleName: 'Basmati Rice Sample',
          sampleType: 'Grain',
          description: 'Premium basmati rice sample for pesticide residue and heavy metals analysis',
          orderId: 'ORD-2024-001',
          commodity: 'Rice',
          commodityCategory: 'Cereals & Grains',
          sampleQuantity: '1kg',
          sampleSampleCondition: 'Dry storage at room temperature',
          assignedAnalyst: 'Dr. Alex Chen',
          dueDate: '2024-01-27',
          status: 'Results Approved',
          testsCount: 3,
          collectionDate: '2024-01-16',
          collectionSite: 'Storage Facility B',
          tests: [
            {
              id: 'T006',
              testId: 'TST-006',
              testName: 'Moisture Analysis',
              testType: 'Chemical Analysis',
              method: 'Oven Drying Method',
              parameters: ['Moisture Content', 'Water Activity'],
              specifications: '≤ 14.0%',
              price: 120.00,
              group: 'Standard',
              analytes: ['Total Moisture', 'Free Water'],
              assignedAnalyst: 'Dr. Alex Chen',
              status: 'Completed',
              completedDate: '2024-01-25',
              result: '12.8',
              unit: '%',
              passStatus: 'Pass',
              reviewStatus: 'Approved',
              testNotes: 'Moisture content well within specification.'
            },
            {
              id: 'T007',
              testId: 'TST-007',
              testName: 'Pesticide Residue',
              testType: 'Chemical Analysis',
              method: 'GC-MS Method',
              parameters: ['Organochlorines', 'Organophosphates', 'Carbamates'],
              specifications: '≤ 0.01 mg/kg',
              price: 450.00,
              group: 'Premium',
              analytes: ['DDT', 'Chlordane', 'Malathion'],
              assignedAnalyst: 'Dr. Sarah Wilson',
              status: 'Completed',
              completedDate: '2024-01-25',
              result: '0.008',
              unit: 'mg/kg',
              passStatus: 'Pass',
              reviewStatus: 'Approved',
              testNotes: 'No detectable pesticide residues above detection limits.'
            },
            {
              id: 'T008',
              testId: 'TST-008',
              testName: 'Heavy Metals',
              testType: 'Chemical Analysis',
              method: 'ICP-MS Method',
              parameters: ['Lead', 'Cadmium', 'Mercury', 'Arsenic'],
              specifications: '≤ 0.1 mg/kg total',
              price: 380.00,
              group: 'Premium',
              analytes: ['Pb', 'Cd', 'Hg', 'As'],
              assignedAnalyst: 'Dr. Sarah Wilson',
              status: 'Completed',
              completedDate: '2024-01-25',
              result: '0.05',
              unit: 'mg/kg',
              passStatus: 'Pass',
              reviewStatus: 'Approved',
              testNotes: 'Heavy metals content within acceptable limits.'
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
          sampleName: 'Sunflower Oil Sample',
          sampleType: 'Liquid',
          description: 'Refined sunflower oil sample for quality analysis',
          orderId: 'ORD-2024-002',
          commodity: 'Sunflower Oil',
          commodityCategory: 'Oils & Fats',
          sampleQuantity: '1L',
          sampleCondition: 'Stored at room temperature',
          assignedAnalyst: 'Dr. Emma Davis',
          dueDate: '2024-01-28',
          status: 'Testing Complete',
          testsCount: 3,
          collectionDate: '2024-01-16',
          collectionSite: 'Processing Unit C',
          tests: [
            {
              id: 'T009',
              testId: 'TST-009',
              testName: 'Acid Value',
              testType: 'Chemical Analysis',
              method: 'Titration Method',
              parameters: ['Free Fatty Acids', 'Acid Number'],
              specifications: '≤ 0.5 mg KOH/g',
              price: 100.00,
              group: 'Standard',
              analytes: ['Free Fatty Acids'],
              assignedAnalyst: 'Dr. Emma Davis',
              status: 'Completed',
              completedDate: '2024-01-26',
              result: '0.3',
              unit: 'mg KOH/g',
              passStatus: 'Pass',
              reviewStatus: 'Approved',
              testNotes: 'Acid value within acceptable range.'
            },
            {
              id: 'T010',
              testId: 'TST-010',
              testName: 'Peroxide Value',
              testType: 'Chemical Analysis',
              method: 'Iodometric Method',
              parameters: ['Peroxide Value', 'Oxidation Level'],
              specifications: '≤ 10 meq O₂/kg',
              price: 120.00,
              group: 'Standard',
              analytes: ['Peroxides', 'Primary Oxidation Products'],
              assignedAnalyst: 'Dr. Emma Davis',
              status: 'Completed',
              completedDate: '2024-01-26',
              result: '8.5',
              unit: 'meq O₂/kg',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review',
              testNotes: 'Peroxide value indicates good oil quality.'
            },
            {
              id: 'T011',
              testId: 'TST-011',
              testName: 'Moisture Content',
              testType: 'Chemical Analysis',
              method: 'Karl Fischer Method',
              parameters: ['Moisture Content', 'Water Content'],
              specifications: '≤ 0.2%',
              price: 90.00,
              group: 'Standard',
              analytes: ['Total Moisture'],
              assignedAnalyst: 'Dr. Emma Davis',
              status: 'Completed',
              completedDate: '2024-01-26',
              result: '0.15',
              unit: '%',
              passStatus: 'Pass',
              reviewStatus: 'Pending Review',
              testNotes: 'Low moisture content indicates proper processing.'
            }
          ]
        },
        {
          id: 'S005',
          sampleId: 'SMP-005',
          sampleName: 'Wheat Flour Sample',
          sampleType: 'Powder',
          description: 'All-purpose wheat flour for baking quality analysis',
          orderId: 'ORD-2024-002',
          commodity: 'Wheat Flour',
          commodityCategory: 'Cereals & Grains',
          sampleQuantity: '2kg',
          sampleCondition: 'Dry storage in sealed container',
          assignedAnalyst: 'Dr. Tom Wilson',
          dueDate: '2024-01-29',
          status: 'In Progress',
          testsCount: 2,
          collectionDate: '2024-01-17',
          collectionSite: 'Mill Facility D',
          tests: [
            {
              id: 'T012',
              testId: 'TST-012',
              testName: 'Protein Content',
              testType: 'Chemical Analysis',
              method: 'Kjeldahl Method',
              parameters: ['Crude Protein', 'Gluten Content'],
              specifications: '10.0 - 14.0%',
              price: 160.00,
              group: 'Standard',
              analytes: ['Total Protein', 'Gluten'],
              assignedAnalyst: 'Dr. Tom Wilson',
              status: 'In Progress',
              reviewStatus: 'Pending Review',
              testNotes: 'Analysis in progress.'
            },
            {
              id: 'T013',
              testId: 'TST-013',
              testName: 'Gluten Quality',
              testType: 'Physical Analysis',
              method: 'Glutomatic Method',
              parameters: ['Wet Gluten', 'Dry Gluten', 'Gluten Index'],
              specifications: 'Gluten Index ≥ 80',
              price: 200.00,
              group: 'Premium',
              analytes: ['Wet Gluten', 'Dry Gluten', 'Gluten Index'],
              assignedAnalyst: 'Dr. Tom Wilson',
              status: 'Pending',
              reviewStatus: 'Pending Review',
              testNotes: 'Awaiting completion of protein analysis.'
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
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
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

  const handleViewSamples = (order: Order) => {
    setSelectedOrder(order);
    setSelectedSample(null);
  };

  const handleViewTests = (sample: Sample) => {
    setSelectedSample(sample);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
    setSelectedSample(null);
  };

  const handleBackToSamples = () => {
    setSelectedSample(null);
  };

  const handleViewTestDetails = (test: Test) => {
    setSelectedTest(test);
    setIsTestDetailsOpen(true);
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

  const handleRejectTest = (testId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => ({
        ...order,
        samples: order.samples.map(sample => ({
          ...sample,
          tests: sample.tests.map(test =>
            test.id === testId
              ? { ...test, reviewStatus: 'Rejected' as const }
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

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Results Approval', onClick: handleBackToOrders }
    ];

    if (selectedOrder) {
      items.push({
        label: selectedOrder.orderId,
        onClick: handleBackToSamples
      });
    }

    if (selectedSample) {
      items.push({
        label: selectedSample.sampleId,
        isActive: true
      });
    }

    return items;
  };

  const getFilteredAndPaginatedSamples = () => {
    if (!selectedOrder) return { samples: [], totalCount: 0 };

    const filtered = selectedOrder.samples.filter(sample =>
      sample.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.sampleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.assignedAnalyst.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSamples = filtered.slice(startIndex, endIndex);

    return {
      samples: paginatedSamples,
      totalCount: filtered.length
    };
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderOrdersView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/30' : 'bg-white/30 dark:bg-gray-900/30'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{order.orderId}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    onClick={() => handleViewSamples(order)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Samples
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderSamplesView = () => {
    if (!selectedOrder) return null;

    const { samples: filteredSamples, totalCount: filteredCount } = getFilteredAndPaginatedSamples();
    const totalPages = Math.ceil(filteredCount / itemsPerPage);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Order Summary Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {selectedOrder.orderId}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                {selectedOrder.companyName} - {selectedOrder.siteName}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedOrder.totalSamples}</div>
              <div className="text-blue-700 dark:text-blue-300">Samples</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search samples by ID, name, commodity, status, or analyst..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Samples Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sample ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commodity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Analyst</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSamples.map((sample, index) => (
                  <motion.tr
                    key={sample.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/30' : 'bg-white/30 dark:bg-gray-900/30'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{sample.sampleId}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{sample.sampleName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.commodity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <TestTube className="w-4 h-4 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.testsCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-purple-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{sample.assignedAnalyst}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 text-orange-500 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{sample.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(sample.status)}`}>
                        {sample.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        onClick={() => handleViewTests(sample)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Tests
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCount)} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredCount)} of {filteredCount} samples
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded ${
                        page === currentPage
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredSamples.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No samples found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search criteria.' : 'No samples available for this order.'}
            </p>
          </div>
        )}
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
        {/* Sample Summary Card */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                {selectedSample.sampleId} - {selectedSample.sampleName}
              </h3>
              <p className="text-green-700 dark:text-green-300">
                {selectedSample.commodity} • {selectedSample.sampleType} • {selectedSample.sampleQuantity}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{selectedSample.testsCount}</div>
              <div className="text-green-700 dark:text-green-300">Tests</div>
            </div>
          </div>
        </div>

        {/* Tests Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Test Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Test Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parameters</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <TestTube className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{test.testName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{test.testId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{test.testType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {test.parameters.slice(0, 2).map((param, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            {param}
                          </span>
                        ))}
                        {test.parameters.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            +{test.parameters.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">${test.price.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReviewStatusColor(test.reviewStatus)}`}>
                        {test.reviewStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        onClick={() => handleViewTestDetails(test)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

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

      {/* Conditional Views */}
      {!selectedOrder && renderOrdersView()}
      {selectedOrder && !selectedSample && renderSamplesView()}
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

            {/* Specifications */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specifications</h4>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {selectedTest.specifications}
              </p>
            </div>

            {/* Test Results */}
            {selectedTest.result && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result</h5>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedTest.result} {selectedTest.unit}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specification</h5>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedTest.specifications}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pass/Fail Status</h5>
                    <span className={`px-4 py-2 text-sm font-medium rounded-full ${getPassStatusColor(selectedTest.passStatus || 'Pending')}`}>
                      {selectedTest.passStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Test Notes */}
            {selectedTest.testNotes && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Notes</h4>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
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
    </div>
  );
};

export default ResultsApproval; 