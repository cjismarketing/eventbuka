/*
  # EventBuka Comprehensive Database Schema

  1. New Tables
    - `users` - Extended user profiles with roles
    - `events` - Event management with venue booking
    - `venues` - Available venues for booking
    - `event_categories` - Event categories
    - `nomination_categories` - Award categories for events
    - `nominees` - Nominated candidates
    - `votes` - Voting records
    - `tickets` - Ticket types and pricing
    - `bookings` - User bookings and purchases
    - `seats` - Seat management for events
    - `seat_bookings` - Seat reservations
    - `sponsors` - Sponsor management
    - `partnerships` - Business partnerships
    - `hotels` - Hotel listings
    - `flights` - Flight booking records
    - `logistics` - Transport services
    - `wallets` - User wallet management
    - `transactions` - Payment transactions
    - `payouts` - Vendor payout requests

  2. Security
    - Enable RLS on all tables
    - Role-based access policies (admin, vendor, user)
    - Secure data access patterns

  3. Features
    - Multi-role authentication system
    - Event venue booking with pricing
    - Free and paid voting systems
    - Sponsor and partnership management
    - Comprehensive booking system
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'vendor', 'user', 'sponsor', 'partner');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE transaction_type AS ENUM ('deposit', 'payment', 'refund', 'payout');
CREATE TYPE payout_status AS ENUM ('pending', 'approved', 'rejected', 'completed');

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  wallet_balance DECIMAL(12,2) DEFAULT 0.00,
  stellar_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Lagos',
  state TEXT NOT NULL DEFAULT 'Lagos',
  country TEXT NOT NULL DEFAULT 'Nigeria',
  capacity INTEGER NOT NULL,
  price_per_hour DECIMAL(10,2),
  price_per_day DECIMAL(10,2),
  amenities TEXT[],
  images TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event categories
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#8B5CF6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES users(id),
  venue_id UUID REFERENCES venues(id),
  category_id UUID REFERENCES event_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Lagos',
  state TEXT DEFAULT 'Lagos',
  country TEXT DEFAULT 'Nigeria',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  capacity INTEGER DEFAULT 100,
  status event_status DEFAULT 'draft',
  is_free BOOLEAN DEFAULT FALSE,
  is_award_event BOOLEAN DEFAULT FALSE,
  has_seating BOOLEAN DEFAULT FALSE,
  venue_cost DECIMAL(10,2) DEFAULT 0.00,
  dress_code TEXT,
  sponsors TEXT[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nomination categories for award events
CREATE TABLE IF NOT EXISTS nomination_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_voting_free BOOLEAN DEFAULT TRUE,
  vote_price DECIMAL(10,2) DEFAULT 0.00,
  max_nominations INTEGER DEFAULT 10,
  voting_start_date TIMESTAMPTZ,
  voting_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nominees
CREATE TABLE IF NOT EXISTS nominees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES nomination_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  vote_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  nominated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nominee_id UUID NOT NULL REFERENCES nominees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  category_id UUID NOT NULL REFERENCES nomination_categories(id),
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  quantity_total INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0,
  is_vip BOOLEAN DEFAULT FALSE,
  benefits TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seats
CREATE TABLE IF NOT EXISTS seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  row_number TEXT NOT NULL,
  seat_number TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  seat_type TEXT DEFAULT 'regular',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, section, row_number, seat_number)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_id UUID REFERENCES tickets(id),
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  booking_reference TEXT UNIQUE NOT NULL,
  qr_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seat bookings
CREATE TABLE IF NOT EXISTS seat_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seat_id)
);

-- Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  sponsorship_budget DECIMAL(12,2),
  preferred_categories TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event sponsorships
CREATE TABLE IF NOT EXISTS event_sponsorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sponsor_id UUID NOT NULL REFERENCES sponsors(id),
  sponsorship_amount DECIMAL(10,2) NOT NULL,
  sponsorship_type TEXT, -- 'title', 'presenting', 'supporting', 'media'
  benefits TEXT[],
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'active', 'completed'
  contract_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, sponsor_id)
);

-- Partners
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  business_name TEXT NOT NULL,
  business_type TEXT, -- 'catering', 'decoration', 'photography', 'security', 'equipment'
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  services TEXT[],
  portfolio_urls TEXT[],
  price_range TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partnership requests
CREATE TABLE IF NOT EXISTS partnership_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partners(id),
  organizer_id UUID NOT NULL REFERENCES users(id),
  service_type TEXT NOT NULL,
  message TEXT,
  proposed_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hotels
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  rating DECIMAL(3,2),
  price_per_night DECIMAL(10,2),
  amenities TEXT[],
  images TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hotel bookings
CREATE TABLE IF NOT EXISTS hotel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  hotel_id UUID NOT NULL REFERENCES hotels(id),
  event_id UUID REFERENCES events(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  rooms INTEGER DEFAULT 1,
  guests INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flights
CREATE TABLE IF NOT EXISTS flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  departure_city TEXT NOT NULL,
  arrival_city TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passengers INTEGER DEFAULT 1,
  class TEXT DEFAULT 'economy',
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  booking_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logistics
CREATE TABLE IF NOT EXISTS logistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'pickup', 'shuttle', 'parking'
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  capacity INTEGER,
  pickup_locations TEXT[],
  contact_info TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logistics bookings
CREATE TABLE IF NOT EXISTS logistics_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  logistics_id UUID NOT NULL REFERENCES logistics(id),
  booking_id UUID REFERENCES bookings(id),
  pickup_location TEXT,
  pickup_time TIMESTAMPTZ,
  passengers INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  status booking_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  type transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  reference TEXT UNIQUE,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payouts
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(12,2) NOT NULL,
  status payout_status DEFAULT 'pending',
  bank_details JSONB,
  stellar_address TEXT,
  processed_by UUID REFERENCES users(id),
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default event categories
INSERT INTO event_categories (name, description, icon, color) VALUES
('Music & Concerts', 'Live music performances and concerts', 'music', '#8B5CF6'),
('Tech & Conferences', 'Technology events and conferences', 'laptop', '#06B6D4'),
('Awards & Nominations', 'Award ceremonies and nomination events', 'trophy', '#F59E0B'),
('Food & Drink', 'Culinary events and food festivals', 'utensils', '#10B981'),
('Sports & Fitness', 'Sports events and fitness activities', 'activity', '#EF4444'),
('Arts & Culture', 'Art exhibitions and cultural events', 'palette', '#8B5CF6'),
('Business & Networking', 'Professional networking events', 'briefcase', '#6366F1'),
('Educational', 'Workshops and educational seminars', 'book-open', '#F59E0B'),
('Nightlife & Clubbing', 'Night entertainment and clubbing', 'moon', '#EC4899'),
('Free Events', 'Free community events', 'gift', '#10B981');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(city, state);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_votes_category ON votes(category_id);
CREATE INDEX IF NOT EXISTS idx_nominees_category ON nominees(category_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE nomination_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominees ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for venues
CREATE POLICY "Venues are viewable by everyone" ON venues FOR SELECT USING (true);
CREATE POLICY "Admins can manage venues" ON venues FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for event_categories
CREATE POLICY "Categories are viewable by everyone" ON event_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON event_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for events
CREATE POLICY "Published events are viewable by everyone" ON events FOR SELECT USING (
  status = 'published' OR 
  organizer_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Vendors can manage their own events" ON events FOR ALL USING (organizer_id = auth.uid());
CREATE POLICY "Admins can manage all events" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for nomination_categories
CREATE POLICY "Nomination categories are viewable by everyone" ON nomination_categories FOR SELECT USING (true);
CREATE POLICY "Event organizers can manage their nomination categories" ON nomination_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM events WHERE id = event_id AND organizer_id = auth.uid())
);
CREATE POLICY "Admins can manage all nomination categories" ON nomination_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for nominees
CREATE POLICY "Approved nominees are viewable by everyone" ON nominees FOR SELECT USING (
  is_approved = true OR
  nominated_by = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'vendor'))
);
CREATE POLICY "Users can nominate candidates" ON nominees FOR INSERT WITH CHECK (nominated_by = auth.uid());
CREATE POLICY "Nominators can update their nominations" ON nominees FOR UPDATE USING (nominated_by = auth.uid());
CREATE POLICY "Admins and event organizers can manage nominees" ON nominees FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin') OR
  EXISTS (
    SELECT 1 FROM nomination_categories nc 
    JOIN events e ON nc.event_id = e.id 
    WHERE nc.id = category_id AND e.organizer_id = auth.uid()
  )
);

-- RLS Policies for votes
CREATE POLICY "Users can view their own votes" ON votes FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can cast votes" ON votes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all votes" ON votes FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for tickets
CREATE POLICY "Tickets are viewable by everyone" ON tickets FOR SELECT USING (true);
CREATE POLICY "Event organizers can manage their tickets" ON tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM events WHERE id = event_id AND organizer_id = auth.uid())
);
CREATE POLICY "Admins can manage all tickets" ON tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for seats
CREATE POLICY "Seats are viewable by everyone" ON seats FOR SELECT USING (true);
CREATE POLICY "Event organizers can manage their seats" ON seats FOR ALL USING (
  EXISTS (SELECT 1 FROM events WHERE id = event_id AND organizer_id = auth.uid())
);
CREATE POLICY "Admins can manage all seats" ON seats FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Event organizers can view bookings for their events" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM events WHERE id = event_id AND organizer_id = auth.uid())
);
CREATE POLICY "Admins can manage all bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for sponsors
CREATE POLICY "Sponsors can manage their own profile" ON sponsors FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Verified sponsors are viewable by everyone" ON sponsors FOR SELECT USING (
  is_verified = true OR 
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all sponsors" ON sponsors FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for partners
CREATE POLICY "Partners can manage their own profile" ON partners FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Verified partners are viewable by everyone" ON partners FOR SELECT USING (
  is_verified = true OR 
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all partners" ON partners FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for hotels
CREATE POLICY "Hotels are viewable by everyone" ON hotels FOR SELECT USING (is_available = true);
CREATE POLICY "Admins can manage hotels" ON hotels FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for payouts
CREATE POLICY "Vendors can view their own payouts" ON payouts FOR SELECT USING (vendor_id = auth.uid());
CREATE POLICY "Vendors can request payouts" ON payouts FOR INSERT WITH CHECK (vendor_id = auth.uid());
CREATE POLICY "Admins can manage all payouts" ON payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();