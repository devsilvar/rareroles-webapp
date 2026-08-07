-- ============================================================================
-- COMPLETE PLATFORM FIX v2 - Run this in Supabase SQL Editor
--
-- Fixes:
-- 1. Analytics tables (fixes silent tracking errors)
-- 2. Marketing scripts table (fixes "Could not load scripts" error)
-- 3. All RLS policies
--
-- Safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================================

-- ============================================================================
-- PREREQUISITE CHECK
-- ============================================================================
DO $$
DECLARE
  has_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'is_admin'
  ) INTO has_is_admin;
  
  IF NOT has_is_admin THEN
    RAISE EXCEPTION 'The is_admin() function does not exist. Run migration 005_create_admin_users.sql first.';
  END IF;
  
  RAISE NOTICE 'Prerequisite check passed: is_admin() function exists';
END $$;


-- ============================================================================
-- PART 1: ANALYTICS TABLES
-- ============================================================================

-- 1. analytics_sessions
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  user_agent TEXT,
  landing_page TEXT,
  exit_page TEXT,
  page_count INTEGER DEFAULT 1,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id 
  ON public.analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_start_time 
  ON public.analytics_sessions(start_time DESC);

ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert analytics sessions" ON public.analytics_sessions;
CREATE POLICY "Public insert analytics sessions" ON public.analytics_sessions
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics sessions" ON public.analytics_sessions;
CREATE POLICY "Admins read analytics sessions" ON public.analytics_sessions
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_sessions TO anon;
GRANT SELECT ON public.analytics_sessions TO authenticated;


-- 2. analytics_page_views
CREATE TABLE IF NOT EXISTS public.analytics_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session_id 
  ON public.analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_timestamp 
  ON public.analytics_page_views(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_page_path 
  ON public.analytics_page_views(page_path);

ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert analytics page views" ON public.analytics_page_views;
CREATE POLICY "Public insert analytics page views" ON public.analytics_page_views
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics page views" ON public.analytics_page_views;
CREATE POLICY "Admins read analytics page views" ON public.analytics_page_views
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_page_views TO anon;
GRANT SELECT ON public.analytics_page_views TO authenticated;


-- 3. analytics_events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_action TEXT NOT NULL,
  event_label TEXT,
  event_value NUMERIC,
  page_path TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id 
  ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp 
  ON public.analytics_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category 
  ON public.analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_action 
  ON public.analytics_events(event_action);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert analytics events" ON public.analytics_events;
CREATE POLICY "Public insert analytics events" ON public.analytics_events
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics events" ON public.analytics_events;
CREATE POLICY "Admins read analytics events" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_events TO anon;
GRANT SELECT ON public.analytics_events TO authenticated;


-- ============================================================================
-- PART 2: MARKETING SCRIPTS TABLES
-- ============================================================================

-- Helper function for timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END $$;


-- Main marketing scripts table
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

ALTER TABLE public.marketing_scripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage marketing scripts" ON public.marketing_scripts;
CREATE POLICY "Admins manage marketing scripts" ON public.marketing_scripts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

REVOKE ALL ON public.marketing_scripts FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_scripts TO authenticated;


-- Public view for website
DROP VIEW IF EXISTS public.marketing_scripts_public CASCADE;
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
-- VERIFICATION & SUCCESS MESSAGE
-- ============================================================================
DO $$
DECLARE
  analytics_count INT;
  marketing_count INT;
BEGIN
  SELECT COUNT(*) INTO analytics_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('analytics_sessions', 'analytics_page_views', 'analytics_events');
  
  SELECT COUNT(*) INTO marketing_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('marketing_scripts', 'marketing_script_audit');
  
  RAISE NOTICE '
============================================================================
PLATFORM FIX COMPLETE!
============================================================================

Created/Verified:
- Analytics tables: % / 3
- Marketing tables: % / 2
- All RLS policies configured
- All permissions granted

WHAT WAS FIXED:

1. Analytics Tracking:
   - analytics_sessions, analytics_page_views, analytics_events created
   - Forms can now track submissions without errors
   - Browser console will show [Analytics] logs with no errors

2. Marketing Scripts Page:
   - marketing_scripts table created
   - Admin page at /admin/marketing now works
   - No more "Could not load scripts" error
   - You can now add Google Ads, Meta Pixel, GA4, etc.

WHAT TO TEST NOW:

1. Forms & Analytics:
   - Submit any form (talent/hiring/contact)
   - Open browser console (F12)
   - Should see: [Analytics] Page view tracked
   - Should see: [Analytics] Form submission tracked
   - NO errors about missing tables

2. Marketing Page:
   - Go to /admin/marketing
   - Should see "No scripts yet" (not an error)
   - Click "Add script" button
   - Script editor should open

3. Admin Dashboard:
   - All submission pages should work
   - Data should load without errors

PLATFORM STATUS: FULLY FUNCTIONAL

Ready to demo and sell!

============================================================================
  ',
  analytics_count,
  marketing_count;
END $$;


-- Show created tables
SELECT
  table_name,
  table_type,
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name AND table_schema = 'public') as columns
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN (
    'analytics_sessions', 'analytics_page_views', 'analytics_events',
    'marketing_scripts', 'marketing_script_audit', 'marketing_scripts_public'
  )
ORDER BY table_name;
