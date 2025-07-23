/*
  # Seed Test Data for EventBuka Platform
  
  This script creates comprehensive test data including:
  - Test users for each role (admin, organizer, vendor, sponsor, partner)
  - Sample events with different types
  - Bookings and transactions
  - Nominations and votes for award events
  
  Note: Users must be created through Supabase Auth first, then this script
  can be run to populate additional data.
*/

-- Insert test events (assuming users exist)
-- These will be created after users are properly set up through auth

-- Sample events for different organizers
INSERT INTO public.events (
  id, organizer_id, venue_id, category_id, title, description, image_url,
  start_date, end_date, location, address, city, state, country,
  capacity, status, is_free, is_award_event, has_seating, tags
) VALUES
-- Music Festival (assuming organizer exists)
(
  uuid_generate_v4(),
  (SELECT id FROM public.users WHERE role = 'organizer' LIMIT 1),
  (SELECT id FROM public.venues WHERE name = 'Tafawa Balewa Square' LIMIT 1),
  (SELECT id FROM public.event_categories WHERE name = 'Music & Concerts' LIMIT 1),
  'Lagos Music Festival 2024',
  'Experience the biggest music festival in West Africa with top local and international artists performing across multiple stages.',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
  '2024-06-15 18:00:00+01',
  '2024-06-16 02:00:00+01',
  'Tafawa Balewa Square',
  'Tafawa Balewa Square, Lagos Island',
  'Lagos',
  'Lagos',
  'Nigeria',
  5000,
  'published',
  false,
  false,
  false,
  ARRAY['music', 'festival', 'live', 'outdoor']
),

-- Tech Conference
(
  uuid_generate_v4(),
  (SELECT id FROM public.users WHERE role = 'organizer' LIMIT 1),
  (SELECT id FROM public.venues WHERE name = 'Eko Hotel Convention Centre' LIMIT 1),
  (SELECT id FROM public.event_categories WHERE name = 'Tech & Conferences' LIMIT 1),
  'Tech Innovation Summit 2024',
  'Join industry leaders and innovators for insights into the future of technology, AI, and digital transformation in Africa.',
  'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=800',
  '2024-07-20 09:00:00+01',
  '2024-07-21 17:00:00+01',
  'Eko Hotel Convention Centre',
  'Eko Hotel, Victoria Island',
  'Lagos',
  'Lagos',
  'Nigeria',
  2000,
  'published',
  false,
  false,
  true,
  ARRAY['technology', 'innovation', 'conference', 'networking']
),

-- Award Event
(
  uuid_generate_v4(),
  (SELECT id FROM public.users WHERE role = 'organizer' LIMIT 1),
  (SELECT id FROM public.venues WHERE name = 'Eko Hotel Convention Centre' LIMIT 1),
  (SELECT id FROM public.event_categories WHERE name = 'Awards & Nominations' LIMIT 1),
  'Nigerian Film Awards 2024',
  'Celebrate the best of Nigerian cinema at this prestigious awards ceremony recognizing outstanding achievements in Nollywood.',
  'https://images.pexels.com/photos/3137892/pexels-photo-3137892.jpeg?auto=compress&cs=tinysrgb&w=800',
  '2024-08-25 19:00:00+01',
  '2024-08-25 23:00:00+01',
  'Eko Hotel Convention Centre',
  'Eko Hotel, Victoria Island',
  'Lagos',
  'Lagos',
  'Nigeria',
  500,
  'published',
  false,
  true,
  true,
  ARRAY['awards', 'nollywood', 'cinema', 'red-carpet']
),

-- Food Festival
(
  uuid_generate_v4(),
  (SELECT id FROM public.users WHERE role = 'organizer' LIMIT 1),
  (SELECT id FROM public.venues WHERE name = 'Lekki Conservation Centre' LIMIT 1),
  (SELECT id FROM public.event_categories WHERE name = 'Food & Drink' LIMIT 1),
  'Lagos Food & Wine Festival',
  'Taste the best local and international cuisine in a beautiful outdoor setting with live cooking demonstrations and wine tastings.',
  'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
  '2024-09-30 12:00:00+01',
  '2024-09-30 20:00:00+01',
  'Lekki Conservation Centre',
  'Lekki-Epe Expressway, Lekki',
  'Lagos',
  'Lagos',
  'Nigeria',
  1000,
  'published',
  true,
  false,
  false,
  ARRAY['food', 'wine', 'outdoor', 'family']
),

-- Business Networking Event
(
  uuid_generate_v4(),
  (SELECT id FROM public.users WHERE role = 'organizer' LIMIT 1),
  (SELECT id FROM public.venues WHERE name = 'Landmark Centre' LIMIT 1),
  (SELECT id FROM public.event_categories WHERE name = 'Business & Networking' LIMIT 1),
  'Startup Pitch Competition 2024',
  'Watch emerging startups pitch their innovative ideas to top investors and mentors in this exciting competition.',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  '2024-10-10 14:00:00+01',
  '2024-10-10 18:00:00+01',
  'Landmark Centre',
  'Water Corporation Drive, Victoria Island',
  'Lagos',
  'Lagos',
  'Nigeria',
  400,
  'published',
  false,
  false,
  true,
  ARRAY['startup', 'pitch', 'investment', 'entrepreneurship']
);

