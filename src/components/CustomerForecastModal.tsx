import React, { useState, useEffect } from 'react';
import { X, Plus, Save, TrendingUp, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { Customer, Item, ForecastFormData, MonthlyForecast } from '../types/forecast';

interface CustomerForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  items: Item[];
  onSaveForecast: (forecast: ForecastFormData) => void;
  existingForecast?: ForecastFormData | null;
}

const CustomerForecastModal: React.FC<CustomerForecastModalProps> = ({
  isOpen,
  onClose,
  customer,
  items,
  onSaveForecast,
  existingForecast
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState<string>('');
  const [monthlyData, setMonthlyData] = useState<{ [month: string]: { quantity: number; unitPrice: number; notes?: string } }>({});

  // Get remaining months of the current year
  const getCurrentYearRemainingMonths = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.slice(currentMonth).map((month, index) => ({
      name: month,
      index: currentMonth + index,
      year: currentYear
    }));
  };

  const remainingMonths = getCurrentYearRemainingMonths();

  // Initialize monthly data for remaining months
  useEffect(() => {
    if (isOpen) {
      const initialData: { [month: string]: { quantity: number; unitPrice: number; notes?: string } } = {};
      remainingMonths.forEach(month => {
        initialData[month.name] = {
          quantity: 0,
          unitPrice: 0,
          notes: ''
        };
      });
      setMonthlyData(initialData);
    }
  }, [isOpen]);

  // Load existing forecast if provided
  useEffect(() => {
    if (existingForecast) {
      setSelectedItemId(existingForecast.itemId);
      setConfidence(existingForecast.confidence);
      setNotes(existingForecast.notes || '');
      setMonthlyData(existingForecast.forecasts);
    }
  }, [existingForecast]);

  const handleMonthlyDataChange = (month: string, field: 'quantity' | 'unitPrice' | 'notes', value: number | string) => {
    setMonthlyData(prev => ({
      ...prev,
      [month]: {
        ...prev[month],
        [field]: field === 'notes' ? value : Number(value)
      }
    }));
  };

  const calculateMonthlyTotal = (month: string) => {
    const data = monthlyData[month];
    if (!data) return 0;
    return data.quantity * data.unitPrice;
  };

  const calculateYearlyTotal = () => {
    return Object.keys(monthlyData).reduce((total, month) => {
      return total + calculateMonthlyTotal(month);
    }, 0);
  };

  const getSelectedItem = () => {
    return items.find(item => item.id === selectedItemId);
  };

  const handleSave = () => {
    if (!customer || !selectedItemId) {
      alert('Please select a customer and item');
      return;
    }

    const forecastData: ForecastFormData = {
      customerId: customer.id,
      itemId: selectedItemId,
      forecasts: monthlyData,
      confidence,
      notes
    };

    onSaveForecast(forecastData);
    onClose();
  };

  const handleClose = () => {
    setSelectedItemId('');
    setConfidence('medium');
    setNotes('');
    setMonthlyData({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create Forecast for {customer?.name}
            </h2>
            <p className="text-sm text-gray-600">
              Enter monthly forecast data for remaining months of {new Date().getFullYear()}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-900">Customer</p>
                <p className="text-lg font-semibold text-blue-800">{customer?.name}</p>
                <p className="text-sm text-blue-600">{customer?.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Region</p>
                <p className="text-blue-800">{customer?.region}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Segment</p>
                <p className="text-blue-800">{customer?.segment}</p>
              </div>
            </div>
          </div>

          {/* Item Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Item to Forecast
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an item...</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.sku} - {item.name} ({item.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forecast Confidence
              </label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Confidence</option>
                <option value="medium">Medium Confidence</option>
                <option value="high">High Confidence</option>
              </select>
            </div>
          </div>

          {/* Selected Item Details */}
          {selectedItemId && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Selected Item Details</h3>
              {(() => {
                const item = getSelectedItem();
                if (!item) return null;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-600">SKU</p>
                      <p className="text-gray-900">{item.sku}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Name</p>
                      <p className="text-gray-900">{item.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Unit Price</p>
                      <p className="text-gray-900">${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Category</p>
                      <p className="text-gray-900">{item.category}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Monthly Forecast Input */}
          {selectedItemId && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Monthly Forecast Data
              </h3>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price ($)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Value ($)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {remainingMonths.map((month) => (
                        <tr key={month.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {month.name} {month.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              value={monthlyData[month.name]?.quantity || 0}
                              onChange={(e) => handleMonthlyDataChange(month.name, 'quantity', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={monthlyData[month.name]?.unitPrice || 0}
                              onChange={(e) => handleMonthlyDataChange(month.name, 'unitPrice', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ${calculateMonthlyTotal(month.name).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={monthlyData[month.name]?.notes || ''}
                              onChange={(e) => handleMonthlyDataChange(month.name, 'notes', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Optional notes..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">Yearly Total Forecast</span>
                  </div>
                  <span className="text-xl font-bold text-green-800">
                    ${calculateYearlyTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* General Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes about this forecast..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Forecast will be saved as draft and can be edited later</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedItemId}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Forecast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForecastModal;
