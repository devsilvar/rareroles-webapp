-- ============================================================================
-- PRODUCTION DATABASE CLEANUP - FIXED VERSION
-- ============================================================================
-- Purpose: Clear all test data before production launch
-- Compatible with: Supabase SQL Editor
-- 
-- ⚠️ WARNING: This PERMANENTLY DELETES all records
-- ⚠️ Create backup first: Dashboard → Database → Backups → Create Backup
-- 
-- How to use:
-- 1. Create backup
-- 2. Copy this ENTIRE file
-- 3. Paste in Supabase SQL Editor
-- 4. Click "Run"
-- 5. Check for "Success" message
-- 6. Run verification query at the end
-- ============================================================================


-- ============================================================================
-- OPTION 1: DELETE EVERYTHING (Recommended for clean start)
-- ============================================================================

-- Delete form submissions
DELETE FROM public.talent_submissions;
DELETE FROM public.hiring_enquiries;
DELETE FROM public.contacts;

-- Delete analytics data
DELETE FROM public.analytics_events;
DELETE FROM public.analytics_page_views;
DELETE FROM public.analytics_sessions;

-- Delete marketing script logs
DELETE FROM public.marketing_script_audit;

-- ⚠️ Uncomment ONLY if you want to delete marketing scripts too:
-- DELETE FROM public.marketing_scripts;


-- ============================================================================
-- OPTION 2: DELETE CONDITIONALLY (If you want to keep some data)
-- ============================================================================

-- Uncomment and modify these if you want selective deletion:

-- Delete only test emails:
-- DELETE FROM public.talent_submissions WHERE email LIKE '%@test.com' OR email LIKE '%test%';
-- DELETE FROM public.hiring_enquiries WHERE email LIKE '%@test.com' OR email LIKE '%test%';
-- DELETE FROM public.contacts WHERE email LIKE '%@test.com' OR email LIKE '%test%';

-- Delete only old records (before a certain date):
-- DELETE FROM public.talent_submissions WHERE created_at < '2026-08-26';
-- DELETE FROM public.hiring_enquiries WHERE created_at < '2026-08-26';
-- DELETE FROM public.contacts WHERE created_at < '2026-08-26';

-- Delete only contacted records:
-- DELETE FROM public.talent_submissions WHERE contacted = true;
-- DELETE FROM public.hiring_enquiries WHERE contacted = true;
-- DELETE FROM public.contacts WHERE contacted = true;


-- ============================================================================
-- ⚠️ CRITICAL: DO NOT DELETE ADMIN USERS!
-- ============================================================================

-- ❌ NEVER RUN THIS:
-- DELETE FROM public.admin_users;

-- To remove ONE specific test admin only:
-- DELETE FROM public.admin_users WHERE email = 'testadmin@example.com';


-- ============================================================================
-- ✅ DONE! Now run this verification query:
-- ============================================================================

-- Copy the query below and run it SEPARATELY to verify:

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
SELECT 'admin_users (MUST BE > 0!)', COUNT(*) FROM public.admin_users;


-- ============================================================================
-- Expected Results:
-- ============================================================================
-- All tables should show 0 records EXCEPT admin_users
-- admin_users MUST show 1 or more (or you can't login!)
-- ============================================================================


-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- Error: "permission denied"
-- Solution: Make sure you're logged in as the project admin in Supabase

-- Error: "relation does not exist"
-- Solution: One of the tables wasn't created. Check your migrations.

-- Error: "syntax error"
-- Solution: Make sure you copied the ENTIRE script

-- Need to undo?
-- Solution: Go to Dashboard → Database → Backups → Restore latest backup

-- Can't login after cleanup?
-- Solution: You deleted admin_users! Restore from backup immediately.


-- ============================================================================
-- STORAGE CLEANUP (Optional - for CV uploads)
-- ============================================================================

-- You cannot delete storage via SQL. Use Supabase Dashboard:
-- 1. Go to: Storage → cv-uploads bucket
-- 2. Select all test files
-- 3. Click Delete


-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- If all queries ran without errors:
-- ✅ Test data is cleared
-- ✅ Database is production-ready
-- ✅ You can now accept real customer submissions
--
-- Next steps:
-- 1. Test a form submission on your live site
-- 2. Check it appears in admin dashboard
-- 3. Announce your launch! 🚀
-- ============================================================================
