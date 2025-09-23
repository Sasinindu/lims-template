import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Package,
  User,
  Calendar as CalendarIcon,
  Eye,
  Mail,
  Truck,
  UserCheck,
  Send,
  Printer,
  Search,
  Filter,
  Download,
  X,
  Check,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';
import Breadcrumb from '../components/Breadcrumb';
import Drawer from '../components/Drawer';
import Input from '../components/Input';
import Label from '../components/Label';
import CustomSelect from '../components/CustomSelect';
import { useConfirmation } from '../hooks/useConfirmation';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  deliveryPreference: 'Email' | 'Courier' | 'Collect by Customer';
  company: string;
  address: string;
}

interface Report {
  id: string;
  reportId: string;
  orderId: string;
  sampleId: string;
  customerName: string;
  customerId: string;
  dateApproved: string;
  status: 'Pending Send' | 'Sent' | 'Printed for Courier' | 'Printed for Collection';
  deliveryPreference: 'Email' | 'Courier' | 'Collect by Customer';
  customerEmail: string;
  reportType: string;
  testResults: any[];
  approvedBy: string;
}

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [emailContent, setEmailContent] = useState({
    to: '',
    subject: '',
    message: 'Please find attached the laboratory report for your sample.'
  });
  
  const { confirmAction } = useConfirmation();

  // Mock data for approved reports
  const [reports] = useState<Report[]>([
    {
      id: 'R001',
      reportId: 'RPT-2024-001',
      orderId: 'ORD-2024-001',
      sampleId: 'SMP-001',
      customerName: 'ABC Corporation',
      customerId: 'CUST-001',
      dateApproved: '2024-01-20',
      status: 'Pending Send',
      deliveryPreference: 'Email',
      customerEmail: 'quality@abccorp.com',
      reportType: 'Chemical Analysis Report',
      testResults: [],
      approvedBy: 'Dr. Sarah Wilson'
    },
    {
      id: 'R002',
      reportId: 'RPT-2024-002',
      orderId: 'ORD-2024-001',
      sampleId: 'SMP-002',
      customerName: 'ABC Corporation',
      customerId: 'CUST-001',
      dateApproved: '2024-01-20',
      status: 'Sent',
      deliveryPreference: 'Email',
      customerEmail: 'quality@abccorp.com',
      reportType: 'Microbiological Analysis Report',
      testResults: [],
      approvedBy: 'Dr. Sarah Wilson'
    },
    {
      id: 'R003',
      reportId: 'RPT-2024-003',
      orderId: 'ORD-2024-002',
      sampleId: 'SMP-003',
      customerName: 'XYZ Industries',
      customerId: 'CUST-002',
      dateApproved: '2024-01-21',
      status: 'Pending Send',
      deliveryPreference: 'Courier',
      customerEmail: 'lab@xyzind.com',
      reportType: 'Pesticide Residue Report',
      testResults: [],
      approvedBy: 'Dr. Mike Johnson'
    },
    {
      id: 'R004',
      reportId: 'RPT-2024-004',
      orderId: 'ORD-2024-003',
      sampleId: 'SMP-004',
      customerName: 'Fresh Foods Ltd',
      customerId: 'CUST-003',
      dateApproved: '2024-01-21',
      status: 'Printed for Collection',
      deliveryPreference: 'Collect by Customer',
      customerEmail: 'qa@freshfoods.com',
      reportType: 'Nutritional Analysis Report',
      testResults: [],
      approvedBy: 'Dr. Emma Davis'
    },
    {
      id: 'R005',
      reportId: 'RPT-2024-005',
      orderId: 'ORD-2024-004',
      sampleId: 'SMP-005',
      customerName: 'Global Traders',
      customerId: 'CUST-004',
      dateApproved: '2024-01-22',
      status: 'Printed for Courier',
      deliveryPreference: 'Courier',
      customerEmail: 'reports@globaltraders.com',
      reportType: 'Heavy Metals Analysis Report',
      testResults: [],
      approvedBy: 'Dr. Tom Wilson'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Send':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Sent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Printed for Courier':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Printed for Collection':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDeliveryIcon = (preference: string) => {
    switch (preference) {
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'Courier':
        return <Truck className="w-4 h-4 text-green-500" />;
      case 'Collect by Customer':
        return <UserCheck className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const handlePreviewReport = (report: Report) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  const handleSendReport = (report: Report) => {
    setSelectedReport(report);
    if (report.deliveryPreference === 'Email') {
      setEmailContent({
        to: report.customerEmail,
        subject: `Laboratory Report - ${report.reportId}`,
        message: `Dear ${report.customerName},\n\nPlease find attached the laboratory report for your sample ${report.sampleId}.\n\nReport Details:\n- Report ID: ${report.reportId}\n- Order ID: ${report.orderId}\n- Date Approved: ${report.dateApproved}\n\nThank you for choosing our laboratory services.\n\nBest regards,\nLaboratory Team`
      });
      setIsSendModalOpen(true);
    } else {
      handlePrintReport(report);
    }
  };

  const handlePrintReport = (report: Report) => {
    console.log('Printing report:', report.reportId);
    
    const newStatus = report.deliveryPreference === 'Courier' 
      ? 'Printed for Courier' 
      : 'Printed for Collection';
      
    confirmAction(
      'Print Report',
      `Print the report for ${report.customerName}? The status will be updated to "${newStatus}".`,
      'Print Report'
    ).then((confirmed) => {
      if (confirmed) {
        // Update report status
        console.log('Report printed and status updated');
        window.print(); // Trigger browser print
      }
    });
  };

  const handleEmailSend = () => {
    if (!selectedReport) return;
    
    confirmAction(
      'Send Email',
      `Send the report via email to ${emailContent.to}?`,
      'Send Email'
    ).then((confirmed) => {
      if (confirmed) {
        // Update report status to sent
        console.log('Email sent successfully');
        setIsSendModalOpen(false);
        setSelectedReport(null);
      }
    });
  };

  const handleBulkAction = (action: 'send' | 'print') => {
    if (selectedReports.length === 0) return;
    
    const actionText = action === 'send' ? 'send' : 'print';
    confirmAction(
      `Bulk ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${selectedReports.length} selected report(s)?`,
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Reports`
    ).then((confirmed) => {
      if (confirmed) {
        console.log(`Bulk ${action} completed for:`, selectedReports);
        setSelectedReports([]);
      }
    });
  };

  // Define columns for the Reports DataTable
  const reportColumns: Column[] = [
    {
      key: 'reportId',
      title: 'Report ID',
      render: (value: any, report: Report) => (
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
      key: 'orderInfo',
      title: 'Order & Sample',
      render: (value: any, report: Report) => (
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
      key: 'customerInfo',
      title: 'Customer',
      render: (value: any, report: Report) => (
        <div className="flex items-center">
          <div className="mr-2">
            {getDeliveryIcon(report.deliveryPreference)}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{report.customerName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{report.deliveryPreference}</div>
          </div>
        </div>
      )
    },
    {
      key: 'dateApproved',
      title: 'Date Approved',
      render: (value: any, report: Report) => (
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 text-orange-500 mr-2" />
          <div>
            <div className="text-sm text-gray-900 dark:text-white">{report.dateApproved}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">By {report.approvedBy}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: any, report: Report) => (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, report: Report) => (
        <div className="flex items-center justify-center space-x-2">
          <motion.button
            onClick={() => handlePreviewReport(report)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="Preview Report"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          {report.status === 'Pending Send' && (
            <motion.button
              onClick={() => handleSendReport(report)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              title={`Send via ${report.deliveryPreference}`}
            >
              {report.deliveryPreference === 'Email' ? (
                <Send className="w-4 h-4" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
            </motion.button>
          )}
        </div>
      )
    }
  ];

  const getBreadcrumbItems = () => {
    return [
      { label: 'Reports' }
    ];
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and send approved laboratory reports to customers
          </p>
        </div>
        
        {selectedReports.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedReports.length} selected
            </span>
            <motion.button
              onClick={() => handleBulkAction('send')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Selected
            </motion.button>
            <motion.button
              onClick={() => handleBulkAction('print')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Selected
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Send</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'Pending Send').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'Sent').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Printed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.filter(r => r.status.includes('Printed')).length}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <Printer className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <DataTable
          data={reports}
          columns={reportColumns}
          searchable
          pagination
          searchPlaceholder="Search by Report ID, Order ID, Sample ID, or Customer..."
        />
      </motion.div>

      {/* Report Preview Drawer */}
      <Drawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Report Preview - ${selectedReport?.reportId || ''}`}
        size="3xl"
      >
        {selectedReport && (
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Laboratory Report Preview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Report ID:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedReport.reportId}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Order ID:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedReport.orderId}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Sample ID:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedReport.sampleId}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Customer:</span>
                  <p className="text-blue-900 dark:text-blue-100">{selectedReport.customerName}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Report Content Preview</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Full report content would be displayed here
              </p>
              <div className="flex items-center justify-center space-x-3">
                <motion.button
                  onClick={() => setIsPreviewOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors duration-200"
                >
                  Close Preview
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsPreviewOpen(false);
                    handleSendReport(selectedReport);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
                >
                  {selectedReport.deliveryPreference === 'Email' ? 'Send via Email' : 'Print Report'}
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Email Send Modal */}
      <Drawer
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Report via Email"
        size="2xl"
      >
        {selectedReport && (
          <div className="p-6 space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                Email Report: {selectedReport.reportId}
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Customer: {selectedReport.customerName} | Sample: {selectedReport.sampleId}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email-to">To:</Label>
                <Input
                  id="email-to"
                  type="email"
                  value={emailContent.to}
                  onChange={(e) => setEmailContent(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="Customer email address"
                />
              </div>

              <div>
                <Label htmlFor="email-subject">Subject:</Label>
                <Input
                  id="email-subject"
                  type="text"
                  value={emailContent.subject}
                  onChange={(e) => setEmailContent(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Email subject"
                />
              </div>

              <div>
                <Label htmlFor="email-message">Message:</Label>
                <textarea
                  id="email-message"
                  rows={6}
                  value={emailContent.message}
                  onChange={(e) => setEmailContent(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  placeholder="Email message content"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedReport.reportId}.pdf
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Attachment</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                onClick={() => setIsSendModalOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleEmailSend}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </motion.button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Reports;
