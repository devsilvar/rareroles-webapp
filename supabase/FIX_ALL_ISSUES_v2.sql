-- ============================================================================
-- COMPLETE FIX v2 - Run this entire file in Supabase SQL Editor
--
-- This version safely handles existing policies by dropping them first
-- ============================================================================

-- ============================================================================
-- FIX #1: RESTORE PUBLIC FORM SUBMISSIONS
-- ============================================================================

-- talent_submissions - Drop and recreate to ensure it's correct
DROP POLICY IF EXISTS "Allow public insert talent" ON public.talent_submissions;
CREATE POLICY "Allow public insert talent" ON public.talent_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.talent_submissions TO anon;


-- hiring_enquiries - Drop and recreate
DROP POLICY IF EXISTS "Allow public insert hiring" ON public.hiring_enquiries;
CREATE POLICY "Allow public insert hiring" ON public.hiring_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.hiring_enquiries TO anon;


-- contacts - Drop and recreate
DROP POLICY IF EXISTS "Allow public insert contact" ON public.contacts;
CREATE POLICY "Allow public insert contact" ON public.contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.contacts TO anon;


-- ============================================================================
-- FIX #2: CREATE ANALYTICS TABLES (Only if they don't exist)
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

DROP POLICY IF EXISTS "Public insert analytics sessions" ON public.analytics_sessions;
CREATE POLICY "Public insert analytics sessions" ON public.analytics_sessions
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics sessions" ON public.analytics_sessions;
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

DROP POLICY IF EXISTS "Public insert analytics page views" ON public.analytics_page_views;
CREATE POLICY "Public insert analytics page views" ON public.analytics_page_views
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics page views" ON public.analytics_page_views;
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

DROP POLICY IF EXISTS "Public insert analytics events" ON public.analytics_events;
CREATE POLICY "Public insert analytics events" ON public.analytics_events
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read analytics events" ON public.analytics_events;
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
  '✅ Form submission enabled' AS status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('talent_submissions', 'hiring_enquiries', 'contacts')
  AND cmd = 'INSERT'
  AND roles::TEXT LIKE '%anon%'
ORDER BY tablename;

-- Check analytics tables exist
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns,
  '✅ Table exists' AS status
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('analytics_sessions', 'analytics_page_views', 'analytics_events')
ORDER BY table_name;

-- Check analytics policies
SELECT
  tablename,
  COUNT(*) as policy_count,
  '✅ Policies configured' AS status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('analytics_sessions', 'analytics_page_views', 'analytics_events')
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
DECLARE
  form_policies_count INT;
  analytics_tables_count INT;
  analytics_policies_count INT;
BEGIN
  -- Count form submission policies
  SELECT COUNT(*) INTO form_policies_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('talent_submissions', 'hiring_enquiries', 'contacts')
    AND cmd = 'INSERT'
    AND roles::TEXT LIKE '%anon%';
  
  -- Count analytics tables
  SELECT COUNT(*) INTO analytics_tables_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('analytics_sessions', 'analytics_page_views', 'analytics_events');
  
  -- Count analytics policies
  SELECT COUNT(*) INTO analytics_policies_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('analytics_sessions', 'analytics_page_views', 'analytics_events');
  
  RAISE NOTICE '
  ============================================================================
  ✅ FIX COMPLETED!
  ============================================================================
  
  Status:
  ✅ Form submission policies: % / 3 (talent, hiring, contact)
  ✅ Analytics tables: % / 3 (sessions, page_views, events)  
  ✅ Analytics policies: % / 6 (insert + select for each table)
  
  What to Test Now:
  1. Submit a talent form → should work without RLS error
  2. Submit a hiring enquiry → should work
  3. Submit a contact form → should work
  4. Open browser console (F12) → check for analytics tracking logs
  5. Check admin dashboard → submissions should appear
  
  Platform Status: %
  
  Next Steps:
  - Test all forms thoroughly
  - Check browser console for analytics logs
  - Verify admin dashboard shows data
  - Start planning your demo!
  
  ============================================================================
  ', 
  form_policies_count,
  analytics_tables_count,
  analytics_policies_count,
  CASE 
    WHEN form_policies_count = 3 AND analytics_tables_count = 3 AND analytics_policies_count = 6 
    THEN 'FULLY FUNCTIONAL ✅'
    WHEN form_policies_count = 3 
    THEN 'FORMS WORKING, CHECK ANALYTICS ⚠️'
    ELSE 'REVIEW RESULTS ABOVE ⚠️'
  END;
END $$;
