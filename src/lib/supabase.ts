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