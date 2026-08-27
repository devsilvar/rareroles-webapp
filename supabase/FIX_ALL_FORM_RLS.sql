-- ============================================================================
-- COMPREHENSIVE FIX: Restore anonymous INSERT policies for ALL form tables
-- 
-- ERROR: "new row violates row-level security policy"
-- 
-- Tables affected:
-- - hiring_enquiries (companies looking to hire)
-- - talent_submissions (individuals seeking work)
-- - contacts (general contact form)
--
-- This script:
-- 1. Drops ALL existing INSERT policies (to avoid name conflicts)
-- 2. Creates fresh INSERT policies for anon role
-- 3. Ensures GRANT INSERT permissions are set
-- 4. Verifies the configuration
--
-- SAFE TO RUN: Uses "IF EXISTS" and will not break existing data
-- ============================================================================

BEGIN;

-- ============================================================================
-- HIRING_ENQUIRIES
-- ============================================================================
-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Allow public insert" ON public.hiring_enquiries;
DROP POLICY IF EXISTS "Allow public insert hiring" ON public.hiring_enquiries;

-- Create fresh INSERT policy for anonymous users
CREATE POLICY "Allow public insert hiring" ON public.hiring_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Grant INSERT permission
GRANT INSERT ON public.hiring_enquiries TO anon;


-- ============================================================================
-- TALENT_SUBMISSIONS
-- ============================================================================
-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Allow public insert" ON public.talent_submissions;
DROP POLICY IF EXISTS "Allow public insert talent" ON public.talent_submissions;

-- Create fresh INSERT policy for anonymous users
CREATE POLICY "Allow public insert talent" ON public.talent_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Grant INSERT permission
GRANT INSERT ON public.talent_submissions TO anon;


-- ============================================================================
-- CONTACTS
-- ============================================================================
-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Allow public insert" ON public.contacts;
DROP POLICY IF EXISTS "Allow public insert contact" ON public.contacts;

-- Create fresh INSERT policy for anonymous users
CREATE POLICY "Allow public insert contact" ON public.contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Grant INSERT permission
GRANT INSERT ON public.contacts TO anon;

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check all policies - you should see:
-- - INSERT policies for anon role on all three tables
-- - SELECT/UPDATE policies for authenticated with is_admin() check
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT,
  COALESCE(qual::TEXT, with_check::TEXT) AS predicate
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('hiring_enquiries', 'talent_submissions', 'contacts')
ORDER BY tablename, cmd, policyname;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ All form submission policies have been restored!';
  RAISE NOTICE 'Public users can now submit:';
  RAISE NOTICE '  - Hiring enquiries';
  RAISE NOTICE '  - Talent submissions';
  RAISE NOTICE '  - Contact forms';
  RAISE NOTICE '';
  RAISE NOTICE 'Admin-only access (read/update) is still enforced via is_admin() check.';
END $$;
