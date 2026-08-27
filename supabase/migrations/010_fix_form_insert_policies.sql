-- ============================================================================
-- Migration: Make public form submission work again (error 42501)
--
-- SYMPTOM
--   POST /rest/v1/hiring_enquiries ->
--   {"code":"42501","message":"new row violates row-level security policy
--    for table \"hiring_enquiries\""}
--
-- There are two independent causes, and this migration fixes the database
-- half of both. The client half is fixed in src/lib/supabase.ts.
--
-- CAUSE 1 — the submitter is logged in.
--   Every INSERT policy created since 002 is scoped "TO anon". A visitor who
--   has an admin session in the same browser sends the request as the
--   "authenticated" role instead. No INSERT policy matches that role, so the
--   WITH CHECK evaluates to false and Postgres raises 42501. This is the
--   likeliest cause when the error appears while testing, because the person
--   testing is usually signed into /admin in the same browser.
--
-- CAUSE 2 — the insert asked for the row back.
--   PostgREST turns .select() after .insert() into INSERT ... RETURNING.
--   Postgres applies SELECT policies to returned rows, and 006 restricted
--   SELECT to admins. So the write succeeds and the read-back is refused,
--   surfacing as the same 42501. Fixed in the client by not requesting the
--   row back — widening SELECT would expose every enquiry to the public.
--
-- Also collapses the duplicate/competing INSERT policies left behind by the
-- ad hoc scripts in supabase/*.sql, which had drifted to different names per
-- table ("Allow public insert", "Allow public insert hiring",
-- "Allow authenticated insert hiring", ...) and could no longer be reasoned
-- about by name. This drops them by lookup rather than by name so the end
-- state is the same no matter which scripts were run.
--
-- Read/update access is untouched: still admin-only via is_admin() from 006.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- Drop every existing INSERT policy on the three form tables.
-- By lookup, not by name — the names diverged across the ad hoc scripts.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('hiring_enquiries', 'talent_submissions', 'contacts')
      AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
    RAISE NOTICE 'Dropped INSERT policy "%" on %', r.policyname, r.tablename;
  END LOOP;
END $$;


-- ----------------------------------------------------------------------------
-- One INSERT policy per table, covering both roles a website visitor can have.
--
-- Granting INSERT to "authenticated" is not a widening of access: anon can
-- already insert, and every authenticated user could drop to anon simply by
-- signing out. It only stops a signed-in visitor from being unable to use a
-- public form.
--
-- RLS is also re-asserted per table. If it were ever switched off these
-- policies would be inert, and this is cheap insurance against that.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['hiring_enquiries', 'talent_submissions', 'contacts']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format(
      'CREATE POLICY "Public form submissions" ON public.%I
         FOR INSERT TO anon, authenticated WITH CHECK (true)', t);

    EXECUTE format('GRANT INSERT ON public.%I TO anon, authenticated', t);
  END LOOP;
END $$;

COMMIT;


-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- 1. Expect exactly one INSERT row per table: permissive, {anon,authenticated},
--    predicate "true". SELECT/UPDATE rows should read "is_admin()" — if any
--    SELECT policy shows "true" for anon, submissions are world-readable and
--    that is a separate, more urgent problem.
SELECT
  tablename,
  cmd,
  policyname,
  permissive,
  roles::TEXT,
  COALESCE(qual::TEXT, with_check::TEXT) AS predicate
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('hiring_enquiries', 'talent_submissions', 'contacts')
ORDER BY tablename, cmd, policyname;

-- 2. A single RESTRICTIVE policy ANDs with everything else and will keep
--    producing 42501 no matter how many permissive policies exist. Expect
--    zero rows here.
SELECT tablename, policyname, cmd, 'RESTRICTIVE POLICY — investigate' AS warning
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('hiring_enquiries', 'talent_submissions', 'contacts')
  AND permissive = 'RESTRICTIVE';

-- 3. rowsecurity must be true; relforcerowsecurity should be false. FORCE
--    applies RLS to the table owner too, which breaks admin tooling in ways
--    that look unrelated.
SELECT
  c.relname AS tablename,
  c.relrowsecurity  AS rls_enabled,
  c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('hiring_enquiries', 'talent_submissions', 'contacts');

-- 4. Table-level grants. RLS is only consulted after the GRANT check passes;
--    a missing grant fails earlier with "permission denied for table", which
--    is a different error than the one being fixed here.
SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('hiring_enquiries', 'talent_submissions', 'contacts')
  AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;

-- 5. End-to-end proof as the anon role, for each table. Wrapped in its own
--    transaction that is rolled back, so no probe rows survive — run the
--    whole block together, not statement by statement.
--
--    If this raises 42501 the policies above are still wrong. If it passes but
--    the website still fails, the fault is on the client side, not here.
BEGIN;

SET LOCAL ROLE anon;

INSERT INTO public.hiring_enquiries (company, contact_name, email, roles)
VALUES ('__rls_probe__', '__rls_probe__', 'probe@example.invalid', '[]'::jsonb);

INSERT INTO public.talent_submissions (name, email, desired_role)
VALUES ('__rls_probe__', 'probe@example.invalid', '__rls_probe__');

INSERT INTO public.contacts (name, email, message, source)
VALUES ('__rls_probe__', 'probe@example.invalid', '__rls_probe__', '__rls_probe__');

RESET ROLE;

ROLLBACK;
