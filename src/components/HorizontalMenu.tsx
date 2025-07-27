import React from 'react';
import { Home, Grid, TrendingUp, Package, Users, BarChart3, Truck } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAccessControl } from '../contexts/AuthContext';
import { UserType } from '../types/auth';

const HorizontalMenu: React.FC = () => {
  const location = useLocation();
  const { canAccess, user } = useAccessControl();

  const allMenuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard',
      active: location.pathname === '/dashboard' || location.pathname === '/home',
      userTypes: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.SUPPLY_CHAIN, UserType.BRANCH_MANAGER]
    },
    {
      icon: Grid,
      label: 'Sales Budget',
      path: '/budgets',
      active: location.pathname === '/budgets',
      userTypes: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]
    },
    {
      icon: TrendingUp,
      label: 'Rolling Forecast',
      path: '/forecasts',
      active: location.pathname === '/forecasts',
      userTypes: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]
    },
    {
      icon: Truck,
      label: 'Distribution',
      path: '/distribution',
      active: location.pathname === '/distribution',
      userTypes: [UserType.ADMIN, UserType.SUPPLY_CHAIN]
    },
    {
      icon: Package,
      label: 'Inventory',
      path: '/inventory',
      active: location.pathname === '/inventory',
      userTypes: [UserType.ADMIN, UserType.SUPPLY_CHAIN, UserType.MANAGER]
    },
    {
      icon: BarChart3,
      label: 'Reports',
      path: '/reports',
      active: location.pathname === '/reports',
      userTypes: [UserType.ADMIN, UserType.MANAGER, UserType.BRANCH_MANAGER]
    },
    {
      icon: Users,
      label: 'User Management',
      path: '/users',
      active: location.pathname === '/users',
      userTypes: [UserType.ADMIN]
    }
  ];

  // Filter menu items based on user type
  const menuItems = allMenuItems.filter(item => canAccess(item.userTypes));

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
