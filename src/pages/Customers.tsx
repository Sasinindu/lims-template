import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import DataTable, { Column } from '../components/DataTable';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock customer data - expanded to show pagination
  const [customers] = useState([
    {
      id: 'C001',
      name: 'ABC Agriculture Ltd',
      contactPerson: 'John Smith',
      email: 'john.smith@abcagriculture.com',
      phone: '+1 (555) 123-4567',
      address: '123 Farm Road, Agricultural District',
      city: 'Springfield',
      country: 'USA',
      website: 'www.abcagriculture.com',
      status: 'Active',
      registrationDate: '2024-01-15',
      lastOrder: '2024-01-20'
    },
    {
      id: 'C002',
      name: 'Green Valley Farms',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.j@greenvalley.com',
      phone: '+1 (555) 234-5678',
      address: '456 Valley Street, Green District',
      city: 'Riverside',
      country: 'USA',
      website: 'www.greenvalley.com',
      status: 'Active',
      registrationDate: '2024-01-10',
      lastOrder: '2024-01-18'
    },
    {
      id: 'C003',
      name: 'Organic Harvest Co',
      contactPerson: 'Mike Chen',
      email: 'mike.chen@organicharvest.com',
      phone: '+1 (555) 345-6789',
      address: '789 Organic Lane, Eco District',
      city: 'Eco City',
      country: 'Canada',
      website: 'www.organicharvest.com',
      status: 'Inactive',
      registrationDate: '2023-12-20',
      lastOrder: '2023-12-25'
    },
    {
      id: 'C004',
      name: 'Premium Crops Inc',
      contactPerson: 'Emily Rodriguez',
      email: 'emily.r@premiumcrops.com',
      phone: '+1 (555) 456-7890',
      address: '321 Premium Avenue, Quality District',
      city: 'Quality City',
      country: 'USA',
      website: 'www.premiumcrops.com',
      status: 'Active',
      registrationDate: '2024-01-05',
      lastOrder: '2024-01-22'
    },
    {
      id: 'C005',
      name: 'Sustainable Agriculture Group',
      contactPerson: 'David Kim',
      email: 'david.kim@sustainableag.com',
      phone: '+1 (555) 567-8901',
      address: '654 Sustainable Street, Green District',
      city: 'Green City',
      country: 'USA',
      website: 'www.sustainableag.com',
      status: 'Active',
      registrationDate: '2024-01-12',
      lastOrder: '2024-01-19'
    },
    {
      id: 'C006',
      name: 'Global Food Solutions',
      contactPerson: 'Lisa Thompson',
      email: 'lisa.t@globalfood.com',
      phone: '+1 (555) 678-9012',
      address: '987 Global Plaza, International District',
      city: 'Metro City',
      country: 'USA',
      website: 'www.globalfood.com',
      status: 'Active',
      registrationDate: '2024-01-08',
      lastOrder: '2024-01-21'
    },
    {
      id: 'C007',
      name: 'Fresh Produce Co',
      contactPerson: 'Robert Wilson',
      email: 'robert.w@freshproduce.com',
      phone: '+1 (555) 789-0123',
      address: '147 Fresh Street, Produce District',
      city: 'Fresh City',
      country: 'USA',
      website: 'www.freshproduce.com',
      status: 'Active',
      registrationDate: '2024-01-14',
      lastOrder: '2024-01-23'
    },
    {
      id: 'C008',
      name: 'Quality Assurance Ltd',
      contactPerson: 'Maria Garcia',
      email: 'maria.g@qualityassurance.com',
      phone: '+1 (555) 890-1234',
      address: '258 Quality Boulevard, Assurance District',
      city: 'Quality Town',
      country: 'USA',
      website: 'www.qualityassurance.com',
      status: 'Active',
      registrationDate: '2024-01-11',
      lastOrder: '2024-01-24'
    },
    {
      id: 'C009',
      name: 'Export Trading Corp',
      contactPerson: 'James Brown',
      email: 'james.b@exporttrading.com',
      phone: '+1 (555) 901-2345',
      address: '369 Export Avenue, Trading District',
      city: 'Export City',
      country: 'USA',
      website: 'www.exporttrading.com',
      status: 'Inactive',
      registrationDate: '2023-11-15',
      lastOrder: '2023-12-10'
    },
    {
      id: 'C010',
      name: 'AgriTech Innovations',
      contactPerson: 'Jennifer Davis',
      email: 'jennifer.d@agritech.com',
      phone: '+1 (555) 012-3456',
      address: '741 AgriTech Park, Innovation District',
      city: 'Tech City',
      country: 'USA',
      website: 'www.agritech.com',
      status: 'Active',
      registrationDate: '2024-01-16',
      lastOrder: '2024-01-25'
    },
    {
      id: 'C011',
      name: 'Farm Fresh Direct',
      contactPerson: 'Michael Taylor',
      email: 'michael.t@farmfresh.com',
      phone: '+1 (555) 123-4567',
      address: '852 Farm Road, Direct District',
      city: 'Farm City',
      country: 'USA',
      website: 'www.farmfresh.com',
      status: 'Active',
      registrationDate: '2024-01-13',
      lastOrder: '2024-01-26'
    },
    {
      id: 'C012',
      name: 'Natural Products Inc',
      contactPerson: 'Amanda White',
      email: 'amanda.w@naturalproducts.com',
      phone: '+1 (555) 234-5678',
      address: '963 Natural Way, Products District',
      city: 'Natural City',
      country: 'USA',
      website: 'www.naturalproducts.com',
      status: 'Active',
      registrationDate: '2024-01-17',
      lastOrder: '2024-01-27'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const columns: Column[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      width: '150px',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Building2 className="w-4 h-4 text-primary-600 mr-2" />
          <span className="font-medium text-primary-600 dark:text-primary-400">{value}</span>
        </div>
      )
    },
    {
      key: 'name',
      title: 'Company Name',
      dataIndex: 'name',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{record.contactPerson}</div>
        </div>
      )
    },
    {
      key: 'contact',
      title: 'Contact Information',
      dataIndex: 'email',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="w-3 h-3 text-gray-400 mr-1" />
            <span className="text-gray-900 dark:text-white">{record.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-3 h-3 text-gray-400 mr-1" />
            <span className="text-gray-600 dark:text-gray-400">{record.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      title: 'Location',
      dataIndex: 'address',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <MapPin className="w-3 h-3 text-gray-400 mr-1" />
            <span className="text-gray-900 dark:text-white">{record.city}, {record.country}</span>
          </div>
          {record.website && (
            <div className="flex items-center text-sm">
              <Globe className="w-3 h-3 text-gray-400 mr-1" />
              <span className="text-blue-600 dark:text-blue-400">{record.website}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      width: '100px',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      )
    }
  ];

  const handleAddCustomer = () => {
    navigate('/customers/add');
  };

  const handleEditCustomer = (record: any) => {
    navigate(`/customers/edit/${record.id}`);
  };

  const handleViewCustomer = (record: any) => {
    navigate(`/customers/view/${record.id}`);
  };

  const handleDeleteCustomer = (record: any) => {
    if (window.confirm(`Are you sure you want to delete customer ${record.name}?`)) {
      // Handle delete logic here
      console.log('Delete customer:', record.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Customers
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage customer information and relationships
        </p>
      </motion.div>

      {/* Customer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{customers.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customers.filter(c => c.status === 'Inactive').length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Customer Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        title="Customer List"
        searchPlaceholder="Search customers..."
        addButtonText="Add Customer"
        onAdd={handleAddCustomer}
        onEdit={handleEditCustomer}
        onView={handleViewCustomer}
        onDelete={handleDeleteCustomer}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={5}
      />
    </div>
  );
};

export default Customers;
