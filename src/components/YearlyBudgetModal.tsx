import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Download, Plus, Minus, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface MonthlyBudget {
  month: string;
  budgetValue: number;
  actualValue: number;
  rate: number;
  stock: number;
  git: number;
  discount: number;
}

interface YearlyBudgetData {
  customer: string;
  item: string;
  category: string;
  brand: string;
  year: string;
  totalBudget: number;
  monthlyData: MonthlyBudget[];
}

interface YearlyBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: YearlyBudgetData) => void;
  selectedCustomer?: string;
  year: string;
}

const YearlyBudgetModal: React.FC<YearlyBudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedCustomer = '',
  year
}) => {
  const [budgetData, setBudgetData] = useState<YearlyBudgetData>({
    customer: selectedCustomer,
    item: '',
    category: '',
    brand: '',
    year,
    totalBudget: 0,
    monthlyData: []
  });

  const [activeView, setActiveView] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Generate all months
  const getAllMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(parseInt(year), i, 1);
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        full: date.toLocaleDateString('en-US', { month: 'long' }),
        budgetValue: 0,
        actualValue: 0,
        rate: 0,
        stock: 0,
        git: 0,
        discount: 0
      });
    }
    return months;
  };

  useEffect(() => {
    if (isOpen) {
      setBudgetData(prev => ({
        ...prev,
        customer: selectedCustomer,
        monthlyData: getAllMonths()
      }));
    }
  }, [isOpen, selectedCustomer, year]);

  const handleMonthlyChange = (monthIndex: number, field: keyof MonthlyBudget, value: number) => {
    setBudgetData(prev => ({
      ...prev,
      monthlyData: prev.monthlyData.map((month, index) =>
        index === monthIndex ? { ...month, [field]: value } : month
      )
    }));
  };

  const calculateTotals = () => {
    const totalBudget = budgetData.monthlyData.reduce((sum, month) => sum + (month.budgetValue * month.rate), 0);
    const totalUnits = budgetData.monthlyData.reduce((sum, month) => sum + month.budgetValue, 0);
    const totalDiscount = budgetData.monthlyData.reduce((sum, month) => sum + month.discount, 0);
    const netBudget = totalBudget - totalDiscount;
    
    return { totalBudget, totalUnits, totalDiscount, netBudget };
  };

  const distributeEvenly = () => {
    const monthlyValue = budgetData.totalBudget / 12;
    setBudgetData(prev => ({
      ...prev,
      monthlyData: prev.monthlyData.map(month => ({
        ...month,
        budgetValue: Math.round(monthlyValue)
      }))
    }));
  };

  const applySeasonalPattern = () => {
    // Apply seasonal pattern: higher in Q4, lower in Q1
    const seasonalMultipliers = [0.8, 0.8, 0.9, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2, 1.2, 1.3, 1.4];
    const baseValue = budgetData.totalBudget / 12;
    
    setBudgetData(prev => ({
      ...prev,
      monthlyData: prev.monthlyData.map((month, index) => ({
        ...month,
        budgetValue: Math.round(baseValue * seasonalMultipliers[index])
      }))
    }));
  };

  const handleSave = () => {
    const totals = calculateTotals();
    const finalData = {
      ...budgetData,
      totalBudget: totals.netBudget
    };
    onSave(finalData);
    onClose();
  };

  const totals = calculateTotals();

  if (!isOpen) {
    console.log('YearlyBudgetModal is not open');
    return null;
  }

  console.log('YearlyBudgetModal is rendering, isOpen:', isOpen);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-green-50 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">📊 Create Yearly Budget - {year}</h2>
            <p className="text-gray-600 text-sm sm:text-base">Follow these simple steps to create your comprehensive yearly budget plan</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Left Panel - Step-by-Step Guide */}
          <div className="w-full lg:w-1/3 p-4 sm:p-6 border-r bg-gray-50 overflow-y-auto">
            {/* Steps Guide */}
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">🎯 How to Create Your Budget</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-blue-900">Fill Basic Information</p>
                    <p className="text-blue-700">Enter customer, item, category, and brand details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-blue-900">Set Total Budget Amount</p>
                    <p className="text-blue-700">Enter your total yearly budget in dollars</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-blue-900">Distribute to Months</p>
                    <p className="text-blue-700">Use quick buttons or manually edit monthly values</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-blue-900">Save Your Budget</p>
                    <p className="text-blue-700">Review and save to add to your budget table</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={budgetData.customer}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, customer: e.target.value }))}
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item/Product <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={budgetData.item}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, item: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={budgetData.category}
                    onChange={(e) => setBudgetData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    <option value="Tyres">Tyres</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Batteries">Batteries</option>
                    <option value="Oil & Lubricants">Oil & Lubricants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={budgetData.brand}
                    onChange={(e) => setBudgetData(prev => ({ ...prev, brand: e.target.value }))}
                  >
                    <option value="">Select brand</option>
                    <option value="BF Goodrich">BF Goodrich</option>
                    <option value="Michelin">Michelin</option>
                    <option value="Generic">Generic</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                  Set Total Budget
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Yearly Budget (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                      value={budgetData.totalBudget}
                      onChange={(e) => setBudgetData(prev => ({ ...prev, totalBudget: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">This amount will be distributed across all 12 months</p>
                </div>
              </div>

              {/* Distribution Buttons */}
              <div className="pt-4 border-t">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                  Distribute to Months
                </h4>
                <p className="text-sm text-gray-600 mb-3">Choose how to spread your budget across the year:</p>
                <div className="space-y-2">
                  <button
                    onClick={distributeEvenly}
                    className="w-full bg-blue-100 text-blue-800 px-4 py-3 rounded-lg text-sm hover:bg-blue-200 transition-colors flex items-center gap-2"
                    disabled={!budgetData.totalBudget}
                  >
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <div className="text-left">
                      <div className="font-medium">Equal Distribution</div>
                      <div className="text-xs text-blue-600">Same amount each month (${Math.round((budgetData.totalBudget || 0) / 12).toLocaleString()}/month)</div>
                    </div>
                  </button>
                  <button
                    onClick={applySeasonalPattern}
                    className="w-full bg-green-100 text-green-800 px-4 py-3 rounded-lg text-sm hover:bg-green-200 transition-colors flex items-center gap-2"
                    disabled={!budgetData.totalBudget}
                  >
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <div className="text-left">
                      <div className="font-medium">Seasonal Distribution</div>
                      <div className="text-xs text-green-600">Higher in Q4, lower in Q1 (realistic seasonal pattern)</div>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">💡 Or manually edit each month in the table on the right</p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-3 pt-4 border-t">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Total Budget</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">${totals.totalBudget.toLocaleString()}</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Total Units</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">{totals.totalUnits.toLocaleString()}</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Net Budget</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600">${totals.netBudget.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Monthly Budget Table */}
          <div className="flex-1 flex flex-col min-h-0 h-full">
            {/* Monthly Budget Header */}
            <div className="p-3 sm:p-4 border-b bg-white flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                    Monthly Budget Details
                  </h4>
                  <p className="text-sm text-gray-600">
                    {budgetData.totalBudget > 0
                      ? `Edit individual months below. Total: $${budgetData.totalBudget.toLocaleString()}`
                      : "Enter total budget amount first, then distribute to months"
                    }
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Budget Table with Sticky Headers */}
            <div className="flex-1 p-3 sm:p-4 flex flex-col min-h-0">
              <div className="border border-gray-300 rounded-lg bg-white flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-auto" style={{ minHeight: '300px', maxHeight: '500px' }}>
                  <table className="w-full border-collapse min-w-[800px]">
                    {/* Sticky Header */}
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[80px]">
                          Month
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[120px]" title="Number of units to budget for this month">
                          📦 Budget Units
                          <div className="text-xs font-normal text-gray-500">Qty to sell</div>
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[100px]" title="Price per unit">
                          💰 Rate ($)
                          <div className="text-xs font-normal text-gray-500">Price/unit</div>
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[100px]" title="Stock level">
                          📊 Stock
                          <div className="text-xs font-normal text-gray-500">Inventory</div>
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[80px]" title="Goods in Transit">
                          🚛 GIT
                          <div className="text-xs font-normal text-gray-500">In transit</div>
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[100px]" title="Discount amount">
                          🏷️ Discount ($)
                          <div className="text-xs font-normal text-gray-500">Deduction</div>
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[120px]" title="Final calculated value">
                          ✅ Total Value ($)
                          <div className="text-xs font-normal text-gray-500">Units × Rate - Discount</div>
                        </th>
                      </tr>
                    </thead>
                    
                    {/* Scrollable Body */}
                    <tbody>
                      {budgetData.monthlyData.map((month, index) => (
                        <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                          <td className="border-r border-gray-200 p-3 font-medium bg-gray-50 sticky left-0 z-5">
                            {month.month}
                          </td>
                          <td className="border-r border-gray-200 p-3">
                            <input
                              type="number"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={month.budgetValue}
                              onChange={(e) => handleMonthlyChange(index, 'budgetValue', parseInt(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-3">
                            <input
                              type="number"
                              step="0.01"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={month.rate}
                              onChange={(e) => handleMonthlyChange(index, 'rate', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-3">
                            <input
                              type="number"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={month.stock}
                              onChange={(e) => handleMonthlyChange(index, 'stock', parseInt(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-3">
                            <input
                              type="number"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={month.git}
                              onChange={(e) => handleMonthlyChange(index, 'git', parseInt(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </td>
                          <td className="border-r border-gray-200 p-3">
                            <input
                              type="number"
                              step="0.01"
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={month.discount}
                              onChange={(e) => handleMonthlyChange(index, 'discount', parseFloat(e.target.value) || 0)}
                              placeholder="0.00"
                            />
                          </td>
                          <td className="p-3 font-semibold text-green-600 bg-green-50">
                            ${((month.budgetValue * month.rate) - month.discount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                    {/* Sticky Footer */}
                    <tfoot className="sticky bottom-0 z-10">
                      <tr className="bg-gray-200 font-bold border-t-2 border-gray-400">
                        <td className="border-r border-gray-400 p-3 font-bold text-gray-800 bg-gray-200 sticky left-0 z-15">
                          TOTAL
                        </td>
                        <td className="border-r border-gray-400 p-3 font-bold text-blue-600 bg-blue-50">
                          {totals.totalUnits.toLocaleString()}
                        </td>
                        <td className="border-r border-gray-400 p-3 text-gray-500 bg-gray-200">
                          -
                        </td>
                        <td className="border-r border-gray-400 p-3 font-bold text-gray-800 bg-gray-200">
                          {budgetData.monthlyData.reduce((sum, month) => sum + month.stock, 0).toLocaleString()}
                        </td>
                        <td className="border-r border-gray-400 p-3 font-bold text-gray-800 bg-gray-200">
                          {budgetData.monthlyData.reduce((sum, month) => sum + month.git, 0).toLocaleString()}
                        </td>
                        <td className="border-r border-gray-400 p-3 font-bold text-red-600 bg-red-50">
                          ${totals.totalDiscount.toLocaleString()}
                        </td>
                        <td className="p-3 font-bold text-green-700 bg-green-100 text-lg">
                          ${totals.netBudget.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-between flex-shrink-0">
              <div className="text-sm text-gray-600">
                💡 <strong>Tip:</strong> Make sure all required fields are filled and your monthly distribution adds up to your target budget.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 sm:px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!budgetData.customer || !budgetData.item || !budgetData.totalBudget}
                  className={`px-4 sm:px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                    budgetData.customer && budgetData.item && budgetData.totalBudget
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {budgetData.customer && budgetData.item && budgetData.totalBudget
                    ? 'Save & Add to Budget Table'
                    : 'Fill Required Fields'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyBudgetModal;
