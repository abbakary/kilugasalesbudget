import React from 'react';
import { Home, Grid, TrendingUp, Package, Users, BarChart3, Truck } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAccessControl } from '../contexts/AuthContext';
import { UserType } from '../types/auth';

const HorizontalMenu: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboards',
      path: '/home',
      active: location.pathname === '/' || location.pathname === '/home'
    },
    {
      icon: Grid,
      label: 'Sales Budget',
      path: '/budgets',
      active: location.pathname === '/budgets'
    },
    {
      icon: TrendingUp,
      label: 'Rolling Forecast',
      path: '/forecasts',
      active: location.pathname === '/forecasts'
    }
  ];

  return (
    <aside className="layout-menu-horizontal menu menu-horizontal bg-white shadow-sm border-b border-gray-200">
      <div className="d-flex h-100 container-fluid">
        <div className="menu-horizontal-wrapper">
          <ul className="menu-inner flex items-center space-x-8 py-4 px-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path} className={`menu-item ${item.active ? 'active' : ''}`}>
                  <Link
                    to={item.path}
                    className={`menu-link flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      item.active
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="menu-icon w-5 h-5" />
                    <div className="hidden sm:block">{item.label}</div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default HorizontalMenu;
