import React, { useState } from 'react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import { PieChartIcon, TrendingUp, Clock, Download, RefreshCw, BarChart3, Target, AlertTriangle, Users, Package, MapPin, Building } from 'lucide-react';
import ExportModal, { ExportConfig } from '../components/ExportModal';
import { useAccessControl } from '../contexts/AuthContext';
import { UserType, getUserTypeName } from '../types/auth';

const Dashboard: React.FC = () => {
  const { user, accessPattern, isAdmin, isSalesman, isManager, isSupplyChain, isBranchManager } = useAccessControl();
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

  // Role-specific stats data
  const getStatsData = () => {
    if (isAdmin) {
      return [
        {
          title: 'Total System Users',
          value: '24',
          subtitle: 'Active users',
          icon: Users,
          color: 'primary' as const,
          trend: { value: '+3 new', isPositive: true }
        },
        {
          title: 'Total Sales',
          value: '$2.4M',
          subtitle: 'All regions',
          icon: TrendingUp,
          color: 'success' as const,
          trend: { value: '+18.2%', isPositive: true }
        },
        {
          title: 'System Performance',
          value: '99.2%',
          subtitle: 'Uptime',
          icon: Target,
          color: 'info' as const,
          trend: { value: '+0.1%', isPositive: true }
        },
        {
          title: 'Budget Utilization',
          value: '87%',
          subtitle: 'Organization wide',
          icon: BarChart3,
          color: 'warning' as const,
          trend: { value: '+5%', isPositive: true }
        }
      ];
    } else if (isSalesman) {
      return [
        {
          title: 'My Sales',
          value: '$156K',
          subtitle: 'This month',
          icon: TrendingUp,
          color: 'primary' as const,
          trend: { value: '+12.5%', isPositive: true }
        },
        {
          title: 'My Target',
          value: '87%',
          subtitle: 'Achievement',
          icon: Target,
          color: 'success' as const,
          trend: { value: '+5%', isPositive: true }
        },
        {
          title: 'My Budget',
          value: '$45K',
          subtitle: 'Remaining',
          icon: PieChartIcon,
          color: 'info' as const,
          trend: { value: '-$12K', isPositive: false }
        },
        {
          title: 'Forecast Accuracy',
          value: '94%',
          subtitle: 'Last quarter',
          icon: BarChart3,
          color: 'warning' as const,
          trend: { value: '+2%', isPositive: true }
        }
      ];
    } else if (isManager) {
      return [
        {
          title: 'Department Sales',
          value: '$850K',
          subtitle: user?.department || 'Department',
          icon: Building,
          color: 'primary' as const,
          trend: { value: '+15%', isPositive: true }
        },
        {
          title: 'Team Performance',
          value: '91%',
          subtitle: 'Average achievement',
          icon: Users,
          color: 'success' as const,
          trend: { value: '+8%', isPositive: true }
        },
        {
          title: 'Department Budget',
          value: '$245K',
          subtitle: 'Utilized',
          icon: PieChartIcon,
          color: 'info' as const,
          trend: { value: '73%', isPositive: true }
        },
        {
          title: 'Active Forecasts',
          value: '18',
          subtitle: 'This quarter',
          icon: BarChart3,
          color: 'warning' as const,
          trend: { value: '+3', isPositive: true }
        }
      ];
    } else if (isSupplyChain) {
      return [
        {
          title: 'Inventory Value',
          value: '$1.2M',
          subtitle: 'Current stock',
          icon: Package,
          color: 'primary' as const,
          trend: { value: '+5%', isPositive: true }
        },
        {
          title: 'Stock Accuracy',
          value: '98.5%',
          subtitle: 'System vs actual',
          icon: Target,
          color: 'success' as const,
          trend: { value: '+1.2%', isPositive: true }
        },
        {
          title: 'Orders Processed',
          value: '1,247',
          subtitle: 'This month',
          icon: TrendingUp,
          color: 'info' as const,
          trend: { value: '+156', isPositive: true }
        },
        {
          title: 'Low Stock Items',
          value: '23',
          subtitle: 'Need attention',
          icon: AlertTriangle,
          color: 'warning' as const,
          trend: { value: '-5', isPositive: true }
        }
      ];
    } else if (isBranchManager) {
      return [
        {
          title: 'Branch Sales',
          value: '$425K',
          subtitle: user?.location || 'Location',
          icon: MapPin,
          color: 'primary' as const,
          trend: { value: '+22%', isPositive: true }
        },
        {
          title: 'Local Target',
          value: '95%',
          subtitle: 'Achievement',
          icon: Target,
          color: 'success' as const,
          trend: { value: '+12%', isPositive: true }
        },
        {
          title: 'Branch Budget',
          value: '$89K',
          subtitle: 'Utilized',
          icon: PieChartIcon,
          color: 'info' as const,
          trend: { value: '67%', isPositive: true }
        },
        {
          title: 'Team Size',
          value: '12',
          subtitle: 'Active staff',
          icon: Users,
          color: 'warning' as const,
          trend: { value: '+1', isPositive: true }
        }
      ];
    }
    
    // Default stats
    return [
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
        value: '$2.4M',
        subtitle: 'Current performance',
        icon: TrendingUp,
        color: 'success' as const,
        trend: { value: '+18.2%', isPositive: true }
      },
      {
        title: 'Target Achievement',
        value: '87%',
        subtitle: 'Monthly progress',
        icon: Target,
        color: 'warning' as const,
        trend: { value: '+5.3%', isPositive: true }
      },
      {
        title: 'Active Users',
        value: '45',
        subtitle: 'System users',
        icon: Clock,
        color: 'info' as const,
        trend: { value: '+2', isPositive: true }
      }
    ];
  };

  // Role-specific quick actions
  const getQuickActions = () => {
    const commonActions = [];

    if (isAdmin) {
      commonActions.push(
        {
          icon: Users,
          title: 'User Management',
          description: 'Manage system users',
          color: 'blue-600',
          onClick: () => window.location.href = '/user-management'
        },
        {
          icon: BarChart3,
          title: 'System Reports',
          description: 'View system analytics',
          color: 'green-600',
          onClick: () => showNotification('System reports opened', 'success')
        },
        {
          icon: Target,
          title: 'Global Targets',
          description: 'Set organization goals',
          color: 'purple-600',
          onClick: () => showNotification('Global targets opened', 'success')
        },
        {
          icon: AlertTriangle,
          title: 'System Alerts',
          description: 'Monitor system health',
          color: 'orange-600',
          onClick: () => showNotification('System alerts checked', 'success')
        }
      );
    } else if (isSalesman) {
      commonActions.push(
        {
          icon: PieChartIcon,
          title: 'My Budget',
          description: 'Manage personal budget',
          color: 'blue-600',
          onClick: () => window.location.href = '/sales-budget'
        },
        {
          icon: TrendingUp,
          title: 'Sales Tracking',
          description: 'Track my sales progress',
          color: 'green-600',
          onClick: () => showNotification('Sales tracking opened', 'success')
        },
        {
          icon: BarChart3,
          title: 'My Forecast',
          description: 'Create sales forecast',
          color: 'purple-600',
          onClick: () => window.location.href = '/rolling-forecast'
        },
        {
          icon: Target,
          title: 'My Targets',
          description: 'View personal targets',
          color: 'orange-600',
          onClick: () => showNotification('Personal targets opened', 'success')
        }
      );
    } else if (isManager) {
      commonActions.push(
        {
          icon: Building,
          title: 'Department Budget',
          description: 'Manage department finances',
          color: 'blue-600',
          onClick: () => window.location.href = '/sales-budget'
        },
        {
          icon: Users,
          title: 'Team Performance',
          description: 'Monitor team progress',
          color: 'green-600',
          onClick: () => showNotification('Team performance opened', 'success')
        },
        {
          icon: BarChart3,
          title: 'Department Reports',
          description: 'Generate department reports',
          color: 'purple-600',
          onClick: () => showNotification('Department reports opened', 'success')
        },
        {
          icon: Target,
          title: 'Team Targets',
          description: 'Set team objectives',
          color: 'orange-600',
          onClick: () => showNotification('Team targets opened', 'success')
        }
      );
    } else if (isSupplyChain) {
      commonActions.push(
        {
          icon: Package,
          title: 'Inventory Management',
          description: 'Manage stock levels',
          color: 'blue-600',
          onClick: () => showNotification('Inventory management opened', 'success')
        },
        {
          icon: TrendingUp,
          title: 'Stock Analytics',
          description: 'Analyze inventory trends',
          color: 'green-600',
          onClick: () => showNotification('Stock analytics opened', 'success')
        },
        {
          icon: BarChart3,
          title: 'Distribution',
          description: 'Manage distribution',
          color: 'purple-600',
          onClick: () => window.location.href = '/distribution-management'
        },
        {
          icon: AlertTriangle,
          title: 'Stock Alerts',
          description: 'Monitor low stock items',
          color: 'orange-600',
          onClick: () => showNotification('Stock alerts checked', 'success')
        }
      );
    } else if (isBranchManager) {
      commonActions.push(
        {
          icon: MapPin,
          title: 'Branch Budget',
          description: 'Manage branch finances',
          color: 'blue-600',
          onClick: () => window.location.href = '/sales-budget'
        },
        {
          icon: Users,
          title: 'Local Team',
          description: 'Manage branch staff',
          color: 'green-600',
          onClick: () => showNotification('Local team opened', 'success')
        },
        {
          icon: BarChart3,
          title: 'Branch Reports',
          description: 'Generate branch reports',
          color: 'purple-600',
          onClick: () => showNotification('Branch reports opened', 'success')
        },
        {
          icon: Target,
          title: 'Local Targets',
          description: 'Set branch objectives',
          color: 'orange-600',
          onClick: () => showNotification('Local targets opened', 'success')
        }
      );
    }

    return commonActions;
  };

  const statsData = getStatsData();
  const quickActions = getQuickActions();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-gray-500 font-light">Dashboard /</span> {getUserTypeName(user?.user_type || UserType.SALESMAN)}
            </h4>
            <p className="text-sm text-gray-600">
              Welcome back, {user?.name}! Last updated: {lastRefresh.toLocaleTimeString()}
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
            {accessPattern.canExportData && (
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            )}
          </div>
        </div>

        {/* User Role Badge */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                isAdmin ? 'bg-red-100' :
                isSalesman ? 'bg-green-100' :
                isManager ? 'bg-blue-100' :
                isSupplyChain ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                <Users className={`w-5 h-5 ${
                  isAdmin ? 'text-red-600' :
                  isSalesman ? 'text-green-600' :
                  isManager ? 'text-blue-600' :
                  isSupplyChain ? 'text-purple-600' :
                  'text-orange-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{getUserTypeName(user?.user_type || UserType.SALESMAN)} Dashboard</h3>
                <p className="text-sm text-gray-600">
                  {user?.department && `Department: ${user.department}`}
                  {user?.location && `Location: ${user.location}`}
                  {user?.budget_id && ` • Budget ID: ${user.budget_id}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Access Level</p>
              <p className="font-semibold text-gray-900">
                {accessPattern.canAccessFullSystem ? 'Full System' :
                 accessPattern.canAccessDepartmentData ? 'Department' :
                 accessPattern.canAccessLocationData ? 'Location' : 'Personal'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button 
                  key={index}
                  onClick={action.onClick}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <IconComponent className={`w-6 h-6 text-${action.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </button>
              );
            })}
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
        {accessPattern.canExportData && (
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            onExport={handleExport}
            title="Export Dashboard Report"
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
