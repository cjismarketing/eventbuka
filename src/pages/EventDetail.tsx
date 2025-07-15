import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Star, Share2, Heart, CreditCard, Wallet, Award, Plane, Hotel } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import SeatSelection from '../components/SeatSelection';
import MapComponent from '../components/MapComponent';

function EventDetail() {
  const { id } = useParams();
  const { user, setShowAuthModal } = useAuth();
  const [selectedTab, setSelectedTab] = useState('details');
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nominees, setNominees] = useState<any[]>([]);
  const [nominationCategories, setNominationCategories] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const { data: eventData, error } = await supabase
        .from('events')
        .select(`
          *,
          organizer:users!events_organizer_id_fkey(full_name, email),
          venue:venues(*),
          category:event_categories(name, color),
          tickets(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setEvent(eventData);

      // If it's an award event, fetch nomination categories and nominees
      if (eventData.is_award_event) {
        const { data: categoriesData } = await supabase
          .from('nomination_categories')
          .select('*')
          .eq('event_id', id);

        const { data: nomineesData } = await supabase
          .from('nominees')
          .select(`
            *,
            category:nomination_categories(name)
          `)
          .in('category_id', categoriesData?.map(c => c.id) || [])
          .eq('is_approved', true);

        setNominationCategories(categoriesData || []);
        setNominees(nomineesData || []);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketChange = (ticketId: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
  };

  const calculateTotal = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = event?.tickets?.find((t: any) => t.id.toString() === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
  };

  const handleBooking = async (paymentMethod: 'card' | 'wallet') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const bookingData = Object.entries(selectedTickets)
        .filter(([_, quantity]) => quantity > 0)
        .map(([ticketId, quantity]) => ({
          user_id: user.id,
          event_id: id,
          ticket_id: ticketId,
          quantity,
          total_amount: event.tickets.find((t: any) => t.id.toString() === ticketId).price * quantity,
          status: 'pending',
          payment_method: paymentMethod,
          booking_reference: `EVB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));

      const { error } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (error) throw error;

      alert('Booking successful! Check your dashboard for details.');
      setSelectedTickets({});
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    }
  };

  const handleVote = async (nomineeId: string, categoryId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('votes')
        .insert({
          nominee_id: nomineeId,
          user_id: user.id,
          category_id: categoryId
        });

      if (error) throw error;

      // Update nominee vote count
      await supabase.rpc('increment_vote_count', { nominee_id: nomineeId });

      alert('Vote cast successfully!');
      fetchEventDetails(); // Refresh data
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error casting vote. You may have already voted in this category.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Event Details' },
    { id: 'tickets', label: event.is_award_event ? 'Voting' : 'Tickets' },
    { id: 'location', label: 'Location' },
    { id: 'reviews', label: 'Reviews' }
  ];

  // Lagos coordinates as default
  const eventCoordinates: [number, number] = [
    event.latitude || 6.5244,
    event.longitude || 3.3792
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-indigo-600">
        <img
          src={event.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt={event.title}
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {event.category?.name || 'Event'}
              </span>
              {event.is_award_event && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  Awards Event
                </span>
              )}
              <div className="flex items-center space-x-1 bg-white bg-opacity-20 rounded-full px-3 py-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">4.8</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(event.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>{event.capacity} capacity</span>
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
                {event.is_award_event ? 'Vote Now' : 'Book Now'}
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Organizer:</span>
                          <span className="text-gray-900">{event.organizer?.full_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Venue:</span>
                          <span className="text-gray-900">{event.venue?.name || event.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="text-gray-900">{event.capacity} people</span>
                        </div>
                        {event.dress_code && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dress Code:</span>
                            <span className="text-gray-900">{event.dress_code}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Event Type</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="text-gray-900">{event.category?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Free Event:</span>
                          <span className="text-gray-900">{event.is_free ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Award Event:</span>
                          <span className="text-gray-900">{event.is_award_event ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Has Seating:</span>
                          <span className="text-gray-900">{event.has_seating ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag: string, index: number) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'tickets' && (
              <div className="space-y-6">
                {event.is_award_event ? (
                  // Voting Section
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Vote for Your Favorites</h2>
                    
                    {nominationCategories.map((category: any) => (
                      <div key={category.id} className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.name}</h3>
                        {category.description && (
                          <p className="text-gray-600 mb-4">{category.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {nominees
                            .filter((nominee: any) => nominee.category_id === category.id)
                            .map((nominee: any) => (
                              <div key={nominee.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={nominee.image_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'}
                                    alt={nominee.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{nominee.name}</h4>
                                    {nominee.description && (
                                      <p className="text-gray-600 text-sm">{nominee.description}</p>
                                    )}
                                    <p className="text-sm text-purple-600 font-medium">
                                      {nominee.vote_count} votes
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleVote(nominee.id, category.id)}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                  >
                                    Vote
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Ticket Selection
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Tickets</h2>
                    
                    <div className="space-y-4">
                      {event.tickets?.map((ticket: any) => (
                        <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{ticket.name}</h3>
                              <p className="text-gray-600 text-sm">{ticket.description}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {ticket.quantity_total - ticket.quantity_sold} available
                              </p>
                              {ticket.benefits && ticket.benefits.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-600 font-medium">Benefits:</p>
                                  <ul className="text-xs text-gray-600 list-disc list-inside">
                                    {ticket.benefits.map((benefit: string, index: number) => (
                                      <li key={index}>{benefit}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-2xl font-bold text-purple-600">
                                {ticket.price === 0 ? 'Free' : `₦${ticket.price.toLocaleString()}`}
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
                                  onClick={() => handleTicketChange(ticket.id.toString(), Math.min(ticket.quantity_total - ticket.quantity_sold, (selectedTickets[ticket.id] || 0) + 1))}
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

                    {event.has_seating && (
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
                )}

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
                  {event.address && (
                    <p className="text-gray-600">{event.address}</p>
                  )}
                  
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapComponent
                      center={eventCoordinates}
                      zoom={15}
                      markers={[{
                        position: eventCoordinates,
                        title: event.title,
                        description: event.location
                      }]}
                      className="h-full w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Getting There</h3>
                      <p className="text-gray-600 text-sm">
                        Easily accessible by public transport. Parking available on-site.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Venue Details</h3>
                      {event.venue ? (
                        <div className="text-sm text-gray-600">
                          <p><strong>Name:</strong> {event.venue.name}</p>
                          <p><strong>Capacity:</strong> {event.venue.capacity}</p>
                          {event.venue.amenities && (
                            <p><strong>Amenities:</strong> {event.venue.amenities.join(', ')}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">
                          Venue details will be provided closer to the event date.
                        </p>
                      )}
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
                    <div className="text-4xl font-bold text-purple-600">4.8</div>
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
                      Amazing event! The organization was top-notch and the experience was incredible. 
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {event.is_award_event ? 'Voting Information' : 'Booking Summary'}
              </h3>
              
              {event.is_award_event ? (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Cast your votes for the nominees</p>
                    <p className="text-sm text-gray-500">
                      Voting is {nominationCategories[0]?.is_voting_free ? 'free' : `₦${nominationCategories[0]?.vote_price} per vote`}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {Object.entries(selectedTickets).filter(([_, quantity]) => quantity > 0).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(selectedTickets)
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([ticketId, quantity]) => {
                          const ticket = event.tickets?.find((t: any) => t.id.toString() === ticketId);
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
                        <button 
                          onClick={() => handleBooking('card')}
                          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay with Card
                        </button>
                        <button 
                          onClick={() => handleBooking('wallet')}
                          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
                        >
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
                </>
              )}
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Organizer</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {event.organizer?.full_name?.charAt(0) || 'O'}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{event.organizer?.full_name}</div>
                  <div className="text-gray-600 text-sm">Event Organizer</div>
                </div>
              </div>
              <button className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Contact Organizer
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