-- ============================================================================
-- Migration: Marketing / tracking script manager
--
-- Lets the site owner paste third-party tags (Google Ads, GA4, GTM, Meta
-- Pixel, LinkedIn, TikTok, or anything custom) and choose where they load,
-- without a developer or a redeploy.
--
-- PREREQUISITE: 005 + 006 must be applied. This table stores arbitrary
-- JavaScript that executes on every public page view, so write access MUST be
-- restricted to the admin allowlist. Without is_admin(), anyone who can sign
-- up could inject a script into your public site.
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'is_admin'
  ) THEN
    RAISE EXCEPTION
      'public.is_admin() not found. Apply 005_create_admin_users.sql and 006_enforce_admin_rls.sql before this migration — otherwise script injection would be writable by any signed-up account.';
  END IF;
END $$;


-- ----------------------------------------------------------------------------
-- Shared updated_at trigger helper
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END $$;


-- ============================================================================
-- marketing_scripts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.marketing_scripts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name          TEXT NOT NULL,
  platform      TEXT NOT NULL DEFAULT 'custom',
  notes         TEXT,

  -- Payload: either a raw pasted snippet, or a template + id
  snippet       TEXT,
  template_key  TEXT,
  template_id   TEXT,
  noscript_html TEXT,

  -- WHERE in the document
  location      TEXT NOT NULL DEFAULT 'head'
                CHECK (location IN ('head', 'body_start', 'body_end', 'slot')),
  slot_id       TEXT,

  -- WHICH pages
  page_mode     TEXT NOT NULL DEFAULT 'all'
                CHECK (page_mode IN ('all', 'include', 'exclude')),
  page_paths    TEXT[] NOT NULL DEFAULT '{}',

  -- WHEN
  load_timing   TEXT NOT NULL DEFAULT 'immediate'
                CHECK (load_timing IN ('immediate', 'idle', 'delay', 'consent')),
  load_delay_ms INTEGER NOT NULL DEFAULT 0
                CHECK (load_delay_ms BETWEEN 0 AND 30000),

  -- ORDER (lower runs first)
  priority      INTEGER NOT NULL DEFAULT 50 CHECK (priority BETWEEN 0 AND 100),

  -- Lifecycle
  enabled       BOOLEAN NOT NULL DEFAULT FALSE,
  spa_pageview  BOOLEAN NOT NULL DEFAULT TRUE,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT,
  updated_by    TEXT,

  CONSTRAINT platform_known CHECK (platform IN (
    'google_ads', 'ga4', 'gtm', 'meta', 'instagram', 'linkedin', 'tiktok',
    'twitter', 'pinterest', 'snapchat', 'microsoft_ads', 'custom')),

  -- Must carry a usable payload one way or the other.
  CONSTRAINT payload_present CHECK (
    (snippet IS NOT NULL AND length(trim(snippet)) > 0)
    OR (template_key IS NOT NULL AND template_id IS NOT NULL)),

  CONSTRAINT slot_required CHECK (location <> 'slot' OR slot_id IS NOT NULL),
  CONSTRAINT delay_needs_timing CHECK (load_timing = 'delay' OR load_delay_ms = 0),

  -- 'all' means "every page", so a path list would be silently ignored.
  CONSTRAINT paths_match_mode CHECK (
    page_mode = 'all' OR array_length(page_paths, 1) > 0)
);

COMMENT ON TABLE public.marketing_scripts IS
  'Owner-managed third-party tracking tags and their placement rules. Executes on the public site — writes are restricted to the admin allowlist.';
COMMENT ON COLUMN public.marketing_scripts.enabled IS
  'Defaults FALSE: pasting a script must never be the same action as publishing it.';
COMMENT ON COLUMN public.marketing_scripts.priority IS
  'Lower runs first. GTM and consent tags should sit low so they initialise before dependants.';

-- The public site runs exactly one query: enabled rows in execution order.
CREATE INDEX IF NOT EXISTS idx_marketing_scripts_enabled
  ON public.marketing_scripts (priority, created_at)
  WHERE enabled = TRUE;

DROP TRIGGER IF EXISTS trg_marketing_scripts_updated_at ON public.marketing_scripts;
CREATE TRIGGER trg_marketing_scripts_updated_at
  BEFORE UPDATE ON public.marketing_scripts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ----------------------------------------------------------------------------
-- RLS
--
-- Admins get full control. The public site never reads this table directly —
-- it reads the view below, which exposes only the columns the injector needs.
-- ----------------------------------------------------------------------------
ALTER TABLE public.marketing_scripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage marketing scripts" ON public.marketing_scripts;
CREATE POLICY "Admins manage marketing scripts" ON public.marketing_scripts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

REVOKE ALL ON public.marketing_scripts FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_scripts TO authenticated;


-- ----------------------------------------------------------------------------
-- Injector view — what anonymous visitors are allowed to see
--
-- RLS is row-level, so granting anon direct SELECT on the table would also
-- expose notes, created_by and updated_by (admin email addresses) on every
-- enabled row. This view is the narrow contract instead: only the fields
-- required to render a tag, and only for enabled rows.
--
-- security_invoker = off (the default for views) means the view runs with the
-- owner's rights and therefore bypasses the table's RLS — which is exactly
-- what we want here, since the WHERE clause is the access control.
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS public.marketing_scripts_public;
CREATE VIEW public.marketing_scripts_public AS
  SELECT
    id, name, platform, snippet, template_key, template_id, noscript_html,
    location, slot_id, page_mode, page_paths,
    load_timing, load_delay_ms, priority, spa_pageview
  FROM public.marketing_scripts
  WHERE enabled = TRUE;

COMMENT ON VIEW public.marketing_scripts_public IS
  'Enabled scripts only, minus admin-facing columns. The single read surface for the public site.';

GRANT SELECT ON public.marketing_scripts_public TO anon, authenticated;


-- ============================================================================
-- marketing_script_audit
--
-- script_id is deliberately NOT a foreign key: the audit trail of a deleted
-- script is exactly when it matters most.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.marketing_script_audit (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id   UUID,
  script_name TEXT,
  action      TEXT NOT NULL
              CHECK (action IN ('create', 'update', 'enable', 'disable', 'delete')),
  changed_by  TEXT,
  diff        JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_audit_created_at
  ON public.marketing_script_audit (created_at DESC);

ALTER TABLE public.marketing_script_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read script audit"  ON public.marketing_script_audit;
DROP POLICY IF EXISTS "Admins write script audit" ON public.marketing_script_audit;

CREATE POLICY "Admins read script audit" ON public.marketing_script_audit
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins write script audit" ON public.marketing_script_audit
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- No anon access at all: diffs can contain internal identifiers.
REVOKE ALL ON public.marketing_script_audit FROM anon, authenticated;
GRANT SELECT, INSERT ON public.marketing_script_audit TO authenticated;


-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT tablename, policyname, cmd, roles::TEXT,
       COALESCE(qual, with_check) AS predicate
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('marketing_scripts', 'marketing_script_audit')
ORDER BY tablename, cmd;
