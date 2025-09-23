import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Package,
  User,
  Calendar as CalendarIcon,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  RotateCcw,
  UserCog
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Breadcrumb from '../components/Breadcrumb';
import Input from '../components/Input';
import Label from '../components/Label';
import CustomSelect from '../components/CustomSelect';
import { useConfirmation } from '../hooks/useConfirmation';

interface ReturnedReport {
  id: string;
  reportId: string;
  orderId: string;
  sampleId: string;
  customerName: string;
  customerId: string;
  dateReturned: string;
  returnReason: string;
  originalApprovalDate: string;
  status: 'Returned' | 'Reopened' | 'Under Review' | 'Reprocessing';
  deliveryPreference: 'Email' | 'Courier' | 'Collect by Customer';
  customerEmail: string;
  reportType: string;
  returnedBy: string;
  assignedAnalyst: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface FilterState {
  orderId: string;
  sampleId: string;
  reportId: string;
  status: string;
}

const ManageOrders: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReturnedReport | null>(null);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    orderId: '',
    sampleId: '',
    reportId: '',
    status: ''
  });
  
  const { confirmAction } = useConfirmation();

  // Mock data for returned reports
  const [returnedReports] = useState<ReturnedReport[]>([
    {
      id: 'RR001',
      reportId: 'RPT-2024-002',
      orderId: 'ORD-2024-001',
      sampleId: 'SMP-002',
      customerName: 'ABC Corporation',
      customerId: 'CUST-001',
      dateReturned: '2024-01-25',
      returnReason: 'Incomplete microbiological analysis - additional testing required for E.coli confirmation',
      originalApprovalDate: '2024-01-20',
      status: 'Returned',
      deliveryPreference: 'Email',
      customerEmail: 'quality@abccorp.com',
      reportType: 'Microbiological Analysis Report',
      returnedBy: 'Dr. Sarah Wilson',
      assignedAnalyst: 'Dr. John Smith',
      priority: 'High'
    },
    {
      id: 'RR002',
      reportId: 'RPT-2024-005',
      orderId: 'ORD-2024-004',
      sampleId: 'SMP-005',
      customerName: 'Global Traders',
      customerId: 'CUST-004',
      dateReturned: '2024-01-24',
      returnReason: 'Heavy metals analysis values need verification - repeat testing requested',
      originalApprovalDate: '2024-01-22',
      status: 'Reopened',
      deliveryPreference: 'Courier',
      customerEmail: 'reports@globaltraders.com',
      reportType: 'Heavy Metals Analysis Report',
      returnedBy: 'Dr. Tom Wilson',
      assignedAnalyst: 'Dr. Mike Johnson',
      priority: 'Medium'
    },
    {
      id: 'RR003',
      reportId: 'RPT-2024-007',
      orderId: 'ORD-2024-005',
      sampleId: 'SMP-007',
      customerName: 'Fresh Foods Ltd',
      customerId: 'CUST-003',
      dateReturned: '2024-01-23',
      returnReason: 'Protein analysis method discrepancy - results inconsistent with previous batches',
      originalApprovalDate: '2024-01-21',
      status: 'Under Review',
      deliveryPreference: 'Collect by Customer',
      customerEmail: 'qa@freshfoods.com',
      reportType: 'Nutritional Analysis Report',
      returnedBy: 'Dr. Emma Davis',
      assignedAnalyst: 'Dr. Jane Doe',
      priority: 'High'
    },
    {
      id: 'RR004',
      reportId: 'RPT-2024-003',
      orderId: 'ORD-2024-002',
      sampleId: 'SMP-003',
      customerName: 'XYZ Industries',
      customerId: 'CUST-002',
      dateReturned: '2024-01-22',
      returnReason: 'Pesticide residue detection limits need clarification - regulatory compliance verification required',
      originalApprovalDate: '2024-01-21',
      status: 'Reprocessing',
      deliveryPreference: 'Email',
      customerEmail: 'lab@xyzind.com',
      reportType: 'Pesticide Residue Report',
      returnedBy: 'Dr. Mike Johnson',
      assignedAnalyst: 'Dr. Alex Chen',
      priority: 'Medium'
    },
    {
      id: 'RR005',
      reportId: 'RPT-2024-008',
      orderId: 'ORD-2024-006',
      sampleId: 'SMP-008',
      customerName: 'Quality Assurance Co',
      customerId: 'CUST-005',
      dateReturned: '2024-01-21',
      returnReason: 'Calibration certificate expired during testing period - revalidation required',
      originalApprovalDate: '2024-01-19',
      status: 'Returned',
      deliveryPreference: 'Email',
      customerEmail: 'testing@qa-co.com',
      reportType: 'Equipment Validation Report',
      returnedBy: 'Dr. Sarah Wilson',
      assignedAnalyst: 'Dr. Tom Wilson',
      priority: 'Low'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Returned':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Reopened':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Reprocessing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
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

  // Multi-filter logic
  const filteredReports = useMemo(() => {
    return returnedReports.filter(report => {
      const matchesOrderId = !filters.orderId || 
        report.orderId.toLowerCase().includes(filters.orderId.toLowerCase());
      
      const matchesSampleId = !filters.sampleId || 
        report.sampleId.toLowerCase().includes(filters.sampleId.toLowerCase());
      
      const matchesReportId = !filters.reportId || 
        report.reportId.toLowerCase().includes(filters.reportId.toLowerCase());
      
      const matchesStatus = !filters.status || 
        report.status === filters.status;

      return matchesOrderId && matchesSampleId && matchesReportId && matchesStatus;
    });
  }, [returnedReports, filters]);

  const handleFilterChange = (filterKey: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      orderId: '',
      sampleId: '',
      reportId: '',
      status: ''
    });
  };

  const handleReopenReport = (report: ReturnedReport) => {
    confirmAction(
      'Reopen Sample Report',
      `Reopen the report ${report.reportId} for sample ${report.sampleId}? This will allow the sample to be reprocessed and the report to be regenerated.`,
      'Reopen Report'
    ).then((confirmed) => {
      if (confirmed) {
        console.log('Report reopened:', report.reportId);
        // Update report status logic here
        // In a real implementation, this would call an API to update the report status
      }
    });
  };

  const handleBulkReopen = () => {
    if (selectedReports.length === 0) return;
    
    confirmAction(
      'Bulk Reopen Reports',
      `Reopen ${selectedReports.length} selected report(s)? This will allow the samples to be reprocessed.`,
      'Reopen Selected Reports'
    ).then((confirmed) => {
      if (confirmed) {
        console.log('Bulk reopen completed for:', selectedReports);
        setSelectedReports([]);
        // Update multiple reports status logic here
      }
    });
  };

  const handleViewReport = (report: ReturnedReport) => {
    setSelectedReport(report);
    // In a real implementation, this would open a detailed view or navigate to report details
    console.log('Viewing report:', report.reportId);
  };

  // Define columns for the DataTable
  const reportColumns: Column[] = [
    {
      key: 'reportId',
      title: 'Report ID',
      render: (value: any, report: ReturnedReport) => (
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-blue-500 mr-2" />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{report.reportId}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{report.reportType}</div>
          </div>
        </div>
      )
    },
    {
      key: 'orderSample',
      title: 'Order & Sample',
      render: (value: any, report: ReturnedReport) => (
        <div>
          <div className="flex items-center mb-1">
            <Building2 className="w-3 h-3 text-green-500 mr-1" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{report.orderId}</span>
          </div>
          <div className="flex items-center">
            <Package className="w-3 h-3 text-indigo-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{report.sampleId}</span>
          </div>
        </div>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (value: any, report: ReturnedReport) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{report.customerName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{report.assignedAnalyst}</div>
        </div>
      )
    },
    {
      key: 'returnInfo',
      title: 'Return Details',
      render: (value: any, report: ReturnedReport) => (
        <div>
          <div className="flex items-center mb-1">
            <CalendarIcon className="w-3 h-3 text-orange-500 mr-1" />
            <span className="text-sm text-gray-900 dark:text-white">{report.dateReturned}</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate" title={report.returnReason}>
            {report.returnReason}
          </div>
        </div>
      )
    },
    {
      key: 'priority',
      title: 'Priority',
      render: (value: any, report: ReturnedReport) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
          {report.priority}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, report: ReturnedReport) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, report: ReturnedReport) => (
        <div className="flex items-center justify-center space-x-2">
          <motion.button
            onClick={() => handleViewReport(report)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Report Details"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          {(report.status === 'Returned' || report.status === 'Under Review') && (
            <motion.button
              onClick={() => handleReopenReport(report)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              title="Reopen Report"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      )
    }
  ];

  const getBreadcrumbItems = () => {
    return [
      { label: 'Manage Orders/Samples' }
    ];
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Returned', label: 'Returned' },
    { value: 'Reopened', label: 'Reopened' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Reprocessing', label: 'Reprocessing' }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Orders/Samples</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Super User view to manage returned sample reports and reopen for reprocessing
          </p>
        </div>
        
        {selectedReports.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedReports.length} selected
            </span>
            <motion.button
              onClick={handleBulkReopen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reopen Selected
            </motion.button>
          </div>
        )}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Returned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{returnedReports.length}</p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Awaiting Reopen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {returnedReports.filter(r => r.status === 'Returned').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reopened</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {returnedReports.filter(r => r.status === 'Reopened').length}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {returnedReports.filter(r => r.priority === 'High').length}
              </p>
            </div>
            <div className="p-3 bg-red-600 rounded-full">
              <UserCog className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Label htmlFor="sample-filter">Sample ID</Label>
            <Input
              id="sample-filter"
              type="text"
              placeholder="Search Sample ID..."
              value={filters.sampleId}
              onChange={(e) => handleFilterChange('sampleId', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="report-filter">Report ID</Label>
            <Input
              id="report-filter"
              type="text"
              placeholder="Search Report ID..."
              value={filters.reportId}
              onChange={(e) => handleFilterChange('reportId', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <CustomSelect
              id="status-filter"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              options={statusOptions}
            />
          </div>
        </div>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
      >
        <div>
          Showing <span className="font-medium text-gray-900 dark:text-white">{filteredReports.length}</span> of{' '}
          <span className="font-medium text-gray-900 dark:text-white">{returnedReports.length}</span> returned reports
        </div>
        {activeFiltersCount > 0 && (
          <div className="text-primary-600 dark:text-primary-400">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
          </div>
        )}
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <DataTable
          data={filteredReports}
          columns={reportColumns}
          searchable
          pagination
          searchPlaceholder="Search returned reports..."
        />
      </motion.div>
    </div>
  );
};

export default ManageOrders; 