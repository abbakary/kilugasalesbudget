import React, { useState } from 'react';
import { X, User, Mail, Shield, MapPin, Building, CreditCard, Eye, EyeOff } from 'lucide-react';
import { UserType, Permission, User as UserInterface, getUserTypeName, USER_ACCESS_PATTERNS } from '../types/auth';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: Omit<UserInterface, 'id'>) => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  user_type: UserType;
  department: string;
  location: string;
  budget_id: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: UserType.SALESMAN,
    department: '',
    location: '',
    budget_id: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Sales',
    'Marketing',
    'Finance',
    'Supply Chain',
    'Operations',
    'IT',
    'Human Resources',
    'Customer Service'
  ];

  const locations = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Department validation for certain user types
    if ([UserType.SALESMAN, UserType.MANAGER, UserType.SUPPLY_CHAIN].includes(formData.user_type) && !formData.department) {
      newErrors.department = 'Department is required for this role';
    }

    // Location validation for branch managers
    if (formData.user_type === UserType.BRANCH_MANAGER && !formData.location) {
      newErrors.location = 'Location is required for Branch Managers';
    }

    // Budget ID validation for salesmen
    if (formData.user_type === UserType.SALESMAN && !formData.budget_id) {
      newErrors.budget_id = 'Budget ID is required for Salesmen';
    } else if (formData.budget_id && !/^\d+$/.test(formData.budget_id)) {
      newErrors.budget_id = 'Budget ID must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDefaultPermissions = (userType: UserType): Permission[] => {
    const accessPattern = USER_ACCESS_PATTERNS[userType];
    const permissions: Permission[] = [];

    if (accessPattern.canManageUsers) {
      permissions.push({ id: 1, name: 'manage_users', description: 'Manage all users' });
      permissions.push({ id: 2, name: 'manage_system', description: 'Manage system settings' });
    }

    if (accessPattern.canManageBudgets) {
      if (userType === UserType.SALESMAN) {
        permissions.push({ id: 3, name: 'manage_own_budget', description: 'Manage own budget' });
      } else if (userType === UserType.MANAGER) {
        permissions.push({ id: 4, name: 'manage_department_budgets', description: 'Manage department budgets' });
        permissions.push({ id: 5, name: 'view_department_reports', description: 'View department reports' });
      } else if (userType === UserType.BRANCH_MANAGER) {
        permissions.push({ id: 8, name: 'manage_location_budgets', description: 'Manage location budgets' });
        permissions.push({ id: 9, name: 'view_location_reports', description: 'View location reports' });
      }
    }

    if (accessPattern.canManageInventory) {
      permissions.push({ id: 6, name: 'manage_inventory', description: 'Manage inventory' });
      permissions.push({ id: 7, name: 'view_stock_reports', description: 'View stock reports' });
    }

    return permissions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: Omit<UserInterface, 'id'> = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        user_type: formData.user_type,
        department: formData.department || undefined,
        location: formData.location || undefined,
        budget_id: formData.budget_id ? parseInt(formData.budget_id) : undefined,
        permissions: getDefaultPermissions(formData.user_type)
      };

      onAddUser(newUser);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        user_type: UserType.SALESMAN,
        department: '',
        location: '',
        budget_id: ''
      });
      setErrors({});
      
    } catch (error) {
      setErrors({ submit: 'Failed to create user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | UserType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      user_type: UserType.SALESMAN,
      department: '',
      location: '',
      budget_id: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
            <p className="text-sm text-gray-600 mt-1">Create a new user account with appropriate permissions</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="user@company.com"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security & Access
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role *
              </label>
              <select
                value={formData.user_type}
                onChange={(e) => handleChange('user_type', parseInt(e.target.value) as UserType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <option value={UserType.SALESMAN}>Salesman</option>
                <option value={UserType.MANAGER}>Manager</option>
                <option value={UserType.SUPPLY_CHAIN}>Supply Chain</option>
                <option value={UserType.BRANCH_MANAGER}>Branch Manager</option>
                <option value={UserType.ADMIN}>Administrator</option>
              </select>
            </div>
          </div>

          {/* Organization Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Organization Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[UserType.SALESMAN, UserType.MANAGER, UserType.SUPPLY_CHAIN].includes(formData.user_type) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department {[UserType.SALESMAN, UserType.MANAGER, UserType.SUPPLY_CHAIN].includes(formData.user_type) ? '*' : ''}
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                </div>
              )}

              {formData.user_type === UserType.BRANCH_MANAGER && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              )}

              {formData.user_type === UserType.SALESMAN && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget ID *
                  </label>
                  <input
                    type="text"
                    value={formData.budget_id}
                    onChange={(e) => handleChange('budget_id', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.budget_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 101"
                    disabled={isSubmitting}
                  />
                  {errors.budget_id && <p className="text-red-500 text-sm mt-1">{errors.budget_id}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Permissions Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Role Permissions Preview
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{getUserTypeName(formData.user_type)}</strong> will have the following permissions:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                {getDefaultPermissions(formData.user_type).map(permission => (
                  <li key={permission.id} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {permission.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">{errors.submit}</div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
