import React from 'react';
import { Home, Grid, TrendingUp, BarChart3, Users, Package, Database, Activity } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAccessControl } from '../contexts/AuthContext';
import { UserType } from '../types/auth';

const HorizontalMenu: React.FC = () => {
  const location = useLocation();
  const { user, accessPattern } = useAccessControl();

  const allMenuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard',
      active: location.pathname === '/' || location.pathname === '/home' || location.pathname === '/dashboard',
      allowedRoles: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.SUPPLY_CHAIN, UserType.BRANCH_MANAGER],
      requiresAccess: () => true
    },
    {
      icon: Grid,
      label: 'Sales Budget',
      path: '/sales-budget',
      active: location.pathname === '/sales-budget',
      allowedRoles: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER],
      requiresAccess: () => accessPattern.canManageBudgets
    },
    {
      icon: TrendingUp,
      label: 'Rolling Forecast',
      path: '/rolling-forecast',
      active: location.pathname === '/rolling-forecast',
      allowedRoles: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER],
      requiresAccess: () => accessPattern.canViewReports
    },
    {
      icon: BarChart3,
      label: 'Distribution',
      path: '/distribution-management',
      active: location.pathname === '/distribution-management',
      allowedRoles: [UserType.ADMIN, UserType.SUPPLY_CHAIN],
      requiresAccess: () => accessPattern.canManageInventory
    },
    {
      icon: Package,
      label: 'Inventory',
      path: '/inventory-management',
      active: location.pathname === '/inventory-management',
      allowedRoles: [UserType.ADMIN, UserType.SUPPLY_CHAIN, UserType.MANAGER],
      requiresAccess: () => accessPattern.canManageInventory || accessPattern.canAccessDepartmentData
    },
    {
      icon: Activity,
      label: 'BI Dashboard',
      path: '/bi-dashboard',
      active: location.pathname === '/bi-dashboard',
      allowedRoles: [UserType.ADMIN, UserType.MANAGER, UserType.SALESMAN],
      requiresAccess: () => accessPattern.canViewAnalytics || accessPattern.canViewReports
    },
    {
      icon: Database,
      label: 'Data Sources',
      path: '/data-sources',
      active: location.pathname === '/data-sources',
      allowedRoles: [UserType.ADMIN, UserType.MANAGER],
      requiresAccess: () => accessPattern.canAccessFullSystem || accessPattern.canAccessDepartmentData
    },
    {
      icon: Users,
      label: 'User Management',
      path: '/user-management',
      active: location.pathname === '/user-management',
      allowedRoles: [UserType.ADMIN],
      requiresAccess: () => accessPattern.canManageUsers
    }
  ];

  // Filter menu items based on user role and access pattern
  const menuItems = allMenuItems.filter(item => {
    if (!user) return false;
    return item.allowedRoles.includes(user.user_type) && item.requiresAccess();
  });

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
            {menuItems.length === 0 && (
              <li className="text-gray-500 text-sm px-4 py-2">
                No menu items available for your role
              </li>
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default HorizontalMenu;
