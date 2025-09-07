import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  TestTube, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Bell,
  Settings
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: 'Total Tests',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: TestTube,
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Pending Reports',
      value: '23',
      change: '-8%',
      changeType: 'negative',
      icon: FileText,
      color: 'orange'
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      change: '+2%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'emerald'
    }
  ];

  const recentTests = [
    { id: 'T001', name: 'Pesticide Analysis', status: 'Completed', date: '2024-01-15', client: 'ABC Corp' },
    { id: 'T002', name: 'Heavy Metal Test', status: 'In Progress', date: '2024-01-14', client: 'XYZ Ltd' },
    { id: 'T003', name: 'Microbiological Analysis', status: 'Pending', date: '2024-01-13', client: 'DEF Inc' },
    { id: 'T004', name: 'Nutritional Analysis', status: 'Completed', date: '2024-01-12', client: 'GHI Corp' },
    { id: 'T005', name: 'Allergen Testing', status: 'In Progress', date: '2024-01-11', client: 'JKL Ltd' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'In Progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getMetricIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
      green: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
      orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400',
      emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
        
        <div className="flex items-center justify-between relative">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening in your lab today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-all duration-300"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-3xl hover:shadow-black/15 dark:hover:shadow-black/40 hover:-translate-y-1"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4 relative">
              <div className={`p-3 rounded-xl ${getMetricIconColor(metric.color)}`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div className={`text-sm font-medium ${
                metric.changeType === 'positive' 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {metric.change}
              </div>
            </div>
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {metric.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-3xl hover:shadow-black/15 dark:hover:shadow-black/40 hover:-translate-y-1"
        >
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-6 relative">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
            >
              View All
            </motion.button>
          </div>
          
          <div className="space-y-4 relative">
            {[
              { icon: TestTube, text: 'New test request from ABC Corp', time: '2 min ago', color: 'blue' },
              { icon: CheckCircle, text: 'Pesticide analysis completed', time: '15 min ago', color: 'green' },
              { icon: AlertCircle, text: 'Equipment maintenance due', time: '1 hour ago', color: 'orange' },
              { icon: Users, text: 'New user registered', time: '2 hours ago', color: 'purple' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300"
              >
                <div className={`p-2 rounded-lg ${
                  activity.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  activity.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  activity.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                  'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                }`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Tests */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-3xl hover:shadow-black/15 dark:hover:shadow-black/40 hover:-translate-y-1"
        >
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-6 relative">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Tests
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-200"
            >
              View All
            </motion.button>
          </div>
          
          <div className="space-y-3 relative">
            {recentTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                    <TestTube className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {test.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {test.client} • {test.date}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                  {test.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-3xl hover:shadow-black/15 dark:hover:shadow-black/40 hover:-translate-y-1"
      >
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 relative">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {[
            { icon: TestTube, label: 'New Test', color: 'blue' },
            { icon: FileText, label: 'Generate Report', color: 'green' },
            { icon: Users, label: 'Add User', color: 'purple' },
            { icon: BarChart3, label: 'View Analytics', color: 'orange' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-xl bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-200/40 dark:border-gray-600/40 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30`}
            >
              <div className={`p-3 rounded-xl mx-auto mb-3 w-fit ${
                action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                action.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
              }`}>
                <action.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {action.label}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
