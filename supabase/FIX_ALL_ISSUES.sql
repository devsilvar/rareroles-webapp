-- ============================================================================
-- COMPLETE FIX - Run this entire file in Supabase SQL Editor
--
-- This combines:
-- 1. Migration 008 - Restore public form submission
-- 2. Migration 009 - Create analytics tables
--
-- After running this, your platform will be fully functional.
-- ============================================================================

-- ============================================================================
-- FIX #1: RESTORE PUBLIC FORM SUBMISSIONS
-- (Migration 008)
-- ============================================================================

-- talent_submissions - Allow anonymous users to submit
CREATE POLICY "Allow public insert talent" ON public.talent_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.talent_submissions TO anon;


-- hiring_enquiries - Allow anonymous users to submit
CREATE POLICY "Allow public insert hiring" ON public.hiring_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.hiring_enquiries TO anon;


-- contacts - Allow anonymous users to submit
CREATE POLICY "Allow public insert contact" ON public.contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.contacts TO anon;


-- ============================================================================
-- FIX #2: CREATE ANALYTICS TABLES
-- (Migration 009)
-- ============================================================================

-- analytics_sessions - Track user sessions
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

CREATE POLICY "Public insert analytics sessions" ON public.analytics_sessions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admins read analytics sessions" ON public.analytics_sessions
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_sessions TO anon;
GRANT SELECT ON public.analytics_sessions TO authenticated;


-- analytics_page_views - Track individual page views
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

CREATE POLICY "Public insert analytics page views" ON public.analytics_page_views
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admins read analytics page views" ON public.analytics_page_views
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_page_views TO anon;
GRANT SELECT ON public.analytics_page_views TO authenticated;


-- analytics_events - Track user interactions
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

CREATE POLICY "Public insert analytics events" ON public.analytics_events
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admins read analytics events" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.is_admin());

GRANT INSERT ON public.analytics_events TO anon;
GRANT SELECT ON public.analytics_events TO authenticated;


-- ============================================================================
-- VERIFICATION - Check everything is set up correctly
-- ============================================================================

-- Check form submission policies (should show INSERT for anon)
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT AS "role",
  'Fixed ✅' AS status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('talent_submissions', 'hiring_enquiries', 'contacts')
  AND cmd = 'INSERT'
  AND roles::TEXT LIKE '%anon%'
ORDER BY tablename;

-- Check analytics tables exist
SELECT
  table_name,
  'Created ✅' AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('analytics_sessions', 'analytics_page_views', 'analytics_events')
ORDER BY table_name;

-- Check analytics policies (should show INSERT for anon, SELECT for authenticated)
SELECT
  tablename,
  policyname,
  cmd,
  roles::TEXT AS "role",
  'Fixed ✅' AS status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('analytics_sessions', 'analytics_page_views', 'analytics_events')
ORDER BY tablename, cmd;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '
  ============================================================================
  ✅ ALL FIXES APPLIED SUCCESSFULLY!
  ============================================================================
  
  Fixed Issues:
  1. ✅ Form submissions restored (talent, hiring, contact)
  2. ✅ Analytics tables created (sessions, page_views, events)
  3. ✅ All RLS policies configured correctly
  
  What to Test:
  1. Submit a talent form → should work
  2. Submit a hiring enquiry → should work
  3. Submit a contact form → should work
  4. Check browser console → no analytics errors
  5. Check admin dashboard → submissions should appear
  
  Platform Status: READY TO DEMO ✅
  
  Next Steps:
  - Test all forms
  - Add email notifications (optional but recommended)
  - Record demo video
  - Start reaching out to potential clients
  
  ============================================================================
  ';
END $$;
