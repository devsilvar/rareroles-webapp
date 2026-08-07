-- ============================================================================
-- CHECK & FIX MARKETING SCRIPTS TABLE
--
-- The admin marketing page shows "Could not load scripts" because the
-- marketing_scripts table doesn't exist yet.
--
-- This will check if it exists and create it if missing.
-- ============================================================================

-- First, let's check what exists
DO $$
DECLARE
  has_table BOOLEAN;
  has_function BOOLEAN;
BEGIN
  -- Check if marketing_scripts table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'marketing_scripts'
  ) INTO has_table;
  
  -- Check if is_admin function exists
  SELECT EXISTS (
    SELECT FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'is_admin'
  ) INTO has_function;
  
  RAISE NOTICE '
  ============================================================================
  CHECKING MARKETING SCRIPTS SETUP
  ============================================================================
  
  marketing_scripts table exists: %
  is_admin() function exists: %
  
  ============================================================================
  ', 
  CASE WHEN has_table THEN '✅ YES' ELSE '❌ NO - will create' END,
  CASE WHEN has_function THEN '✅ YES' ELSE '❌ NO - please run migration 005 first' END;
  
  -- Abort if is_admin doesn't exist (security requirement)
  IF NOT has_function THEN
    RAISE EXCEPTION 'is_admin() function not found. This table stores JavaScript that executes on your website, so it must be admin-protected. Run migration 005_create_admin_users.sql first.';
  END IF;
END $$;


-- ============================================================================
-- CREATE MARKETING SCRIPTS TABLE & RELATED OBJECTS
-- (Only if they don't exist)
-- ============================================================================

-- Helper function for auto-updating timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END $$;


-- Main table
CREATE TABLE IF NOT EXISTS public.marketing_scripts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  platform      TEXT NOT NULL DEFAULT 'custom',
  notes         TEXT,
  snippet       TEXT,
  template_key  TEXT,
  template_id   TEXT,
  noscript_html TEXT,
  location      TEXT NOT NULL DEFAULT 'head'
                CHECK (location IN ('head', 'body_start', 'body_end', 'slot')),
  slot_id       TEXT,
  page_mode     TEXT NOT NULL DEFAULT 'all'
                CHECK (page_mode IN ('all', 'include', 'exclude')),
  page_paths    TEXT[] NOT NULL DEFAULT '{}',
  load_timing   TEXT NOT NULL DEFAULT 'immediate'
                CHECK (load_timing IN ('immediate', 'idle', 'delay', 'consent')),
  load_delay_ms INTEGER NOT NULL DEFAULT 0
                CHECK (load_delay_ms BETWEEN 0 AND 30000),
  priority      INTEGER NOT NULL DEFAULT 50 CHECK (priority BETWEEN 0 AND 100),
  enabled       BOOLEAN NOT NULL DEFAULT FALSE,
  spa_pageview  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    TEXT,
  updated_by    TEXT,

  CONSTRAINT platform_known CHECK (platform IN (
    'google_ads', 'ga4', 'gtm', 'meta', 'instagram', 'linkedin', 'tiktok',
    'twitter', 'pinterest', 'snapchat', 'microsoft_ads', 'custom')),
  CONSTRAINT payload_present CHECK (
    (snippet IS NOT NULL AND length(trim(snippet)) > 0)
    OR (template_key IS NOT NULL AND template_id IS NOT NULL)),
  CONSTRAINT slot_required CHECK (location <> 'slot' OR slot_id IS NOT NULL),
  CONSTRAINT delay_needs_timing CHECK (load_timing = 'delay' OR load_delay_ms = 0),
  CONSTRAINT paths_match_mode CHECK (
    page_mode = 'all' OR array_length(page_paths, 1) > 0)
);

CREATE INDEX IF NOT EXISTS idx_marketing_scripts_enabled
  ON public.marketing_scripts (priority, created_at)
  WHERE enabled = TRUE;

DROP TRIGGER IF EXISTS trg_marketing_scripts_updated_at ON public.marketing_scripts;
CREATE TRIGGER trg_marketing_scripts_updated_at
  BEFORE UPDATE ON public.marketing_scripts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- RLS Policies
ALTER TABLE public.marketing_scripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage marketing scripts" ON public.marketing_scripts;
CREATE POLICY "Admins manage marketing scripts" ON public.marketing_scripts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

REVOKE ALL ON public.marketing_scripts FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_scripts TO authenticated;


-- Public view (only enabled scripts, only needed columns)
DROP VIEW IF EXISTS public.marketing_scripts_public;
CREATE VIEW public.marketing_scripts_public AS
  SELECT
    id, name, platform, snippet, template_key, template_id, noscript_html,
    location, slot_id, page_mode, page_paths,
    load_timing, load_delay_ms, priority, spa_pageview
  FROM public.marketing_scripts
  WHERE enabled = TRUE;

GRANT SELECT ON public.marketing_scripts_public TO anon, authenticated;


-- Audit table
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

REVOKE ALL ON public.marketing_script_audit FROM anon, authenticated;
GRANT SELECT, INSERT ON public.marketing_script_audit TO authenticated;


-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check tables exist
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name AND table_schema = 'public') as columns,
  '✅ Created' AS status
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('marketing_scripts', 'marketing_script_audit')
ORDER BY table_name;

-- Check view exists
SELECT
  table_name,
  table_type,
  '✅ Created' AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'marketing_scripts_public';

-- Check policies
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('marketing_scripts', 'marketing_script_audit')
ORDER BY tablename, cmd;


-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '
  ============================================================================
  ✅ MARKETING SCRIPTS TABLE CREATED!
  ============================================================================
  
  What Was Created:
  ✅ marketing_scripts table (main table)
  ✅ marketing_scripts_public view (public-facing)
  ✅ marketing_script_audit table (change history)
  ✅ All RLS policies configured
  ✅ Permissions granted
  
  What to Test:
  1. Go to /admin/marketing
  2. Error toast should be GONE
  3. You should see "No scripts yet" message
  4. Click "Add script" button
  5. Should open the script editor
  
  Admin Marketing Page Status: FIXED ✅
  
  Next Steps:
  - The marketing page now works
  - You can add Google Ads, GA4, Meta Pixel, etc.
  - Scripts can be enabled/disabled without code changes
  
  ============================================================================
  ';
END $$;
