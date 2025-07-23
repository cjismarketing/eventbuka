/*
  # Comprehensive Authentication and User Management System

  1. Database Schema
    - Redesigned users table with proper structure
    - Role-based system with specific roles
    - Proper foreign key relationships

  2. Security
    - Row Level Security (RLS) policies
    - Database triggers for user management
    - Secure session handling

  3. Test Data
    - Clean seed data for all user roles
    - Sample events, venues, sponsors, partners
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.event_sponsorships CASCADE;
DROP TABLE IF EXISTS public.partnership_requests CASCADE;
DROP TABLE IF EXISTS public.logistics_bookings CASCADE;
DROP TABLE IF EXISTS public.logistics CASCADE;
DROP TABLE IF EXISTS public.hotel_bookings CASCADE;
DROP TABLE IF EXISTS public.hotels CASCADE;
DROP TABLE IF EXISTS public.flights CASCADE;
DROP TABLE IF EXISTS public.payouts CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.seat_bookings CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.seats CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.nominees CASCADE;
DROP TABLE IF EXISTS public.nomination_categories CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.partners CASCADE;
DROP TABLE IF EXISTS public.sponsors CASCADE;
DROP TABLE IF EXISTS public.venues CASCADE;
DROP TABLE IF EXISTS public.event_categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.event_status CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;
DROP TYPE IF EXISTS public.payout_status CASCADE;

-- Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'organizer', 'vendor', 'sponsor', 'partner');
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE public.transaction_type AS ENUM ('deposit', 'payment', 'refund', 'payout');
CREATE TYPE public.payout_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Users table with comprehensive structure
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  avatar_url text,
  role public.user_role DEFAULT 'organizer'::public.user_role,
  is_verified boolean DEFAULT false,
  wallet_balance numeric(12,2) DEFAULT 0.00,
  stellar_address text,
  
  -- Profile data (JSON for flexible role-specific data)
  profile_data jsonb DEFAULT '{}',
  
  -- Business information (for vendors, sponsors, partners)
  business_name text,
  business_type text,
  company_name text,
  contact_person text,
  website text,
  description text,
  location text,
  
  -- Role-specific fields
  services text[], -- for partners
  preferred_categories text[], -- for sponsors
  sponsorship_budget numeric(12,2), -- for sponsors
  rating numeric(3,2) DEFAULT 0.00, -- for partners
  portfolio_urls text[], -- for partners
  price_range text, -- for partners
  logo_url text, -- for sponsors/partners
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event categories
CREATE TABLE IF NOT EXISTS public.event_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#8B5CF6',
  created_at timestamptz DEFAULT now()
);

-- Venues
CREATE TABLE IF NOT EXISTS public.venues (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text DEFAULT 'Lagos' NOT NULL,
  state text DEFAULT 'Lagos' NOT NULL,
  country text DEFAULT 'Nigeria' NOT NULL,
  capacity integer NOT NULL,
  price_per_hour numeric(10,2),
  price_per_day numeric(10,2),
  amenities text[],
  images text[],
  contact_email text,
  contact_phone text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES public.venues(id),
  category_id uuid REFERENCES public.event_categories(id),
  title text NOT NULL,
  description text,
  image_url text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text NOT NULL,
  address text,
  city text DEFAULT 'Lagos',
  state text DEFAULT 'Lagos',
  country text DEFAULT 'Nigeria',
  latitude numeric(10,8),
  longitude numeric(11,8),
  capacity integer DEFAULT 100,
  status public.event_status DEFAULT 'draft',
  is_free boolean DEFAULT false,
  is_award_event boolean DEFAULT false,
  has_seating boolean DEFAULT false,
  venue_cost numeric(10,2) DEFAULT 0.00,
  dress_code text,
  sponsors text[],
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tickets
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) DEFAULT 0.00 NOT NULL,
  quantity_total integer NOT NULL,
  quantity_sold integer DEFAULT 0,
  is_vip boolean DEFAULT false,
  benefits text[],
  created_at timestamptz DEFAULT now()
);

-- Nomination categories (for award events)
CREATE TABLE IF NOT EXISTS public.nomination_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_voting_free boolean DEFAULT true,
  vote_price numeric(10,2) DEFAULT 0.00,
  max_nominations integer DEFAULT 10,
  voting_start_date timestamptz,
  voting_end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Nominees
CREATE TABLE IF NOT EXISTS public.nominees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid NOT NULL REFERENCES public.nomination_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  contact_email text,
  contact_phone text,
  vote_count integer DEFAULT 0,
  is_approved boolean DEFAULT false,
  nominated_by uuid REFERENCES public.users(id),
  created_at timestamptz DEFAULT now()
);

-- Votes
CREATE TABLE IF NOT EXISTS public.votes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nominee_id uuid NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id),
  category_id uuid NOT NULL REFERENCES public.nomination_categories(id),
  payment_reference text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Seats (for events with seating)
CREATE TABLE IF NOT EXISTS public.seats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  section text NOT NULL,
  row_number text NOT NULL,
  seat_number text NOT NULL,
  price numeric(10,2) NOT NULL,
  is_available boolean DEFAULT true,
  seat_type text DEFAULT 'regular',
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, section, row_number, seat_number)
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  event_id uuid NOT NULL REFERENCES public.events(id),
  ticket_id uuid REFERENCES public.tickets(id),
  quantity integer DEFAULT 1,
  total_amount numeric(10,2) NOT NULL,
  status public.booking_status DEFAULT 'pending',
  payment_method text,
  payment_reference text,
  booking_reference text UNIQUE NOT NULL,
  qr_code text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seat bookings
CREATE TABLE IF NOT EXISTS public.seat_bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  seat_id uuid NOT NULL REFERENCES public.seats(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(seat_id)
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  type public.transaction_type NOT NULL,
  amount numeric(12,2) NOT NULL,
  description text,
  reference text UNIQUE,
  payment_method text,
  status text DEFAULT 'pending',
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Payouts
CREATE TABLE IF NOT EXISTS public.payouts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id uuid NOT NULL REFERENCES public.users(id),
  amount numeric(12,2) NOT NULL,
  status public.payout_status DEFAULT 'pending',
  bank_details jsonb,
  stellar_address text,
  processed_by uuid REFERENCES public.users(id),
  processed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Event sponsorships
CREATE TABLE IF NOT EXISTS public.event_sponsorships (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sponsor_id uuid NOT NULL REFERENCES public.users(id),
  sponsorship_amount numeric(10,2) NOT NULL,
  sponsorship_type text,
  benefits text[],
  status text DEFAULT 'pending',
  contract_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, sponsor_id)
);

-- Partnership requests
CREATE TABLE IF NOT EXISTS public.partnership_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.users(id),
  organizer_id uuid NOT NULL REFERENCES public.users(id),
  service_type text NOT NULL,
  message text,
  proposed_amount numeric(10,2),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Hotels
CREATE TABLE IF NOT EXISTS public.hotels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  rating numeric(3,2),
  price_per_night numeric(10,2),
  amenities text[],
  images text[],
  contact_email text,
  contact_phone text,
  website text,
  latitude numeric(10,8),
  longitude numeric(11,8),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Hotel bookings
CREATE TABLE IF NOT EXISTS public.hotel_bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id),
  event_id uuid REFERENCES public.events(id),
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  rooms integer DEFAULT 1,
  guests integer DEFAULT 1,
  total_amount numeric(10,2) NOT NULL,
  status public.booking_status DEFAULT 'pending',
  payment_reference text,
  created_at timestamptz DEFAULT now()
);

-- Flights
CREATE TABLE IF NOT EXISTS public.flights (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  event_id uuid REFERENCES public.events(id),
  departure_city text NOT NULL,
  arrival_city text NOT NULL,
  departure_date date NOT NULL,
  return_date date,
  passengers integer DEFAULT 1,
  class text DEFAULT 'economy',
  total_amount numeric(10,2) NOT NULL,
  status public.booking_status DEFAULT 'pending',
  booking_reference text,
  created_at timestamptz DEFAULT now()
);

-- Logistics
CREATE TABLE IF NOT EXISTS public.logistics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  capacity integer,
  pickup_locations text[],
  contact_info text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Logistics bookings
CREATE TABLE IF NOT EXISTS public.logistics_bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  logistics_id uuid NOT NULL REFERENCES public.logistics(id),
  booking_id uuid REFERENCES public.bookings(id),
  pickup_location text,
  pickup_time timestamptz,
  passengers integer DEFAULT 1,
  total_amount numeric(10,2) NOT NULL,
  status public.booking_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(city, state);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON public.bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_nominees_category ON public.nominees(category_id);
CREATE INDEX IF NOT EXISTS idx_votes_category ON public.votes(category_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nomination_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nominees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistics_bookings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Helper function to get current user ID
CREATE OR REPLACE FUNCTION public.uid()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'organizer'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- Function to increment vote count
CREATE OR REPLACE FUNCTION public.increment_vote_count(nominee_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.nominees 
  SET vote_count = vote_count + 1 
  WHERE id = nominee_id;
END;
$$;

-- Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for events table
CREATE POLICY "Published events are viewable by everyone" ON public.events
  FOR SELECT USING (
    status = 'published' OR 
    organizer_id = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Event organizers can manage their own events" ON public.events
  FOR ALL USING (organizer_id = auth.uid()) WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for venues table
CREATE POLICY "Venues are viewable by everyone" ON public.venues
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage venues" ON public.venues
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for event_categories table
CREATE POLICY "Categories are viewable by everyone" ON public.event_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.event_categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for tickets table
CREATE POLICY "Tickets are viewable by everyone" ON public.tickets
  FOR SELECT USING (true);

CREATE POLICY "Event organizers can manage their tickets" ON public.tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = tickets.event_id AND events.organizer_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = tickets.event_id AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all tickets" ON public.tickets
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for nomination_categories table
CREATE POLICY "Nomination categories are viewable by everyone" ON public.nomination_categories
  FOR SELECT USING (true);

CREATE POLICY "Event organizers can manage their nomination categories" ON public.nomination_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = nomination_categories.event_id AND events.organizer_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = nomination_categories.event_id AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all nomination categories" ON public.nomination_categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for nominees table
CREATE POLICY "Approved nominees are viewable by everyone" ON public.nominees
  FOR SELECT USING (
    is_approved = true OR 
    nominated_by = auth.uid() OR 
    is_admin()
  );

CREATE POLICY "Users can nominate candidates" ON public.nominees
  FOR INSERT WITH CHECK (nominated_by = auth.uid());

CREATE POLICY "Users can update their own nominations" ON public.nominees
  FOR UPDATE USING (nominated_by = auth.uid()) WITH CHECK (nominated_by = auth.uid());

CREATE POLICY "Admins can manage all nominees" ON public.nominees
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for votes table
CREATE POLICY "Users can view their own votes" ON public.votes
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can cast votes" ON public.votes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all votes" ON public.votes
  FOR SELECT USING (is_admin());

-- RLS Policies for seats table
CREATE POLICY "Seats are viewable by everyone" ON public.seats
  FOR SELECT USING (true);

CREATE POLICY "Event organizers can manage their seats" ON public.seats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = seats.event_id AND events.organizer_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = seats.event_id AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all seats" ON public.seats
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Event organizers can view bookings for their events" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = bookings.event_id AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for seat_bookings table
CREATE POLICY "Allow authenticated users to select their own bookings" ON public.seat_bookings
  FOR SELECT USING (
    auth.uid() = (
      SELECT bookings.user_id FROM public.bookings 
      WHERE bookings.id = seat_bookings.booking_id
    )
  );

-- RLS Policies for transactions table
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (is_admin());

-- RLS Policies for payouts table
CREATE POLICY "Vendors can view their own payouts" ON public.payouts
  FOR SELECT USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can request payouts" ON public.payouts
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Admins can manage all payouts" ON public.payouts
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for event_sponsorships table
CREATE POLICY "Enable read access for all users" ON public.event_sponsorships
  FOR SELECT USING (true);

-- RLS Policies for partnership_requests table
CREATE POLICY "Allow authenticated users to view their own partnership requests" ON public.partnership_requests
  FOR SELECT USING (auth.uid() = organizer_id OR auth.uid() = partner_id);

CREATE POLICY "Allow authenticated users to create partnership requests" ON public.partnership_requests
  FOR INSERT WITH CHECK (auth.uid() = organizer_id OR auth.uid() = partner_id);

CREATE POLICY "Allow authenticated users to update their own partnership requests" ON public.partnership_requests
  FOR UPDATE USING (auth.uid() = organizer_id OR auth.uid() = partner_id) 
  WITH CHECK (auth.uid() = organizer_id OR auth.uid() = partner_id);

-- RLS Policies for hotels table
CREATE POLICY "Hotels are viewable by everyone" ON public.hotels
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage hotels" ON public.hotels
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS Policies for flights table
CREATE POLICY "Allow authenticated users to view their own flights" ON public.flights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.flights
  FOR INSERT WITH CHECK (true);

-- Insert seed data

-- Event categories
INSERT INTO public.event_categories (name, description, icon, color) VALUES
('Music & Concerts', 'Live music performances and concerts', 'music', '#8B5CF6'),
('Tech & Conferences', 'Technology conferences and seminars', 'laptop', '#3B82F6'),
('Awards & Nominations', 'Award ceremonies and recognition events', 'trophy', '#F59E0B'),
('Food & Drink', 'Culinary events and food festivals', 'utensils', '#10B981'),
('Sports & Fitness', 'Sports events and fitness activities', 'activity', '#EF4444'),
('Arts & Culture', 'Art exhibitions and cultural events', 'palette', '#8B5CF6'),
('Business & Networking', 'Business meetings and networking events', 'briefcase', '#6366F1'),
('Educational', 'Educational workshops and training', 'book', '#059669'),
('Charity & Fundraising', 'Charity events and fundraisers', 'heart', '#DC2626'),
('Entertainment', 'General entertainment events', 'star', '#7C3AED');

-- Test users for each role (2 per role minimum)
-- Note: These will be created through the auth system, this is just for reference
-- Actual user creation should be done through Supabase Auth

-- Venues
INSERT INTO public.venues (name, description, address, city, state, country, capacity, price_per_day, amenities, contact_email, contact_phone, latitude, longitude) VALUES
('Tafawa Balewa Square', 'Historic square in the heart of Lagos Island', 'Tafawa Balewa Square, Lagos Island', 'Lagos', 'Lagos', 'Nigeria', 5000, 500000, ARRAY['Parking', 'Security', 'Sound System', 'Lighting'], 'info@tbsquare.ng', '+234-801-234-5678', 6.4541, 3.3947),
('Eko Hotel Convention Centre', 'Premium convention center with modern facilities', 'Eko Hotel, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 2000, 1000000, ARRAY['AC', 'WiFi', 'Catering', 'Parking', 'Security', 'AV Equipment'], 'events@ekohotels.com', '+234-801-234-5679', 6.4281, 3.4219),
('Landmark Centre', 'Modern event center in Victoria Island', 'Water Corporation Drive, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 1500, 750000, ARRAY['AC', 'WiFi', 'Parking', 'Security', 'Catering'], 'info@landmarkcentre.com', '+234-801-234-5680', 6.4269, 3.4106),
('Terra Kulture', 'Cultural center promoting Nigerian arts', 'Tiamiyu Savage Street, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 300, 200000, ARRAY['AC', 'WiFi', 'Art Gallery', 'Restaurant'], 'info@terrakulture.com', '+234-801-234-5681', 6.4395, 3.4197),
('Co-Creation Hub', 'Tech hub and innovation center', 'Herbert Macaulay Way, Yaba', 'Lagos', 'Lagos', 'Nigeria', 500, 300000, ARRAY['WiFi', 'Tech Equipment', 'Parking', 'Catering'], 'events@cchubnigeria.com', '+234-801-234-5682', 6.5056, 3.3784),
('Lekki Conservation Centre', 'Nature reserve with event facilities', 'Lekki-Epe Expressway, Lekki', 'Lagos', 'Lagos', 'Nigeria', 1000, 400000, ARRAY['Outdoor Space', 'Nature Trails', 'Parking', 'Security'], 'info@lcc.gov.ng', '+234-801-234-5683', 6.4698, 3.5852);

-- Hotels
INSERT INTO public.hotels (name, description, address, city, rating, price_per_night, amenities, contact_email, contact_phone, website, latitude, longitude) VALUES
('Eko Hotel & Suites', 'Luxury hotel with premium amenities', 'Eko Hotel, Victoria Island', 'Lagos', 4.8, 45000, ARRAY['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar'], 'reservations@ekohotels.com', '+234-801-234-5684', 'https://ekohotels.com', 6.4281, 3.4219),
('Radisson Blu Anchorage Hotel', 'Modern business hotel', 'Ozumba Mbadiwe Avenue, Victoria Island', 'Lagos', 4.6, 38000, ARRAY['WiFi', 'Pool', 'Gym', 'Restaurant', 'Business Center'], 'info@radissonblu.com', '+234-801-234-5685', 'https://radissonblu.com', 6.4395, 3.4197),
('The Wheatbaker', 'Boutique luxury hotel', 'Ikoyi', 'Lagos', 4.9, 55000, ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Concierge'], 'reservations@thewheatbaker.com', '+234-801-234-5686', 'https://thewheatbaker.com', 6.4395, 3.4314),
('Lagos Continental Hotel', 'Business hotel in Victoria Island', 'Kofo Abayomi Street, Victoria Island', 'Lagos', 4.2, 32000, ARRAY['WiFi', 'Restaurant', 'Business Center', 'Gym'], 'info@lagoscontinental.com', '+234-801-234-5687', 'https://lagoscontinental.com', 6.4395, 3.4197);

-- This completes the database schema and initial setup
-- Users will be created through the authentication system
-- Events and other data will be populated after user creation