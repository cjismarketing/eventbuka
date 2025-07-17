/*
  # Fix RLS Policies - Resolve Infinite Recursion

  This migration fixes the infinite recursion issue in RLS policies by:
  1. Dropping problematic policies that create circular references
  2. Creating simplified policies that avoid complex joins
  3. Using direct auth.uid() checks instead of subqueries to users table
*/

-- Drop existing problematic policies on users table
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Drop problematic policies on events table that reference users
DROP POLICY IF EXISTS "Admins can manage all events" ON events;
DROP POLICY IF EXISTS "Vendors can manage their own events" ON events;

-- Drop problematic policies on partners table
DROP POLICY IF EXISTS "Admins can manage all partners" ON partners;
DROP POLICY IF EXISTS "Partners can manage their own profile" ON partners;
DROP POLICY IF EXISTS "Verified partners are viewable by everyone" ON partners;

-- Drop problematic policies on sponsors table
DROP POLICY IF EXISTS "Admins can manage all sponsors" ON sponsors;
DROP POLICY IF EXISTS "Sponsors can manage their own profile" ON sponsors;
DROP POLICY IF EXISTS "Verified sponsors are viewable by everyone" ON sponsors;

-- Drop problematic policies on nominees table
DROP POLICY IF EXISTS "Admins and event organizers can manage nominees" ON nominees;

-- Create simplified policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create simplified policies for events table
CREATE POLICY "Published events are publicly viewable"
  ON events
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Event organizers can view their own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (organizer_id = auth.uid());

CREATE POLICY "Event organizers can manage their own events"
  ON events
  FOR ALL
  TO authenticated
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

-- Create simplified policies for partners table
CREATE POLICY "Verified partners are publicly viewable"
  ON partners
  FOR SELECT
  TO public
  USING (is_verified = true);

CREATE POLICY "Partners can view their own profile"
  ON partners
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Partners can manage their own profile"
  ON partners
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create simplified policies for sponsors table
CREATE POLICY "Verified sponsors are publicly viewable"
  ON sponsors
  FOR SELECT
  TO public
  USING (is_verified = true);

CREATE POLICY "Sponsors can view their own profile"
  ON sponsors
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Sponsors can manage their own profile"
  ON sponsors
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create simplified policies for nominees table
CREATE POLICY "Approved nominees are publicly viewable"
  ON nominees
  FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Users can view their own nominations"
  ON nominees
  FOR SELECT
  TO authenticated
  USING (nominated_by = auth.uid());

CREATE POLICY "Users can create nominations"
  ON nominees
  FOR INSERT
  TO authenticated
  WITH CHECK (nominated_by = auth.uid());

CREATE POLICY "Users can update their own nominations"
  ON nominees
  FOR UPDATE
  TO authenticated
  USING (nominated_by = auth.uid())
  WITH CHECK (nominated_by = auth.uid());

-- Create admin policies using a function to check admin role
-- This avoids the circular reference by using a direct function call
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  );
$$;

-- Admin policies using the function
CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can manage all events"
  ON events
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can manage all partners"
  ON partners
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can manage all sponsors"
  ON sponsors
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can manage all nominees"
  ON nominees
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());