import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SalesBudget from './pages/SalesBudget';
import RollingForecast from './pages/RollingForecast';
import DistributionManagement from './pages/DistributionManagement';
import UserManagement from './pages/UserManagement';
import InventoryManagement from './pages/InventoryManagement';
import { UserType } from './types/auth';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/sales-budget"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]}>
                <SalesBudget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rolling-forecast"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]}>
                <RollingForecast />
              </ProtectedRoute>
            }
          />
          <Route
            path="/distribution-management"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SUPPLY_CHAIN]}>
                <DistributionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
