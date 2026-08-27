-- ============================================================================
-- EMERGENCY FIX: Restore anonymous INSERT policy for hiring_enquiries
-- 
-- ERROR: "new row violates row-level security policy for table hiring_enquiries"
-- CAUSE: Migration 006 removed the public insert policy, migration 008 should
--        have restored it but either wasn't run or the policy name conflicts.
--
-- This script:
-- 1. Drops any existing INSERT policies for anon role
-- 2. Creates a fresh INSERT policy for anonymous users
-- 3. Ensures anon role has INSERT grant
-- 4. Verifies the fix
-- ============================================================================

-- Step 1: Drop any existing INSERT policies for hiring_enquiries (clean slate)
DROP POLICY IF EXISTS "Allow public insert" ON public.hiring_enquiries;
DROP POLICY IF EXISTS "Allow public insert hiring" ON public.hiring_enquiries;

-- Step 2: Create the INSERT policy for anonymous users (public form submissions)
CREATE POLICY "Allow public insert hiring" ON public.hiring_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Step 3: Grant INSERT permission to anon role
GRANT INSERT ON public.hiring_enquiries TO anon;

-- Step 4: Verify the policies are correct
-- Expected output:
-- - INSERT policy for anon role: "Allow public insert hiring"
-- - SELECT policy for authenticated: "Admins read hiring enquiries" (with is_admin check)
-- - UPDATE policy for authenticated: "Admins update hiring enquiries" (with is_admin check)
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT,
  COALESCE(qual::TEXT, with_check::TEXT) AS predicate
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'hiring_enquiries'
ORDER BY cmd, policyname;

-- Step 5: Test the fix (optional - uncomment to run a test insert)
-- This should succeed if the fix worked:
/*
DO $$
BEGIN
  -- Try to insert as anon user (simulates form submission)
  SET LOCAL ROLE anon;
  INSERT INTO public.hiring_enquiries (company, contact_name, email, roles)
  VALUES ('Test Company', 'Test User', 'test@test.com', '[]'::jsonb);
  RAISE NOTICE 'Test insert succeeded! RLS policy is working.';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Test insert failed: %', SQLERRM;
END $$;
*/
