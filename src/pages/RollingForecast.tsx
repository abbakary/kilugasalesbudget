import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Download, Filter, Calendar, TrendingUp, BarChart3, Target, AlertCircle, Plus, Users, DollarSign, ShoppingCart, Eye, Edit, Trash2 } from 'lucide-react';
import CustomerForecastModal from '../components/CustomerForecastModal';
import { Customer, Item, CustomerItemForecast, ForecastFormData, MonthlyForecast } from '../types/forecast';
import { getBudgetImpactAnalysis, formatCurrency, formatPercentage, getVarianceColor, getConfidenceColor, getRemainingMonths } from '../utils/budgetCalculations';

const RollingForecast: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customer-forecast');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState('2025');

  // Modal states
  const [isForecastModalOpen, setIsForecastModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingForecast, setEditingForecast] = useState<CustomerItemForecast | null>(null);

  // Data states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [customerForecasts, setCustomerForecasts] = useState<CustomerItemForecast[]>([]);

  // Toast notification state
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Sample data - in real app this would come from API
  useEffect(() => {
    // Initialize sample customers
    const sampleCustomers: Customer[] = [
      {
        id: '1',
        name: 'Acme Corporation',
        code: 'ACME001',
        email: 'orders@acme.com',
        phone: '+1-555-0101',
        region: 'North America',
        segment: 'Enterprise',
        creditLimit: 500000,
        currency: 'USD',
        active: true,
        createdAt: '2024-01-15',
        lastActivity: '2024-12-01'
      },
      {
        id: '2',
        name: 'Global Tech Solutions',
        code: 'GTS002',
        email: 'procurement@globaltech.com',
        phone: '+1-555-0102',
        region: 'North America',
        segment: 'SMB',
        creditLimit: 250000,
        currency: 'USD',
        active: true,
        createdAt: '2024-02-20',
        lastActivity: '2024-11-28'
      },
      {
        id: '3',
        name: 'European Systems Ltd',
        code: 'ESL003',
        email: 'orders@eusystems.eu',
        phone: '+44-20-7946-0958',
        region: 'Europe',
        segment: 'Enterprise',
        creditLimit: 750000,
        currency: 'EUR',
        active: true,
        createdAt: '2024-03-10',
        lastActivity: '2024-12-02'
      },
      {
        id: '4',
        name: 'Asia Pacific Trading',
        code: 'APT004',
        email: 'info@aptrading.com',
        phone: '+65-6123-4567',
        region: 'Asia Pacific',
        segment: 'SMB',
        creditLimit: 300000,
        currency: 'SGD',
        active: true,
        createdAt: '2024-04-05',
        lastActivity: '2024-11-30'
      }
    ];

    // Initialize sample items
    const sampleItems: Item[] = [
      {
        id: '1',
        sku: 'IPH15P-256',
        name: 'iPhone 15 Pro 256GB',
        category: 'Smartphones',
        brand: 'Apple',
        unitPrice: 999.00,
        costPrice: 750.00,
        currency: 'USD',
        unit: 'piece',
        active: true,
        description: 'Latest iPhone with Pro features'
      },
      {
        id: '2',
        sku: 'SGS24-128',
        name: 'Samsung Galaxy S24 128GB',
        category: 'Smartphones',
        brand: 'Samsung',
        unitPrice: 849.00,
        costPrice: 650.00,
        currency: 'USD',
        unit: 'piece',
        active: true,
        description: 'Premium Android smartphone'
      },
      {
        id: '3',
        sku: 'MBA-M3-512',
        name: 'MacBook Air M3 512GB',
        category: 'Laptops',
        brand: 'Apple',
        unitPrice: 1299.00,
        costPrice: 950.00,
        currency: 'USD',
        unit: 'piece',
        active: true,
        description: 'Ultra-thin laptop with M3 chip'
      },
      {
        id: '4',
        sku: 'DXP13-1TB',
        name: 'Dell XPS 13 1TB',
        category: 'Laptops',
        brand: 'Dell',
        unitPrice: 1199.00,
        costPrice: 900.00,
        currency: 'USD',
        unit: 'piece',
        active: true,
        description: 'Premium ultrabook for professionals'
      },
      {
        id: '5',
        sku: 'SWH1000X5',
        name: 'Sony WH-1000XM5 Headphones',
        category: 'Audio',
        brand: 'Sony',
        unitPrice: 399.00,
        costPrice: 250.00,
        currency: 'USD',
        unit: 'piece',
        active: true,
        description: 'Premium noise-canceling headphones'
      }
    ];

    setCustomers(sampleCustomers);
    setItems(sampleItems);
  }, []);

  // Calculate summary data from forecasts
  const budgetAnalysis = getBudgetImpactAnalysis(customerForecasts);

  const summaryData = [
    {
      title: 'Total Forecast',
      value: formatCurrency(budgetAnalysis.summary.totalForecast),
      change: formatPercentage(budgetAnalysis.summary.overallVariancePercentage),
      isPositive: budgetAnalysis.summary.overallVariance >= 0,
      icon: TrendingUp,
      color: 'primary' as const
    },
    {
      title: 'Active Customers',
      value: customers.filter(c => c.active).length.toString(),
      change: `${customerForecasts.length} forecasts`,
      isPositive: true,
      icon: Users,
      color: 'success' as const
    },
    {
      title: 'Budget Variance',
      value: formatCurrency(Math.abs(budgetAnalysis.summary.overallVariance)),
      change: budgetAnalysis.summary.overallVariance >= 0 ? 'Over Budget' : 'Under Budget',
      isPositive: budgetAnalysis.summary.overallVariance < 0,
      icon: Target,
      color: 'info' as const
    },
    {
      title: 'Remaining Months',
      value: getRemainingMonths().length.toString(),
      change: `${new Date().getFullYear()} Forecast`,
      isPositive: true,
      icon: Calendar,
      color: 'warning' as const
    }
  ];

  const tabs = [
    { id: 'customer-forecast', label: 'Customer Forecasts', active: true },
    { id: 'budget-impact', label: 'Budget Impact', active: false },
    { id: 'forecast-summary', label: 'Forecast Summary', active: false }
  ];

  const handleCellEdit = (id: number, field: string, value: number | string) => {
    setForecastData(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate total for numeric fields
        if (typeof value === 'number' && field !== 'total' && field !== 'accuracy') {
          updated.total = updated.jan + updated.feb + updated.mar + updated.apr + 
                         updated.may + updated.jun + updated.jul + updated.aug + 
                         updated.sep + updated.oct + updated.nov + updated.dec;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleSelectRow = (id: number) => {
    setForecastData(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSelectAll = () => {
    const allSelected = forecastData.every(item => item.selected);
    setForecastData(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  const addNewRow = () => {
    const newId = Math.max(...forecastData.map(item => item.id)) + 1;
    const newRow = {
      id: newId,
      selected: false,
      product: 'New Product',
      sku: 'NEW-SKU',
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0,
      accuracy: 0,
      model: 'Linear Regression',
      confidence: 'Medium'
    };
    setForecastData(prev => [...prev, newRow]);
  };

  const removeSelectedRows = () => {
    setForecastData(prev => prev.filter(item => !item.selected));
  };

  const recalculateForecast = () => {
    // Simulate forecast recalculation
    setForecastData(prev => prev.map(item => ({
      ...item,
      accuracy: Math.min(100, item.accuracy + (Math.random() * 4 - 2)) // Random adjustment
    })));
    showNotification('Forecast recalculated successfully', 'success');
  };

  const saveChanges = () => {
    // Simulate saving changes
    showNotification('Changes saved successfully', 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFiltersApply = (filters: FilterState) => {
    setAppliedFilters(filters);
    // Apply filters to data
    let filteredData = [...forecastData];

    if (filters.customer) {
      filteredData = filteredData.filter(item =>
        item.product.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }

    if (filters.product) {
      filteredData = filteredData.filter(item =>
        item.product.toLowerCase().includes(filters.product.toLowerCase())
      );
    }

    showNotification('Filters applied successfully', 'success');
  };

  const handleScenarioApply = (scenario: ScenarioConfig) => {
    setAppliedScenario(scenario);
    // Apply scenario adjustments to forecast data
    setForecastData(prev => prev.map(item => {
      const adjustedItem = { ...item };

      // Apply scenario adjustments
      if (scenario.adjustments.volumeChange !== 0) {
        const volumeMultiplier = 1 + (scenario.adjustments.volumeChange / 100);
        ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].forEach(month => {
          adjustedItem[month as keyof typeof adjustedItem] = Math.round(
            (adjustedItem[month as keyof typeof adjustedItem] as number) * volumeMultiplier
          );
        });
        adjustedItem.total = Math.round(adjustedItem.total * volumeMultiplier);
      }

      return adjustedItem;
    }));

    showNotification(`Scenario "${scenario.name}" applied successfully`, 'success');
  };

  const handleExport = (config: ExportConfig) => {
    // Simulate export functionality
    const fileName = `${config.filename}.${config.format === 'excel' ? 'xlsx' : config.format}`;
    showNotification(`Exporting data as ${fileName}...`, 'success');

    // In a real app, this would trigger file download
    setTimeout(() => {
      showNotification(`Export completed: ${fileName}`, 'success');
    }, 2000);
  };

  const handleImport = (file: File, config: ImportConfig) => {
    // Simulate import functionality
    showNotification(`Importing data from ${file.name}...`, 'success');

    // In a real app, this would process the file
    setTimeout(() => {
      showNotification(`Import completed: ${file.name}`, 'success');
    }, 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600 bg-green-50';
    if (accuracy >= 90) return 'text-blue-600 bg-blue-50';
    if (accuracy >= 85) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceBadge = (confidence: string) => {
    const classes = {
      'High': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-red-100 text-red-800',
    };
    return classes[confidence as keyof typeof classes] || classes.Medium;
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            <span className="text-gray-500 font-light">Rolling Forecast /</span> Management
          </h4>
          <p className="text-gray-600 text-sm">Manage and analyze rolling forecasts with advanced predictive analytics</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAnalyticsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics Planning</span>
          </button>
          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
              appliedFilters
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters {appliedFilters && '(Active)'}</span>
          </button>
          <button
            onClick={() => setIsScenariosModalOpen(true)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
              appliedScenario
                ? 'border-orange-600 bg-orange-50 text-orange-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Scenarios {appliedScenario && `(${appliedScenario.name})`}</span>
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <ForecastSummary data={summaryData} />

      {/* Advanced Analytics Chart */}
      <AdvancedForecastChart />

      {/* Search and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Forecasts</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search products, customers, or regions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Period</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Horizon</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={forecastHorizon}
              onChange={(e) => setForecastHorizon(e.target.value)}
            >
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="18">18 Months</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
            >
              <option value="linear">Linear Regression</option>
              <option value="arima">ARIMA</option>
              <option value="exponential">Exponential Smoothing</option>
              <option value="neural">Neural Network</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={addNewRow}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Forecast</span>
          </button>
          <button
            onClick={removeSelectedRows}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Minus className="w-4 h-4" />
            <span>Remove Selected</span>
          </button>
          <button
            onClick={recalculateForecast}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recalculate</span>
          </button>
          <button
            onClick={saveChanges}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
          </button>
        </div>
        <div className="text-sm text-gray-600">
          {forecastData.filter(item => item.selected).length} of {forecastData.length} forecasts selected
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-0">
          <ul className="flex" role="tablist">
            {tabs.map((tab) => (
              <li key={tab.id} className="flex-1" role="presentation">
                <button
                  className={`w-full px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  role="tab"
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sticky Forecast Table Container */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="sticky left-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={forecastData.every(item => item.selected)}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="sticky left-12 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-48">
                    Product
                  </th>
                  <th className="sticky left-60 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-32">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Jan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Feb</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Mar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Apr</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">May</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Jun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Jul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Aug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Sep</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Oct</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Nov</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">Dec</th>
                  <th className="sticky right-40 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 min-w-40">
                    Total
                  </th>
                  <th className="sticky right-20 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 min-w-24">
                    Accuracy
                  </th>
                  <th className="sticky right-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 min-w-32">
                    Model
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forecastData.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.selected ? 'bg-blue-50' : ''}`}>
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 whitespace-nowrap border-r border-gray-200">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="sticky left-12 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                      <input
                        type="text"
                        value={item.product}
                        onChange={(e) => handleCellEdit(item.id, 'product', e.target.value)}
                        className="w-full border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                      />
                    </td>
                    <td className="sticky left-60 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      <input
                        type="text"
                        value={item.sku}
                        onChange={(e) => handleCellEdit(item.id, 'sku', e.target.value)}
                        className="w-full border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                      />
                    </td>
                    {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map((month) => (
                      <td key={month} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <input
                          type="number"
                          value={item[month as keyof typeof item] as number}
                          onChange={(e) => handleCellEdit(item.id, month, parseInt(e.target.value) || 0)}
                          className="w-full border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 text-right"
                        />
                      </td>
                    ))}
                    <td className="sticky right-40 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 border-l border-gray-200">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="sticky right-20 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm border-l border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccuracyColor(item.accuracy)}`}>
                        {item.accuracy.toFixed(1)}%
                      </span>
                    </td>
                    <td className="sticky right-0 z-10 bg-white px-6 py-4 whitespace-nowrap text-sm border-l border-gray-200">
                      <select
                        value={item.model}
                        onChange={(e) => handleCellEdit(item.id, 'model', e.target.value)}
                        className="w-full border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                      >
                        <option value="ARIMA">ARIMA</option>
                        <option value="Neural Network">Neural Network</option>
                        <option value="Linear Regression">Linear Regression</option>
                        <option value="Exponential Smoothing">Exponential Smoothing</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Modals */}
      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onApply={handleFiltersApply}
      />

      <ScenariosModal
        isOpen={isScenariosModalOpen}
        onClose={() => setIsScenariosModalOpen(false)}
        onApplyScenario={handleScenarioApply}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Export Forecast Data"
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      <AnalyticsPlanningModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
      </div>
    </Layout>
  );
};

export default RollingForecast;
