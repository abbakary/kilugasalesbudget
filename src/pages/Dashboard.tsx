import React from 'react';
import StatsCard from '../components/StatsCard';
import { PieChartIcon, TrendingUp, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const statsData = [
    {
      title: 'Total Budget Units',
      value: '5,042',
      subtitle: 'As of current year',
      icon: PieChartIcon,
      color: 'primary' as const,
      trend: null
    },
    {
      title: 'Total Sales',
      value: '$0',
      subtitle: 'Last Week Analysis',
      icon: TrendingUp,
      color: 'success' as const,
      trend: null
    },
    {
      title: 'Total Sold Units',
      value: '0',
      subtitle: 'Last Week Analysis',
      icon: Clock,
      color: 'info' as const,
      trend: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between flex items-center justify-between">
        <h4 className="fw-bold py-1 mb-4 text-2xl font-bold text-gray-900">
          <span className="text-muted fw-light text-gray-500">Dashboard /</span> Statistics
        </h4>
        <div className="d-flex justify-content-between"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="col-span-1 md:col-span-1 lg:col-span-1">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;