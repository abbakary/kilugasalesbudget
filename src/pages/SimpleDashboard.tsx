import React from 'react';

const SimpleDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sales Budget Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Budget Units</h3>
            <p className="text-3xl font-bold text-blue-600">5,042</p>
            <p className="text-sm text-gray-500">As of current year</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
            <p className="text-3xl font-bold text-green-600">$2.4M</p>
            <p className="text-sm text-gray-500">Current performance</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Target Achievement</h3>
            <p className="text-3xl font-bold text-purple-600">87%</p>
            <p className="text-sm text-gray-500">Monthly progress</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
            <p className="text-3xl font-bold text-indigo-600">45</p>
            <p className="text-sm text-gray-500">System users</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900">Budget Planning</h3>
              <p className="text-sm text-gray-600">Create and manage budgets</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900">Sales Analysis</h3>
              <p className="text-sm text-gray-600">View sales performance</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900">Forecasting</h3>
              <p className="text-sm text-gray-600">Generate forecasts</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
