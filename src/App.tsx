import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import EventDiscovery from './pages/EventDiscovery';
import EventDetail from './pages/EventDetail';
import VenuesPage from './pages/VenuesPage';
import SponsorsPage from './pages/SponsorsPage';
import PartnersPage from './pages/PartnersPage';
import Dashboard from './pages/Dashboard';
import BecomeVendor from './pages/BecomeVendor';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { showAuthModal, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EventBuka...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/events" element={<EventDiscovery />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/become-organizer" element={<BecomeVendor />} />
        </Routes>
      </main>
      <Footer />
      {showAuthModal && <AuthModal />}
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