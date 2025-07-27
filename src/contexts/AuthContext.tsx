import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  AuthState, 
  User, 
  LoginCredentials, 
  UserType, 
  USER_ACCESS_PATTERNS, 
  AccessPattern,
  MOCK_USERS 
} from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccess: (userTypes: UserType[]) => boolean;
  getAccessPattern: () => AccessPattern;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        const savedToken = localStorage.getItem('auth_token');
        
        if (savedUser && savedToken) {
          const user = JSON.parse(savedUser);
          dispatch({ type: 'RESTORE_SESSION', payload: user });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check credentials against mock users
      const user = MOCK_USERS[credentials.email];
      
      if (!user) {
        throw new Error('User not found');
      }

      // For demo purposes, accept specific passwords based on user type
      const validPasswords: Record<string, string> = {
        'admin@example.com': 'admin123',
        'salesman@example.com': 'sales123',
        'manager@example.com': 'manager123',
        'supply@example.com': 'supply123',
        'branch@example.com': 'branch123',
      };

      if (validPasswords[credentials.email] !== credentials.password) {
        throw new Error('Invalid password');
      }

      // Store user data and token
      const authToken = `token_${user.id}_${Date.now()}`;
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', authToken);
      
      if (credentials.remember) {
        localStorage.setItem('remember_user', 'true');
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('remember_user');
    dispatch({ type: 'LOGOUT' });
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    return state.user.permissions.some(p => p.name === permission);
  };

  const canAccess = (userTypes: UserType[]): boolean => {
    if (!state.user) return false;
    return userTypes.includes(state.user.user_type);
  };

  const getAccessPattern = (): AccessPattern => {
    if (!state.user) {
      return {
        canAccessFullSystem: false,
        canAccessDepartmentData: false,
        canAccessLocationData: false,
        canAccessOwnData: false,
        canManageUsers: false,
        canManageBudgets: false,
        canViewReports: false,
        canExportData: false,
        canManageInventory: false,
        canViewAnalytics: false,
      };
    }
    return USER_ACCESS_PATTERNS[state.user.user_type];
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    hasPermission,
    canAccess,
    getAccessPattern,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for checking if user can access specific features
export const useAccessControl = () => {
  const { user, getAccessPattern, canAccess, hasPermission } = useAuth();
  
  return {
    user,
    accessPattern: getAccessPattern(),
    canAccess,
    hasPermission,
    isAdmin: user?.user_type === UserType.ADMIN,
    isSalesman: user?.user_type === UserType.SALESMAN,
    isManager: user?.user_type === UserType.MANAGER,
    isSupplyChain: user?.user_type === UserType.SUPPLY_CHAIN,
    isBranchManager: user?.user_type === UserType.BRANCH_MANAGER,
  };
};
