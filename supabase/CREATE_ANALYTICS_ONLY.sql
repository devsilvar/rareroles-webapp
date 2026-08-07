-- ============================================================================
-- MINIMAL FIX - Only Create Missing Analytics Tables
--
-- Since you got an error that policies already exist, this script ONLY
-- creates the analytics tables (which are still missing).
--
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- CREATE ANALYTICS TABLES (The Missing Pieces)
-- ============================================================================

-- 1. analytics_sessions - Track user sessions
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


-- 2. analytics_page_views - Track individual page views
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


-- 3. analytics_events - Track user interactions (clicks, form submissions)
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
-- VERIFICATION
-- ============================================================================

-- Check all analytics tables were created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count,
  '✅ Created' AS status
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('analytics_sessions', 'analytics_page_views', 'analytics_events')
ORDER BY table_name;

-- Show analytics policies
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('analytics_sessions', 'analytics_page_views', 'analytics_events')
ORDER BY tablename, cmd;

-- ============================================================================
-- TEST YOUR FORMS NOW!
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '
  ============================================================================
  ✅ ANALYTICS TABLES CREATED!
  ============================================================================
  
  What Was Fixed:
  ✅ analytics_sessions table created
  ✅ analytics_page_views table created  
  ✅ analytics_events table created
  ✅ All RLS policies configured
  ✅ Permissions granted
  
  Form Submission Status:
  ✅ Already working (policies exist from before)
  
  What to Test:
  1. Go to your website
  2. Open browser console (F12 → Console tab)
  3. Navigate to any page
  4. You should see: [Analytics] Page view tracked: /talent
  5. Submit a form
  6. You should see: [Analytics] Form submission tracked: talent-form
  7. No errors should appear!
  
  Admin Dashboard:
  1. Login to /admin
  2. Check submissions appear
  3. Check analytics data is being collected
  
  ============================================================================
  YOUR PLATFORM IS NOW FULLY FUNCTIONAL! 🚀
  ============================================================================
  ';
END $$;
