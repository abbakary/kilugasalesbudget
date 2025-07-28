import React, { useState } from 'react';
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
  Minus
} from 'lucide-react';
import ExportModal, { ExportConfig } from '../components/ExportModal';
import NewAdditionModal, { NewItemData } from '../components/NewAdditionModal';
import DistributionModal, { DistributionConfig } from '../components/DistributionModal';
import DistributionManager from '../components/DistributionManager';

const SalesBudget: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [withBudget2026, setWithBudget2026] = useState(false);
  const [withoutBudget2026, setWithoutBudget2026] = useState(false);
  const [activeView, setActiveView] = useState('customer-item');
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [unitInputs, setUnitInputs] = useState<{ [key: number]: string }>({});
  const [inlineFormRows, setInlineFormRows] = useState<Set<number>>(new Set());
  const [newRowData, setNewRowData] = useState<{ [key: number]: Partial<typeof tableData[0]> }>({});

  // Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewAdditionModalOpen, setIsNewAdditionModalOpen] = useState(false);
  const [newAdditionType, setNewAdditionType] = useState<'customer' | 'item'>('item');
  const [isDistributionModalOpen, setIsDistributionModalOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // GIT explanation state
  const [showGitExplanation, setShowGitExplanation] = useState(false);

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

  const [tableData, setTableData] = useState([
    {
      id: 1,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "BF GOODRICH TYRE 235/85R16 120/116S TL AT/TA KO2 LRERWLGO",
      act25: "0",
      bud25: "0",
      bud26: "0",
      rate: "341",
      stk: "232",
      git: "0",
      value: "$0",
      discount: "$0"
    },
    {
      id: 2,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "BF GOODRICH TYRE 265/65R17 120/117S TL AT/TA KO2 LRERWLGO",
      act25: "0",
      bud25: "0",
      bud26: "0",
      rate: "412",
      stk: "7",
      git: "0",
      value: "$0",
      discount: "$0"
    },
    {
      id: 3,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "VALVE 0214 TR 414J FOR CAR TUBELESS TYRE",
      act25: "6",
      bud25: "0",
      bud26: "0",
      rate: "0.5",
      stk: "2207",
      git: "0",
      value: "$0",
      discount: "$0"
    },
    {
      id: 4,
      selected: false,
      customer: "Action Aid International (Tz)",
      item: "MICHELIN TYRE 265/65R17 112T TL LTX TRAIL",
      act25: "6",
      bud25: "0",
      bud26: "0",
      rate: "300",
      stk: "127",
      git: "0",
      value: "$0",
      discount: "$0"
    }
  ]);

  const handleSelectRow = (id: number) => {
    setTableData(prev => prev.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSelectAll = () => {
    const allSelected = tableData.every(item => item.selected);
    setTableData(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  };

  const handleBudgetChange = (id: number, value: string) => {
    setTableData(prev => prev.map(item =>
      item.id === id ? { ...item, bud26: value } : item
    ));
  };

  const handleUnitInputChange = (id: number, value: string) => {
    setUnitInputs(prev => ({ ...prev, [id]: value }));
  };

  const toggleExpandRow = (id: number) => {
    setExpandedRowId(prev => (prev === id ? null : id));
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
    // Get selected rows
    const selectedRows = tableData.filter(row => row.selected);

    if (selectedRows.length === 0) {
      showNotification('Please select at least one row to add new items', 'error');
      return;
    }

    // Add inline forms to selected rows
    const selectedIds = new Set(selectedRows.map(row => row.id));
    setInlineFormRows(selectedIds);

    // Initialize form data for selected rows
    const initialData: { [key: number]: Partial<typeof tableData[0]> } = {};
    selectedRows.forEach(row => {
      initialData[row.id] = {
        item: '',
        rate: '0',
        stk: '0',
        git: '0'
      };
    });
    setNewRowData(initialData);
  };

  const handleInlineFormChange = (rowId: number, field: string, value: string) => {
    setNewRowData(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value
      }
    }));
  };

  const submitInlineForm = (rowId: number) => {
    const formData = newRowData[rowId];
    if (!formData || !formData.item) {
      showNotification('Please fill in the item name', 'error');
      return;
    }

    // Update the row with new data
    setTableData(prev => prev.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          item: formData.item || row.item,
          rate: formData.rate || row.rate,
          stk: formData.stk || row.stk,
          git: formData.git || row.git,
          selected: false
        };
      }
      return row;
    }));

    // Remove from inline forms
    setInlineFormRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      return newSet;
    });

    showNotification(`Item updated successfully for row ${rowId}`, 'success');
  };

  const cancelInlineForm = (rowId: number) => {
    setInlineFormRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      return newSet;
    });

    setNewRowData(prev => {
      const newData = { ...prev };
      delete newData[rowId];
      return newData;
    });
  };

  const handleAddNewItem = (itemData: NewItemData) => {
    if (newAdditionType === 'customer') {
      showNotification(`Customer "${itemData.customerName}" added successfully`, 'success');
    } else {
      // Add new item to table data
      const newId = Math.max(...tableData.map(item => item.id)) + 1;
      const newRow = {
        id: newId,
        selected: false,
        customer: selectedCustomer || "New Customer",
        item: itemData.itemName || "New Item",
        act25: "0",
        bud25: "0",
        bud26: "0",
        rate: itemData.unitPrice?.toString() || "0",
        stk: itemData.stockLevel?.toString() || "0",
        git: itemData.gitLevel?.toString() || "0",
        value: "$0",
        discount: "$0"
      };
      setTableData(prev => [...prev, newRow]);
      showNotification(`Item "${itemData.itemName}" added successfully`, 'success');
    }
  };

  const saveUnitChanges = (id: number) => {
    const units = unitInputs[id];
    if (units && parseInt(units) > 0) {
      handleBudgetChange(id, units);
      showNotification(`Units updated for item ID ${id}`, 'success');
    }
  };

  const setDistribution = () => {
    setIsDistributionModalOpen(true);
  };

  const handleApplyDistribution = (distribution: DistributionConfig) => {
    // Apply distribution to table data based on the selected type
    const distributionEntries = Object.entries(distribution.distributions);

    // Create new rows based on distribution
    const newRows = distributionEntries.map((entry, index) => {
      const [name, data] = entry;
      const newId = Math.max(...tableData.map(item => item.id)) + index + 1;

      return {
        id: newId,
        selected: false,
        customer: distribution.type === 'customer' ? name : selectedCustomer || "New Customer",
        item: distribution.type === 'category' ? `${name} Item` : `New ${name} Item`,
        act25: "0",
        bud25: "0",
        bud26: data.units.toString(),
        rate: Math.round(data.amount / (data.units || 1)).toString(),
        stk: data.units.toString(),
        git: "0",
        value: `$${data.amount.toLocaleString()}`,
        discount: "$0"
      };
    });

    // Add new rows to existing data
    setTableData(prev => [...prev, ...newRows]);

    // Track the applied distribution with detailed segments
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
    const distributionSummary = {
      id: `dist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: distribution.type,
      name: `${distribution.type.charAt(0).toUpperCase() + distribution.type.slice(1)} Distribution`,
      appliedAt: new Date(),
      segments: distributionEntries.length,
      totalAmount: distribution.totalBudget,
      totalUnits: distribution.totalUnits,
      isActive: true,
      segments_detail: distributionEntries.map(([name, data], index) => ({
        name,
        percentage: data.percentage,
        amount: data.amount,
        units: data.units,
        color: colors[index % colors.length]
      }))
    };

    setAppliedDistributions(prev => [...prev, distributionSummary]);

    showNotification(
      `Distribution applied: ${distributionEntries.length} ${distribution.type} segments created`,
      'success'
    );
  };

  const handleEditDistribution = (id: string) => {
    const distribution = appliedDistributions.find(d => d.id === id);
    if (distribution) {
      // Open distribution modal with existing data
      setIsDistributionModalOpen(true);
      showNotification(`Opening ${distribution.name} for editing`, 'success');
    }
  };

  const handleDeleteDistribution = (id: string) => {
    const distribution = appliedDistributions.find(d => d.id === id);
    if (distribution) {
      setAppliedDistributions(prev => prev.filter(d => d.id !== id));

      // Remove related table rows (this is a simplified approach)
      // In a real app, you'd track which rows belong to which distribution
      setTableData(prev => prev.filter(row =>
        !distribution.segments_detail.some(segment =>
          row.customer.includes(segment.name) || row.item.includes(segment.name)
        )
      ));

      showNotification(`${distribution.name} deleted successfully`, 'success');
    }
  };

  const handleDuplicateDistribution = (id: string) => {
    const distribution = appliedDistributions.find(d => d.id === id);
    if (distribution) {
      const duplicated = {
        ...distribution,
        id: `dist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${distribution.name} (Copy)`,
        appliedAt: new Date(),
        isActive: false
      };

      setAppliedDistributions(prev => [...prev, duplicated]);
      showNotification(`${distribution.name} duplicated successfully`, 'success');
    }
  };

  const handleToggleDistribution = (id: string) => {
    setAppliedDistributions(prev => prev.map(d =>
      d.id === id ? { ...d, isActive: !d.isActive } : d
    ));

    const distribution = appliedDistributions.find(d => d.id === id);
    if (distribution) {
      showNotification(
        `${distribution.name} ${distribution.isActive ? 'deactivated' : 'activated'}`,
        'success'
      );
    }
  };

  const handleCreateNewDistribution = () => {
    setIsDistributionModalOpen(true);
  };

  return (
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
                <p className="text-xl font-bold text-green-600">47,096 units</p>
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
                <p className="text-xl font-bold text-red-600">7,071 units</p>
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
                <span>Download Budget (2026)</span>
              </button>
            </div>
          </div>

          {/* Info Alert and View Toggle */}
          <div className="flex justify-between items-center mb-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 text-blue-800 p-4 rounded-r-lg flex items-center gap-2">
              <InfoIcon className="w-5 h-5" />
              <p className="font-bold">Instructions (how to use)</p>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Customer Filter */}
            <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
              <label className="block text-xs font-medium text-gray-700 mb-1">CUSTOMER:</label>
              <select 
                className="w-full text-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Select customer</option>
                <option value="action-aid">Action Aid International (Tz)</option>
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
                <option value="tyres">Tyres</option>
                <option value="accessories">Accessories</option>
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
                <option value="bf-goodrich">BF Goodrich</option>
                <option value="michelin">Michelin</option>
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
                <option value="tyre-235">BF GOODRICH TYRE 235/85R16</option>
                <option value="tyre-265">BF GOODRICH TYRE 265/65R17</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="bg-white p-3 rounded-lg shadow-sm border-2 border-yellow-400">
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex gap-1 mb-1">
                  <button
                    onClick={() => handleNewAddition('item')}
                    className="bg-green-600 text-white font-semibold px-2 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Edit Selected</span>
                  </button>
                  <button
                    onClick={() => {
                      const selectedCount = tableData.filter(row => row.selected).length;
                      if (selectedCount === 0) {
                        showNotification('Please select rows to clear forms', 'error');
                      } else {
                        setInlineFormRows(new Set());
                        setNewRowData({});
                        showNotification('Forms cleared', 'success');
                      }
                    }}
                    className="bg-red-500 text-white font-semibold px-2 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-red-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                    <span>Clear Forms</span>
                  </button>
                </div>
                <button
                  onClick={setDistribution}
                  className="bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-blue-200 transition-colors w-full"
                >
                  <PieChart className="w-4 h-4" />
                  <span>Set Distribution</span>
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input 
                    type="checkbox" 
                    className="w-3 h-3 border border-gray-300 rounded accent-blue-600"
                    checked={withBudget2026}
                    onChange={(e) => setWithBudget2026(e.target.checked)}
                  />
                  <span>With 2026 Budget</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input 
                    type="checkbox" 
                    className="w-3 h-3 border border-gray-300 rounded accent-blue-600"
                    checked={withoutBudget2026}
                    onChange={(e) => setWithoutBudget2026(e.target.checked)}
                  />
                  <span>Without 2026 Budget</span>
                </label>
              </div>
            </div>
          </div>

          {/* Distribution Management */}
          <DistributionManager
            distributions={appliedDistributions}
            onEditDistribution={handleEditDistribution}
            onDeleteDistribution={handleDeleteDistribution}
            onDuplicateDistribution={handleDuplicateDistribution}
            onToggleDistribution={handleToggleDistribution}
            onCreateNew={handleCreateNewDistribution}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <div className="bg-white p-2 rounded shadow-sm border border-gray-200 h-30">
              <div className="flex flex-col gap-1 h-full">
                <p className="text-xs text-gray-600">Budget 2025</p>
                <p className="text-lg font-semibold text-gray-900">$1,512,340</p>
                <p className="text-xs text-gray-600">5,042 Units</p>
              </div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm border border-gray-200 h-30">
              <div className="flex flex-col gap-1 h-full">
                <p className="text-xs text-gray-600">Sales 2025</p>
                <p className="text-lg font-semibold text-gray-900">$0</p>
                <p className="text-xs text-gray-600">0 Units</p>
              </div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm border border-gray-200 h-30">
              <div className="flex flex-col gap-1 h-full">
                <p className="text-xs text-gray-600">Budget 2026</p>
                <p className="text-lg font-semibold text-gray-900">$0</p>
                <p className="text-xs text-gray-600">0 Units</p>
              </div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm border border-gray-200 h-30">
              <div className="flex flex-col gap-1 h-full">
                <p className="text-xs text-gray-600">Budget Growth (%)</p>
                <p className="text-lg font-semibold text-gray-900">0 %</p>
                <p className="text-xs text-gray-600">Of the current year sales (2025)</p>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600"
                      checked={tableData.every(item => item.selected)}
                      onChange={handleSelectAll}
                    />
                  </th>
                  {[ 'Customer', 'Item', "BUD 25'", "ACT 25'", "BUD 26'", 'Rate', 'STK', 'GIT', "BUD 26' Value", 'Discount' ].map((label, idx) => (
                    <th
                      key={idx}
                      className={`p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 ${label === "BUD 26'" ? 'bg-blue-50' : ''}`}
                    >
                      {label} <ChevronUp className="w-4 h-4 inline ml-1" />
                    </th>
                  ))}
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <MoreVertical className="w-5 h-5" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map(row => (
                  <React.Fragment key={row.id}>
                    <tr className={`hover:bg-gray-50 ${row.selected ? 'bg-blue-50' : ''}`}>
                      <td className="p-3 border-b border-gray-200">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-600"
                          checked={row.selected}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </td>
                      <td className="p-3 border-b border-gray-200">{row.customer}</td>
                      <td className="p-3 border-b border-gray-200">
                        {inlineFormRows.has(row.id) ? (
                          <input
                            type="text"
                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newRowData[row.id]?.item || ''}
                            onChange={(e) => handleInlineFormChange(row.id, 'item', e.target.value)}
                            placeholder="Enter item name"
                          />
                        ) : (
                          row.item
                        )}
                      </td>
                      <td className="p-3 border-b border-gray-200">{row.bud25}</td>
                      <td className="p-3 border-b border-gray-200">{row.act25}</td>
                      <td className="p-3 border-b border-gray-200 bg-gray-50">
                        <input
                          type="text"
                          className="w-16 p-1 text-center border border-gray-300 rounded"
                          value={row.bud26}
                          onChange={(e) => handleBudgetChange(row.id, e.target.value)}
                        />
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {inlineFormRows.has(row.id) ? (
                          <input
                            type="number"
                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newRowData[row.id]?.rate || ''}
                            onChange={(e) => handleInlineFormChange(row.id, 'rate', e.target.value)}
                            placeholder="Rate"
                          />
                        ) : (
                          row.rate
                        )}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {inlineFormRows.has(row.id) ? (
                          <input
                            type="number"
                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newRowData[row.id]?.stk || ''}
                            onChange={(e) => handleInlineFormChange(row.id, 'stk', e.target.value)}
                            placeholder="Stock"
                          />
                        ) : (
                          row.stk
                        )}
                      </td>
                      <td className="p-3 border-b border-gray-200">
                        {inlineFormRows.has(row.id) ? (
                          <input
                            type="number"
                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newRowData[row.id]?.git || ''}
                            onChange={(e) => handleInlineFormChange(row.id, 'git', e.target.value)}
                            placeholder="GIT"
                          />
                        ) : (
                          row.git
                        )}
                      </td>
                      <td className="p-3 border-b border-gray-200">{row.value}</td>
                      <td className="p-3 border-b border-gray-200">{row.discount}</td>
                      <td className="p-3 border-b border-gray-200 text-sm text-gray-600">
                        <div className="flex justify-center gap-1">
                          {inlineFormRows.has(row.id) ? (
                            <>
                              <button
                                onClick={() => submitInlineForm(row.id)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => cancelInlineForm(row.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors ml-1"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => toggleExpandRow(row.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {expandedRowId === row.id ? (
                                <Minus className="w-5 h-5" />
                              ) : (
                                <Plus className="w-5 h-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {expandedRowId === row.id && !inlineFormRows.has(row.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan={13} className="p-4 border-b border-gray-200">
                          <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700">
                              Add Units for: {row.item}
                            </label>
                            <input
                              type="number"
                              className="w-32 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={unitInputs[row.id] || ''}
                              onChange={(e) => handleUnitInputChange(row.id, e.target.value)}
                              placeholder="Enter units"
                            />
                            <button
                              onClick={() => saveUnitChanges(row.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                            >
                              Save
                            </button>
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
  );
};

export default SalesBudget;
