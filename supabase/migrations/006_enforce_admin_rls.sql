-- ============================================================================
-- Migration: Enforce the admin allowlist on all submission tables
--
-- THIS IS THE MIGRATION THAT ACTUALLY CLOSES THE HOLE.
--
-- Before: "TO authenticated USING (true)" — any account that could log in
--         could read every hiring enquiry, talent submission (including CV
--         URLs) and contact message.
-- After:  the same operations require public.is_admin(), i.e. presence on the
--         allowlist created in 005.
--
-- PREREQUISITE: 005 must be applied AND your own account must already be in
-- public.admin_users. If the allowlist is empty when this runs, nobody will be
-- able to load the admin dashboard. The guard below stops that from happening.
--
-- Public form submissions are unaffected: the anon INSERT policies are left
-- exactly as they were, so the website keeps working for visitors.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Refuse to run against an empty allowlist. Failing the migration is
-- recoverable in seconds; locking every admin out of a live dashboard and
-- then having to work out why is not.
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users) THEN
    RAISE EXCEPTION
      'Refusing to apply: public.admin_users is empty, so this migration would lock everyone out of /admin. Seed your account first — see the SEEDING notes in 005_create_admin_users.sql.';
  END IF;
END $$;


-- ============================================================================
-- hiring_enquiries
-- ============================================================================
DROP POLICY IF EXISTS "Allow authenticated read"   ON public.hiring_enquiries;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.hiring_enquiries;

CREATE POLICY "Admins read hiring enquiries" ON public.hiring_enquiries
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins update hiring enquiries" ON public.hiring_enquiries
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ============================================================================
-- talent_submissions  (contains CV URLs — highest-sensitivity table here)
-- ============================================================================
DROP POLICY IF EXISTS "Allow authenticated read"   ON public.talent_submissions;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.talent_submissions;

CREATE POLICY "Admins read talent submissions" ON public.talent_submissions
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins update talent submissions" ON public.talent_submissions
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ============================================================================
-- contacts
-- ============================================================================
DROP POLICY IF EXISTS "Allow authenticated read"   ON public.contacts;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.contacts;

CREATE POLICY "Admins read contacts" ON public.contacts
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins update contacts" ON public.contacts
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ============================================================================
-- Analytics tables
--
-- src/hooks/useAnalytics.tsx writes to analytics_page_views, analytics_events
-- and analytics_sessions from the public site, and src/pages/admin/*Page.tsx
-- reads them. No migration in this repo creates them, so they were made by
-- hand in the dashboard and their policies are unknown. Handled conditionally
-- so this migration works whether or not they exist.
--
-- Intent: anon may INSERT (tracking from the public site), only admins may
-- SELECT (the dashboard). Visitor analytics contain user agents, referrers and
-- session identifiers, so they should not be world-readable either.
-- ============================================================================
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['analytics_page_views', 'analytics_events', 'analytics_sessions']
  LOOP
    IF EXISTS (
      SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = t
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

      EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated read" ON public.%I', t);
      EXECUTE format('DROP POLICY IF EXISTS "Allow public read"        ON public.%I', t);
      EXECUTE format('DROP POLICY IF EXISTS "Admins read analytics"    ON public.%I', t);
      EXECUTE format('DROP POLICY IF EXISTS "Public insert analytics"  ON public.%I', t);

      EXECUTE format(
        'CREATE POLICY "Public insert analytics" ON public.%I FOR INSERT TO anon WITH CHECK (true)', t);
      EXECUTE format(
        'CREATE POLICY "Admins read analytics" ON public.%I FOR SELECT TO authenticated USING (public.is_admin())', t);

      EXECUTE format('GRANT INSERT ON public.%I TO anon', t);
      EXECUTE format('GRANT SELECT ON public.%I TO authenticated', t);

      RAISE NOTICE 'Secured analytics table: %', t;
    ELSE
      RAISE NOTICE 'Skipped (does not exist): %', t;
    END IF;
  END LOOP;
END $$;


-- ============================================================================
-- VERIFICATION — every row should show qual = 'is_admin()' for the
-- authenticated SELECT/UPDATE policies, and 'true' only for anon INSERT.
-- ============================================================================
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT,
  COALESCE(qual, with_check) AS predicate
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'hiring_enquiries', 'talent_submissions', 'contacts', 'admin_users',
    'analytics_page_views', 'analytics_events', 'analytics_sessions'
  )
ORDER BY tablename, cmd, policyname;
