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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Yearly Budget Planning - {year}</h2>
            <p className="text-gray-600 text-sm sm:text-base">Create comprehensive budget for all months</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Left Panel - Budget Info */}
          <div className="w-full lg:w-1/3 p-4 sm:p-6 border-r bg-gray-50 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Budget Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={budgetData.customer}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, customer: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={budgetData.item}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, item: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                    className="w-full p-3 border border-gray-300 rounded-lg"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Yearly Budget</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={budgetData.totalBudget}
                  onChange={(e) => setBudgetData(prev => ({ ...prev, totalBudget: parseInt(e.target.value) || 0 }))}
                />
              </div>

              {/* Distribution Buttons */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Quick Distribution</h4>
                <div className="flex gap-2">
                  <button
                    onClick={distributeEvenly}
                    className="flex-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                  >
                    Even Split
                  </button>
                  <button
                    onClick={applySeasonalPattern}
                    className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors"
                  >
                    Seasonal
                  </button>
                </div>
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
          <div className="flex-1 flex flex-col min-h-0">
            {/* View Toggle */}
            <div className="p-3 sm:p-4 border-b bg-white flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex rounded-lg border overflow-hidden">
                  <button
                    onClick={() => setActiveView('monthly')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ${
                      activeView === 'monthly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Monthly View
                  </button>
                  <button
                    onClick={() => setActiveView('quarterly')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium ${
                      activeView === 'quarterly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Quarterly View
                  </button>
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
            <div className="flex-1 p-3 sm:p-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white h-full">
                <div className="h-full overflow-auto">
                  <table className="w-full border-collapse">
                    {/* Sticky Header */}
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[80px]">
                          Month
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[120px]">
                          Budget Units
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[100px]">
                          Rate ($)
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[100px]">
                          Stock
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[80px]">
                          GIT
                        </th>
                        <th className="border-r border-gray-300 p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[100px]">
                          Discount ($)
                        </th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700 bg-gray-100 min-w-[120px]">
                          Total Value ($)
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
              <button
                onClick={onClose}
                className="order-2 sm:order-1 px-4 sm:px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="order-1 sm:order-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Save className="w-4 h-4" />
                Save Yearly Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyBudgetModal;
