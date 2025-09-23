import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Package,
  User,
  Calendar as CalendarIcon,
  Eye,
  Search,
  Filter,
  Download,
  Printer,
  Building2,
  DollarSign,
  CheckCircle2,
  Clock,
  X,
  Plus,
  Receipt,
  CreditCard,
  Hash
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Breadcrumb from '../components/Breadcrumb';
import Drawer from '../components/Drawer';
import Input from '../components/Input';
import Label from '../components/Label';
import CustomSelect from '../components/CustomSelect';
import { useConfirmation } from '../hooks/useConfirmation';

interface CompletedOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerId: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  dateCompleted: string;
  totalSamples: number;
  totalTests: number;
  totalCost: number;
  currency: string;
  paymentTerms: string;
  samples: Sample[];
  invoiceGenerated: boolean;
  invoiceId?: string;
}

interface Sample {
  id: string;
  sampleId: string;
  sampleName: string;
  commodity: string;
  tests: Test[];
}

interface Test {
  id: string;
  testName: string;
  testType: string;
  cost: number;
  completedDate: string;
  analyst: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerName: string;
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  status: 'Generated' | 'Sent' | 'Paid' | 'Overdue';
  generatedBy: string;
  paymentTerms: string;
  samples: Sample[];
}

interface FilterState {
  orderId: string;
  customerName: string;
  invoiceStatus: string;
  dateRange: string;
}

