import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Search,
  Bell,
  ChevronDown,
  BarChart3,
  TrendingUp,
  RotateCcw,
  Info as InfoIcon,
  Download as DownloadIcon,
  Plus,
  PieChart,
  MoreVertical,
  Check,
  Trash2,
  ChevronUp,
  Truck,
  Home,
  Grid,
  Minus,
  Edit,
  Save,
  X,
  Calendar
} from 'lucide-react';
import ExportModal, { ExportConfig } from '../components/ExportModal';
import NewAdditionModal, { NewItemData } from '../components/NewAdditionModal';
import DistributionModal, { DistributionConfig } from '../components/DistributionModal';
import DistributionManager from '../components/DistributionManager';
import YearlyBudgetModal from '../components/YearlyBudgetModal';

interface MonthlyBudget {
  month: string;
  budgetValue: number;
  actualValue: number;
  rate: number;
  stock: number;
  git: number;
  discount: number;
}

interface SalesBudgetItem {
  id: number;
  selected: boolean;
  customer: string;
  item: string;
  category: string;
  brand: string;
  itemCombined: string;
  budget2025: number;
  actual2025: number;
  budget2026: number;
  rate: number;
  stock: number;
  git: number;
  budgetValue2026: number;
  discount: number;
  monthlyData: MonthlyBudget[];
}

