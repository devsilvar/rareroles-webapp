-- ============================================================================
-- Migration: Create analytics tables
--
-- Purpose: The analytics hooks (useAnalytics.tsx) reference three tables that
-- were never created in the migration history:
-- - analytics_page_views (page tracking)
-- - analytics_events (click/form tracking)
-- - analytics_sessions (session tracking)
--
-- Migration 006 tried to secure them but they don't exist yet, causing errors
-- when forms are submitted and analytics hooks try to insert data.
-- ============================================================================

-- ============================================================================
-- analytics_sessions - Track user sessions
-- ============================================================================
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

-- Index for fast session lookups
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id 
  ON public.analytics_sessions(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_sessions_start_time 
  ON public.analytics_sessions(start_time DESC);

-- Enable RLS
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (from website), only admins can SELECT (dashboard)
DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics_sessions;
CREATE POLICY "Public insert analytics" ON public.analytics_sessions
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics" ON public.analytics_sessions;
CREATE POLICY "Admins read analytics" ON public.analytics_sessions
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_sessions TO anon;
GRANT SELECT ON public.analytics_sessions TO authenticated;


-- ============================================================================
-- analytics_page_views - Track individual page views
-- ============================================================================
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session_id 
  ON public.analytics_page_views(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_page_views_timestamp 
  ON public.analytics_page_views(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_page_views_page_path 
  ON public.analytics_page_views(page_path);

-- Enable RLS
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (from website), only admins can SELECT (dashboard)
DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics_page_views;
CREATE POLICY "Public insert analytics" ON public.analytics_page_views
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics" ON public.analytics_page_views;
CREATE POLICY "Admins read analytics" ON public.analytics_page_views
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_page_views TO anon;
GRANT SELECT ON public.analytics_page_views TO authenticated;


-- ============================================================================
-- analytics_events - Track user interactions (clicks, form submissions, etc.)
-- ============================================================================
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id 
  ON public.analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp 
  ON public.analytics_events(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_category 
  ON public.analytics_events(event_category);

CREATE INDEX IF NOT EXISTS idx_analytics_events_action 
  ON public.analytics_events(event_action);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (from website), only admins can SELECT (dashboard)
DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics_events;
CREATE POLICY "Public insert analytics" ON public.analytics_events
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics" ON public.analytics_events;
CREATE POLICY "Admins read analytics" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_events TO anon;
GRANT SELECT ON public.analytics_events TO authenticated;


-- ============================================================================
-- VERIFICATION - Check that all tables exist with correct policies
-- ============================================================================
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT,
  COALESCE(qual::TEXT, with_check::TEXT) AS predicate
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('analytics_sessions', 'analytics_page_views', 'analytics_events')
ORDER BY tablename, cmd, policyname;
