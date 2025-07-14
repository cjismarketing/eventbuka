import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Star, Share2, Heart, CreditCard, Wallet, Award, Plane, Hotel } from 'lucide-react';
import SeatSelection from '../components/SeatSelection';

function EventDetail() {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState('details');
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});

  const event = {
    id: 1,
    title: 'Lagos Music Festival 2024',
    date: '2024-03-15',
    time: '18:00',
    location: 'Tafawa Balewa Square, Lagos',
    organizer: 'Lagos Events Co.',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Music',
    rating: 4.8,
    attendees: 1200,
    description: 'Experience the biggest music festival in West Africa with top local and international artists. Join thousands of music lovers for an unforgettable night of entertainment, food, and culture.',
    fullDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    ticketTypes: [
      { id: 1, name: 'General Admission', price: 5000, available: 500, description: 'Access to main area' },
      { id: 2, name: 'VIP Pass', price: 15000, available: 100, description: 'Premium seating & backstage access' },
      { id: 3, name: 'Table for 4', price: 40000, available: 20, description: 'Reserved table seating' }
    ],
    sponsors: ['MTN', 'Coca-Cola', 'Dangote Group'],
    dressCode: 'Smart Casual',
    features: ['Live Music', 'Food & Drinks', 'Photography', 'Networking'],
    isAwardEvent: false,
    hasSeating: true
  };

  const handleTicketChange = (ticketId: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
  };

  const calculateTotal = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = event.ticketTypes.find(t => t.id.toString() === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
  };

  const tabs = [
    { id: 'details', label: 'Event Details' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'location', label: 'Location' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-indigo-600">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
              <div className="flex items-center space-x-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">{event.rating}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{event.attendees} attending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedTab === 'details' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                  <p className="text-gray-600 mb-6">{event.description}</p>
                  <p className="text-gray-600 mb-6">{event.fullDescription}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Event Features</h3>
                      <ul className="space-y-1">
                        {event.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Organizer:</span>
                          <span className="text-gray-900">{event.organizer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dress Code:</span>
                          <span className="text-gray-900">{event.dressCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="text-gray-900">{event.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sponsors */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Sponsors</h3>
                  <div className="flex flex-wrap gap-4">
                    {event.sponsors.map((sponsor, index) => (
                      <div key={index} className="bg-gray-100 px-4 py-2 rounded-lg">
                        <span className="text-gray-700 font-medium">{sponsor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'tickets' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Tickets</h2>
                  
                  <div className="space-y-4">
                    {event.ticketTypes.map((ticket) => (
                      <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{ticket.name}</h3>
                            <p className="text-gray-600 text-sm">{ticket.description}</p>
                            <p className="text-sm text-gray-500 mt-1">{ticket.available} available</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-purple-600">
                              ₦{ticket.price.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleTicketChange(ticket.id.toString(), Math.max(0, (selectedTickets[ticket.id] || 0) - 1))}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{selectedTickets[ticket.id] || 0}</span>
                              <button
                                onClick={() => handleTicketChange(ticket.id.toString(), Math.min(ticket.available, (selectedTickets[ticket.id] || 0) + 1))}
                                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center text-white"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {event.hasSeating && (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowSeatSelection(true)}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                      >
                        Select Seats
                      </button>
                    </div>
                  )}
                </div>

                {/* Add-ons */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Add-ons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Hotel className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">Hotel Booking</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Stay near the venue</p>
                      <button className="text-purple-600 hover:text-purple-700 font-medium">
                        View Hotels
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Plane className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">Flight Booking</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">Book your flights</p>
                      <button className="text-purple-600 hover:text-purple-700 font-medium">
                        Search Flights
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'location' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Location</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900">{event.location}</span>
                  </div>
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Interactive Map Coming Soon</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Getting There</h3>
                      <p className="text-gray-600 text-sm">
                        Easily accessible by public transport. Parking available on-site.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Nearby Landmarks</h3>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Lagos Island</li>
                        <li>• National Museum</li>
                        <li>• Tafawa Balewa Square</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">{event.rating}</div>
                    <div className="flex items-center justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">Based on 125 reviews</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{rating}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${rating * 20}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <img 
                        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" 
                        alt="Reviewer" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">Sarah Johnson</div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">
                      Amazing event! The organization was top-notch and the artists were incredible. 
                      Would definitely attend again.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-32">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              {Object.entries(selectedTickets).filter(([_, quantity]) => quantity > 0).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(selectedTickets)
                    .filter(([_, quantity]) => quantity > 0)
                    .map(([ticketId, quantity]) => {
                      const ticket = event.ticketTypes.find(t => t.id.toString() === ticketId);
                      if (!ticket) return null;
                      
                      return (
                        <div key={ticketId} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900">{ticket.name}</div>
                            <div className="text-sm text-gray-600">Qty: {quantity}</div>
                          </div>
                          <div className="text-purple-600 font-semibold">
                            ₦{(ticket.price * quantity).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">₦{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay with Card
                    </button>
                    <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center">
                      <Wallet className="w-5 h-5 mr-2" />
                      Pay with Wallet
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Select tickets to see pricing</p>
                </div>
              )}
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Organizer</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">LE</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{event.organizer}</div>
                  <div className="text-gray-600 text-sm">Event Organizer</div>
                </div>
              </div>
              <button className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Selection Modal */}
      {showSeatSelection && (
        <SeatSelection
          onClose={() => setShowSeatSelection(false)}
          onSeatSelect={(seats) => {
            console.log('Selected seats:', seats);
            setShowSeatSelection(false);
          }}
        />
      )}
    </div>
  );
}

export default EventDetail;