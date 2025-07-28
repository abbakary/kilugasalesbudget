import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Users, Plus, Edit, Trash2, Shield, Search, Filter } from 'lucide-react';
import { UserType, getUserTypeName, MOCK_USERS } from '../types/auth';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserType | 'all'>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Get all users from mock data
  const allUsers = Object.values(MOCK_USERS);

  // Filter users based on search and role filter
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.user_type === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (userType: UserType) => {
    switch (userType) {
      case UserType.ADMIN: return 'bg-red-100 text-red-800';
      case UserType.MANAGER: return 'bg-blue-100 text-blue-800';
      case UserType.SALESMAN: return 'bg-green-100 text-green-800';
      case UserType.SUPPLY_CHAIN: return 'bg-purple-100 text-purple-800';
      case UserType.BRANCH_MANAGER: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-2">
            <span className="text-gray-500 font-light">User Management /</span> All Users
          </h4>
          <p className="text-sm text-gray-600">
            Manage system users, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as UserType)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Roles</option>
              <option value={UserType.ADMIN}>Administrator</option>
              <option value={UserType.MANAGER}>Manager</option>
              <option value={UserType.SALESMAN}>Salesman</option>
              <option value={UserType.SUPPLY_CHAIN}>Supply Chain</option>
              <option value={UserType.BRANCH_MANAGER}>Branch Manager</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department/Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.user_type)}`}>
                      {getUserTypeName(user.user_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department && (
                      <div>Dept: {user.department}</div>
                    )}
                    {user.location && (
                      <div>Location: {user.location}</div>
                    )}
                    {user.budget_id && (
                      <div>Budget ID: {user.budget_id}</div>
                    )}
                    {!user.department && !user.location && !user.budget_id && (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{user.permissions.length} permissions</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or add a new user.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.values(UserType).filter(val => typeof val === 'number').map((userType) => {
          const count = allUsers.filter(user => user.user_type === userType).length;
          return (
            <div key={userType} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{getUserTypeName(userType as UserType)}</p>
                  <p className="text-2xl font-semibold text-gray-900">{count}</p>
                </div>
                <div className={`p-2 rounded-full ${getRoleBadgeColor(userType as UserType)}`}>
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal Placeholder */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
              <p className="text-sm text-gray-600 mb-4">User creation interface would be implemented here.</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default UserManagement;
