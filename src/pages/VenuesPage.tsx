import React, { useState, useEffect } from 'react';
import { MapPin, Users, DollarSign, Star, Clock, Wifi, Car, Coffee, Shield, Phone, Mail, Filter } from 'lucide-react';
import { supabase, Venue } from '../lib/supabase';

function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    capacity: '',
    priceRange: '',
    amenities: [] as string[]
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      let query = supabase
        .from('venues')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }

      if (filters.capacity) {
        query = query.gte('capacity', parseInt(filters.capacity));
      }

      const { data, error } = await query;

      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Parking': Car,
    'Catering': Coffee,
    'Security': Shield,
    'AC': Clock
  };

  const handleBookVenue = (venue: Venue) => {
    // Implement venue booking logic
    alert(`Booking ${venue.name}. This feature will be implemented with payment integration.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Venues</h1>
          <p className="text-gray-600 mb-6">Find the perfect venue for your next event</p>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <input
                type="text"
                placeholder="Search by city..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex-1 min-w-48">
              <select
                value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any Capacity</option>
                <option value="50">50+ people</option>
                <option value="100">100+ people</option>
                <option value="200">200+ people</option>
                <option value="500">500+ people</option>
                <option value="1000">1000+ people</option>
              </select>
            </div>
            <div className="flex-1 min-w-48">
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any Price</option>
                <option value="budget">Budget (Under ₦50,000/day)</option>
                <option value="mid">Mid-range (₦50,000 - ₦200,000/day)</option>
                <option value="premium">Premium (₦200,000+/day)</option>
              </select>
            </div>
            <button
              onClick={fetchVenues}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {venues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No venues found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={venue.images?.[0] || 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={venue.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{venue.description}</p>
                  
                  <div className="flex items-center space-x-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{venue.address}, {venue.city}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{venue.capacity} capacity</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {venue.amenities.slice(0, 4).map((amenity, index) => {
                        const IconComponent = amenityIcons[amenity] || Clock;
                        return (
                          <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                            <IconComponent className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-gray-600">{amenity}</span>
                          </div>
                        );
                      })}
                      {venue.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">+{venue.amenities.length - 4} more</span>
                      )}
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {venue.contact_phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{venue.contact_phone}</span>
                      </div>
                    )}
                    {venue.contact_email && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{venue.contact_email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {venue.price_per_day && (
                        <span className="text-lg font-bold text-purple-600">
                          ₦{venue.price_per_day.toLocaleString()}/day
                        </span>
                      )}
                      {venue.price_per_hour && (
                        <div className="text-sm text-gray-600">
                          ₦{venue.price_per_hour.toLocaleString()}/hour
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleBookVenue(venue)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VenuesPage;