/*
  # Remove Stellar Wallet Addresses from Users

  1. Changes
    - Remove `stellar_address` column from `users` table
    - Clean up any references to stellar addresses in the codebase

  2. Security
    - No RLS changes needed as we're only removing a column
    - Existing policies remain intact

  3. Notes
    - This is a destructive operation that will permanently remove stellar address data
    - Make sure to backup any important stellar address data before running this migration
*/

-- Remove stellar_address column from users table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'stellar_address'
  ) THEN
    ALTER TABLE users DROP COLUMN stellar_address;
  END IF;
END $$;