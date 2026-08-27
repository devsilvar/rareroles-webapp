-- ============================================================================
-- FIX: Remove conflicting old policies and keep only the correct ones
-- 
-- PROBLEM IDENTIFIED:
-- You have duplicate/conflicting policies from different migrations
-- - "Allow public inserts" (old, wrong role: public)
-- - "Allow public insert hiring" (new, correct role: anon)
-- - "Allow authenticated reads" (old, insecure: public can read)
-- - "Allow authenticated read" (new, correct: authenticated only)
--
-- This script removes the old policies and keeps the correct ones
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Remove old/conflicting policies
-- ============================================================================

-- Remove the old INSERT policy (wrong role: public)
DROP POLICY IF EXISTS "Allow public inserts" ON public.hiring_enquiries;

-- Remove the old SELECT policy (insecure: public can read)
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.hiring_enquiries;

-- ============================================================================
-- STEP 2: Ensure the correct policies exist
-- ============================================================================

-- Make sure the correct INSERT policy exists (for anon role)
DROP POLICY IF EXISTS "Allow public insert hiring" ON public.hiring_enquiries;
CREATE POLICY "Allow public insert hiring" ON public.hiring_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Make sure the correct SELECT policy exists (for authenticated with admin check)
-- First check if is_admin() function exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
    -- Use is_admin() if it exists (from migration 005/006)
    DROP POLICY IF EXISTS "Allow authenticated read" ON public.hiring_enquiries;
    CREATE POLICY "Admins read hiring enquiries" ON public.hiring_enquiries
      FOR SELECT
      TO authenticated
      USING (public.is_admin());
  ELSE
    -- Fallback to basic authenticated access if is_admin() doesn't exist
    DROP POLICY IF EXISTS "Allow authenticated read" ON public.hiring_enquiries;
    CREATE POLICY "Allow authenticated read" ON public.hiring_enquiries
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Make sure the correct UPDATE policy exists (for authenticated with admin check)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
    -- Use is_admin() if it exists
    DROP POLICY IF EXISTS "Allow authenticated update" ON public.hiring_enquiries;
    CREATE POLICY "Admins update hiring enquiries" ON public.hiring_enquiries
      FOR UPDATE
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  ELSE
    -- Fallback to basic authenticated access
    DROP POLICY IF EXISTS "Allow authenticated update" ON public.hiring_enquiries;
    CREATE POLICY "Allow authenticated update" ON public.hiring_enquiries
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- ============================================================================
-- STEP 3: Ensure GRANTs are correct
-- ============================================================================

-- Grant INSERT to anon (for public form submissions)
GRANT INSERT ON public.hiring_enquiries TO anon;

-- Grant SELECT and UPDATE to authenticated (for admin dashboard)
GRANT SELECT, UPDATE ON public.hiring_enquiries TO authenticated;

COMMIT;

-- ============================================================================
-- VERIFICATION: Show final policies
-- ============================================================================
SELECT
  'FINAL POLICIES' AS status,
  policyname,
  cmd,
  roles::TEXT
FROM pg_policies
WHERE tablename = 'hiring_enquiries'
ORDER BY cmd, policyname;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
SELECT '✅ Conflicting policies removed!' AS status;
SELECT '✅ Correct policies in place!' AS status;
SELECT '✅ Try submitting the form now!' AS status;
