import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Download, Filter, Calendar, TrendingUp, BarChart3, Target, AlertCircle, Plus, Users, DollarSign, ShoppingCart, Eye, Edit, Trash2, X } from 'lucide-react';
import CustomerForecastModal from '../components/CustomerForecastModal';
import AdvancedCustomerTable from '../components/AdvancedCustomerTable';
import { Customer, Item, CustomerItemForecast, ForecastFormData, MonthlyForecast, BudgetHistory, YearlyForecastSummary, FilterOptions } from '../types/forecast';
import { getBudgetImpactAnalysis, formatCurrency, formatPercentage, getVarianceColor, getConfidenceColor, getRemainingMonths, generateBudgetHistory, generateYearlyForecastSummary, getAvailableYears } from '../utils/budgetCalculations';
import { exportForecastData, downloadImportTemplate, ExportData } from '../utils/exportUtils';

const RollingForecast: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customer-forecast');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState('2025');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Modal states
  const [isForecastModalOpen, setIsForecastModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingForecast, setEditingForecast] = useState<CustomerItemForecast | null>(null);

  // Data states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [customerForecasts, setCustomerForecasts] = useState<CustomerItemForecast[]>([]);
  const [budgetHistory, setBudgetHistory] = useState<BudgetHistory[]>([]);
  const [yearlyForecastSummary, setYearlyForecastSummary] = useState<YearlyForecastSummary | null>(null);

  // Filter states
  const [filters, setFilters] = useState<{
    regions: string[];
    segments: string[];
    categories: string[];
    confidence: string[];
  }>({ regions: [], segments: [], categories: [], confidence: [] });

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
        lastActivity: '2024-12-01',
        channels: ['Direct Sales', 'Online'],
        seasonality: 'medium',
        tier: 'platinum',
        manager: 'John Smith'
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
        lastActivity: '2024-11-28',
        channels: ['Retail Partners', 'Distributors'],
        seasonality: 'high',
        tier: 'gold',
        manager: 'Sarah Johnson'
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
        lastActivity: '2024-12-02',
        channels: ['Direct Sales', 'Online', 'Retail Partners'],
        seasonality: 'low',
        tier: 'platinum',
        manager: 'Michael Brown'
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
        lastActivity: '2024-11-30',
        channels: ['Online', 'Distributors'],
        seasonality: 'medium',
        tier: 'silver',
        manager: 'Lisa Chen'
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
        description: 'Latest iPhone with Pro features',
        seasonal: false,
        minOrderQuantity: 1,
        leadTime: 7,
        supplier: 'Apple Inc.'
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
        description: 'Premium Android smartphone',
        seasonal: false,
        minOrderQuantity: 1,
        leadTime: 5,
        supplier: 'Samsung Electronics'
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
        description: 'Ultra-thin laptop with M3 chip',
        seasonal: false,
        minOrderQuantity: 1,
        leadTime: 10,
        supplier: 'Apple Inc.'
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
        description: 'Premium ultrabook for professionals',
        seasonal: false,
        minOrderQuantity: 1,
        leadTime: 8,
        supplier: 'Dell Technologies'
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
        description: 'Premium noise-canceling headphones',
        seasonal: true,
        seasonalMonths: ['Nov', 'Dec', 'Jan'],
        minOrderQuantity: 5,
        leadTime: 3,
        supplier: 'Sony Corporation'
      }
    ];

    setCustomers(sampleCustomers);
    setItems(sampleItems);

    // Initialize budget history
    const history = generateBudgetHistory();
    setBudgetHistory(history);
  }, []);

  // Update yearly forecast summary when data changes
  useEffect(() => {
    const summary = generateYearlyForecastSummary(customerForecasts, customers, selectedYear);
    setYearlyForecastSummary(summary);
  }, [customerForecasts, customers, selectedYear]);

  // Calculate summary data from forecasts
  const budgetAnalysis = getBudgetImpactAnalysis(customerForecasts, selectedYear);

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
    { id: 'customer-table', label: 'Customer Management', active: false },
    { id: 'budget-impact', label: 'Budget Impact', active: false },
    { id: 'budget-history', label: 'Budget History', active: false },
    { id: 'forecast-summary', label: 'Forecast Summary', active: false }
  ];

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
  };

  const handleCreateForecast = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditingForecast(null);
    setIsForecastModalOpen(true);
  };

  const handleEditForecast = (forecast: CustomerItemForecast) => {
    setSelectedCustomer(forecast.customer);
    setEditingForecast(forecast);
    setIsForecastModalOpen(true);
  };

  const handleDeleteForecast = (forecastId: string) => {
    if (confirm('Are you sure you want to delete this forecast?')) {
      setCustomerForecasts(prev => prev.filter(f => f.id !== forecastId));
      showNotification('Forecast deleted successfully', 'success');
    }
  };

  const handleSaveForecast = (forecastData: ForecastFormData) => {
    const customer = customers.find(c => c.id === forecastData.customerId);
    const item = items.find(i => i.id === forecastData.itemId);

    if (!customer || !item) {
      showNotification('Invalid customer or item selected', 'error');
      return;
    }

    // Convert forecast data to monthly forecasts
    const monthlyForecasts: MonthlyForecast[] = Object.entries(forecastData.forecasts)
      .filter(([_, data]) => data.quantity > 0 || data.unitPrice > 0)
      .map(([month, data]) => ({
        month,
        year: new Date().getFullYear(),
        monthIndex: getRemainingMonths().indexOf(month),
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalValue: data.quantity * data.unitPrice,
        notes: data.notes
      }));

    const yearlyTotal = monthlyForecasts.reduce((sum, mf) => sum + mf.totalValue, 0);

    const monthlyBudgetImpact: { [month: string]: number } = {};
    monthlyForecasts.forEach(mf => {
      monthlyBudgetImpact[mf.month] = mf.totalValue;
    });

    const newForecast: CustomerItemForecast = {
      id: editingForecast?.id || `forecast_${Date.now()}`,
      customerId: customer.id,
      itemId: item.id,
      customer,
      item,
      monthlyForecasts,
      yearlyTotal,
      yearlyBudgetImpact: yearlyTotal,
      monthlyBudgetImpact,
      createdAt: editingForecast?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user',
      status: 'draft',
      confidence: forecastData.confidence,
      notes: forecastData.notes
    };

    if (editingForecast) {
      // Update existing forecast
      setCustomerForecasts(prev => prev.map(f => f.id === editingForecast.id ? newForecast : f));
      showNotification('Forecast updated successfully', 'success');
    } else {
      // Add new forecast
      setCustomerForecasts(prev => [...prev, newForecast]);
      showNotification('Forecast created successfully', 'success');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const getFilteredCustomers = () => {
    let filteredCustomers = customers;

    // Apply search term filter
    if (searchTerm) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.segment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply selected customer filter
    if (selectedCustomerId) {
      filteredCustomers = filteredCustomers.filter(customer => customer.id === selectedCustomerId);
    }

    // Apply additional filters
    if (filters.regions.length > 0) {
      filteredCustomers = filteredCustomers.filter(customer =>
        filters.regions.includes(customer.region)
      );
    }

    if (filters.segments.length > 0) {
      filteredCustomers = filteredCustomers.filter(customer =>
        filters.segments.includes(customer.segment)
      );
    }

    return filteredCustomers;
  };

  const getCustomerForecasts = (customerId?: string) => {
    if (customerId) {
      return customerForecasts.filter(f => f.customerId === customerId);
    }
    return customerForecasts;
  };

  const getCustomerForecastSummary = (customerId: string) => {
    const forecasts = getCustomerForecasts(customerId);
    const totalValue = forecasts.reduce((sum, f) => sum + f.yearlyTotal, 0);
    const totalItems = forecasts.length;
    return { totalValue, totalItems };
  };

  const handleExportData = (format: 'csv' | 'json' | 'budget-csv' = 'csv') => {
    try {
      const exportData: ExportData = {
        customers,
        forecasts: customerForecasts,
        budgetAnalysis
      };

      exportForecastData(exportData, format);
      showNotification(`Export started in ${format.toUpperCase()} format`, 'success');
    } catch (error) {
      showNotification('Export failed. Please try again.', 'error');
    }
  };

  const handleDownloadTemplate = () => {
    downloadImportTemplate();
    showNotification('Import template downloaded', 'success');
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            <span className="text-gray-500 font-light">Rolling Forecast /</span> Customer Management
          </h4>
          <p className="text-gray-600 text-sm">Create and manage customer-specific forecasts for remaining months of {new Date().getFullYear()}</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getAvailableYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="relative group">
            <button
              onClick={() => handleExportData('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExportData('json')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Export JSON
              </button>
              <button
                onClick={() => handleExportData('budget-csv')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Export Budget Analysis
              </button>
              <button
                onClick={handleDownloadTemplate}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Download Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${
                  item.color === 'primary' ? 'bg-blue-100' :
                  item.color === 'success' ? 'bg-green-100' :
                  item.color === 'info' ? 'bg-purple-100' :
                  item.color === 'warning' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    item.color === 'primary' ? 'text-blue-600' :
                    item.color === 'success' ? 'text-green-600' :
                    item.color === 'info' ? 'text-purple-600' :
                    item.color === 'warning' ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{item.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                    <p className={`ml-2 text-sm font-medium ${
                      item.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Customers</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search customers, codes, or regions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCustomerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
            >
              <option value="">All Customers</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Year</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{customerForecasts.length}</span> active forecasts
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{customers.filter(c => c.active).length}</span> active customers
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{getRemainingMonths().length}</span> months remaining in {new Date().getFullYear()}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleString()}
          </div>
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'customer-forecast' && (
            <div className="space-y-6">
              {/* Customer List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {getFilteredCustomers().map(customer => {
                  const forecasts = getCustomerForecasts(customer.id);
                  const summary = getCustomerForecastSummary(customer.id);

                  return (
                    <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                            <p className="text-sm text-gray-600">{customer.code}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Region:</span>
                          <span className="font-medium">{customer.region}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Segment:</span>
                          <span className="font-medium">{customer.segment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Active Forecasts:</span>
                          <span className="font-medium">{summary.totalItems}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Forecast:</span>
                          <span className="font-medium text-green-600">{formatCurrency(summary.totalValue)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCreateForecast(customer)}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>New Forecast</span>
                        </button>
                        {forecasts.length > 0 && (
                          <button
                            onClick={() => setSelectedCustomerId(customer.id)}
                            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Customer Forecasts */}
              {selectedCustomerId && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Forecasts for {customers.find(c => c.id === selectedCustomerId)?.name}
                      </h3>
                      <button
                        onClick={() => setSelectedCustomerId('')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Forecast</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getCustomerForecasts(selectedCustomerId).map(forecast => (
                          <tr key={forecast.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{forecast.item.name}</div>
                                <div className="text-sm text-gray-500">{forecast.item.category}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {forecast.item.sku}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(forecast.yearlyTotal)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(forecast.confidence)}`}>
                                {forecast.confidence}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                forecast.status === 'approved' ? 'bg-green-100 text-green-800' :
                                forecast.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                forecast.status === 'revised' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {forecast.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEditForecast(forecast)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteForecast(forecast.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {getCustomerForecasts(selectedCustomerId).length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              No forecasts found for this customer.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'budget-impact' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Impact Analysis</h3>

                {/* Yearly Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Total Budget</p>
                        <p className="text-xl font-semibold text-blue-800">{formatCurrency(budgetAnalysis.yearly.originalBudget)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-900">Total Forecast</p>
                        <p className="text-xl font-semibold text-green-800">{formatCurrency(budgetAnalysis.yearly.forecastImpact)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className={`rounded-lg p-4 ${
                    budgetAnalysis.yearly.variance >= 0 ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          budgetAnalysis.yearly.variance >= 0 ? 'text-red-900' : 'text-green-900'
                        }`}>Variance</p>
                        <p className={`text-xl font-semibold ${
                          budgetAnalysis.yearly.variance >= 0 ? 'text-red-800' : 'text-green-800'
                        }`}>{formatPercentage(budgetAnalysis.yearly.variancePercentage)}</p>
                      </div>
                      <AlertCircle className={`w-8 h-8 ${
                        budgetAnalysis.yearly.variance >= 0 ? 'text-red-600' : 'text-green-600'
                      }`} />
                    </div>
                  </div>
                </div>

                {/* Monthly Budget Impact */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Target</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecast</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Variance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {budgetAnalysis.monthly.map(impact => (
                        <tr key={impact.month} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {impact.month} {impact.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(impact.originalBudget)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(impact.forecastImpact)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVarianceColor(impact.variance)}`}>
                              {formatCurrency(Math.abs(impact.variance))}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVarianceColor(impact.variance)}`}>
                              {formatPercentage(impact.variancePercentage)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budget-history' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget History (2021 - {new Date().getFullYear()})</h3>

                {/* Historical Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {budgetHistory.map(history => (
                    <div key={history.year} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{history.year}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          history.status === 'completed' ? 'bg-green-100 text-green-800' :
                          history.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {history.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">{formatCurrency(history.totalBudget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Actual:</span>
                          <span className="font-medium">{formatCurrency(history.actualSpent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Variance:</span>
                          <span className={`font-medium ${
                            history.variance >= 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {formatPercentage(history.variancePercentage)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="font-medium">{history.forecastAccuracy.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Year Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Year for Detailed View
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {budgetHistory.map(history => (
                      <option key={history.year} value={history.year}>{history.year}</option>
                    ))}
                  </select>
                </div>

                {/* Monthly Details for Selected Year */}
                {(() => {
                  const selectedYearData = budgetHistory.find(h => h.year === selectedYear);
                  if (!selectedYearData) return null;

                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Target</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Spent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecast</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(selectedYearData.monthlyData).map(([month, data]) => {
                            const variance = data.actual - data.budget;
                            const variancePercentage = data.budget !== 0 ? (variance / data.budget) * 100 : 0;

                            return (
                              <tr key={month} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {month} {selectedYear}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(data.budget)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(data.actual)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(data.forecast)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVarianceColor(variance)}`}>
                                    {formatPercentage(variancePercentage)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {activeTab === 'forecast-summary' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600">Active Forecasts</p>
                    <p className="text-2xl font-semibold text-gray-900">{customerForecasts.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600">Items Forecasted</p>
                    <p className="text-2xl font-semibold text-gray-900">{new Set(customerForecasts.map(f => f.itemId)).size}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {customerForecasts.length > 0 ?
                        Math.round(customerForecasts.reduce((sum, f) =>
                          sum + (f.confidence === 'high' ? 3 : f.confidence === 'medium' ? 2 : 1), 0
                        ) / customerForecasts.length * 33.33) : 0}%
                    </p>
                  </div>
                </div>

                {/* Customer Summary Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecasts</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map(customer => {
                        const forecasts = getCustomerForecasts(customer.id);
                        const summary = getCustomerForecastSummary(customer.id);
                        const lastForecast = forecasts.sort((a, b) =>
                          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        )[0];

                        return (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.code}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {customer.region}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {summary.totalItems}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(summary.totalValue)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {lastForecast ? new Date(lastForecast.updatedAt).toLocaleDateString() : 'No forecasts'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
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

      {/* Customer Forecast Modal */}
      <CustomerForecastModal
        isOpen={isForecastModalOpen}
        onClose={() => {
          setIsForecastModalOpen(false);
          setSelectedCustomer(null);
          setEditingForecast(null);
        }}
        customer={selectedCustomer}
        items={items}
        onSaveForecast={handleSaveForecast}
        existingForecast={editingForecast ? {
          customerId: editingForecast.customerId,
          itemId: editingForecast.itemId,
          forecasts: editingForecast.monthlyForecasts.reduce((acc, mf) => {
            acc[mf.month] = {
              quantity: mf.quantity,
              unitPrice: mf.unitPrice,
              notes: mf.notes
            };
            return acc;
          }, {} as { [month: string]: { quantity: number; unitPrice: number; notes?: string } }),
          confidence: editingForecast.confidence,
          notes: editingForecast.notes
        } : null}
      />
      </div>
    </Layout>
  );
};

export default RollingForecast;
