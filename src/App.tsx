import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleLogin from './pages/SimpleLogin';
import SimpleDashboard from './pages/SimpleDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleLogin />} />
        <Route path="/dashboard" element={<SimpleDashboard />} />
        <Route path="/home" element={<SimpleDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
