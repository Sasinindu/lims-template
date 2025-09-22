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
  Users,
  Save,
  Edit3,
  Info,
  Plus,
  Trash2
} from 'lucide-react';
import Drawer from '../components/Drawer';
import CustomSelect from '../components/CustomSelect';
import Label from '../components/Label';
import Input from '../components/Input';
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
  assignedDivisionalHead?: string;
  dueDate?: string;
  status: string;
  testsCount: number;
  priority: string;
  collectionDate: string;
  collectionSite: string;
  tests: Test[];
}

interface Test {
  id: string;
  testId: string;
  testName: string;
  method: string;
  assignedAnalyst?: string;
  status: string;
  priority: string;
}

interface DivisionalHead {
  id: string;
  name: string;
  department: string;
  email: string;
}

const OrderApproval: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedSamples, setExpandedSamples] = useState<Set<string>>(new Set());
  const [loading] = useState(false);
  const [editingSample, setEditingSample] = useState<string | null>(null);

  // Sample assignment state
  const [sampleAssignments, setSampleAssignments] = useState<{
    [sampleId: string]: {
      divisionalHead: string;
      dueDate: string;
    }
  }>({});

  // Sample details drawer state
  const [isSampleDetailsOpen, setIsSampleDetailsOpen] = useState(false);
  const [selectedSampleForDetails, setSelectedSampleForDetails] = useState<Sample | null>(null);

  const [orders] = useState<Order[]>([
    {
      id: 'ORD001',
      orderId: 'ORD-2024-001',
      companyName: 'ABC Corporation',
      siteName: 'Head Office',
      poNumber: 'PO-2024-001',
      totalSamples: 4,
      totalTests: 12,
      status: 'Pending Assignment',
      createdAt: '2024-01-15',
      samples: [
        {
          id: 'S001',
          sampleId: 'SMP-001',
          sampleName: 'Raw Milk Sample',
          sampleType: 'Liquid',
          description: 'Fresh raw milk sample collected from dairy farm for microbiological and chemical analysis',
          orderId: 'ORD-2024-001',
          commodity: 'Milk',
          commodityCategory: 'Dairy Products',
          sampleQuantity: '500ml',
          sampleCondition: 'Chilled at 4°C',
          assignedDivisionalHead: undefined,
          dueDate: undefined,
          status: 'Pending Assignment',
          testsCount: 3,
          priority: 'High',
          collectionDate: '2024-01-15',
          collectionSite: 'Main Production Unit',
          tests: [
            {
              id: 'T001',
              testId: 'TST-001',
              testName: 'Protein Content',
              method: 'Kjeldahl Method',
              assignedAnalyst: undefined,
              status: 'Pending',
              priority: 'High'
            },
            {
              id: 'T002',
              testId: 'TST-002',
              testName: 'Fat Content',
              method: 'Soxhlet Extraction',
              assignedAnalyst: undefined,
              status: 'Pending',
              priority: 'Medium'
            },
            {
              id: 'T003',
              testId: 'TST-003',
              testName: 'Microbiological Count',
              method: 'Plate Count Method',
              assignedAnalyst: undefined,
              status: 'Pending',
              priority: 'High'
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
          assignedDivisionalHead: 'Dr. Sarah Wilson',
          dueDate: '2024-01-25',
          status: 'Assigned',
          testsCount: 2,
          priority: 'Medium',
          collectionDate: '2024-01-15',
          collectionSite: 'Processing Plant A',
          tests: [
            {
              id: 'T004',
              testId: 'TST-004',
              testName: 'Moisture Content',
              method: 'Oven Drying Method',
              assignedAnalyst: 'Dr. John Smith',
              status: 'Assigned',
              priority: 'Medium'
            },
            {
              id: 'T005',
              testId: 'TST-005',
              testName: 'Protein Analysis',
              method: 'Kjeldahl Method',
              assignedAnalyst: 'Dr. John Smith',
              status: 'Assigned',
              priority: 'High'
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
          sampleCondition: 'Dry storage at room temperature',
          assignedDivisionalHead: 'Dr. Mike Johnson',
          dueDate: '2024-01-26',
          status: 'In Progress',
          testsCount: 4,
          priority: 'High',
          collectionDate: '2024-01-16',
          collectionSite: 'Storage Facility B',
          tests: [
            {
              id: 'T006',
              testId: 'TST-006',
              testName: 'Moisture Analysis',
              method: 'Oven Drying Method',
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'In Progress',
              priority: 'High'
            },
            {
              id: 'T007',
              testId: 'TST-007',
              testName: 'Pesticide Residue',
              method: 'GC-MS Method',
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'Completed',
              priority: 'High'
            },
            {
              id: 'T008',
              testId: 'TST-008',
              testName: 'Heavy Metals',
              method: 'ICP-MS Method',
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'In Progress',
              priority: 'Medium'
            },
            {
              id: 'T009',
              testId: 'TST-009',
              testName: 'Aflatoxin Analysis',
              method: 'HPLC Method',
              assignedAnalyst: 'Dr. Jane Doe',
              status: 'Pending',
              priority: 'High'
            }
          ]
        },
        {
          id: 'S004',
          sampleId: 'SMP-004',
          sampleName: 'Olive Oil Sample',
          sampleType: 'Liquid',
          description: 'Extra virgin olive oil sample for acidity and peroxide value testing',
          orderId: 'ORD-2024-001',
          commodity: 'Olive Oil',
          commodityCategory: 'Oils & Fats',
          sampleQuantity: '200ml',
          sampleCondition: 'Stored in dark glass bottle',
          assignedDivisionalHead: 'Dr. Lisa Brown',
          dueDate: '2024-01-24',
          status: 'Completed',
          testsCount: 3,
          priority: 'Low',
          collectionDate: '2024-01-14',
          collectionSite: 'Quality Control Lab',
          tests: [
            {
              id: 'T010',
              testId: 'TST-010',
              testName: 'Acid Value',
              method: 'Titration Method',
              assignedAnalyst: 'Dr. Alex Chen',
              status: 'Completed',
              priority: 'Medium'
            },
            {
              id: 'T011',
              testId: 'TST-011',
              testName: 'Peroxide Value',
              method: 'Iodometric Method',
              assignedAnalyst: 'Dr. Alex Chen',
              status: 'Completed',
              priority: 'Medium'
            },
            {
              id: 'T012',
              testId: 'TST-012',
              testName: 'Moisture Content',
              method: 'Karl Fischer Method',
              assignedAnalyst: 'Dr. Alex Chen',
              status: 'Completed',
              priority: 'Low'
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
      totalTests: 6,
      status: 'Approved',
      createdAt: '2024-01-16',
      samples: [
        {
          id: 'S005',
          sampleId: 'SMP-005',
          sampleName: 'Wheat Flour Sample',
          sampleType: 'Powder',
          description: 'Refined wheat flour sample for gluten and protein content analysis',
          orderId: 'ORD-2024-002',
          commodity: 'Wheat Flour',
          commodityCategory: 'Cereals & Grains',
          sampleQuantity: '500g',
          sampleCondition: 'Sealed packaging, dry storage',
          assignedDivisionalHead: 'Dr. Sarah Wilson',
          dueDate: '2024-01-28',
          status: 'Approved',
          testsCount: 4,
          priority: 'Medium',
          collectionDate: '2024-01-16',
          collectionSite: 'Mill Floor',
          tests: []
        },
        {
          id: 'S006',
          sampleId: 'SMP-006',
          sampleName: 'Corn Kernels Sample',
          sampleType: 'Grain',
          description: 'Yellow corn kernels for aflatoxin and moisture analysis',
          orderId: 'ORD-2024-002',
          commodity: 'Corn',
          commodityCategory: 'Cereals & Grains',
          sampleQuantity: '750g',
          sampleCondition: 'Dry storage in sealed container',
          assignedDivisionalHead: 'Dr. Mike Johnson',
          dueDate: '2024-01-27',
          status: 'Approved',
          testsCount: 2,
          priority: 'High',
          collectionDate: '2024-01-16',
          collectionSite: 'Grain Storage Unit',
          tests: []
        }
      ]
    }
  ]);

  const divisionalHeads: DivisionalHead[] = [
    {
      id: 'dh001',
      name: 'Dr. Sarah Wilson',
      department: 'Microbiology Division',
      email: 'sarah.wilson@lab.com'
    },
    {
      id: 'dh002',
      name: 'Dr. Mike Johnson',
      department: 'Chemistry Division',
      email: 'mike.johnson@lab.com'
    },
    {
      id: 'dh003',
      name: 'Dr. Lisa Brown',
      department: 'Food Safety Division',
      email: 'lisa.brown@lab.com'
    },
    {
      id: 'dh004',
      name: 'Dr. Alex Chen',
      department: 'Quality Assurance Division',
      email: 'alex.chen@lab.com'
    },
    {
      id: 'dh005',
      name: 'Dr. Emma Davis',
      department: 'Environmental Testing Division',
      email: 'emma.davis@lab.com'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Pending Assignment':
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  const handleViewSampleDetails = (sample: Sample) => {
    setSelectedSampleForDetails(sample);
    setIsSampleDetailsOpen(true);
  };

  const handleEditSample = (sampleId: string) => {
    setEditingSample(sampleId);
  };

  const handleSaveAssignment = (sampleId: string) => {
    // Save assignment logic would go here
    setEditingSample(null);
    console.log('Saving assignment for sample:', sampleId, sampleAssignments[sampleId]);
  };

  const handleCancelEdit = () => {
    setEditingSample(null);
  };

  const updateSampleAssignment = (sampleId: string, field: 'divisionalHead' | 'dueDate', value: string) => {
    setSampleAssignments(prev => ({
      ...prev,
      [sampleId]: {
        ...prev[sampleId],
        [field]: value
      }
    }));
  };

  const getDivisionalHeadOptions = () => {
    return divisionalHeads.map(head => ({
      value: head.name,
      label: `${head.name} - ${head.department}`
    }));
  };

  const getBreadcrumbItems = () => {
    const items = [];
    
    if (!selectedOrder) {
      items.push({ label: 'Orders', isActive: true });
    } else {
      items.push(
        { label: 'Orders', onClick: handleBackToOrders },
        { label: `${selectedOrder.orderId} - Sample Management`, isActive: true }
      );
    }
    
    return items;
  };

  const renderOrdersView = () => (
    <div className="space-y-6">
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Assignment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'Pending Assignment').length}
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
                {orders.filter(o => o.samples.some(s => s.status === 'In Progress')).length}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {orders.filter(o => o.status === 'Approved').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
        
        <div className="relative">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Management</h2>
            <p className="text-gray-600 dark:text-gray-400">Select an order to manage sample assignments</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PO Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Samples</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
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
                    <td className="px-4 py-4">
                      <div className="flex items-center">
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
                      <motion.button
                        onClick={() => handleViewOrder(order)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Manage Samples
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderSampleManagementView = () => {
    if (!selectedOrder) return null;

    return (
      <div className="space-y-6">
        {/* Back Button and Order Info */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={handleBackToOrders}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </motion.button>
          
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedOrder.orderId}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.companyName} - {selectedOrder.siteName}</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Sample Assignment Overview</h3>
              <p className="text-blue-700 dark:text-blue-300">Assign samples to divisional heads and set due dates for efficient processing</p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedOrder.totalSamples}</div>
                <div className="text-blue-700 dark:text-blue-300">Total Samples</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedOrder.totalTests}</div>
                <div className="text-blue-700 dark:text-blue-300">Total Tests</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Samples Management Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
          
          <div className="relative">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Sample Assignment Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Assign divisional heads and set due dates for each sample</p>
            </div>

            <div className="space-y-4">
              {selectedOrder.samples.map((sample, index) => (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden ${
                    index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/50' : 'bg-white/50 dark:bg-gray-900/50'
                  }`}
                >
                  {/* Collapsed Sample Card - Minimal Information */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          onClick={() => toggleSampleExpansion(sample.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                        >
                          {expandedSamples.has(sample.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          )}
                        </motion.button>
                        <Package className="w-6 h-6 text-primary-600" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{sample.sampleId}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{sample.sampleName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sample.status)}`}>
                          {sample.status}
                        </span>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {sample.testsCount} tests
                        </div>
                      </div>
                    </div>

                    {/* Assignment Status Summary - Always Visible */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          {sample.assignedDivisionalHead ? (
                            <>
                              <UserCheck className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.assignedDivisionalHead}</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-yellow-600 dark:text-yellow-400">Not assigned</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {sample.dueDate ? (
                            <>
                              <CalendarIcon className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.dueDate}</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-yellow-600 dark:text-yellow-400">No due date</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => handleViewSampleDetails(sample)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                          title="View Sample Details"
                        >
                          <Info className="w-4 h-4 mr-1" />
                          Details
                        </motion.button>
                        <motion.button
                          onClick={() => handleEditSample(sample.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/30 rounded-lg transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          {sample.assignedDivisionalHead ? 'Update' : 'Assign'}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sample Details */}
                  <AnimatePresence>
                    {expandedSamples.has(sample.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
                      >
                        <div className="p-6 space-y-6">
                          {/* Sample Details Grid */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <Package className="w-4 h-4 mr-2 text-primary-600" />
                              Sample Information
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Type:</span>
                                <p className="text-gray-900 dark:text-white mt-1">{sample.sampleType}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Quantity:</span>
                                <p className="text-gray-900 dark:text-white mt-1">{sample.sampleQuantity}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Commodity:</span>
                                <p className="text-gray-900 dark:text-white mt-1">{sample.commodity}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Category:</span>
                                <p className="text-gray-900 dark:text-white mt-1">{sample.commodityCategory}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Collection Date:</span>
                                <p className="text-gray-900 dark:text-white mt-1">{sample.collectionDate}</p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Collection Site:</span>
                                <p className="text-gray-900 dark:text-white mt-1">{sample.collectionSite}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">Description:</span>
                              <p className="text-gray-900 dark:text-white mt-1">{sample.description}</p>
                            </div>
                            <div className="mt-4">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">Sample Condition:</span>
                              <p className="text-gray-900 dark:text-white mt-1">{sample.sampleCondition}</p>
                            </div>
                          </div>

                          {/* Assignment Section */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                              <Users className="w-4 h-4 mr-2 text-primary-600" />
                              Assignment Management
                            </h5>
                            
                            {editingSample === sample.id ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`divisionalHead-${sample.id}`} required>
                                      Assign to Divisional Head
                                    </Label>
                                    <CustomSelect
                                      value={sampleAssignments[sample.id]?.divisionalHead || sample.assignedDivisionalHead || ''}
                                      onChange={(value) => updateSampleAssignment(sample.id, 'divisionalHead', value)}
                                      options={getDivisionalHeadOptions()}
                                      placeholder="Select divisional head"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`dueDate-${sample.id}`} required>
                                      Set Due Date
                                    </Label>
                                    <Input
                                      type="date"
                                      value={sampleAssignments[sample.id]?.dueDate || sample.dueDate || ''}
                                      onChange={(e) => updateSampleAssignment(sample.id, 'dueDate', e.target.value)}
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                                  <motion.button
                                    onClick={handleCancelEdit}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
                                  >
                                    Cancel
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleSaveAssignment(sample.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save Assignment
                                  </motion.button>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Assigned Divisional Head</div>
                                  {sample.assignedDivisionalHead ? (
                                    <div className="flex items-center">
                                      <UserCheck className="w-4 h-4 text-green-500 mr-2" />
                                      <div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.assignedDivisionalHead}</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {divisionalHeads.find(h => h.name === sample.assignedDivisionalHead)?.department}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                                      <span className="text-sm text-yellow-600 dark:text-yellow-400">Not assigned</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Due Date</div>
                                  {sample.dueDate ? (
                                    <div className="flex items-center">
                                      <CalendarIcon className="w-4 h-4 text-blue-500 mr-2" />
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">{sample.dueDate}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                                      <span className="text-sm text-yellow-600 dark:text-yellow-400">Not set</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Associated Tests */}
                          {sample.tests.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <TestTube className="w-4 h-4 mr-2 text-primary-600" />
                                Associated Tests ({sample.tests.length})
                              </h5>
                              <div className="grid grid-cols-1 gap-3">
                                {sample.tests.map((test) => (
                                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-medium text-sm text-gray-900 dark:text-white">{test.testName}</div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400">{test.method}</div>
                                        </div>
                                                                                 <div className="flex items-center space-x-2">
                                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                                             {test.status}
                                           </span>
                                         </div>
                                      </div>
                                      {test.assignedAnalyst && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                          <User className="w-3 h-3 mr-1" />
                                          {test.assignedAnalyst}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
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
        </motion.div>
      </div>
    );
  };

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
            Order Approval
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage sample assignments to divisional heads with due date tracking
          </p>
        </div>
      </motion.div>

      {/* Breadcrumb Navigation */}
      <Breadcrumb items={getBreadcrumbItems()} />

      {/* Current View */}
      {!selectedOrder && renderOrdersView()}
      {selectedOrder && renderSampleManagementView()}

      {/* Sample Details Drawer */}
      <Drawer
        isOpen={isSampleDetailsOpen}
        onClose={() => setIsSampleDetailsOpen(false)}
        title={`Sample Details - ${selectedSampleForDetails?.sampleId || ''}`}
        size="xl"
      >
        {selectedSampleForDetails && (
          <div className="p-6 space-y-6">
            {/* Sample Overview */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Sample Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Sample ID:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedSampleForDetails.sampleId}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Sample Name:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedSampleForDetails.sampleName}</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Type:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedSampleForDetails.sampleType}</p>
                </div>
                                                 <div>
                                   <span className="text-blue-700 dark:text-blue-300 font-medium">Status:</span>
                                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedSampleForDetails.status)}`}>
                                     {selectedSampleForDetails.status}
                                   </span>
                                 </div>
              </div>
            </div>

            {/* Sample Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Description</Label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-900 dark:text-white">{selectedSampleForDetails.description}</p>
                </div>
              </div>
              <div>
                <Label>Sample Condition</Label>
                <Input value={selectedSampleForDetails.sampleCondition} disabled />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input value={selectedSampleForDetails.sampleQuantity} disabled />
              </div>
              <div>
                <Label>Collection Date</Label>
                <Input value={selectedSampleForDetails.collectionDate} disabled />
              </div>
              <div>
                <Label>Collection Site</Label>
                <Input value={selectedSampleForDetails.collectionSite} disabled />
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedSampleForDetails.status)}`}>
                    {selectedSampleForDetails.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            {(selectedSampleForDetails.assignedDivisionalHead || selectedSampleForDetails.dueDate) && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">Assignment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedSampleForDetails.assignedDivisionalHead && (
                    <div>
                      <span className="text-green-700 dark:text-green-300 font-medium">Divisional Head:</span>
                      <p className="text-green-900 dark:text-green-100">{selectedSampleForDetails.assignedDivisionalHead}</p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        {divisionalHeads.find(h => h.name === selectedSampleForDetails.assignedDivisionalHead)?.department}
                      </p>
                    </div>
                  )}
                  {selectedSampleForDetails.dueDate && (
                    <div>
                      <span className="text-green-700 dark:text-green-300 font-medium">Due Date:</span>
                      <p className="text-green-900 dark:text-green-100">{selectedSampleForDetails.dueDate}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Associated Tests */}
            {selectedSampleForDetails.tests.length > 0 && (
              <div>
                <Label>Associated Tests ({selectedSampleForDetails.tests.length})</Label>
                <div className="mt-2 space-y-2">
                  {selectedSampleForDetails.tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{test.testName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{test.method}</div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                          {test.status}
                        </div>
                        {test.assignedAnalyst && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{test.assignedAnalyst}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default OrderApproval;
