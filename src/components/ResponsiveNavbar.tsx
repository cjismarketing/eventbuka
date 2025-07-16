import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Calendar, Wallet, MapPin, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function ResponsiveNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const { user, setShowAuthModal, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    navigate(`/events?${params.toString()}`);
    setIsMenuOpen(false);
  };

  const getDashboardRoute = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'vendor': return '/organizer';
      default: return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              EventBuka
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/events" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Events
            </Link>
            <Link to="/venues" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Venues
            </Link>
            <Link to="/sponsors" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Sponsors
            </Link>
            <Link to="/partners" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Partners
            </Link>
            <Link to="/become-organizer" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
              Become Organizer
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-2">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 w-32 xl:w-48 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Notifications (Desktop) */}
            {user && (
              <button className="hidden sm:block p-2 text-gray-600 hover:text-purple-600 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={handleAuthClick}
                className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                {user ? (
                  <>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-5 h-5 rounded-full" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{user.full_name?.split(' ')[0] || user.email}</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </>
                )}
              </button>

              {/* User Dropdown */}
              {user && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <Link
                    to={getDashboardRoute()}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard?tab=wallet"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Wallet (₦{user.wallet_balance?.toLocaleString() || '0'})</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Search Events
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/events"
                  className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
                <Link
                  to="/venues"
                  className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Venues
                </Link>
                <Link
                  to="/sponsors"
                  className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sponsors
                </Link>
                <Link
                  to="/partners"
                  className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Partners
                </Link>
                <Link
                  to="/become-organizer"
                  className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become Organizer
                </Link>
              </div>

              {/* Mobile User Actions */}
              {user ? (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 py-2">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardRoute()}
                    className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="text-sm text-gray-600 py-1">
                    Wallet: ₦{user.wallet_balance?.toLocaleString() || '0'}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default ResponsiveNavbar;