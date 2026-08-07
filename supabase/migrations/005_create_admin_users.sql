-- ============================================================================
-- Migration: Admin allowlist
--
-- WHY THIS EXISTS
-- Until now, every admin policy was granted "TO authenticated USING (true)",
-- which means *any* Supabase account could read every hiring enquiry, talent
-- submission and contact message. Combined with the public /admin/register
-- page (removed in this same change), anyone on the internet could sign
-- themselves up and read all of it.
--
-- "authenticated" means "proved they own an email address". It does NOT mean
-- "is allowed to run this business". This migration introduces an explicit
-- allowlist so those two ideas stop being the same thing.
--
-- RUN 006 IMMEDIATELY AFTER THIS ONE. On its own, this migration only creates
-- the allowlist; 006 is what actually revokes access from everyone else.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'owner')),
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.admin_users IS
  'Explicit allowlist of accounts permitted to use the admin dashboard. Being in auth.users is NOT sufficient.';

-- ----------------------------------------------------------------------------
-- is_admin() — the single source of truth for "may this account use /admin?"
--
-- SECURITY DEFINER: runs as the function owner, so it can read admin_users
-- even though RLS blocks clients from reading that table directly. Without
-- this, the policies in 006 would recurse (reading admin_users requires
-- is_admin(), which reads admin_users...).
--
-- SET search_path: pins schema resolution. Without it, a caller could put a
-- malicious "admin_users" table earlier on their search_path and this
-- function would happily read it and return true. Mandatory on every
-- SECURITY DEFINER function.
--
-- STABLE: lets Postgres call it once per statement instead of once per row,
-- which matters when it appears in a policy on a table scan.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'TRUE if the calling account is on the admin allowlist. Used by RLS policies and by the client to gate the admin UI.';

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ----------------------------------------------------------------------------
-- RLS on the allowlist itself
--
-- Admins may read it (so the dashboard can show who has access) but may NOT
-- write it. Granting admins the ability to add admins means one compromised
-- admin account becomes permanent, self-replicating access. Adding and
-- removing admins is a deliberate, out-of-band act performed in the Supabase
-- SQL editor using the snippets at the bottom of this file.
-- ----------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins read allowlist" ON public.admin_users;
CREATE POLICY "admins read allowlist" ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

REVOKE ALL ON public.admin_users FROM anon, authenticated;
GRANT SELECT ON public.admin_users TO authenticated;

-- ============================================================================
-- SEEDING — read this before running
--
-- Seeding the WRONG account here is how you either lock yourself out or hand
-- admin to a stranger who already self-registered. So this migration seeds
-- nothing automatically. It deliberately fails loudly instead.
--
-- STEP 1. Run this and look at every row. These are all the accounts that
--         currently exist. If you see an email you do not recognise, that is
--         someone who used the open /admin/register page.
--
--           SELECT id, email, created_at, last_sign_in_at
--           FROM auth.users
--           ORDER BY created_at;
--
-- STEP 2. Insert ONLY your own account(s) using the snippet below.
--
-- STEP 3. Delete the accounts you did not recognise (see snippet at bottom).
--
-- STEP 4. Run migration 006 to enforce the allowlist.
-- ============================================================================

-- Guard: makes it obvious if 006 is applied while the allowlist is still
-- empty, which would lock every account out of the dashboard.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users) THEN
    RAISE WARNING
      'admin_users is EMPTY. Seed your own account (see SEEDING notes in this file) BEFORE applying 006, or nobody will be able to use /admin.';
  END IF;
END $$;


-- ============================================================================
-- OPERATOR SNIPPETS — copy/paste into the Supabase SQL editor as needed.
-- These are commented out on purpose; none of them run as part of the migration.
-- ============================================================================

-- ---- Grant admin to an existing account (by email) --------------------------
-- INSERT INTO public.admin_users (user_id, email, role, note)
-- SELECT id, email, 'owner', 'Site owner'
-- FROM auth.users
-- WHERE email = 'you@example.com'
-- ON CONFLICT (user_id) DO NOTHING;

-- ---- See who currently has admin access ------------------------------------
-- SELECT a.email, a.role, a.note, a.created_at, u.last_sign_in_at
-- FROM public.admin_users a
-- JOIN auth.users u ON u.id = a.user_id
-- ORDER BY a.created_at;

-- ---- Revoke admin (keeps the login, removes dashboard access) ---------------
-- DELETE FROM public.admin_users WHERE email = 'someone@example.com';

-- ---- Find accounts that are NOT admins (likely self-registered strangers) ---
-- SELECT u.id, u.email, u.created_at, u.last_sign_in_at
-- FROM auth.users u
-- LEFT JOIN public.admin_users a ON a.user_id = u.id
-- WHERE a.user_id IS NULL
-- ORDER BY u.created_at;

-- ---- Delete a stranger's account entirely ----------------------------------
-- Prefer doing this via Dashboard > Authentication > Users so it is logged.
-- DELETE FROM auth.users WHERE email = 'stranger@example.com';
