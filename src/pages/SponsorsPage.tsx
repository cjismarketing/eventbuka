import React, { useState, useEffect } from 'react';
import { Building, Mail, Phone, Globe, DollarSign, Star, ArrowRight, Handshake } from 'lucide-react';
import { supabase, Sponsor } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBecomeForm, setShowBecomeForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [sponsorshipAmount, setSponsorshipAmount] = useState('');
  const { user, setShowAuthModal } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch verified sponsors
      const { data: sponsorsData } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_verified', true)
        .order('company_name');

      // Fetch upcoming events for sponsorship opportunities
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date')
        .limit(10);

      setSponsors(sponsorsData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeSponsor = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowBecomeForm(true);
  };

  const handleSponsorEvent = async (eventId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('event_sponsorships')
        .insert({
          event_id: eventId,
          sponsor_id: user.id, // This would need to be the sponsor's ID from sponsors table
          sponsorship_amount: parseFloat(sponsorshipAmount),
          sponsorship_type: 'supporting',
          status: 'pending'
        });

      if (error) throw error;

      alert('Sponsorship request submitted successfully!');
      setSelectedEvent('');
      setSponsorshipAmount('');
    } catch (error) {
      console.error('Error submitting sponsorship:', error);
      alert('Error submitting sponsorship request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Event Sponsorship Opportunities
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect with amazing events and grow your brand through strategic sponsorships
          </p>
          <button
            onClick={handleBecomeSponsor}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            <Handshake className="mr-2 w-6 h-6" />
            Become a Sponsor
          </button>
        </div>
      </div>

      {/* Current Sponsors */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Trusted Sponsors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join these amazing companies who are already supporting events and growing their brands
            </p>
          </div>

          {sponsors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No sponsors yet. Be the first to join!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    {sponsor.logo_url ? (
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.company_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{sponsor.company_name}</h3>
                      {sponsor.contact_person && (
                        <p className="text-gray-600">{sponsor.contact_person}</p>
                      )}
                    </div>
                  </div>

                  {sponsor.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{sponsor.description}</p>
                  )}

                  {sponsor.preferred_categories && sponsor.preferred_categories.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preferred Categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {sponsor.preferred_categories.slice(0, 3).map((category, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {sponsor.email && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{sponsor.email}</span>
                      </div>
                    )}
                    {sponsor.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{sponsor.phone}</span>
                      </div>
                    )}
                    {sponsor.website && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-600">
                          {sponsor.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sponsorship Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sponsorship Opportunities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover upcoming events looking for sponsors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="relative mb-4">
                  <img
                    src={event.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{event.location}</p>
                <p className="text-gray-600 text-sm mb-4">
                  {new Date(event.start_date).toLocaleDateString()}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Sponsorship Available</span>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(event.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Sponsor Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sponsor This Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsorship Amount (₦)
                </label>
                <input
                  type="number"
                  value={sponsorshipAmount}
                  onChange={(e) => setSponsorshipAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedEvent('')}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSponsorEvent(selectedEvent)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Sponsor Events?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our sponsor network and connect with amazing events that align with your brand
          </p>
          <button
            onClick={handleBecomeSponsor}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            <Handshake className="mr-2 w-6 h-6" />
            Become a Sponsor Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default SponsorsPage;