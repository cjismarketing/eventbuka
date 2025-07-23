@@ .. @@
 -- Admin User (replace with actual admin user ID from auth.users)
-INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance, stellar_address) VALUES
-((SELECT id FROM auth.users WHERE email = 'support@eventbuka.com' LIMIT 1), 'support@eventbuka.com', 'System Admin', 'admin', TRUE, 1000000.00, 'GABCDEF12345...');
+INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance) VALUES
+((SELECT id FROM auth.users WHERE email = 'support@eventbuka.com' LIMIT 1), 'support@eventbuka.com', 'System Admin', 'admin', TRUE, 1000000.00);
 
 -- Organizer User (replace with actual organizer user ID from auth.users)
-INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance, stellar_address) VALUES
-((SELECT id FROM auth.users WHERE email = 'organizer@eventbuka.com' LIMIT 1), 'organizer@eventbuka.com', 'Event Organizer', 'organizer', TRUE, 500000.00, 'GHIJKL67890...');
+INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance) VALUES
+((SELECT id FROM auth.users WHERE email = 'organizer@eventbuka.com' LIMIT 1), 'organizer@eventbuka.com', 'Event Organizer', 'organizer', TRUE, 500000.00);
 
 -- Vendor User (replace with actual vendor user ID from auth.users)
-INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance, stellar_address) VALUES
-((SELECT id FROM auth.users WHERE email = 'vendor@eventbuka.com' LIMIT 1), 'vendor@eventbuka.com', 'Event Vendor', 'vendor', TRUE, 250000.00, 'MNOPQR12345...');
+INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance) VALUES
+((SELECT id FROM auth.users WHERE email = 'vendor@eventbuka.com' LIMIT 1), 'vendor@eventbuka.com', 'Event Vendor', 'vendor', TRUE, 250000.00);
 
 -- Sponsor User (replace with actual sponsor user ID from auth.users)
-INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance, stellar_address) VALUES
-((SELECT id FROM auth.users WHERE email = 'sponsor@eventbuka.com' LIMIT 1), 'sponsor@eventbuka.com', 'Corporate Sponsor', 'sponsor', TRUE, 100000.00, 'STUVWX67890...');
+INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance) VALUES
+((SELECT id FROM auth.users WHERE email = 'sponsor@eventbuka.com' LIMIT 1), 'sponsor@eventbuka.com', 'Corporate Sponsor', 'sponsor', TRUE, 100000.00);
 
 -- Partner User (replace with actual partner user ID from auth.users)
-INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance, stellar_address) VALUES
-((SELECT id FROM auth.users WHERE email = 'partner@eventbuka.com' LIMIT 1), 'partner@eventbuka.com', 'Business Partner', 'partner', TRUE, 50000.00, 'YZABCD12345...');
+INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance) VALUES
+((SELECT id FROM auth.users WHERE email = 'partner@eventbuka.com' LIMIT 1), 'partner@eventbuka.com', 'Business Partner', 'partner', TRUE, 50000.00);
 
 -- Regular User (replace with actual regular user ID from auth.users)
-INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance, stellar_address) VALUES
-((SELECT id FROM auth.users WHERE email = 'user@eventbuka.com' LIMIT 1), 'user@eventbuka.com', 'Regular User', 'user', TRUE, 20000.00, 'EFGHIJ67890...');
+INSERT INTO public.users (id, email, full_name, role, is_verified, wallet_balance) VALUES
+((SELECT id FROM auth.users WHERE email = 'user@eventbuka.com' LIMIT 1), 'user@eventbuka.com', 'Regular User', 'user', TRUE, 20000.00);