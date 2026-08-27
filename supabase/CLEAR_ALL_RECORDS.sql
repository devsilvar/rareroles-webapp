-- ============================================================================
-- CLEAR ALL RECORDS - Fresh Database for Client Handover
-- ============================================================================
-- This script deletes ALL records from ALL tables while preserving the
-- database structure (tables, columns, indexes, policies, etc.)
--
-- USE CASE: Handing over the project to client with a clean slate
--
-- ⚠️  WARNING: This is IRREVERSIBLE. All data will be permanently deleted.
-- ⚠️  Make sure you have a backup if needed before running this script.
--
-- HOW TO USE:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Paste this entire script
-- 3. Click "Run" or press Ctrl+Enter
-- 4. Verify deletion by checking table counts at the bottom
-- ============================================================================

-- ============================================================================
-- 1. DELETE FORM SUBMISSIONS (User-facing data)
-- ============================================================================

-- Clear talent submissions (job seeker applications)
DELETE FROM public.talent_submissions;

-- Clear hiring enquiries (employer job postings)
DELETE FROM public.hiring_enquiries;

-- Clear contact form submissions
DELETE FROM public.contacts;


-- ============================================================================
-- 2. DELETE ANALYTICS DATA
-- ============================================================================

-- Clear page view tracking
DELETE FROM public.analytics_page_views;

-- Clear event tracking (clicks, interactions)
DELETE FROM public.analytics_events;

-- Clear session tracking
DELETE FROM public.analytics_sessions;


-- ============================================================================
-- 3. DELETE MARKETING SCRIPTS (if exists)
-- ============================================================================

-- Clear marketing script audit log (if table exists)
DELETE FROM public.marketing_script_audit WHERE TRUE;

-- Clear marketing scripts configuration (if table exists)
DELETE FROM public.marketing_scripts WHERE TRUE;


-- ============================================================================
-- 4. OPTIONAL: DELETE ADMIN USERS (Uncomment if you want to clear admins too)
-- ============================================================================

-- ⚠️  CAUTION: This will remove all admin access.
--     You'll need to manually add admin users back after running this.
--     Uncomment the line below ONLY if you want to clear admin users:

-- DELETE FROM public.admin_users;


-- ============================================================================
-- 5. VERIFICATION - Check that all tables are now empty
-- ============================================================================

SELECT 
  'talent_submissions' as table_name, 
  COUNT(*) as record_count 
FROM public.talent_submissions

UNION ALL

SELECT 
  'hiring_enquiries' as table_name, 
  COUNT(*) as record_count 
FROM public.hiring_enquiries

UNION ALL

SELECT 
  'contacts' as table_name, 
  COUNT(*) as record_count 
FROM public.contacts

UNION ALL

SELECT 
  'analytics_page_views' as table_name, 
  COUNT(*) as record_count 
FROM public.analytics_page_views

UNION ALL

SELECT 
  'analytics_events' as table_name, 
  COUNT(*) as record_count 
FROM public.analytics_events

UNION ALL

SELECT 
  'analytics_sessions' as table_name, 
  COUNT(*) as record_count 
FROM public.analytics_sessions

UNION ALL

SELECT 
  'marketing_scripts' as table_name, 
  COUNT(*) as record_count 
FROM public.marketing_scripts

UNION ALL

SELECT 
  'marketing_script_audit' as table_name, 
  COUNT(*) as record_count 
FROM public.marketing_script_audit

ORDER BY table_name;


-- ============================================================================
-- EXPECTED RESULT:
-- All tables should show 0 records after running this script.
-- Database structure (tables, policies, functions) remains intact.
-- ============================================================================