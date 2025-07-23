import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResponsiveNavbar from './components/ResponsiveNavbar';
import ResponsiveFooter from './components/ResponsiveFooter';
import DatabaseStatus from './components/DatabaseStatus';
import Homepage from './pages/Homepage';
import EventDiscovery from './pages/EventDiscovery';
import EventDetail from './pages/EventDetail';
import VenuesPage from './pages/VenuesPage';
import SponsorsPage from './pages/SponsorsPage';
import PartnersPage from './pages/PartnersPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import BecomeVendor from './pages/BecomeVendor';
import ResponsiveAuthModal from './components/ResponsiveAuthModal';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { showAuthModal, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading EventBuka...</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">Connecting to database...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  const getDashboardRoute = () => {
    if (!user) return <Dashboard />;
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'organizer':
        return <OrganizerDashboard />;
      case 'vendor':
        return <OrganizerDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header role="banner">
        <ResponsiveNavbar />
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/events" element={<EventDiscovery />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/dashboard" element={getDashboardRoute()} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/become-organizer" element={<BecomeVendor />} />
          <Route path="/become-vendor" element={<BecomeVendor />} />
        </Routes>
      </main>
      <footer role="contentinfo">
        <ResponsiveFooter />
      </footer>
      {user?.role === 'admin' && <DatabaseStatus />}
      {showAuthModal && <ResponsiveAuthModal />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;