const Invoices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [isInvoiceHistoryOpen, setIsInvoiceHistoryOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    orderId: '',
    customerName: '',
    invoiceStatus: '',
    dateRange: ''
  });
  
  const { confirmAction } = useConfirmation();

  // Mock data for completed orders eligible for invoicing
  const [completedOrders] = useState<CompletedOrder[]>([
    {
      id: 'CO001',
      orderId: 'ORD-2024-001',
      customerName: 'ABC Corporation',
      customerId: 'CUST-001',
      customerEmail: 'finance@abccorp.com',
      customerAddress: '123 Business Ave, Business City, BC 12345',
      customerPhone: '+1-555-0101',
      dateCompleted: '2024-01-25',
      totalSamples: 2,
      totalTests: 4,
      totalCost: 2400.00,
      currency: 'USD',
      paymentTerms: '30 days',
      invoiceGenerated: false,
      samples: [
        {
          id: 'S001',
          sampleId: 'SMP-001',
          sampleName: 'Wheat Sample A',
          commodity: 'Wheat',
          tests: [
            { id: 'T001', testName: 'Protein Analysis', testType: 'Chemical', cost: 150.00, completedDate: '2024-01-23', analyst: 'Dr. John Smith' },
            { id: 'T002', testName: 'Moisture Content', testType: 'Physical', cost: 100.00, completedDate: '2024-01-24', analyst: 'Dr. Jane Doe' }
          ]
        },
        {
          id: 'S002',
          sampleId: 'SMP-002',
          sampleName: 'Wheat Sample B',
          commodity: 'Wheat',
          tests: [
            { id: 'T003', testName: 'Microbiological Analysis', testType: 'Microbiological', cost: 300.00, completedDate: '2024-01-24', analyst: 'Dr. Mike Johnson' },
            { id: 'T004', testName: 'Heavy Metals', testType: 'Chemical', cost: 250.00, completedDate: '2024-01-25', analyst: 'Dr. Sarah Wilson' }
          ]
        }
      ]
    },
    {
      id: 'CO002',
      orderId: 'ORD-2024-003',
      customerName: 'Fresh Foods Ltd',
      customerId: 'CUST-003',
      customerEmail: 'accounts@freshfoods.com',
      customerAddress: '456 Food Street, Fresh City, FC 67890',
      customerPhone: '+1-555-0102',
      dateCompleted: '2024-01-24',
      totalSamples: 3,
      totalTests: 5,
      totalCost: 1850.00,
      currency: 'USD',
      paymentTerms: '15 days',
      invoiceGenerated: false,
      samples: [
        {
          id: 'S003',
          sampleId: 'SMP-003',
          sampleName: 'Organic Spinach',
          commodity: 'Vegetables',
          tests: [
            { id: 'T005', testName: 'Pesticide Residue', testType: 'Chemical', cost: 400.00, completedDate: '2024-01-22', analyst: 'Dr. Alex Chen' },
            { id: 'T006', testName: 'Nutritional Analysis', testType: 'Chemical', cost: 200.00, completedDate: '2024-01-23', analyst: 'Dr. Emma Davis' }
          ]
        }
      ]
    },
    {
      id: 'CO003',
      orderId: 'ORD-2024-005',
      customerName: 'Quality Assurance Co',
      customerId: 'CUST-005',
      customerEmail: 'billing@qa-co.com',
      customerAddress: '789 Quality Lane, QA City, QC 54321',
      customerPhone: '+1-555-0103',
      dateCompleted: '2024-01-23',
      totalSamples: 1,
      totalTests: 3,
      totalCost: 950.00,
      currency: 'USD',
      paymentTerms: '30 days',
      invoiceGenerated: true,
      invoiceId: 'INV-2024-001',
      samples: [
        {
          id: 'S004',
          sampleId: 'SMP-004',
          sampleName: 'Industrial Lubricant',
          commodity: 'Industrial',
          tests: [
            { id: 'T007', testName: 'Viscosity Test', testType: 'Physical', cost: 180.00, completedDate: '2024-01-21', analyst: 'Dr. Tom Wilson' },
            { id: 'T008', testName: 'Flash Point', testType: 'Physical', cost: 220.00, completedDate: '2024-01-22', analyst: 'Dr. Lisa Brown' },
            { id: 'T009', testName: 'Contamination Analysis', testType: 'Chemical', cost: 350.00, completedDate: '2024-01-23', analyst: 'Dr. Robert Lee' }
          ]
        }
      ]
    }
  ]);

  // Mock data for invoice history
  const [invoiceHistory] = useState<Invoice[]>([
    {
      id: 'INV001',
      invoiceNumber: 'INV-2024-001',
      orderId: 'ORD-2024-005',
      customerName: 'Quality Assurance Co',
      customerId: 'CUST-005',
      invoiceDate: '2024-01-23',
      dueDate: '2024-02-22',
      totalAmount: 950.00,
      currency: 'USD',
      status: 'Sent',
      generatedBy: 'Admin User',
      paymentTerms: '30 days',
      samples: []
    },
    {
      id: 'INV002',
      invoiceNumber: 'INV-2024-002',
      orderId: 'ORD-2024-002',
      customerName: 'XYZ Industries',
      customerId: 'CUST-002',
      invoiceDate: '2024-01-20',
      dueDate: '2024-02-04',
      totalAmount: 1200.00,
      currency: 'USD',
      status: 'Paid',
      generatedBy: 'Finance User',
      paymentTerms: '15 days',
      samples: []
    },
    {
      id: 'INV003',
      invoiceNumber: 'INV-2024-003',
      orderId: 'ORD-2024-004',
      customerName: 'Global Traders',
      customerId: 'CUST-004',
      invoiceDate: '2024-01-18',
      dueDate: '2024-02-17',
      totalAmount: 3200.00,
      currency: 'USD',
      status: 'Overdue',
      generatedBy: 'Admin User',
      paymentTerms: '30 days',
      samples: []
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Generated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Sent':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const nextNumber = invoiceHistory.length + 1;
    return `INV-${year}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleGenerateInvoice = (order: CompletedOrder) => {
    const invoiceNumber = generateInvoiceNumber();
    
    confirmAction(
      'Generate Invoice',
      `Generate invoice ${invoiceNumber} for order ${order.orderId}? Total amount: ${order.currency} ${order.totalCost.toFixed(2)}`,
      'Generate Invoice'
    ).then((confirmed) => {
      if (confirmed) {
        // Create new invoice object
        const newInvoice: Invoice = {
          id: `INV${Date.now()}`,
          invoiceNumber,
          orderId: order.orderId,
          customerName: order.customerName,
          customerId: order.customerId,
          invoiceDate: new Date().toISOString().split('T')[0],
          dueDate: calculateDueDate(order.paymentTerms),
          totalAmount: order.totalCost,
          currency: order.currency,
          status: 'Generated',
          generatedBy: 'Current User', // In real app, get from auth context
          paymentTerms: order.paymentTerms,
          samples: order.samples
        };
        
        setSelectedInvoice(newInvoice);
        setIsInvoicePreviewOpen(true);
        
        console.log('Invoice generated:', newInvoice);
        // In real implementation, this would save to database
      }
    });
  };

  const calculateDueDate = (paymentTerms: string): string => {
    const today = new Date();
    const days = parseInt(paymentTerms.split(' ')[0]);
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceHistoryOpen(true);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    console.log('Printing invoice:', invoice.invoiceNumber);
    window.print();
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Downloading invoice:', invoice.invoiceNumber);
    // In real implementation, this would generate and download PDF
  };

  // Filter logic for invoice history
  const filteredInvoices = useMemo(() => {
    return invoiceHistory.filter(invoice => {
      const matchesOrderId = !filters.orderId || 
        invoice.orderId.toLowerCase().includes(filters.orderId.toLowerCase());
      
      const matchesCustomer = !filters.customerName || 
        invoice.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
      
      const matchesStatus = !filters.invoiceStatus || 
        invoice.status === filters.invoiceStatus;

      return matchesOrderId && matchesCustomer && matchesStatus;
    });
  }, [invoiceHistory, filters]);

  const handleFilterChange = (filterKey: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      orderId: '',
      customerName: '',
      invoiceStatus: '',
      dateRange: ''
    });
  };

  // Define columns for completed orders table
  const orderColumns: Column[] = [
    {
      key: 'orderId',
      title: 'Order Details',
      render: (value: any, order: CompletedOrder) => (
        <div className="flex items-center">
          <Package className="w-4 h-4 text-blue-500 mr-2" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{order.orderId}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {order.totalSamples} samples, {order.totalTests} tests
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value: any, order: CompletedOrder) => (
        <div className="flex items-center">
          <Building2 className="w-4 h-4 text-green-500 mr-2" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{order.customerName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{order.customerId}</div>
          </div>
        </div>
      )
    },
    {
      key: 'completion',
      title: 'Completion',
      render: (value: any, order: CompletedOrder) => (
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 text-orange-500 mr-2" />
          <div>
            <div className="text-sm text-gray-900 dark:text-white">{order.dateCompleted}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Terms: {order.paymentTerms}</div>
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Total Amount',
      render: (value: any, order: CompletedOrder) => (
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-green-600 mr-2" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {order.currency} {order.totalCost.toFixed(2)}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Invoice Status',
      render: (value: any, order: CompletedOrder) => (
        <div>
          {order.invoiceGenerated ? (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Generated
            </span>
          ) : (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              Pending
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, order: CompletedOrder) => (
        <div className="flex items-center justify-center space-x-2">
          {!order.invoiceGenerated ? (
            <motion.button
              onClick={() => handleGenerateInvoice(order)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              title="Generate Invoice"
            >
              <Receipt className="w-4 h-4" />
            </motion.button>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {order.invoiceId}
            </span>
          )}
        </div>
      )
    }
  ];

  // Define columns for invoice history table
  const invoiceColumns: Column[] = [
    {
      key: 'invoiceNumber',
      title: 'Invoice',
      render: (value: any, invoice: Invoice) => (
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-blue-500 mr-2" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{invoice.invoiceNumber}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{invoice.orderId}</div>
          </div>
        </div>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value: any, invoice: Invoice) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{invoice.customerName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{invoice.customerId}</div>
        </div>
      )
    },
    {
      key: 'dates',
      title: 'Dates',
      render: (value: any, invoice: Invoice) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-white">Issued: {invoice.invoiceDate}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Due: {invoice.dueDate}</div>
        </div>
      )
    },
    {
      key: 'amount',
      title: 'Amount',
      render: (value: any, invoice: Invoice) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          {invoice.currency} {invoice.totalAmount.toFixed(2)}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, invoice: Invoice) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
          {invoice.status}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, invoice: Invoice) => (
        <div className="flex items-center justify-center space-x-2">
          <motion.button
            onClick={() => handleViewInvoice(invoice)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Invoice"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => handleDownloadInvoice(invoice)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            title="Download Invoice"
          >
            <Download className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => handlePrintInvoice(invoice)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            title="Print Invoice"
          >
            <Printer className="w-4 h-4" />
          </motion.button>
        </div>
      )
    }
  ];

  const getBreadcrumbItems = () => {
    return [
      { label: 'Invoices' }
    ];
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Generated', label: 'Generated' },
    { value: 'Sent', label: 'Sent' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Overdue', label: 'Overdue' }
  ];

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={getBreadcrumbItems()} />

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Generate and manage invoices for completed laboratory orders
          </p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
      >
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            activeTab === 'pending'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pending Invoices ({completedOrders.filter(o => !o.invoiceGenerated).length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            activeTab === 'history'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Invoice History ({invoiceHistory.length})
        </button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedOrders.filter(o => !o.invoiceGenerated).length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Generated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {invoiceHistory.filter(i => i.status === 'Generated').length}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {invoiceHistory.filter(i => i.status === 'Paid').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${invoiceHistory.reduce((sum, i) => sum + i.totalAmount, 0).toFixed(0)}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'pending' ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Completed Orders - Pending Invoice Generation
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Orders that have been completed and are ready for invoicing
              </p>
            </div>
            <DataTable
              data={completedOrders.filter(order => !order.invoiceGenerated)}
              columns={orderColumns}
              searchable
              pagination
              searchPlaceholder="Search orders by ID or customer name..."
            />
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filters for Invoice History */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Invoices</h3>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400 rounded-full">
                      {activeFiltersCount} active
                    </span>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <motion.button
                    onClick={clearFilters}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </motion.button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="order-filter">Order ID</Label>
                  <Input
                    id="order-filter"
                    type="text"
                    placeholder="Search Order ID..."
                    value={filters.orderId}
                    onChange={(e) => handleFilterChange('orderId', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-filter">Customer Name</Label>
                  <Input
                    id="customer-filter"
                    type="text"
                    placeholder="Search Customer..."
                    value={filters.customerName}
                    onChange={(e) => handleFilterChange('customerName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status-filter">Invoice Status</Label>
                  <CustomSelect
                    id="status-filter"
                    value={filters.invoiceStatus}
                    onChange={(value) => handleFilterChange('invoiceStatus', value)}
                    options={statusOptions}
                  />
                </div>
              </div>
            </div>

            {/* Invoice History Table */}
            <div className="card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Invoice History
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Showing {filteredInvoices.length} of {invoiceHistory.length} invoices
                    </p>
                  </div>
                </div>
              </div>
              <DataTable
                data={filteredInvoices}
                columns={invoiceColumns}
                searchable
                pagination
                searchPlaceholder="Search invoices..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Preview Drawer */}
      <Drawer
        isOpen={isInvoicePreviewOpen}
        onClose={() => setIsInvoicePreviewOpen(false)}
        title={`Invoice Preview - ${selectedInvoice?.invoiceNumber || ''}`}
        size="3xl"
      >
        {selectedInvoice && (
          <div className="p-6 space-y-6">
            {/* Invoice Header */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    INVOICE
                  </h2>
                  <p className="text-blue-700 dark:text-blue-300">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700 dark:text-blue-300">Invoice Date</p>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">{selectedInvoice.invoiceDate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Bill To:</h3>
                  <div className="text-blue-700 dark:text-blue-300">
                    <p className="font-medium">{selectedInvoice.customerName}</p>
                    <p className="text-sm">{selectedInvoice.customerId}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Order Details:</h3>
                  <div className="text-blue-700 dark:text-blue-300">
                    <p>Order ID: {selectedInvoice.orderId}</p>
                    <p>Payment Terms: {selectedInvoice.paymentTerms}</p>
                    <p>Due Date: {selectedInvoice.dueDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedInvoice.samples?.map((sample, index) => 
                    sample.tests?.map((test, testIndex) => (
                      <tr key={`${index}-${testIndex}`} className="bg-white dark:bg-gray-800">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {test.testName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Sample: {sample.sampleName} ({sample.commodity})
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                          1
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                          {selectedInvoice.currency} {test.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      Total Amount:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-xl text-gray-900 dark:text-white">
                      {selectedInvoice.currency} {selectedInvoice.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                onClick={() => setIsInvoicePreviewOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors duration-200"
              >
                Close
              </motion.button>
              <motion.button
                onClick={() => handlePrintInvoice(selectedInvoice)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors duration-200"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </motion.button>
              <motion.button
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </motion.button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Invoice History Detail Drawer */}
      <Drawer
        isOpen={isInvoiceHistoryOpen}
        onClose={() => setIsInvoiceHistoryOpen(false)}
        title={`Invoice Details - ${selectedInvoice?.invoiceNumber || ''}`}
        size="2xl"
      >
        {selectedInvoice && (
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Invoice Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Invoice Number:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Order ID:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInvoice.orderId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Customer:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInvoice.customerName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                  <p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                      {selectedInvoice.status}
                    </span>
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Invoice Date:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInvoice.invoiceDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Due Date:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInvoice.dueDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount:</span>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {selectedInvoice.currency} {selectedInvoice.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Generated By:</span>
                  <p className="text-gray-900 dark:text-white">{selectedInvoice.generatedBy}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <motion.button
                onClick={() => setIsInvoiceHistoryOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors duration-200"
              >
                Close
              </motion.button>
              <motion.button
                onClick={() => handleDownloadInvoice(selectedInvoice)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </motion.button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Invoices; 