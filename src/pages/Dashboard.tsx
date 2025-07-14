import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Ticket, Wallet, Heart, Trophy, Settings, Download, MapPin, Clock } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');

  const tabs = [
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'saved', label: 'Saved Events', icon: Heart },
    { id: 'nominations', label: 'Nominations', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const myTickets = [
    {
      id: 1,
      eventTitle: 'Lagos Music Festival 2024',
      date: '2024-03-15',
      time: '18:00',
      location: 'Tafawa Balewa Square, Lagos',
      ticketType: 'VIP Pass',
      price: 15000,
      status: 'confirmed',
      qrCode: 'QR123456',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      eventTitle: 'Tech Innovation Summit',
      date: '2024-03-20',
      time: '09:00',
      location: 'Landmark Centre, Victoria Island',
      ticketType: 'General Admission',
      price: 15000,
      status: 'confirmed',
      qrCode: 'QR789012',
      image: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const savedEvents = [
    {
      id: 1,
      title: 'Nigerian Film Awards',
      date: '2024-03-25',
      location: 'Eko Hotel, Victoria Island',
      price: '₦25,000',
      image: 'https://images.pexels.com/photos/3137892/pexels-photo-3137892.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Food & Wine Festival',
      date: '2024-03-30',
      location: 'Lekki Conservation Centre',
      price: 'Free',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const nominations = [
    {
      id: 1,
      eventTitle: 'Nigerian Film Awards',
      category: 'Best Actor',
      nominee: 'John Doe',
      status: 'pending',
      votingEnds: '2024-03-20'
    },
    {
      id: 2,
      eventTitle: 'Music Awards 2024',
      category: 'Best New Artist',
      nominee: 'Jane Smith',
      status: 'voted',
      votingEnds: '2024-03-18'
    }
  ];

  const walletBalance = 45000;
  const walletHistory = [
    { id: 1, type: 'deposit', amount: 50000, description: 'Wallet funding via Flutterwave', date: '2024-03-01' },
    { id: 2, type: 'payment', amount: -15000, description: 'Lagos Music Festival ticket', date: '2024-03-02' },
    { id: 3, type: 'refund', amount: 10000, description: 'Cancelled event refund', date: '2024-03-05' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Ticket className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-bold text-gray-900">{myTickets.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wallet Balance</p>
                  <p className="text-2xl font-bold text-gray-900">₦{walletBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Saved Events</p>
                  <p className="text-2xl font-bold text-gray-900">{savedEvents.length}</p>
                </div>
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
            {activeTab === 'tickets' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Tickets</h2>
                <div className="space-y-4">
                  {myTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={ticket.image}
                          alt={ticket.eventTitle}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.eventTitle}</h3>
                          <div className="flex items-center space-x-4 text-gray-600 mt-2">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{new Date(ticket.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{ticket.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{ticket.location}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                              {ticket.ticketType}
                            </span>
                            <span className={`ml-2 inline-block text-xs px-2 py-1 rounded-full ${
                              ticket.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 mb-2">
                            ₦{ticket.price.toLocaleString()}
                          </div>
                          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Wallet</h2>
                
                {/* Wallet Balance */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
                  <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
                  <div className="text-3xl font-bold mb-4">₦{walletBalance.toLocaleString()}</div>
                  <div className="flex space-x-4">
                    <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      Add Money
                    </button>
                    <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors">
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Transaction History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
                  <div className="space-y-3">
                    {walletHistory.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-600">{transaction.date}</div>
                        </div>
                        <div className={`font-semibold ${
                          transaction.type === 'deposit' || transaction.type === 'refund' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : ''}
                          ₦{Math.abs(transaction.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <span className="font-semibold text-purple-600">{event.price}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        View Event
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'nominations' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Nominations & Votes</h2>
                <div className="space-y-4">
                  {nominations.map((nomination) => (
                    <div key={nomination.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{nomination.eventTitle}</h3>
                          <p className="text-gray-600">{nomination.category}</p>
                          <p className="text-sm text-gray-500">Nominee: {nomination.nominee}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            nomination.status === 'voted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {nomination.status}
                          </span>
                          <div className="text-sm text-gray-600 mt-1">
                            Voting ends: {new Date(nomination.votingEnds).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          value={user.name} 
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          value={user.email} 
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Email notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">SMS notifications</span>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Marketing emails</span>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;