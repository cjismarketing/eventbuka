import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Star, Users, ArrowRight, Music, Trophy, Utensils, Mic, Clock, Gift, Building, Handshake } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Homepage() {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured events
      const { data: events } = await supabase
        .from('events')
        .select(`
          *,
          profiles!events_vendor_id_fkey(full_name),
          tickets(price)
        `)
        .eq('is_published', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(6);

      setFeaturedEvents(events || []);
      setCategories([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    window.location.href = `/events?${params.toString()}`;
  };

  const defaultCategories = [
    { name: 'Music & Concerts', icon: Music, color: 'bg-purple-100 text-purple-600', count: 152 },
    { name: 'Awards & Nominations', icon: Trophy, color: 'bg-yellow-100 text-yellow-600', count: 28 },
    { name: 'Food & Drink', icon: Utensils, color: 'bg-green-100 text-green-600', count: 89 },
    { name: 'Tech & Conferences', icon: Mic, color: 'bg-blue-100 text-blue-600', count: 64 },
    { name: 'Nightlife & Clubbing', icon: Clock, color: 'bg-indigo-100 text-indigo-600', count: 43 },
    { name: 'Free Events', icon: Gift, color: 'bg-pink-100 text-pink-600', count: 76 }
  ];

  const getIconForCategory = (name: string) => {
    const iconMap: { [key: string]: any } = {
      'Music & Concerts': Music,
      'Awards & Nominations': Trophy,
      'Food & Drink': Utensils,
      'Tech & Conferences': Mic,
      'Nightlife & Clubbing': Clock,
      'Free Events': Gift,
      'Sports & Fitness': Users,
      'Arts & Culture': Star,
      'Business & Networking': Building,
      'Educational': Mic
    };
    return iconMap[name] || Calendar;
  };

  const getColorForCategory = (name: string) => {
    const colorMap: { [key: string]: string } = {
      'Music & Concerts': 'bg-purple-100 text-purple-600',
      'Awards & Nominations': 'bg-yellow-100 text-yellow-600',
      'Food & Drink': 'bg-green-100 text-green-600',
      'Tech & Conferences': 'bg-blue-100 text-blue-600',
      'Nightlife & Clubbing': 'bg-indigo-100 text-indigo-600',
      'Free Events': 'bg-pink-100 text-pink-600',
      'Sports & Fitness': 'bg-red-100 text-red-600',
      'Arts & Culture': 'bg-purple-100 text-purple-600',
      'Business & Networking': 'bg-gray-100 text-gray-600',
      'Educational': 'bg-orange-100 text-orange-600'
    };
    return colorMap[name] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing Events
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-purple-200">
                Book, Vote, and Experience More
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-purple-100">
              From concerts to conferences, find and book the perfect events that match your interests. 
              Join thousands of event-goers discovering what's next.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search events, artists, venues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-gray-900 bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-gray-900 bg-transparent focus:outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                Browse Events
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/venues"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-xl hover:bg-white hover:text-purple-600 transition-colors font-medium"
              >
                <Building className="mr-2 w-5 h-5" />
                Book Venues
              </Link>
              <Link
                to="/become-organizer"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-xl hover:bg-white hover:text-purple-600 transition-colors font-medium"
              >
                Become Organizer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/sponsors"
              className="group p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Become a Sponsor</h3>
                  <p className="text-gray-600 text-sm">Support events and grow your brand</p>
                </div>
              </div>
            </Link>

            <Link
              to="/partners"
              className="group p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Business Partners</h3>
                  <p className="text-gray-600 text-sm">Offer services to event organizers</p>
                </div>
              </div>
            </Link>

            <Link
              to="/venues"
              className="group p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Book Venues</h3>
                  <p className="text-gray-600 text-sm">Find the perfect venue for your event</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Event Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find events that match your interests and discover new experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {(categories.length > 0 ? categories : defaultCategories).map((category, index) => {
              const IconComponent = getIconForCategory(category.name);
              const colorClass = getColorForCategory(category.name);
              
              return (
                <Link
                  key={index}
                  to={`/events?category=${encodeURIComponent(category.name)}`}
                  className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-center">
                    {category.count || Math.floor(Math.random() * 100) + 10} events
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't miss these amazing upcoming events
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={event.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category || 'Event'}
                      </span>
                    </div>
                    {event.category === 'Awards & Nominations' && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Trophy className="w-3 h-3 mr-1" />
                          Awards
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">
                        Free
                      </span>
                      <Link
                        to={`/events/${event.id}`}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        {event.category === 'Awards & Nominations' ? 'Vote Now' : 'Book Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              View All Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Host Your Event?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust EventBuka to manage their events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/become-organizer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-lg"
            >
              Become an Organizer
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/venues"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-purple-600 transition-colors font-medium text-lg"
            >
              <Building className="mr-2 w-5 h-5" />
              Browse Venues
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;