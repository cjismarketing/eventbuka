import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

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

export interface Hotel {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  rating?: number;
  price_per_night?: number;
  amenities?: string[];
  images?: string[];
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  is_available: boolean;
  created_at: string;
}

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
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