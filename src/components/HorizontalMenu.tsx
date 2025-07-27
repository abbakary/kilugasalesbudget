import React from 'react';
import { Home, Grid, TrendingUp } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const HorizontalMenu: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboards',
      path: '/home',
      active: location.pathname === '/' || location.pathname === '/home' || location.pathname === '/dashboard'
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

            {/* Show role indicator */}
            {user && (
              <li className="ml-auto">
                <div className="px-3 py-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {user.user_type === UserType.ADMIN && 'Admin Panel'}
                    {user.user_type === UserType.SALESMAN && 'Sales View'}
                    {user.user_type === UserType.MANAGER && 'Manager View'}
                    {user.user_type === UserType.SUPPLY_CHAIN && 'Supply Chain View'}
                    {user.user_type === UserType.BRANCH_MANAGER && 'Branch View'}
                  </span>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default HorizontalMenu;
