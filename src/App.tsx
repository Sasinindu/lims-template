import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import OrderRegistration from './pages/OrderRegistration';
import LabTests from './pages/LabTests';
import Reports from './pages/Reports';
import UsersPage from './pages/Users';
import Settings from './pages/Settings';
import CustomerMaster from './pages/CustomerMaster';
import Tests from './pages/Tests';
import Chemicals from './pages/Chemicals';
import Commodities from './pages/Commodities';
import InstrumentMaster from './pages/InstrumentMaster';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import DatabasePage from './pages/Database';

// Mock authentication state
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  
  return { isAuthenticated, login, logout };
};

const App: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  // Mock login function - in a real app, this would handle actual authentication
  const handleLogin = () => {
    login();
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order-registration" element={<OrderRegistration />} />
            <Route path="/lab-tests" element={<LabTests />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Master Data Routes */}
            <Route path="/customer-master" element={<CustomerMaster />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/chemicals" element={<Chemicals />} />
            <Route path="/commodities" element={<Commodities />} />
            <Route path="/instrument-master" element={<InstrumentMaster />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
