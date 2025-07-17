import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

function ResponsiveFooter() {
  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Logo and Description */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">EventBuka</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premier destination for discovering and booking amazing events. 
              From concerts to conferences, we've got you covered.
            </p>
            <div className="flex space-x-4" role="list" aria-label="Social media links">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Subscribe to our YouTube channel">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="space-y-4" aria-label="Quick links">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/venues" className="text-gray-400 hover:text-white transition-colors">
                  Book Venues
                </Link>
              </li>
              <li>
                <Link to="/become-organizer" className="text-gray-400 hover:text-white transition-colors">
                  Become Organizer
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Categories */}
          <nav className="space-y-4" aria-label="Event categories">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events?category=music" className="text-gray-400 hover:text-white transition-colors">
                  Music & Concerts
                </Link>
              </li>
              <li>
                <Link to="/events?category=tech" className="text-gray-400 hover:text-white transition-colors">
                  Tech & Conferences
                </Link>
              </li>
              <li>
                <Link to="/events?category=awards" className="text-gray-400 hover:text-white transition-colors">
                  Awards & Nominations
                </Link>
              </li>
              <li>
                <Link to="/events?category=food" className="text-gray-400 hover:text-white transition-colors">
                  Food & Drink
                </Link>
              </li>
              <li>
                <Link to="/events?category=nightlife" className="text-gray-400 hover:text-white transition-colors">
                  Nightlife & Clubbing
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="space-y-4" role="complementary" aria-label="Contact information">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href="mailto:support@eventbuka.com" className="text-gray-400 hover:text-white transition-colors">support@eventbuka.com</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href="tel:+2348001234567" className="text-gray-400 hover:text-white transition-colors">+234 800 123 4567</a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            © 2024 EventBuka. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6" aria-label="Legal links">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default ResponsiveFooter;