export enum UserType {
  ADMIN = 1,
  SALESMAN = 2,
  MANAGER = 3,
  SUPPLY_CHAIN = 4,
  BRANCH_MANAGER = 5
}

export interface User {
  id: number;
  name: string;
  email: string;
  user_type: UserType;
  department?: string;
  location?: string;
  budget_id?: number;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

// Role-based access patterns
export interface AccessPattern {
  canAccessFullSystem: boolean;
  canAccessDepartmentData: boolean;
  canAccessLocationData: boolean;
  canAccessOwnData: boolean;
  canManageUsers: boolean;
  canManageBudgets: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canManageInventory: boolean;
  canViewAnalytics: boolean;
}

// Default access patterns for each user type
export const USER_ACCESS_PATTERNS: Record<UserType, AccessPattern> = {
  [UserType.ADMIN]: {
    canAccessFullSystem: true,
    canAccessDepartmentData: true,
    canAccessLocationData: true,
    canAccessOwnData: true,
    canManageUsers: true,
    canManageBudgets: true,
    canViewReports: true,
    canExportData: true,
    canManageInventory: true,
    canViewAnalytics: true,
  },
  [UserType.SALESMAN]: {
    canAccessFullSystem: false,
    canAccessDepartmentData: false,
    canAccessLocationData: false,
    canAccessOwnData: true,
    canManageUsers: false,
    canManageBudgets: true, // Only their own budgets
    canViewReports: true, // Only their own reports
    canExportData: true, // Only their own data
    canManageInventory: false,
    canViewAnalytics: true, // Limited to their data
  },
  [UserType.MANAGER]: {
    canAccessFullSystem: false,
    canAccessDepartmentData: true,
    canAccessLocationData: false,
    canAccessOwnData: true,
    canManageUsers: false,
    canManageBudgets: true, // Department budgets
    canViewReports: true, // Department reports
    canExportData: true, // Department data
    canManageInventory: false,
    canViewAnalytics: true, // Department analytics
  },
  [UserType.SUPPLY_CHAIN]: {
    canAccessFullSystem: false,
    canAccessDepartmentData: false,
    canAccessLocationData: false,
    canAccessOwnData: true,
    canManageUsers: false,
    canManageBudgets: false,
    canViewReports: true, // Inventory reports
    canExportData: true, // Inventory data
    canManageInventory: true,
    canViewAnalytics: true, // Inventory analytics
  },
  [UserType.BRANCH_MANAGER]: {
    canAccessFullSystem: false,
    canAccessDepartmentData: false,
    canAccessLocationData: true,
    canAccessOwnData: true,
    canManageUsers: false,
    canManageBudgets: true, // Location budgets
    canViewReports: true, // Location reports
    canExportData: true, // Location data
    canManageInventory: false,
    canViewAnalytics: true, // Location analytics
  },
};

// Navigation items based on user type
export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  requiredPermissions?: string[];
  userTypes: UserType[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
    userTypes: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.SUPPLY_CHAIN, UserType.BRANCH_MANAGER],
  },
  {
    label: 'Sales Budget',
    path: '/budgets',
    icon: 'budget',
    userTypes: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER],
  },
  {
    label: 'Rolling Forecast',
    path: '/forecasts',
    icon: 'forecast',
    userTypes: [UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER],
  },
  {
    label: 'Distribution Management',
    path: '/distribution',
    icon: 'distribution',
    userTypes: [UserType.ADMIN, UserType.SUPPLY_CHAIN],
  },
  {
    label: 'Inventory Management',
    path: '/inventory',
    icon: 'inventory',
    userTypes: [UserType.ADMIN, UserType.SUPPLY_CHAIN, UserType.MANAGER],
  },
  {
    label: 'User Management',
    path: '/users',
    icon: 'users',
    userTypes: [UserType.ADMIN],
  },
  {
    label: 'Reports & Analytics',
    path: '/reports',
    icon: 'reports',
    userTypes: [UserType.ADMIN, UserType.MANAGER, UserType.BRANCH_MANAGER],
  },
];

// Mock user data for development
export const MOCK_USERS: Record<string, User> = {
  'admin@example.com': {
    id: 1,
    name: 'System Administrator',
    email: 'admin@example.com',
    user_type: UserType.ADMIN,
    permissions: [
      { id: 1, name: 'manage_users', description: 'Manage all users' },
      { id: 2, name: 'manage_system', description: 'Manage system settings' },
    ],
  },
  'salesman@example.com': {
    id: 2,
    name: 'John Salesman',
    email: 'salesman@example.com',
    user_type: UserType.SALESMAN,
    budget_id: 101,
    department: 'Sales',
    permissions: [
      { id: 3, name: 'manage_own_budget', description: 'Manage own budget' },
    ],
  },
  'manager@example.com': {
    id: 3,
    name: 'Jane Manager',
    email: 'manager@example.com',
    user_type: UserType.MANAGER,
    department: 'Sales',
    permissions: [
      { id: 4, name: 'manage_department_budgets', description: 'Manage department budgets' },
      { id: 5, name: 'view_department_reports', description: 'View department reports' },
    ],
  },
  'supply@example.com': {
    id: 4,
    name: 'Bob Supply Chain',
    email: 'supply@example.com',
    user_type: UserType.SUPPLY_CHAIN,
    department: 'Supply Chain',
    permissions: [
      { id: 6, name: 'manage_inventory', description: 'Manage inventory' },
      { id: 7, name: 'view_stock_reports', description: 'View stock reports' },
    ],
  },
  'branch@example.com': {
    id: 5,
    name: 'Alice Branch Manager',
    email: 'branch@example.com',
    user_type: UserType.BRANCH_MANAGER,
    location: 'New York',
    permissions: [
      { id: 8, name: 'manage_location_budgets', description: 'Manage location budgets' },
      { id: 9, name: 'view_location_reports', description: 'View location reports' },
    ],
  },
};

export const getUserTypeName = (userType: UserType): string => {
  switch (userType) {
    case UserType.ADMIN:
      return 'Administrator';
    case UserType.SALESMAN:
      return 'Salesman';
    case UserType.MANAGER:
      return 'Manager';
    case UserType.SUPPLY_CHAIN:
      return 'Supply Chain';
    case UserType.BRANCH_MANAGER:
      return 'Branch Manager';
    default:
      return 'Unknown';
  }
};
