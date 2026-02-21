import React, { useState, useEffect } from 'react';
import Dashboard from './components/pages/Dashboard';
import AgentUmrahCalculator from './components/pages/AgentUmrahCalculator';
import LoginPage from './components/pages/LoginPage';
import UmrahPackagePage from './components/pages/UmrahPackagePage';

import UmrahBookingPage from './components/pages/UmrahBookingPage';
// import TicketPage from './components/pages/TicketPage';
import TicketPage from './components/pages/TicketPage';
import CustomBookingPage from './components/pages/CustomBookingPage';

import BookingHistory from './components/pages/BookingHistory';
import Payments from './components/pages/Payments';
import AddBankAccount from './components/pages/AddBankAccount';
import FlightsPage from './pages/bookings/FlightsPage';
import BookedFlights from './pages/bookings/BookedFlights';
import HotelsPage from './components/pages/HotelsPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import './index.css';

// Placeholder pages
const PlaceholderPage = ({ title }) => (
  <div>
    <h1 className="text-3xl font-black text-slate-900 mb-4">{title}</h1>
    <p className="text-slate-500">This page is under construction.</p>
  </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingFlights, setBookingFlights] = useState([]);
  const [bookingAirlines, setBookingAirlines] = useState([]);
  const [customBookingData, setCustomBookingData] = useState(null);

  const handleBookCustomPackage = (data) => {
    setCustomBookingData(data);
    setActiveTab('Custom Package Booking');
  };

  const handleBookPackage = (pkg, flights = [], airlines = []) => {
    setSelectedPackage(pkg);
    setBookingFlights(flights);
    setBookingAirlines(airlines);
    setActiveTab('Umrah Package Booking');
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/hotels') {
      setActiveTab('Hotels');
    }
  }, []);

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
        return <AgentUmrahCalculator onBookCustomPackage={handleBookCustomPackage} />;
      case 'Custom Package Booking':
        return customBookingData ? (
          <CustomBookingPage
            calculatorData={customBookingData}
            onBack={() => setActiveTab('Custom Package')}
          />
        ) : null;
      case 'Umrah Package':
        return <UmrahPackagePage onBookPackage={handleBookPackage} />;
      case 'Umrah Package Booking':
        return selectedPackage ? (
          <UmrahBookingPage
            packageData={selectedPackage}
            flights={bookingFlights}
            airlines={bookingAirlines}
            onBack={() => setActiveTab('Umrah Package')}
          />
        ) : null;
      case 'Ticket':
        return <TicketPage />;
      case 'Flight Search':
        return <FlightsPage />;
      case 'Booked Flights':
        return <BookedFlights />;
      case 'Hotels':
        return <HotelsPage />;
      case 'Packages':
        return <PlaceholderPage title="Packages" />;
      case 'Customers':
        return <PlaceholderPage title="Customers" />;
      case 'Payments':
        return (
          <Payments
            onAddAccount={() => {
              setEditingAccount(null);
              setActiveTab('Payments/Add');
            }}
            onEditAccount={(acc) => {
              setEditingAccount(acc);
              setActiveTab('Payments/Add');
            }}
          />
        );
      case 'Payments/Add':
        return (
          <AddBankAccount
            onBack={() => {
              setEditingAccount(null);
              setActiveTab('Payments');
            }}
            editingAccount={editingAccount}
          />
        );
      case 'Reports':
        return <PlaceholderPage title="Reports" />;
      case 'Settings':
        return <PlaceholderPage title="Settings" />;
      case 'Profile':
        return <PlaceholderPage title="Profile Setup" />;
      case 'Booking History':
        return <BookingHistory />;
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

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
