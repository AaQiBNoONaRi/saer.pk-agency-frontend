import React, { useState } from 'react';
import Dashboard from './components/pages/Dashboard';
import AgentUmrahCalculator from './components/pages/AgentUmrahCalculator';
import LoginPage from './components/pages/LoginPage';
import UmrahPackagePage from './components/pages/UmrahPackagePage';
import TicketPage from './components/pages/TicketPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import './index.css';

// Placeholder pages
const PlaceholderPage = ({ title }) => (
  <div className="p-8">
    <h1 className="text-3xl font-black text-slate-900 mb-4">{title}</h1>
    <p className="text-slate-500">This page is under construction.</p>
  </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Map activeTab to components
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Custom Package':
        return <AgentUmrahCalculator />;
      case 'Umrah Package':
        return <UmrahPackagePage />;
      case 'Ticket':
        return <TicketPage />;
      case 'Packages':
        return <PlaceholderPage title="Packages" />;
      case 'Customers':
        return <PlaceholderPage title="Customers" />;
      case 'Payments':
        return <PlaceholderPage title="Payments" />;
      case 'Reports':
        return <PlaceholderPage title="Reports" />;
      case 'Settings':
        return <PlaceholderPage title="Settings" />;
      case 'Profile':
        return <PlaceholderPage title="Profile Setup" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setIsLoggedIn={setIsLoggedIn}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
