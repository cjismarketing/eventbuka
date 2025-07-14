import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Globe, Star, MapPin, ArrowRight, Briefcase } from 'lucide-react';
import { supabase, Partner } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('');
  const [showBecomeForm, setShowBecomeForm] = useState(false);
  const { user, setShowAuthModal } = useAuth();

  const serviceTypes = [
    'All Services',
    'Catering',
    'Decoration',
    'Photography',
    'Security',
    'Equipment Rental',
    'Entertainment',
    'Transportation',
    'Cleaning',
    'Technical Support'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch verified partners
      let query = supabase
        .from('partners')
        .select('*')
        .eq('is_verified', true)
        .order('business_name');

      if (selectedService && selectedService !== 'All Services') {
        query = query.contains('services', [selectedService]);
      }

      const { data: partnersData } = await query;

      // Fetch upcoming events for partnership opportunities
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date')
        .limit(10);

      setPartners(partnersData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedService]);

  const handleBecomePartner = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowBecomeForm(true);
  };

  const handleContactOrganizer = async (eventId: string, partnerId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('partnership_requests')
        .insert({
          event_id: eventId,
          partner_id: partnerId,
          organizer_id: user.id,
          service_type: 'general',
          message: 'Interested in providing services for your event.',
          status: 'pending'
        });

      if (error) throw error;

      alert('Partnership request sent successfully!');
    } catch (error) {
      console.error('Error sending partnership request:', error);
      alert('Error sending partnership request');
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
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Business Partners Network
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect with event organizers and offer your services to make their events successful
          </p>
          <button
            onClick={handleBecomePartner}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            <Briefcase className="mr-2 w-6 h-6" />
            Become a Partner
          </button>
        </div>
      </div>

      {/* Service Filter */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-2">
            {serviceTypes.map((service) => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedService === service || (selectedService === '' && service === 'All Services')
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Trusted Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional service providers ready to make your event successful
            </p>
          </div>

          {partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No partners found for the selected service. Try a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt={partner.business_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-green-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{partner.business_name}</h3>
                      {partner.business_type && (
                        <p className="text-green-600 font-medium capitalize">{partner.business_type}</p>
                      )}
                      {partner.contact_person && (
                        <p className="text-gray-600 text-sm">{partner.contact_person}</p>
                      )}
                    </div>
                  </div>

                  {partner.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{partner.description}</p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(partner.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({partner.rating.toFixed(1)})</span>
                  </div>

                  {/* Services */}
                  {partner.services && partner.services.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {partner.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {service}
                          </span>
                        ))}
                        {partner.services.length > 3 && (
                          <span className="text-xs text-gray-500">+{partner.services.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  {partner.price_range && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Price Range: </span>
                      <span className="text-sm text-green-600 font-medium">{partner.price_range}</span>
                    </div>
                  )}

                  {/* Location */}
                  {partner.location && (
                    <div className="flex items-center space-x-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{partner.location}</span>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    {partner.email && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{partner.email}</span>
                      </div>
                    )}
                    {partner.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{partner.phone}</span>
                      </div>
                    )}
                    {partner.website && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-green-600">
                          {partner.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Contact Partner
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Opportunities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upcoming events looking for service partners
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
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{event.capacity} attendees</span>
                  </div>
                  <button
                    onClick={() => handleContactOrganizer(event.id, user?.id || '')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Contact Organizer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Partner with Events?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our partner network and connect with event organizers who need your services
          </p>
          <button
            onClick={handleBecomePartner}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            <Briefcase className="mr-2 w-6 h-6" />
            Become a Partner Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default PartnersPage;