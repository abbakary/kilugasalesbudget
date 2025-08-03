import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  DollarSign,
  Package,
  Calendar,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Maximize2,
  Eye,
  EyeOff,
  AlertCircle,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle
} from 'lucide-react';
import { useAccessControl } from '../contexts/AuthContext';
import { formatCurrency, formatPercentage } from '../utils/budgetCalculations';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'table' | 'gauge';
  value?: number | string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  data?: any[];
  config?: any;
  size: 'small' | 'medium' | 'large';
  category: string;
}

interface BiMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  format: 'currency' | 'percentage' | 'number';
  target?: number;
  category: 'sales' | 'budget' | 'forecast' | 'operations';
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

const BiDashboard: React.FC = () => {
  const { user, accessPattern } = useAccessControl();
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [metrics, setMetrics] = useState<BiMetric[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod, selectedCategory]);

  const loadDashboardData = async () => {
    setRefreshing(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate sample metrics
    const sampleMetrics: BiMetric[] = [
      {
        id: 'total_sales',
        name: 'Total Sales',
        value: 2450000,
        previousValue: 2250000,
        format: 'currency',
        target: 2500000,
        category: 'sales',
        trend: 'up',
        confidence: 0.85
      },
      {
        id: 'budget_utilization',
        name: 'Budget Utilization',
        value: 0.87,
        previousValue: 0.82,
        format: 'percentage',
        target: 0.90,
        category: 'budget',
        trend: 'up',
        confidence: 0.92
      },
      {
        id: 'forecast_accuracy',
        name: 'Forecast Accuracy',
        value: 0.94,
        previousValue: 0.91,
        format: 'percentage',
        category: 'forecast',
        trend: 'up',
        confidence: 0.88
      },
      {
        id: 'active_customers',
        name: 'Active Customers',
        value: 1247,
        previousValue: 1195,
        format: 'number',
        category: 'operations',
        trend: 'up',
        confidence: 0.95
      }
    ];

    // Generate sample widgets
    const sampleWidgets: DashboardWidget[] = [
      {
        id: 'sales_trend',
        title: 'Sales Trend',
        type: 'chart',
        size: 'large',
        category: 'sales',
        data: generateTrendData()
      },
      {
        id: 'budget_vs_actual',
        title: 'Budget vs Actual',
        type: 'chart',
        size: 'medium',
        category: 'budget',
        data: generateBudgetComparisonData()
      },
      {
        id: 'top_customers',
        title: 'Top Customers',
        type: 'table',
        size: 'medium',
        category: 'sales',
        data: generateCustomerData()
      },
      {
        id: 'forecast_accuracy_gauge',
        title: 'Forecast Accuracy',
        type: 'gauge',
        size: 'small',
        category: 'forecast',
        value: '94%',
        config: { value: 94, max: 100, color: 'green' }
      },
      {
        id: 'budget_allocation',
        title: 'Budget Allocation',
        type: 'chart',
        size: 'medium',
        category: 'budget',
        data: generateBudgetAllocationData()
      },
      {
        id: 'regional_performance',
        title: 'Regional Performance',
        type: 'chart',
        size: 'large',
        category: 'sales',
        data: generateRegionalData()
      }
    ];

    // Generate sample insights
    const sampleInsights = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Q4 Sales Surge Detected',
        description: 'Sales increased 15% above forecast in the last month. Consider increasing Q1 budget allocation.',
        impact: 'high',
        confidence: 0.92,
        metrics: ['Total Sales', 'Forecast Accuracy'],
        recommendation: 'Increase Q1 budget by 8-12% to capitalize on momentum'
      },
      {
        id: '2',
        type: 'risk',
        title: 'Budget Utilization Gap',
        description: 'Several departments are behind on budget utilization, which may impact year-end targets.',
        impact: 'medium',
        confidence: 0.88,
        metrics: ['Budget Utilization'],
        recommendation: 'Review budget allocation and accelerate spending in underutilized areas'
      },
      {
        id: '3',
        type: 'trend',
        title: 'Customer Acquisition Acceleration',
        description: 'New customer acquisition rate increased 22% compared to same period last year.',
        impact: 'high',
        confidence: 0.95,
        metrics: ['Active Customers'],
        recommendation: 'Invest more in customer acquisition channels showing highest ROI'
      }
    ];

    setMetrics(sampleMetrics);
    setWidgets(sampleWidgets);
    setInsights(sampleInsights);
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  const generateTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 500000) + 1500000,
      budget: Math.floor(Math.random() * 400000) + 1600000,
      forecast: Math.floor(Math.random() * 450000) + 1550000
    }));
  };

  const generateBudgetComparisonData = () => {
    return [
      { category: 'Sales & Marketing', budget: 500000, actual: 485000, variance: -3 },
      { category: 'Operations', budget: 750000, actual: 820000, variance: 9.3 },
      { category: 'Technology', budget: 300000, actual: 275000, variance: -8.3 },
      { category: 'HR & Training', budget: 200000, actual: 195000, variance: -2.5 },
      { category: 'Facilities', budget: 150000, actual: 162000, variance: 8 }
    ];
  };

  const generateCustomerData = () => {
    return [
      { name: 'Acme Corporation', revenue: 245000, growth: 15.2, region: 'North America' },
      { name: 'Global Tech Solutions', revenue: 198000, growth: 8.7, region: 'Europe' },
      { name: 'Asian Trading Co.', revenue: 176000, growth: 22.1, region: 'Asia Pacific' },
      { name: 'European Systems', revenue: 165000, growth: -2.3, region: 'Europe' },
      { name: 'Tech Innovations', revenue: 142000, growth: 12.8, region: 'North America' }
    ];
  };

  const generateBudgetAllocationData = () => {
    return [
      { name: 'Product Development', value: 35, amount: 1750000 },
      { name: 'Sales & Marketing', value: 25, amount: 1250000 },
      { name: 'Operations', value: 20, amount: 1000000 },
      { name: 'Technology', value: 12, amount: 600000 },
      { name: 'Administration', value: 8, amount: 400000 }
    ];
  };

  const generateRegionalData = () => {
    return [
      { region: 'North America', q1: 850000, q2: 920000, q3: 1100000, q4: 1200000 },
      { region: 'Europe', q1: 650000, q2: 720000, q3: 850000, q4: 950000 },
      { region: 'Asia Pacific', q1: 450000, q2: 580000, q3: 720000, q4: 850000 },
      { region: 'Latin America', q1: 250000, q2: 290000, q3: 340000, q4: 420000 }
    ];
  };

  const formatMetricValue = (metric: BiMetric) => {
    switch (metric.format) {
      case 'currency':
        return formatCurrency(metric.value);
      case 'percentage':
        return formatPercentage(metric.value * 100);
      case 'number':
        return metric.value.toLocaleString();
      default:
        return metric.value.toString();
    }
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getChangeIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'risk':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-gray-500 font-light">BI Tools /</span> Analytics Dashboard
            </h4>
            <p className="text-gray-600 text-sm">
              Advanced business intelligence and analytics for sales budgeting and forecasting
            </p>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="current_quarter">Current Quarter</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="current_year">Current Year</option>
              <option value="last_year">Last Year</option>
            </select>
            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const change = calculateChange(metric.value, metric.previousValue);
            const isPositive = change > 0;
            
            return (
              <div key={metric.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                  {getChangeIcon(metric.trend)}
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatMetricValue(metric)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium flex items-center ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? '+' : ''}{change.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500">vs previous period</span>
                  </div>
                  {metric.target && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Target</span>
                        <span>{formatMetricValue({...metric, value: metric.target})}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Insights Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
            <span className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {insights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'opportunity' ? 'border-green-500 bg-green-50' :
                insight.type === 'risk' ? 'border-red-500 bg-red-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                        insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                    {insight.recommendation && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          <strong>Recommended Action:</strong> {insight.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sales Trend Chart - Large */}
          <div className="lg:col-span-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sales Performance Trend</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Sales Trend Chart</p>
                <p className="text-sm text-gray-400">Interactive chart showing sales vs budget vs forecast</p>
              </div>
            </div>
          </div>

          {/* Forecast Accuracy Gauge - Small */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Forecast Accuracy</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.94)}`}
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">94%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Current Period</p>
              </div>
            </div>
          </div>

          {/* Budget vs Actual - Medium */}
          <div className="lg:col-span-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Budget vs Actual</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Budget Comparison Chart</p>
              </div>
            </div>
          </div>

          {/* Top Customers Table - Medium */}
          <div className="lg:col-span-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
              <button className="text-blue-600 text-sm hover:text-blue-800">View All</button>
            </div>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Revenue</th>
                    <th className="pb-3">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generateCustomerData().slice(0, 5).map((customer, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.region}</div>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {formatCurrency(customer.revenue)}
                      </td>
                      <td className="py-3">
                        <span className={`text-sm font-medium ${
                          customer.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {customer.growth > 0 ? '+' : ''}{customer.growth.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Data Quality & Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality & Sync Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-900">Oracle Database</p>
                <p className="text-xs text-green-700">Last sync: 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-900">OLAP Cube</p>
                <p className="text-xs text-green-700">Last sync: 5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <RefreshCw className="w-8 h-8 text-blue-600 mr-3 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-blue-900">Power BI</p>
                <p className="text-xs text-blue-700">Syncing...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BiDashboard;
