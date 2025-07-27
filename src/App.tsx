import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SalesBudget from './pages/SalesBudget';
import RollingForecast from './pages/RollingForecast';
import DistributionManagement from './pages/DistributionManagement';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import { UserType } from './types/auth';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.SUPPLY_CHAIN, UserType.BRANCH_MANAGER]}>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.SUPPLY_CHAIN, UserType.BRANCH_MANAGER]}>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]}>
                <Layout><SalesBudget /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/forecasts"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SALESMAN, UserType.MANAGER, UserType.BRANCH_MANAGER]}>
                <Layout><RollingForecast /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/distribution"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN, UserType.SUPPLY_CHAIN]}>
                <Layout><DistributionManagement /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredUserTypes={[UserType.ADMIN]}>
                <Layout><UserManagement /></Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
