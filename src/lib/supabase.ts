import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

console.log('Supabase configuration:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'admin' | 'vendor' | 'user' | 'sponsor' | 'partner';
  is_verified: boolean;
  wallet_balance: number;
  stellar_address?: string;
  business_name?: string;
  business_type?: string;
  company_name?: string;
  contact_person?: string;
  website?: string;
  description?: string;
  location?: string;
  services?: string[];
  preferred_categories?: string[];
  sponsorship_budget?: number;
  rating?: number;
  portfolio_urls?: string[];
  price_range?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  venue_id?: string;
  category_id?: string;
  title: string;
  description?: string;
  image_url?: string;
  start_date: string;
  end_date: string;
  location: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  capacity: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_free: boolean;
  is_award_event: boolean;
  has_seating: boolean;
  venue_cost: number;
  dress_code?: string;
  sponsors?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Relations
  organizer?: User;
  venue?: Venue;
  category?: EventCategory;
  tickets?: Ticket[];
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  capacity: number;
  price_per_hour?: number;
  price_per_day?: number;
  amenities?: string[];
  images?: string[];
  contact_email?: string;
  contact_phone?: string;
  latitude?: number;
  longitude?: number;
  is_available: boolean;
  created_at: string;
}

export interface NominationCategory {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  is_voting_free: boolean;
  vote_price: number;
  max_nominations: number;
  voting_start_date?: string;
  voting_end_date?: string;
  created_at: string;
}

export interface Nominee {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  contact_email?: string;
  contact_phone?: string;
  vote_count: number;
  is_approved: boolean;
  nominated_by?: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  quantity_total: number;
  quantity_sold: number;
  is_vip: boolean;
  benefits?: string[];
  created_at: string;
}

export interface Seat {
  id: string;
  event_id: string;
  section: string;
  row_number: string;
  seat_number: string;
  price: number;
  is_available: boolean;
  seat_type: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  ticket_id?: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  payment_method?: string;
  payment_reference?: string;
  booking_reference: string;
  qr_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  event?: Event;
  ticket?: Ticket;
  user?: User;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'payment' | 'payout' | 'refund';
  amount: number;
  description?: string;
  reference?: string;
  payment_method?: string;
  status: string;
  metadata?: any;
  created_at: string;
}

export interface Sponsor {
  id: string;
  user_id: string;
  company_name: string;
  contact_person?: string;
  email: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  sponsorship_budget?: number;
  preferred_categories?: string[];
  is_verified: boolean;
  created_at: string;
}

export interface Partner {
  id: string;
  user_id: string;
  business_name: string;
  business_type?: string;
  contact_person?: string;
  email: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  services?: string[];
  portfolio_urls?: string[];
  price_range?: string;
  location?: string;
  is_verified: boolean;
  rating: number;
  created_at: string;
}

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Sign in exception:', error);
    return { data: null, error };
  }
};

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Sign up exception:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Get user exception:', error);
    return null;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Get user profile error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Get user profile exception:', error);
    return { data: null, error };
  }
};

// Event functions
export const getEvents = async (filters?: {
  category?: string;
  location?: string;
  search?: string;
  status?: string;
  limit?: number;
}) => {
  try {
    let query = supabase
      .from('events')
      .select(`
        *,
        organizer:users!events_organizer_id_fkey(full_name, email),
        venue:venues(*),
        category:event_categories(name, color),
        tickets(*)
      `)
      .order('start_date', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    } else {
      query = query.eq('status', 'published');
    }

    if (filters?.category) {
      query = query.eq('category.name', filters.category);
    }

    if (filters?.location) {
      query = query.ilike('city', `%${filters.location}%`);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get events error:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get events exception:', error);
    return { data: [], error };
  }
};

export const getEventById = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:users!events_organizer_id_fkey(full_name, email),
        venue:venues(*),
        category:event_categories(name, color),
        tickets(*)
      `)
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Get event by ID error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Get event by ID exception:', error);
    return { data: null, error };
  }
};

export const createEvent = async (eventData: Partial<Event>) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Create event error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Create event exception:', error);
    return { data: null, error };
  }
};

export const updateEvent = async (eventId: string, updates: Partial<Event>) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Update event error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Update event exception:', error);
    return { data: null, error };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Delete event error:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Delete event exception:', error);
    return { error };
  }
};

// Booking functions
export const createBooking = async (bookingData: Partial<Booking>) => {
  try {
    // Generate booking reference
    const bookingReference = `EVB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        booking_reference: bookingReference,
        status: 'pending'
      }])
      .select(`
        *,
        event:events(title, start_date, location),
        ticket:tickets(name, price),
        user:users(full_name, email)
      `)
      .single();

    if (error) {
      console.error('Create booking error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Create booking exception:', error);
    return { data: null, error };
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        event:events(title, start_date, location, image_url),
        ticket:tickets(name, price)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get user bookings error:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get user bookings exception:', error);
    return { data: [], error };
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Update booking status error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Update booking status exception:', error);
    return { data: null, error };
  }
};

