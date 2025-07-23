import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Eye, 
  Trash2,
  BarChart3,
  Ticket,
  MapPin,
  Clock,
  Star,
  Download,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

function OrganizerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    upcomingEvents: 0
  });
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (user?.role === 'vendor') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch organizer's events
      const { data: eventsData } = await supabase
        .from('events')
        .select(`
          *,
          venue:venues(name),
          category:event_categories(name),
          tickets(*)
        `)
        .eq('organizer_id', user?.id)
        .order('created_at', { ascending: false });

      // Fetch bookings for organizer's events
      const eventIds = eventsData?.map(e => e.id) || [];
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(full_name, email),
          event:events(title),
          ticket:tickets(name)
        `)
        .in('event_id', eventIds)
        .order('created_at', { ascending: false });

      // Calculate stats
      const totalEvents = eventsData?.length || 0;
      const totalBookings = bookingsData?.length || 0;
      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
      const upcomingEvents = eventsData?.filter(e => new Date(e.start_date) > new Date()).length || 0;

      setStats({
        totalEvents,
        totalBookings,
        totalRevenue,
        upcomingEvents
      });

      setEvents(eventsData || []);
      setBookings(bookingsData || []);

      // Create recent activity
      const activity = [
        ...bookingsData?.slice(0, 5).map(booking => ({
          type: 'booking',
          message: `New booking for ${booking.event?.title}`,
          time: booking.created_at,
          user: booking.user?.full_name
        })) || [],
        ...eventsData?.slice(0, 3).map(event => ({
          type: 'event',
          message: `Event ${event.title} ${event.status}`,
          time: event.created_at
        })) || []
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await supabase.from('events').delete().eq('id', eventId);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  if (user?.role !== 'vendor' && user?.role !== 'organizer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need to be an event organizer or vendor to access this page.</p>
          <Link to="/become-organizer" className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            Become an Organizer
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organizer dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.full_name}!</p>
          </div>
          <Link
            to="/create-event"
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Ticket className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₦{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upcoming Events */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                      {events.filter((event: any) => new Date(event.start_date) > new Date()).slice(0, 5).map((event: any) => (
                        <div key={event.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(event.start_date).toLocaleDateString()} at {event.location}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.status === 'published' ? 'bg-green-100 text-green-800' :
                            event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {recentActivity.slice(0, 5).map((activity: any, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === 'booking' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            {activity.user && (
                              <p className="text-xs text-gray-600">by {activity.user}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(activity.time).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/create-event"
                      className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Plus className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Create New Event</p>
                        <p className="text-sm text-gray-600">Start planning your next event</p>
                      </div>
                    </Link>

                    <button className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                      <BarChart3 className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">View Analytics</p>
                        <p className="text-sm text-gray-600">Check your event performance</p>
                      </div>
                    </button>

                    <button className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                      <Download className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Export Reports</p>
                        <p className="text-sm text-gray-600">Download booking reports</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">My Events</h2>
                  <Link
                    to="/create-event"
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Event</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event: any) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img
                          src={event.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={event.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.status === 'published' ? 'bg-green-100 text-green-800' :
                            event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                        
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{new Date(event.start_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{event.capacity} capacity</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/events/${event.id}`}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {event.tickets?.reduce((sum: number, ticket: any) => sum + ticket.quantity_sold, 0) || 0} sold
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {events.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                    <p className="text-gray-600 mb-4">Create your first event to get started</p>
                    <Link
                      to="/create-event"
                      className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create Event</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Event Bookings</h2>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Booking ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Ticket</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking: any) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm">{booking.booking_reference}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm text-gray-900">{booking.user?.full_name}</p>
                              <p className="text-xs text-gray-600">{booking.user?.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-900">{booking.event?.title}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-900">{booking.ticket?.name}</p>
                            <p className="text-xs text-gray-600">Qty: {booking.quantity}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">₦{booking.total_amount?.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {bookings.length === 0 && (
                  <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600">Bookings will appear here once people start buying tickets</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Analytics & Insights</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <p>Chart will be implemented with a charting library</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Sales</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <p>Chart will be implemented with a charting library</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Performance</h3>
                    <div className="space-y-4">
                      {events.slice(0, 5).map((event: any) => (
                        <div key={event.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-600">{new Date(event.start_date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {event.tickets?.reduce((sum: number, ticket: any) => sum + ticket.quantity_sold, 0) || 0} sold
                            </p>
                            <p className="text-sm text-gray-600">
                              of {event.capacity} capacity
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Events</h3>
                    <div className="space-y-4">
                      {events
                        .sort((a: any, b: any) => {
                          const aRevenue = a.tickets?.reduce((sum: number, ticket: any) => sum + (ticket.quantity_sold * ticket.price), 0) || 0;
                          const bRevenue = b.tickets?.reduce((sum: number, ticket: any) => sum + (ticket.quantity_sold * ticket.price), 0) || 0;
                          return bRevenue - aRevenue;
                        })
                        .slice(0, 5)
                        .map((event: any) => {
                          const revenue = event.tickets?.reduce((sum: number, ticket: any) => sum + (ticket.quantity_sold * ticket.price), 0) || 0;
                          return (
                            <div key={event.id} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{event.title}</p>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600">Top performer</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">₦{revenue.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">revenue</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;