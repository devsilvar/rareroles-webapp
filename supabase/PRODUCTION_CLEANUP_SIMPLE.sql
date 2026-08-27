-- ============================================================================
-- PRODUCTION DATABASE CLEANUP - SIMPLE VERSION
-- ============================================================================
-- Purpose: Clear all test data from Supabase database (Supabase SQL Editor Compatible)
-- 
-- ⚠️ WARNING: This PERMANENTLY DELETES all records from your tables
-- ⚠️ Create a backup BEFORE running: Dashboard → Database → Backups → Create Backup
-- 
-- How to use:
-- 1. Create backup in Supabase Dashboard
-- 2. Copy this entire file
-- 3. Open Supabase SQL Editor
-- 4. Paste and click "Run"
-- 5. Run verification query below
-- ============================================================================


-- ============================================================================
-- STEP 1: Delete all form submissions
-- ============================================================================

DELETE FROM public.talent_submissions;
DELETE FROM public.hiring_enquiries;
DELETE FROM public.contacts;


-- ============================================================================
-- STEP 2: Delete all analytics data
-- ============================================================================

DELETE FROM public.analytics_events;
DELETE FROM public.analytics_page_views;
DELETE FROM public.analytics_sessions;


-- ============================================================================
-- STEP 3: Delete marketing script audit logs
-- ============================================================================

DELETE FROM public.marketing_script_audit;

-- ⚠️ Uncomment the line below ONLY if you want to delete marketing scripts too
-- DELETE FROM public.marketing_scripts;


-- ============================================================================
-- ⚠️ DO NOT DELETE ADMIN USERS - You need these to login!
-- ============================================================================

-- ❌ DO NOT RUN THIS:
-- DELETE FROM public.admin_users;

-- To remove a specific test admin only (replace email):
-- DELETE FROM public.admin_users WHERE email = 'test@example.com';


-- ============================================================================
-- VERIFICATION QUERY - Run this after cleanup
-- ============================================================================
-- Copy and run this separately to verify cleanup was successful:

SELECT 
  'talent_submissions' as table_name, 
  COUNT(*) as remaining_records 
FROM public.talent_submissions
UNION ALL
SELECT 'hiring_enquiries', COUNT(*) FROM public.hiring_enquiries
UNION ALL
SELECT 'contacts', COUNT(*) FROM public.contacts
UNION ALL
SELECT 'analytics_sessions', COUNT(*) FROM public.analytics_sessions
UNION ALL
SELECT 'analytics_page_views', COUNT(*) FROM public.analytics_page_views
UNION ALL
SELECT 'analytics_events', COUNT(*) FROM public.analytics_events
UNION ALL
SELECT 'marketing_script_audit', COUNT(*) FROM public.marketing_script_audit
UNION ALL
SELECT 'admin_users (KEEP!)', COUNT(*) FROM public.admin_users;


-- ============================================================================
-- Expected Results After Cleanup:
-- ============================================================================
-- talent_submissions:       0 ✓
-- hiring_enquiries:         0 ✓
-- contacts:                 0 ✓
-- analytics_sessions:       0 ✓
-- analytics_page_views:     0 ✓
-- analytics_events:         0 ✓
-- marketing_script_audit:   0 ✓
-- admin_users:              1+ ✓ (MUST BE > 0!)
-- ============================================================================
