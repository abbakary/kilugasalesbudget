import React, { useState } from 'react';
import StatsCard from '../components/StatsCard';
import { PieChartIcon, TrendingUp, Clock, Download, RefreshCw } from 'lucide-react';
import ExportModal, { ExportConfig } from '../components/ExportModal';

const Dashboard: React.FC = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExport = (config: ExportConfig) => {
    const fileName = `dashboard_report_${config.year}.${config.format === 'excel' ? 'xlsx' : config.format}`;
    showNotification(`Exporting dashboard report as ${fileName}...`, 'success');

    setTimeout(() => {
      showNotification(`Export completed: ${fileName}`, 'success');
    }, 2000);
  };

  const refreshData = () => {
    setLastRefresh(new Date());
    showNotification('Dashboard data refreshed successfully', 'success');
  };

  const statsData = [
    {
      title: 'Total Budget Units',
      value: '5,042',
      subtitle: 'As of current year',
      icon: PieChartIcon,
      color: 'primary' as const,
      trend: { value: '+12.5%', isPositive: true }
    },
    {
      title: 'Total Sales',
      value: '$0',
      subtitle: 'Last Week Analysis',
      icon: TrendingUp,
      color: 'success' as const,
      trend: { value: '0%', isPositive: true }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            <span className="text-gray-500 font-light">Dashboard /</span> Statistics
          </h4>
          <p className="text-sm text-gray-600">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <div key={index} className="col-span-1">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <PieChartIcon className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Budget Planning</p>
              <p className="text-sm text-gray-600">Create new budget</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Sales Analysis</p>
              <p className="text-sm text-gray-600">View sales trends</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Target className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Forecasting</p>
              <p className="text-sm text-gray-600">Generate forecasts</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Stock Alerts</p>
              <p className="text-sm text-gray-600">Manage inventory</p>
            </div>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Export Dashboard Report"
      />
    </div>
  );
};

export default Dashboard;
