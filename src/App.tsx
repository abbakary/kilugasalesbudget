import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SalesBudget from './pages/SalesBudget';
import RollingForecast from './pages/RollingForecast';
import Login from './pages/Login';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/home" element={<Layout><Dashboard /></Layout>} />
        <Route path="/budgets" element={<Layout><SalesBudget /></Layout>} />
        <Route path="/forecasts" element={<Layout><RollingForecast /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;