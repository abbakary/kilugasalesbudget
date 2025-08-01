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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Yearly Budget Planning - {year}</h2>
            <p className="text-gray-600">Create comprehensive budget for all months</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Panel - Budget Info */}
          <div className="w-full lg:w-1/3 p-6 border-r bg-gray-50">
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
          <div className="flex-1 flex flex-col">
            {/* View Toggle */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex rounded-lg border overflow-hidden">
                  <button
                    onClick={() => setActiveView('monthly')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeView === 'monthly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Monthly View
                  </button>
                  <button
                    onClick={() => setActiveView('quarterly')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeView === 'quarterly'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Quarterly View
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly Budget Table */}
            <div className="flex-1 overflow-auto p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium">Month</th>
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium">Budget Units</th>
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium">Rate ($)</th>
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium">Stock</th>
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium">GIT</th>
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium">Discount ($)</th>
                      <th className="border border-gray-300 p-3 text-left text-sm font-medium">Total Value ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetData.monthlyData.map((month, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">{month.month}</td>
                        <td className="border border-gray-300 p-3">
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={month.budgetValue}
                            onChange={(e) => handleMonthlyChange(index, 'budgetValue', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            type="number"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={month.rate}
                            onChange={(e) => handleMonthlyChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={month.stock}
                            onChange={(e) => handleMonthlyChange(index, 'stock', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={month.git}
                            onChange={(e) => handleMonthlyChange(index, 'git', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="border border-gray-300 p-3">
                          <input
                            type="number"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={month.discount}
                            onChange={(e) => handleMonthlyChange(index, 'discount', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td className="border border-gray-300 p-3 font-medium text-green-600">
                          ${((month.budgetValue * month.rate) - month.discount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="border border-gray-300 p-3">TOTAL</td>
                      <td className="border border-gray-300 p-3">{totals.totalUnits.toLocaleString()}</td>
                      <td className="border border-gray-300 p-3">-</td>
                      <td className="border border-gray-300 p-3">
                        {budgetData.monthlyData.reduce((sum, month) => sum + month.stock, 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {budgetData.monthlyData.reduce((sum, month) => sum + month.git, 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 p-3">${totals.totalDiscount.toLocaleString()}</td>
                      <td className="border border-gray-300 p-3 text-green-600">${totals.netBudget.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
