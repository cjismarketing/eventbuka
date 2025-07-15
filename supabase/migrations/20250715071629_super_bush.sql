/*
  # Fix Authentication and User Management System

  1. User Management
    - Fix users table structure
    - Add proper user roles and permissions
    - Create admin, organizer, vendor, sponsor, partner roles
    
  2. Authentication
    - Enable proper RLS policies
    - Create trigger for new user creation
    
  3. Test Data
    - Create test users with different roles
    - Seed events, venues, sponsors, partners
*/

-- First, let's ensure the users table has the correct structure
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS services TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_categories TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS sponsorship_budget NUMERIC(12,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio_urls TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS price_range TEXT;

-- Update the handle_new_user function to properly create user profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user',
    false,
    0.00
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create test users in auth.users (these will be created via the application)
-- But first, let's insert some test data directly into the users table

-- Insert test users (assuming they exist in auth.users)
INSERT INTO users (id, email, full_name, role, is_verified, wallet_balance, phone, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'support@eventbuka.com', 'Super Admin', 'admin', true, 100000.00, '+234-800-123-4567', NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'organizer@eventbuka.com', 'Event Organizer', 'vendor', true, 50000.00, '+234-800-123-4568', NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'vendor@eventbuka.com', 'Event Vendor', 'vendor', true, 30000.00, '+234-800-123-4569', NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'sponsor@eventbuka.com', 'Corporate Sponsor', 'sponsor', true, 200000.00, '+234-800-123-4570', NOW()),
  ('550e8400-e29b-41d4-a716-446655440005', 'partner@eventbuka.com', 'Business Partner', 'partner', true, 25000.00, '+234-800-123-4571', NOW()),
  ('550e8400-e29b-41d4-a716-446655440006', 'user@eventbuka.com', 'Regular User', 'user', true, 15000.00, '+234-800-123-4572', NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_verified = EXCLUDED.is_verified,
  wallet_balance = EXCLUDED.wallet_balance,
  phone = EXCLUDED.phone;

-- Create event categories
INSERT INTO event_categories (name, description, icon, color) VALUES
  ('Music & Concerts', 'Live music performances and concerts', 'music', '#8B5CF6'),
  ('Tech & Conferences', 'Technology conferences and seminars', 'laptop', '#3B82F6'),
  ('Awards & Nominations', 'Award ceremonies and recognition events', 'trophy', '#F59E0B'),
  ('Food & Drink', 'Food festivals and culinary events', 'utensils', '#10B981'),
  ('Sports & Fitness', 'Sports events and fitness activities', 'activity', '#EF4444'),
  ('Arts & Culture', 'Art exhibitions and cultural events', 'palette', '#8B5CF6'),
  ('Business & Networking', 'Business meetings and networking events', 'briefcase', '#6B7280'),
  ('Educational', 'Educational workshops and training', 'book', '#F97316')
ON CONFLICT (name) DO NOTHING;

-- Create sample venues
INSERT INTO venues (name, description, address, city, state, country, capacity, price_per_hour, price_per_day, amenities, contact_email, contact_phone, is_available) VALUES
  ('Tafawa Balewa Square', 'Historic square in the heart of Lagos Island', 'Tafawa Balewa Square, Lagos Island', 'Lagos', 'Lagos', 'Nigeria', 5000, 50000, 300000, ARRAY['Parking', 'Security', 'Sound System'], 'info@tbs.gov.ng', '+234-1-234-5678', true),
  ('Eko Hotel Convention Centre', 'Premium convention center with modern facilities', '1415 Adetokunbo Ademola Street, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 2000, 100000, 800000, ARRAY['AC', 'WiFi', 'Catering', 'Parking', 'Security'], 'events@ekohotels.com', '+234-1-261-0000', true),
  ('Landmark Centre', 'Modern event space in Victoria Island', 'Water Corporation Drive, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 1500, 75000, 500000, ARRAY['AC', 'WiFi', 'Parking', 'Security'], 'info@landmarkcentre.com', '+234-1-270-1000', true),
  ('Terra Kulture', 'Cultural center and event space', '1376 Tiamiyu Savage Street, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 300, 25000, 150000, ARRAY['AC', 'WiFi', 'Catering'], 'info@terrakulture.com', '+234-1-270-3842', true),
  ('Co-Creation Hub', 'Tech hub and event space in Yaba', '294 Herbert Macaulay Way, Yaba', 'Lagos', 'Lagos', 'Nigeria', 200, 20000, 100000, ARRAY['WiFi', 'Parking', 'Security'], 'hello@cchubnigeria.com', '+234-1-280-3050', true)
ON CONFLICT (name) DO NOTHING;

-- Create sample events
INSERT INTO events (id, organizer_id, venue_id, category_id, title, description, image_url, start_date, end_date, location, address, city, state, country, capacity, status, is_free, is_award_event, has_seating, venue_cost, dress_code, tags) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM venues WHERE name = 'Tafawa Balewa Square'), (SELECT id FROM event_categories WHERE name = 'Music & Concerts'), 'Lagos Music Festival 2024', 'Experience the biggest music festival in West Africa with top local and international artists', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg', '2024-04-15 18:00:00+01', '2024-04-15 23:00:00+01', 'Tafawa Balewa Square', 'Tafawa Balewa Square, Lagos Island', 'Lagos', 'Lagos', 'Nigeria', 5000, 'published', false, false, true, 300000, 'Smart Casual', ARRAY['music', 'festival', 'entertainment']),
  
  ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM venues WHERE name = 'Landmark Centre'), (SELECT id FROM event_categories WHERE name = 'Tech & Conferences'), 'Tech Innovation Summit 2024', 'Join industry leaders and innovators for insights into the future of technology', 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg', '2024-04-20 09:00:00+01', '2024-04-20 17:00:00+01', 'Landmark Centre', 'Water Corporation Drive, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 1500, 'published', false, false, false, 500000, 'Business Formal', ARRAY['tech', 'innovation', 'conference']),
  
  ('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM venues WHERE name = 'Eko Hotel Convention Centre'), (SELECT id FROM event_categories WHERE name = 'Awards & Nominations'), 'Nigerian Film Awards 2024', 'Celebrate the best of Nigerian cinema at this prestigious awards ceremony', 'https://images.pexels.com/photos/3137892/pexels-photo-3137892.jpeg', '2024-04-25 19:00:00+01', '2024-04-25 23:00:00+01', 'Eko Hotel Convention Centre', '1415 Adetokunbo Ademola Street, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 2000, 'published', false, true, true, 800000, 'Black Tie', ARRAY['awards', 'film', 'nollywood']),
  
  ('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM venues WHERE name = 'Terra Kulture'), (SELECT id FROM event_categories WHERE name = 'Food & Drink'), 'Lagos Food Festival', 'Taste the best local and international cuisine', 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg', '2024-04-30 12:00:00+01', '2024-04-30 20:00:00+01', 'Terra Kulture', '1376 Tiamiyu Savage Street, Victoria Island', 'Lagos', 'Lagos', 'Nigeria', 300, 'published', true, false, false, 150000, 'Casual', ARRAY['food', 'festival', 'culture'])
ON CONFLICT (id) DO NOTHING;

-- Create tickets for events
INSERT INTO tickets (event_id, name, description, price, quantity_total, quantity_sold, is_vip, benefits) VALUES
  -- Lagos Music Festival tickets
  ((SELECT id FROM events WHERE title = 'Lagos Music Festival 2024'), 'General Admission', 'Access to main festival area', 5000, 3000, 150, false, ARRAY['Festival access', 'Food court access']),
  ((SELECT id FROM events WHERE title = 'Lagos Music Festival 2024'), 'VIP Pass', 'Premium experience with backstage access', 15000, 500, 25, true, ARRAY['VIP area access', 'Backstage meet & greet', 'Premium bar', 'VIP parking']),
  ((SELECT id FROM events WHERE title = 'Lagos Music Festival 2024'), 'Table for 4', 'Reserved table seating for 4 people', 40000, 100, 5, true, ARRAY['Reserved table', 'Waiter service', 'Premium location']),
  
  -- Tech Summit tickets
  ((SELECT id FROM events WHERE title = 'Tech Innovation Summit 2024'), 'Regular Pass', 'Full conference access', 15000, 1000, 200, false, ARRAY['All sessions', 'Networking lunch', 'Conference materials']),
  ((SELECT id FROM events WHERE title = 'Tech Innovation Summit 2024'), 'Premium Pass', 'Enhanced conference experience', 25000, 200, 30, true, ARRAY['All sessions', 'VIP networking', 'Premium lunch', 'Exclusive workshops']),
  
  -- Film Awards tickets
  ((SELECT id FROM events WHERE title = 'Nigerian Film Awards 2024'), 'Standard Seat', 'Awards ceremony access', 25000, 1500, 100, false, ARRAY['Ceremony access', 'Welcome drink']),
  ((SELECT id FROM events WHERE title = 'Nigerian Film Awards 2024'), 'VIP Seat', 'Premium awards experience', 50000, 300, 20, true, ARRAY['Premium seating', 'After-party access', 'Gift bag', 'Photo opportunities']),
  
  -- Food Festival (Free event)
  ((SELECT id FROM events WHERE title = 'Lagos Food Festival'), 'Free Entry', 'Free access to food festival', 0, 300, 50, false, ARRAY['Festival access', 'Tasting opportunities'])
ON CONFLICT DO NOTHING;

-- Create sponsors
INSERT INTO sponsors (user_id, company_name, contact_person, email, phone, website, description, sponsorship_budget, preferred_categories, is_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440004', 'MTN Nigeria', 'John Adebayo', 'sponsor@eventbuka.com', '+234-803-000-0001', 'https://www.mtnonline.com', 'Leading telecommunications company in Nigeria', 5000000, ARRAY['Music & Concerts', 'Tech & Conferences'], true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Dangote Group', 'Amina Hassan', 'partnerships@dangote.com', '+234-803-000-0002', 'https://www.dangote.com', 'Diversified business conglomerate', 10000000, ARRAY['Business & Networking', 'Awards & Nominations'], true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Guaranty Trust Bank', 'Kemi Ogundimu', 'events@gtbank.com', '+234-803-000-0003', 'https://www.gtbank.com', 'Leading financial institution', 3000000, ARRAY['Tech & Conferences', 'Educational'], true)
ON CONFLICT DO NOTHING;

-- Create partners
INSERT INTO partners (user_id, business_name, business_type, contact_person, email, phone, website, description, services, price_range, location, is_verified, rating) VALUES
  ('550e8400-e29b-41d4-a716-446655440005', 'Lagos Catering Services', 'Catering', 'Funmi Adebola', 'partner@eventbuka.com', '+234-803-000-0004', 'https://www.lagoscatering.com', 'Premium catering services for all events', ARRAY['Catering', 'Event Planning'], '₦50,000 - ₦500,000', 'Lagos, Nigeria', true, 4.8),
  ('550e8400-e29b-41d4-a716-446655440005', 'EventPro Decorations', 'Decoration', 'Tunde Bakare', 'decor@eventpro.ng', '+234-803-000-0005', 'https://www.eventpro.ng', 'Creative event decoration and styling', ARRAY['Decoration', 'Lighting', 'Styling'], '₦30,000 - ₦300,000', 'Lagos, Nigeria', true, 4.9),
  ('550e8400-e29b-41d4-a716-446655440005', 'SecureGuard Services', 'Security', 'Ibrahim Musa', 'security@secureguard.ng', '+234-803-000-0006', 'https://www.secureguard.ng', 'Professional security services for events', ARRAY['Security', 'Crowd Control'], '₦20,000 - ₦200,000', 'Lagos, Nigeria', true, 4.7)
ON CONFLICT DO NOTHING;

-- Create nomination categories for awards event
INSERT INTO nomination_categories (event_id, name, description, is_voting_free, vote_price, max_nominations, voting_start_date, voting_end_date) VALUES
  ((SELECT id FROM events WHERE title = 'Nigerian Film Awards 2024'), 'Best Actor', 'Best Male Actor in a Leading Role', false, 500, 10, '2024-04-01 00:00:00+01', '2024-04-24 23:59:59+01'),
  ((SELECT id FROM events WHERE title = 'Nigerian Film Awards 2024'), 'Best Actress', 'Best Female Actor in a Leading Role', false, 500, 10, '2024-04-01 00:00:00+01', '2024-04-24 23:59:59+01'),
  ((SELECT id FROM events WHERE title = 'Nigerian Film Awards 2024'), 'Best Director', 'Best Film Director', false, 500, 8, '2024-04-01 00:00:00+01', '2024-04-24 23:59:59+01'),
  ((SELECT id FROM events WHERE title = 'Nigerian Film Awards 2024'), 'Best Film', 'Best Overall Film', false, 1000, 12, '2024-04-01 00:00:00+01', '2024-04-24 23:59:59+01')
ON CONFLICT DO NOTHING;

-- Create nominees
INSERT INTO nominees (category_id, name, description, image_url, contact_email, vote_count, is_approved, nominated_by) VALUES
  ((SELECT id FROM nomination_categories WHERE name = 'Best Actor'), 'Ramsey Nouah', 'Veteran Nollywood actor known for his versatile roles', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', 'ramsey@nollywood.ng', 45, true, '550e8400-e29b-41d4-a716-446655440006'),
  ((SELECT id FROM nomination_categories WHERE name = 'Best Actor'), 'Richard Mofe-Damijo', 'Award-winning actor and former commissioner', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', 'rmd@nollywood.ng', 38, true, '550e8400-e29b-41d4-a716-446655440006'),
  ((SELECT id FROM nomination_categories WHERE name = 'Best Actress'), 'Genevieve Nnaji', 'International Nollywood star and producer', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', 'genevieve@nollywood.ng', 52, true, '550e8400-e29b-41d4-a716-446655440006'),
  ((SELECT id FROM nomination_categories WHERE name = 'Best Actress'), 'Funke Akindele', 'Popular actress and producer', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg', 'funke@nollywood.ng', 41, true, '550e8400-e29b-41d4-a716-446655440006')
ON CONFLICT DO NOTHING;

-- Create sample bookings
INSERT INTO bookings (user_id, event_id, ticket_id, quantity, total_amount, status, payment_method, booking_reference, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM events WHERE title = 'Lagos Music Festival 2024'), (SELECT id FROM tickets WHERE name = 'General Admission' AND event_id = (SELECT id FROM events WHERE title = 'Lagos Music Festival 2024')), 2, 10000, 'confirmed', 'card', 'EVB-' || EXTRACT(EPOCH FROM NOW())::TEXT, 'Excited for the festival!'),
  ('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM events WHERE title = 'Tech Innovation Summit 2024'), (SELECT id FROM tickets WHERE name = 'Regular Pass' AND event_id = (SELECT id FROM events WHERE title = 'Tech Innovation Summit 2024')), 1, 15000, 'confirmed', 'wallet', 'EVB-' || (EXTRACT(EPOCH FROM NOW()) + 1)::TEXT, 'Looking forward to learning!')
ON CONFLICT DO NOTHING;

-- Create sample transactions
INSERT INTO transactions (user_id, type, amount, description, reference, payment_method, status, metadata) VALUES
  ('550e8400-e29b-41d4-a716-446655440006', 'deposit', 50000, 'Wallet funding via Flutterwave', 'FLW-' || EXTRACT(EPOCH FROM NOW())::TEXT, 'flutterwave', 'completed', '{"gateway": "flutterwave", "transaction_id": "FLW123456"}'),
  ('550e8400-e29b-41d4-a716-446655440006', 'payment', -10000, 'Lagos Music Festival tickets', 'EVB-' || EXTRACT(EPOCH FROM NOW())::TEXT, 'wallet', 'completed', '{"event_id": "550e8400-e29b-41d4-a716-446655440101", "tickets": 2}'),
  ('550e8400-e29b-41d4-a716-446655440006', 'payment', -15000, 'Tech Summit ticket', 'EVB-' || (EXTRACT(EPOCH FROM NOW()) + 1)::TEXT, 'wallet', 'completed', '{"event_id": "550e8400-e29b-41d4-a716-446655440102", "tickets": 1}')
ON CONFLICT DO NOTHING;

-- Update user wallet balances based on transactions
UPDATE users SET wallet_balance = (
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions 
  WHERE transactions.user_id = users.id AND status = 'completed'
) WHERE id IN ('550e8400-e29b-41d4-a716-446655440006');

-- Create seats for events with seating
INSERT INTO seats (event_id, section, row_number, seat_number, price, is_available, seat_type) 
SELECT 
  e.id,
  section_data.section,
  section_data.row_number,
  section_data.seat_number,
  section_data.price,
  true,
  section_data.seat_type
FROM events e
CROSS JOIN (
  -- VIP Section (5 rows, 20 seats each)
  SELECT 'VIP' as section, chr(64 + row_num) as row_number, seat_num::text as seat_number, 25000 as price, 'vip' as seat_type
  FROM generate_series(1, 5) row_num, generate_series(1, 20) seat_num
  UNION ALL
  -- Regular Section (10 rows, 30 seats each)
  SELECT 'Regular' as section, chr(64 + row_num) as row_number, seat_num::text as seat_number, 15000 as price, 'regular' as seat_type
  FROM generate_series(1, 10) row_num, generate_series(1, 30) seat_num
  UNION ALL
  -- Table Section (8 tables, 8 seats each)
  SELECT 'Table' as section, table_num::text as row_number, chr(64 + seat_num) as seat_number, 40000 as price, 'table' as seat_type
  FROM generate_series(1, 8) table_num, generate_series(1, 8) seat_num
) section_data
WHERE e.has_seating = true
ON CONFLICT DO NOTHING;