-- Insert tickets for events
INSERT INTO public.tickets (event_id, name, description, price, quantity_total, quantity_sold, is_vip, benefits) 
SELECT 
  e.id,
  'General Admission',
  'Standard entry ticket',
  CASE 
    WHEN e.is_free THEN 0
    WHEN e.title LIKE '%Music%' THEN 5000
    WHEN e.title LIKE '%Tech%' THEN 15000
    WHEN e.title LIKE '%Awards%' THEN 25000
    WHEN e.title LIKE '%Startup%' THEN 2000
    ELSE 1000
  END,
  CASE 
    WHEN e.capacity > 1000 THEN e.capacity * 0.7
    ELSE e.capacity * 0.8
  END::integer,
  CASE 
    WHEN e.capacity > 1000 THEN (e.capacity * 0.7 * 0.3)::integer
    ELSE (e.capacity * 0.8 * 0.2)::integer
  END,
  false,
  ARRAY['Event Access', 'Welcome Drink']
FROM public.events e;

-- Insert VIP tickets for paid events
INSERT INTO public.tickets (event_id, name, description, price, quantity_total, quantity_sold, is_vip, benefits) 
SELECT 
  e.id,
  'VIP Pass',
  'Premium experience with exclusive benefits',
  CASE 
    WHEN e.title LIKE '%Music%' THEN 15000
    WHEN e.title LIKE '%Tech%' THEN 35000
    WHEN e.title LIKE '%Awards%' THEN 50000
    WHEN e.title LIKE '%Startup%' THEN 5000
    ELSE 3000
  END,
  (e.capacity * 0.2)::integer,
  (e.capacity * 0.2 * 0.4)::integer,
  true,
  ARRAY['VIP Lounge Access', 'Premium Seating', 'Meet & Greet', 'Exclusive Networking', 'Gift Bag']
FROM public.events e
WHERE NOT e.is_free;

-- Insert seats for events with seating
INSERT INTO public.seats (event_id, section, row_number, seat_number, price, seat_type)
SELECT 
  e.id,
  section_data.section,
  section_data.row_letter,
  seat_num::text,
  CASE 
    WHEN section_data.section = 'VIP' THEN 
      CASE 
        WHEN e.title LIKE '%Tech%' THEN 35000
        WHEN e.title LIKE '%Awards%' THEN 50000
        ELSE 15000
      END
    WHEN section_data.section = 'Premium' THEN 
      CASE 
        WHEN e.title LIKE '%Tech%' THEN 25000
        WHEN e.title LIKE '%Awards%' THEN 35000
        ELSE 10000
      END
    ELSE 
      CASE 
        WHEN e.title LIKE '%Tech%' THEN 15000
        WHEN e.title LIKE '%Awards%' THEN 25000
        ELSE 5000
      END
  END,
  CASE 
    WHEN section_data.section = 'VIP' THEN 'vip'
    WHEN section_data.section = 'Premium' THEN 'premium'
    ELSE 'regular'
  END
FROM public.events e
CROSS JOIN (
  SELECT 'VIP' as section, chr(65 + row_idx) as row_letter, row_idx
  FROM generate_series(0, 2) as row_idx
  UNION ALL
  SELECT 'Premium' as section, chr(65 + row_idx) as row_letter, row_idx
  FROM generate_series(0, 4) as row_idx
  UNION ALL
  SELECT 'Regular' as section, chr(65 + row_idx) as row_letter, row_idx
  FROM generate_series(0, 9) as row_idx
) section_data
CROSS JOIN generate_series(1, 20) as seat_num
WHERE e.has_seating = true;

-- Insert nomination categories for award events
INSERT INTO public.nomination_categories (event_id, name, description, is_voting_free, vote_price, max_nominations, voting_start_date, voting_end_date)
SELECT 
  e.id,
  category_name,
  'Vote for the best in ' || category_name,
  false,
  100,
  5,
  e.start_date - INTERVAL '30 days',
  e.start_date - INTERVAL '1 day'
FROM public.events e
CROSS JOIN (
  VALUES 
    ('Best Actor'),
    ('Best Actress'),
    ('Best Director'),
    ('Best Picture'),
    ('Best Supporting Actor'),
    ('Best Supporting Actress')
) AS categories(category_name)
WHERE e.is_award_event = true;

-- Insert nominees for award categories
INSERT INTO public.nominees (category_id, name, description, image_url, is_approved, vote_count)
SELECT 
  nc.id,
  nominee_data.name,
  'Nominated for outstanding performance in ' || nc.name,
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
  true,
  (random() * 100)::integer
FROM public.nomination_categories nc
CROSS JOIN (
  VALUES 
    ('Ramsey Nouah'),
    ('Genevieve Nnaji'),
    ('Omotola Jalade'),
    ('Richard Mofe-Damijo'),
    ('Funke Akindele'),
    ('Jim Iyke'),
    ('Rita Dominic'),
    ('Nkem Owoh')
) AS nominee_data(name);

-- Insert logistics services for events
INSERT INTO public.logistics (event_id, service_type, description, price, capacity, pickup_locations, contact_info)
SELECT 
  e.id,
  service_data.service_type,
  service_data.description,
  service_data.price,
  service_data.capacity,
  ARRAY['Victoria Island', 'Ikoyi', 'Lekki', 'Surulere', 'Ikeja'],
  '+234-801-234-5690'
FROM public.events e
CROSS JOIN (
  VALUES 
    ('Shuttle Service', 'Comfortable shuttle service to and from the venue', 2000, 50),
    ('VIP Transport', 'Luxury car service for VIP guests', 10000, 4),
    ('Group Transport', 'Bus service for large groups', 1500, 30)
) AS service_data(service_type, description, price, capacity);

-- This script provides a comprehensive foundation for test data
-- Additional data can be added as needed for specific testing scenarios