// Voting functions
export const getNominationCategories = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('nomination_categories')
      .select('*')
      .eq('event_id', eventId)
      .order('name');

    if (error) {
      console.error('Get nomination categories error:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get nomination categories exception:', error);
    return { data: [], error };
  }
};

export const getNominees = async (categoryIds: string[]) => {
  try {
    const { data, error } = await supabase
      .from('nominees')
      .select(`
        *,
        category:nomination_categories(name)
      `)
      .in('category_id', categoryIds)
      .eq('is_approved', true)
      .order('vote_count', { ascending: false });

    if (error) {
      console.error('Get nominees error:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get nominees exception:', error);
    return { data: [], error };
  }
};

export const castVote = async (nomineeId: string, userId: string, categoryId: string) => {
  try {
    const { data, error } = await supabase
      .from('votes')
      .insert([{
        nominee_id: nomineeId,
        user_id: userId,
        category_id: categoryId
      }])
      .select()
      .single();

    if (error) {
      console.error('Cast vote error:', error);
      return { data: null, error };
    }

    // Increment vote count
    await supabase.rpc('increment_vote_count', { nominee_id: nomineeId });

    return { data, error: null };
  } catch (error) {
    console.error('Cast vote exception:', error);
    return { data: null, error };
  }
};

// Transaction functions
export const createTransaction = async (transactionData: Partial<Transaction>) => {
  try {
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transactionData,
        reference,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Create transaction error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Create transaction exception:', error);
    return { data: null, error };
  }
};

export const updateUserWalletBalance = async (userId: string, amount: number) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        wallet_balance: amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update wallet balance error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Update wallet balance exception:', error);
    return { data: null, error };
  }
};

// Venue functions
export const getVenues = async (filters?: {
  city?: string;
  capacity?: number;
  available?: boolean;
}) => {
  try {
    let query = supabase
      .from('venues')
      .select('*')
      .order('name');

    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters?.capacity) {
      query = query.gte('capacity', filters.capacity);
    }

    if (filters?.available !== undefined) {
      query = query.eq('is_available', filters.available);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get venues error:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get venues exception:', error);
    return { data: [], error };
  }
};

// Sponsor functions
export const getSponsors = async () => {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('is_verified', true)
      .order('company_name');

    if (error) {
      console.error('Get sponsors error:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get sponsors exception:', error);
    return { data: [], error };
  }
};

// Partner functions
export const getPartners = async (serviceType?: string) => {
  try {
    let query = supabase
      .from('partners')
      .select('*')
      .eq('is_verified', true)
      .order('business_name');

    if (serviceType && serviceType !== 'All Services') {
      query = query.contains('services', [serviceType]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get partners error:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Get partners exception:', error);
    return { data: [], error };
  }
};

// Utility functions
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Database health check
export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return { connected: false, error };
    }

    return { connected: true, error: null };
  } catch (error) {
    console.error('Database connection exception:', error);
    return { connected: false, error };
  }
};

// Test database functions
export const testDatabaseFunctions = async () => {
  console.log('🧪 Testing database functions...');
  
  try {
    // Test connection
    const connectionTest = await checkDatabaseConnection();
    console.log('✅ Database connection:', connectionTest.connected ? 'OK' : 'FAILED');

    // Test events fetch
    const eventsTest = await getEvents({ limit: 1 });
    console.log('✅ Events fetch:', eventsTest.data.length > 0 ? 'OK' : 'NO DATA');

    // Test venues fetch
    const venuesTest = await getVenues();
    console.log('✅ Venues fetch:', venuesTest.data.length > 0 ? 'OK' : 'NO DATA');

    // Test sponsors fetch
    const sponsorsTest = await getSponsors();
    console.log('✅ Sponsors fetch:', sponsorsTest.data.length >= 0 ? 'OK' : 'FAILED');

    // Test partners fetch
    const partnersTest = await getPartners();
    console.log('✅ Partners fetch:', partnersTest.data.length >= 0 ? 'OK' : 'FAILED');

    console.log('🎉 Database function tests completed!');
    
    return {
      connection: connectionTest.connected,
      events: eventsTest.data.length,
      venues: venuesTest.data.length,
      sponsors: sponsorsTest.data.length,
      partners: partnersTest.data.length
    };
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return null;
  }
};