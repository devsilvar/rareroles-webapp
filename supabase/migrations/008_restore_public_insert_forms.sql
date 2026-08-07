-- ============================================================================
-- Migration: Restore public INSERT policies for all form submission tables
--
-- Purpose: Migration 006 removed the anonymous INSERT policies that allow
-- public users to submit forms. This restores them for all three tables:
-- - talent_submissions (talent seeking work)
-- - hiring_enquiries (companies looking to hire)
-- - contacts (general contact form)
--
-- Security note: This only allows INSERT for anonymous users (public forms).
-- SELECT and UPDATE remain restricted to admins via is_admin() check from 006.
-- ============================================================================

-- ============================================================================
-- talent_submissions
-- ============================================================================
CREATE POLICY "Allow public insert talent" ON public.talent_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.talent_submissions TO anon;


-- ============================================================================
-- hiring_enquiries
-- ============================================================================
CREATE POLICY "Allow public insert hiring" ON public.hiring_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.hiring_enquiries TO anon;


-- ============================================================================
-- contacts
-- ============================================================================
CREATE POLICY "Allow public insert contact" ON public.contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.contacts TO anon;


-- ============================================================================
-- Verification: Check that we now have the correct policy mix:
-- - INSERT policy for anon (public form submissions)
-- - SELECT policy for authenticated with is_admin() check (admin dashboard)
-- - UPDATE policy for authenticated with is_admin() check (marking contacted)
-- ============================================================================
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT,
  COALESCE(qual::TEXT, with_check::TEXT) AS predicate
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('talent_submissions', 'hiring_enquiries', 'contacts')
ORDER BY tablename, cmd, policyname;