const SalesBudget: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedYear2025, setSelectedYear2025] = useState('2025');
  const [selectedYear2026, setSelectedYear2026] = useState('2026');
  const [withBudget2026, setWithBudget2026] = useState(false);
  const [withoutBudget2026, setWithoutBudget2026] = useState(false);
  const [activeView, setActiveView] = useState('customer-item');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewAdditionModalOpen, setIsNewAdditionModalOpen] = useState(false);
  const [newAdditionType, setNewAdditionType] = useState<'customer' | 'item'>('item');
  const [isDistributionModalOpen, setIsDistributionModalOpen] = useState(false);
  const [isYearlyBudgetModalOpen, setIsYearlyBudgetModalOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // GIT explanation state
  const [showGitExplanation, setShowGitExplanation] = useState(false);

  // Monthly editing state
  const [editingMonthlyData, setEditingMonthlyData] = useState<{[key: number]: MonthlyBudget[]}>({});

  // Distribution tracking state
  const [appliedDistributions, setAppliedDistributions] = useState<Array<{
    id: string;
    type: 'regional' | 'category' | 'customer' | 'seasonal' | 'channel';
    name: string;
    appliedAt: Date;
    segments: number;
    totalAmount: number;
    totalUnits: number;
    isActive: boolean;
    segments_detail: Array<{
      name: string;
      percentage: number;
      amount: number;
      units: number;
      color: string;
    }>;
  }>>([]);

  // Generate all months for the year
  const getAllYearMonths = () => {
    const currentDate = new Date();
    const months = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), i, 1);
      months.push({
        short: date.toLocaleDateString('en-US', { month: 'short' }),
        full: date.toLocaleDateString('en-US', { month: 'long' }),
        index: i
      });
    }
    return months;
  };

  const months = getAllYearMonths();

  // Initial data
  const initialData: SalesBudgetItem[] = [
    {
      id: 1,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "BF GOODRICH TYRE 235/85R16 120/116S TL AT/TA KO2 LRERWLGO",
      category: "Tyres",
      brand: "BF Goodrich",
      itemCombined: "BF GOODRICH TYRE 235/85R16 (Tyres - BF Goodrich)",
      budget2025: 1200000,
      actual2025: 850000,
      budget2026: 0,
      rate: 341,
      stock: 232,
      git: 0,
      budgetValue2026: 0,
      discount: 0,
      monthlyData: months.map(month => ({
        month: month.short,
        budgetValue: 0,
        actualValue: 0,
        rate: 341,
        stock: Math.floor(Math.random() * 100) + 50,
        git: Math.floor(Math.random() * 20),
        discount: 0
      }))
    },
    {
      id: 2,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "BF GOODRICH TYRE 265/65R17 120/117S TL AT/TA KO2 LRERWLGO",
      category: "Tyres",
      brand: "BF Goodrich",
      itemCombined: "BF GOODRICH TYRE 265/65R17 (Tyres - BF Goodrich)",
      budget2025: 980000,
      actual2025: 720000,
      budget2026: 0,
      rate: 412,
      stock: 7,
      git: 0,
      budgetValue2026: 0,
      discount: 0,
      monthlyData: months.map(month => ({
        month: month.short,
        budgetValue: 0,
        actualValue: 0,
        rate: 412,
        stock: Math.floor(Math.random() * 50) + 10,
        git: Math.floor(Math.random() * 15),
        discount: 0
      }))
    },
    {
      id: 3,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "VALVE 0214 TR 414J FOR CAR TUBELESS TYRE",
      category: "Accessories",
      brand: "Generic",
      itemCombined: "VALVE 0214 TR 414J (Accessories - Generic)",
      budget2025: 15000,
      actual2025: 18000,
      budget2026: 0,
      rate: 0.5,
      stock: 2207,
      git: 0,
      budgetValue2026: 0,
      discount: 0,
      monthlyData: months.map(month => ({
        month: month.short,
        budgetValue: 0,
        actualValue: 0,
        rate: 0.5,
        stock: Math.floor(Math.random() * 500) + 1000,
        git: 0,
        discount: 0
      }))
    },
    {
      id: 4,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "MICHELIN TYRE 265/65R17 112T TL LTX TRAIL",
      category: "Tyres",
      brand: "Michelin",
      itemCombined: "MICHELIN TYRE 265/65R17 (Tyres - Michelin)",
      budget2025: 875000,
      actual2025: 920000,
      budget2026: 0,
      rate: 300,
      stock: 127,
      git: 0,
      budgetValue2026: 0,
      discount: 0,
      monthlyData: months.map(month => ({
        month: month.short,
        budgetValue: 0,
        actualValue: 0,
        rate: 300,
        stock: Math.floor(Math.random() * 80) + 50,
        git: Math.floor(Math.random() * 25),
        discount: 0
      }))
    }
  ];

  const [originalTableData, setOriginalTableData] = useState<SalesBudgetItem[]>(initialData);
  const [tableData, setTableData] = useState<SalesBudgetItem[]>(initialData);

  // Add event listeners for filter changes
  useEffect(() => {
    // Apply filters whenever any filter changes
    const filteredData = originalTableData.filter(item => {
      const matchesCustomer = !selectedCustomer || item.customer.toLowerCase().includes(selectedCustomer.toLowerCase());
      const matchesCategory = !selectedCategory || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesBrand = !selectedBrand || item.brand.toLowerCase().includes(selectedBrand.toLowerCase());
      const matchesItem = !selectedItem || item.item.toLowerCase().includes(selectedItem.toLowerCase());
      return matchesCustomer && matchesCategory && matchesBrand && matchesItem;
    });
    setTableData(filteredData);
  }, [selectedCustomer, selectedCategory, selectedBrand, selectedItem, originalTableData]);

  const handleSelectRow = (id: number) => {
    setTableData(prev => prev.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSelectAll = () => {
    const allSelected = tableData.every(item => item.selected);
    setTableData(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  const handleEditMonthlyData = (rowId: number) => {
    const row = tableData.find(item => item.id === rowId);
    if (row) {
      setEditingRowId(rowId);
      setEditingMonthlyData({
        [rowId]: [...row.monthlyData]
      });
    }
  };

  const handleMonthlyDataChange = (rowId: number, monthIndex: number, field: keyof MonthlyBudget, value: number) => {
    setEditingMonthlyData(prev => ({
      ...prev,
      [rowId]: prev[rowId]?.map((month, index) => 
        index === monthIndex ? { ...month, [field]: value } : month
      ) || []
    }));
  };

  const handleSaveMonthlyData = (rowId: number) => {
    const monthlyData = editingMonthlyData[rowId];
    if (monthlyData) {
      // Calculate budget value 2026 from monthly data
      const budgetValue2026 = monthlyData.reduce((sum, month) => sum + month.budgetValue, 0);
      const totalBudget2026 = monthlyData.reduce((sum, month) => sum + (month.budgetValue * month.rate), 0);
      
      setTableData(prev => prev.map(item => 
        item.id === rowId ? {
          ...item,
          monthlyData: monthlyData,
          budget2026: budgetValue2026,
          budgetValue2026: totalBudget2026
        } : item
      ));
      
      setEditingRowId(null);
      setEditingMonthlyData(prev => {
        const newData = { ...prev };
        delete newData[rowId];
        return newData;
      });
      
      showNotification(`Monthly budget data saved for row ${rowId}`, 'success');
    }
  };

  const handleCancelMonthlyEdit = (rowId: number) => {
    setEditingRowId(null);
    setEditingMonthlyData(prev => {
      const newData = { ...prev };
      delete newData[rowId];
      return newData;
    });
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadBudget = () => {
    setIsExportModalOpen(true);
  };

  const handleExport = (config: ExportConfig) => {
    const fileName = `budget_${config.year}.${config.format === 'excel' ? 'xlsx' : config.format}`;
    showNotification(`Downloading budget for ${config.year} as ${fileName}...`, 'success');

    // Simulate download
    setTimeout(() => {
      showNotification(`Download completed: ${fileName}`, 'success');
    }, 2000);
  };

  const handleNewAddition = (type: 'customer' | 'item') => {
    setNewAdditionType(type);
    setIsNewAdditionModalOpen(true);
  };

  const handleAddNewItem = (itemData: NewItemData) => {
    if (newAdditionType === 'customer') {
      showNotification(`Customer "${itemData.customerName}" added successfully`, 'success');
    } else {
      // Add new item to original data
      const newId = Math.max(...originalTableData.map(item => item.id)) + 1;
      const newRow: SalesBudgetItem = {
        id: newId,
        selected: false,
        customer: selectedCustomer || "New Customer",
        item: itemData.itemName || "New Item",
        category: "New Category",
        brand: "New Brand",
        itemCombined: `${itemData.itemName} (New Category - New Brand)`,
        budget2025: 0,
        actual2025: 0,
        budget2026: 0,
        rate: itemData.unitPrice || 0,
        stock: itemData.stockLevel || 0,
        git: itemData.gitLevel || 0,
        budgetValue2026: 0,
        discount: 0,
        monthlyData: months.map(month => ({
          month: month.short,
          budgetValue: 0,
          actualValue: 0,
          rate: itemData.unitPrice || 0,
          stock: itemData.stockLevel || 0,
          git: itemData.gitLevel || 0,
          discount: 0
        }))
      };
      setOriginalTableData(prev => [...prev, newRow]);
      showNotification(`Item "${itemData.itemName}" added successfully`, 'success');
    }
  };

  const setDistribution = () => {
    setIsDistributionModalOpen(true);
  };

  const handleApplyDistribution = (distribution: DistributionConfig) => {
    // Implementation for distribution logic
    showNotification(
      `Distribution applied: ${Object.keys(distribution.distributions).length} segments created`,
      'success'
    );
  };

  // Calculate totals based on filtered data
  const totalBudget2025 = tableData.reduce((sum, item) => sum + item.budget2025, 0);
  const totalActual2025 = tableData.reduce((sum, item) => sum + item.actual2025, 0);
  const totalBudget2026 = tableData.reduce((sum, item) => sum + item.budget2026, 0);
  const budgetGrowth = totalBudget2025 > 0 ? ((totalBudget2026 - totalBudget2025) / totalBudget2025) * 100 : 0;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Main Content Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 m-4 overflow-hidden">
          {/* Stats Cards Row */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Stock Card */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="bg-green-200 p-3 rounded-full">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Stock</p>
                  <p className="text-xl font-bold text-green-600">
                    {tableData.reduce((sum, item) => sum + item.stock, 0).toLocaleString()} units
                  </p>
                </div>
              </div>

              {/* GIT Card */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 relative">
                <div className="bg-red-200 p-3 rounded-full">
                  <Truck className="w-7 h-7 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">GIT (Good In Transit)</p>
                    <button
                      onClick={() => setShowGitExplanation(!showGitExplanation)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <InfoIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xl font-bold text-red-600">
                    {tableData.reduce((sum, item) => sum + item.git, 0).toLocaleString()} units
                  </p>
                  {showGitExplanation && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-red-200 rounded-lg shadow-lg z-10">
                      <p className="text-xs text-gray-700">
                        <strong>GIT (Good In Transit):</strong> Items that have been shipped from suppliers
                        but haven't yet arrived at our warehouse. These are considered inventory assets
                        but are not available for immediate sale.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Button */}
              <div className="flex items-center justify-end">
                <button
                  onClick={handleDownloadBudget}
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <DownloadIcon className="w-5 h-5" />
                  <span>Download Budget ({selectedYear2026})</span>
                </button>
              </div>
            </div>

            {/* Info Alert and View Toggle */}
            <div className="flex justify-between items-center mb-4">
              <div className="bg-blue-50 border-l-4 border-blue-600 text-blue-800 p-4 rounded-r-lg flex items-center gap-2">
                <InfoIcon className="w-5 h-5" />
                <p className="font-bold">Instructions: Select a customer row to open monthly budget forms</p>
              </div>
              <div className="flex">
                <button 
                  onClick={() => setActiveView('customer-item')}
                  className={`px-6 py-2 font-semibold rounded-l-md ${
                    activeView === 'customer-item' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  Customer - Item
                </button>
                <button 
                  onClick={() => setActiveView('item-wise')}
                  className={`px-6 py-2 font-semibold rounded-r-md ${
                    activeView === 'item-wise' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  Item Wise
                </button>
              </div>
            </div>

            {/* Filters and Action Buttons Row */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              {/* Customer Filter */}
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
                <label className="block text-xs font-medium text-gray-700 mb-1">CUSTOMER:</label>
                <select 
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  <option value="">Select customer</option>
                  <option value="Action Aid International (Tz)">Action Aid International (Tz)</option>
                  <option value="other">Other Customer</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
                <label className="block text-xs font-medium text-gray-700 mb-1">CATEGORY:</label>
                <select 
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="Tyres">Tyres</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              {/* Brand Filter */}
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
                <label className="block text-xs font-medium text-gray-700 mb-1">BRAND:</label>
                <select 
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">Select brand</option>
                  <option value="BF Goodrich">BF Goodrich</option>
                  <option value="Michelin">Michelin</option>
                  <option value="Generic">Generic</option>
                </select>
              </div>

              {/* Item Filter */}
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
                <label className="block text-xs font-medium text-gray-700 mb-1">ITEM:</label>
                <select 
                  className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  <option value="">Select item</option>
                  <option value="BF GOODRICH TYRE 235/85R16">BF GOODRICH TYRE 235/85R16</option>
                  <option value="BF GOODRICH TYRE 265/65R17">BF GOODRICH TYRE 265/65R17</option>
                  <option value="VALVE 0214 TR 414J">VALVE 0214 TR 414J</option>
                  <option value="MICHELIN TYRE 265/65R17">MICHELIN TYRE 265/65R17</option>
                </select>
              </div>

              {/* Year Selectors */}
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
                <label className="block text-xs font-medium text-gray-700 mb-1">YEARS:</label>
                <div className="flex gap-1">
                  <select 
                    className="w-full text-xs p-1 border border-gray-300 rounded-md"
                    value={selectedYear2025}
                    onChange={(e) => setSelectedYear2025(e.target.value)}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                  <select 
                    className="w-full text-xs p-1 border border-gray-300 rounded-md"
                    value={selectedYear2026}
                    onChange={(e) => setSelectedYear2026(e.target.value)}
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setIsYearlyBudgetModalOpen(true)}
                    className="bg-green-600 text-white font-semibold px-2 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yearly Budget</span>
                  </button>
                  <button
                    onClick={setDistribution}
                    className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-blue-200 transition-colors"
                  >
                    <PieChart className="w-4 h-4" />
                    <span>Distribution</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Distribution Management */}
            <DistributionManager
              distributions={appliedDistributions}
              onEditDistribution={() => {}}
              onDeleteDistribution={() => {}}
              onDuplicateDistribution={() => {}}
              onToggleDistribution={() => {}}
              onCreateNew={() => setIsDistributionModalOpen(true)}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-600">Budget {selectedYear2025}</p>
                  <p className="text-lg font-semibold text-gray-900">${totalBudget2025.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{tableData.reduce((sum, item) => sum + item.budget2026, 0).toLocaleString()} Units</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-600">Actual {selectedYear2025}</p>
                  <p className="text-lg font-semibold text-gray-900">${totalActual2025.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{tableData.reduce((sum, item) => sum + item.actual2025, 0).toLocaleString()} Units</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-600">Budget {selectedYear2026}</p>
                  <p className="text-lg font-semibold text-gray-900">${totalBudget2026.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">{tableData.reduce((sum, item) => sum + item.budget2026, 0).toLocaleString()} Units</p>
                </div>
              </div>
              <div className="bg-white p-2 rounded shadow-sm border border-gray-200">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-600">Budget Growth (%)</p>
                  <p className="text-lg font-semibold text-gray-900">{budgetGrowth.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">From {selectedYear2025} to {selectedYear2026}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Data Table with Sticky Headers */}
            <div className="relative">
              <div className="overflow-auto max-h-[600px] border border-gray-300 rounded-lg">
                <table className="w-full bg-white border-collapse">
                  {/* Sticky Header */}
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="sticky left-0 bg-gray-50 z-20 p-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-600"
                          checked={tableData.every(item => item.selected)}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="sticky left-12 bg-gray-50 z-20 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200 min-w-[200px]">
                        Customer <ChevronUp className="w-4 h-4 inline ml-1" />
                      </th>
                      <th className="sticky left-[280px] bg-gray-50 z-20 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200 min-w-[300px]">
                        Item (Category - Brand) <ChevronUp className="w-4 h-4 inline ml-1" />
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[100px]">
                        BUD {selectedYear2025}
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[100px]">
                        ACT {selectedYear2025}
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-blue-50 min-w-[100px]">
                        BUD {selectedYear2026}
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[80px]">
                        RATE
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[80px]">
                        STK
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[80px]">
                        GIT
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[120px]">
                        BUD {selectedYear2026} Value
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[100px]">
                        DISCOUNT
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 min-w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    {tableData.map(row => (
                      <React.Fragment key={row.id}>
                        <tr className={`hover:bg-gray-50 ${row.selected ? 'bg-blue-50' : ''}`}>
                          <td className="sticky left-0 bg-white z-10 p-3 border-b border-r border-gray-200">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-blue-600"
                              checked={row.selected}
                              onChange={() => handleSelectRow(row.id)}
                            />
                          </td>
                          <td className="sticky left-12 bg-white z-10 p-3 border-b border-r border-gray-200 text-sm">
                            {row.customer}
                          </td>
                          <td className="sticky left-[280px] bg-white z-10 p-3 border-b border-r border-gray-200 text-sm">
                            <div className="max-w-[300px]">
                              <div className="font-medium text-gray-900 truncate" title={row.item}>
                                {row.item}
                              </div>
                              <div className="text-xs text-gray-500">
                                {row.category} - {row.brand}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 border-b border-gray-200 text-sm">
                            ${row.budget2025.toLocaleString()}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-sm">
                            ${row.actual2025.toLocaleString()}
                          </td>
                          <td className="p-3 border-b border-gray-200 bg-blue-50 text-sm">
                            <input
                              type="number"
                              className="w-20 p-1 text-center border border-gray-300 rounded"
                              value={row.budget2026}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setTableData(prev => prev.map(item =>
                                  item.id === row.id ? { ...item, budget2026: value } : item
                                ));
                              }}
                            />
                          </td>
                          <td className="p-3 border-b border-gray-200 text-sm">
                            ${row.rate}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-sm">
                            {row.stock}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-sm">
                            {row.git}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-sm">
                            ${row.budgetValue2026.toLocaleString()}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-sm">
                            ${row.discount.toLocaleString()}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-sm">
                            <div className="flex gap-1">
                              {editingRowId === row.id ? (
                                <>
                                  <button
                                    onClick={() => handleSaveMonthlyData(row.id)}
                                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                                    title="Save monthly data"
                                  >
                                    <Save className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleCancelMonthlyEdit(row.id)}
                                    className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                                    title="Cancel edit"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleEditMonthlyData(row.id)}
                                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                                  title="Edit monthly budget"
                                >
                                  <Calendar className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Monthly Data Entry Row */}
                        {editingRowId === row.id && (
                          <tr className="bg-gray-50">
                            <td colSpan={12} className="p-4 border-b border-gray-200">
                              <div className="bg-white rounded-lg p-4 border">
                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                  <Calendar className="w-5 h-5" />
                                  Monthly Budget Data for {selectedYear2026}
                                </h4>
                                
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100">
                                        <th className="p-2 text-left">Month</th>
                                        <th className="p-2 text-left">Budget Value</th>
                                        <th className="p-2 text-left">Rate</th>
                                        <th className="p-2 text-left">Stock</th>
                                        <th className="p-2 text-left">GIT</th>
                                        <th className="p-2 text-left">Discount</th>
                                        <th className="p-2 text-left">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {editingMonthlyData[row.id]?.map((month, monthIndex) => (
                                        <tr key={monthIndex} className="border-b">
                                          <td className="p-2 font-medium">{month.month}</td>
                                          <td className="p-2">
                                            <input
                                              type="number"
                                              className="w-20 p-1 border border-gray-300 rounded"
                                              value={month.budgetValue}
                                              onChange={(e) => handleMonthlyDataChange(
                                                row.id, 
                                                monthIndex, 
                                                'budgetValue', 
                                                parseInt(e.target.value) || 0
                                              )}
                                            />
                                          </td>
                                          <td className="p-2">
                                            <input
                                              type="number"
                                              className="w-20 p-1 border border-gray-300 rounded"
                                              value={month.rate}
                                              onChange={(e) => handleMonthlyDataChange(
                                                row.id, 
                                                monthIndex, 
                                                'rate', 
                                                parseFloat(e.target.value) || 0
                                              )}
                                            />
                                          </td>
                                          <td className="p-2">
                                            <input
                                              type="number"
                                              className="w-20 p-1 border border-gray-300 rounded"
                                              value={month.stock}
                                              onChange={(e) => handleMonthlyDataChange(
                                                row.id, 
                                                monthIndex, 
                                                'stock', 
                                                parseInt(e.target.value) || 0
                                              )}
                                            />
                                          </td>
                                          <td className="p-2">
                                            <input
                                              type="number"
                                              className="w-20 p-1 border border-gray-300 rounded"
                                              value={month.git}
                                              onChange={(e) => handleMonthlyDataChange(
                                                row.id, 
                                                monthIndex, 
                                                'git', 
                                                parseInt(e.target.value) || 0
                                              )}
                                            />
                                          </td>
                                          <td className="p-2">
                                            <input
                                              type="number"
                                              className="w-20 p-1 border border-gray-300 rounded"
                                              value={month.discount}
                                              onChange={(e) => handleMonthlyDataChange(
                                                row.id, 
                                                monthIndex, 
                                                'discount', 
                                                parseFloat(e.target.value) || 0
                                              )}
                                            />
                                          </td>
                                          <td className="p-2 font-medium">
                                            ${((month.budgetValue * month.rate) - month.discount).toLocaleString()}
                                          </td>
                                        </tr>
                                      )) || []}
                                    </tbody>
                                  </table>
                                </div>
                                
                                <div className="mt-4 flex justify-between items-center">
                                  <div className="text-sm text-gray-600">
                                    <strong>Total Budget Value:</strong> ${editingMonthlyData[row.id]?.reduce((sum, month) => sum + (month.budgetValue * month.rate) - month.discount, 0).toLocaleString() || 0}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSaveMonthlyData(row.id)}
                                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
                                    >
                                      <Save className="w-4 h-4" />
                                      Save & Apply
                                    </button>
                                    <button
                                      onClick={() => handleCancelMonthlyEdit(row.id)}
                                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
                                    >
                                      <X className="w-4 h-4" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
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
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
          title="Download Budget"
        />

        <NewAdditionModal
          isOpen={isNewAdditionModalOpen}
          onClose={() => setIsNewAdditionModalOpen(false)}
          onAdd={handleAddNewItem}
          type={newAdditionType}
        />

        <DistributionModal
          isOpen={isDistributionModalOpen}
          onClose={() => setIsDistributionModalOpen(false)}
          onApplyDistribution={handleApplyDistribution}
        />
      </div>
    </Layout>
  );
};

export default SalesBudget;
