import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Star, Users, Clock, Grid, List } from 'lucide-react';

function EventDiscovery() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceRange: '',
    date: ''
  });

  const events = [
    {
      id: 1,
      title: 'Lagos Music Festival 2024',
      date: '2024-03-15',
      time: '18:00',
      location: 'Tafawa Balewa Square, Lagos',
      price: '₦5,000',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Music',
      rating: 4.8,
      attendees: 1200,
      organizer: 'Lagos Events Co.',
      description: 'Experience the biggest music festival in West Africa with top local and international artists.'
    },
    {
      id: 2,
      title: 'Tech Innovation Summit',
      date: '2024-03-20',
      time: '09:00',
      location: 'Landmark Centre, Victoria Island',
      price: '₦15,000',
      image: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Tech',
      rating: 4.9,
      attendees: 800,
      organizer: 'TechHub Lagos',
      description: 'Join industry leaders and innovators for insights into the future of technology.'
    },
    {
      id: 3,
      title: 'Nigerian Film Awards',
      date: '2024-03-25',
      time: '19:00',
      location: 'Eko Hotel, Victoria Island',
      price: '₦25,000',
      image: 'https://images.pexels.com/photos/3137892/pexels-photo-3137892.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Awards',
      rating: 4.7,
      attendees: 500,
      organizer: 'Nollywood Association',
      description: 'Celebrate the best of Nigerian cinema at this prestigious awards ceremony.'
    },
    {
      id: 4,
      title: 'Food & Wine Festival',
      date: '2024-03-30',
      time: '12:00',
      location: 'Lekki Conservation Centre',
      price: 'Free',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Food',
      rating: 4.6,
      attendees: 2000,
      organizer: 'Foodie Lagos',
      description: 'Taste the best local and international cuisine in a beautiful outdoor setting.'
    },
    {
      id: 5,
      title: 'Stand-Up Comedy Night',
      date: '2024-04-05',
      time: '20:00',
      location: 'Terra Kulture, VI',
      price: '₦3,000',
      image: 'https://images.pexels.com/photos/3137892/pexels-photo-3137892.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Comedy',
      rating: 4.5,
      attendees: 300,
      organizer: 'Comedy Central Lagos',
      description: 'Laugh the night away with the best comedians in Nigeria.'
    },
    {
      id: 6,
      title: 'Startup Pitch Competition',
      date: '2024-04-10',
      time: '14:00',
      location: 'Co-Creation Hub, Yaba',
      price: '₦2,000',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Business',
      rating: 4.8,
      attendees: 400,
      organizer: 'StartupLagos',
      description: 'Watch emerging startups pitch their ideas to top investors and mentors.'
    }
  ];

  const categories = ['All', 'Music', 'Tech', 'Awards', 'Food', 'Comedy', 'Business'];

  const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-white rounded-full px-2 py-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{event.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex items-center space-x-4 text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{event.time}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{event.location}</span>
        </div>
        
        <div className="flex items-center space-x-1 text-gray-600 mb-4">
          <Users className="w-4 h-4" />
          <span className="text-sm">{event.attendees} going</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">{event.price}</span>
          <Link
            to={`/events/${event.id}`}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  const EventListItem = ({ event }: { event: any }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48 h-32 flex-shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
            <span className="text-purple-600 px-3 py-1 bg-purple-100 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{event.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span className="text-sm">{event.time}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{event.location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{event.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{event.attendees} going</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-purple-600">{event.price}</span>
              <Link
                to={`/events/${event.id}`}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Location */}
            <div className="lg:w-64">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
            
            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
                  filters.category === category
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
                onClick={() => setFilters({ ...filters, category })}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {events.length} Events Found
          </h2>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>Sort by: Date</option>
            <option>Sort by: Price</option>
            <option>Sort by: Popularity</option>
            <option>Sort by: Rating</option>
          </select>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDiscovery;