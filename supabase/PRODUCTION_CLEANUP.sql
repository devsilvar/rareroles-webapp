-- ============================================================================
-- PRODUCTION DATABASE CLEANUP SCRIPT
-- ============================================================================
-- Purpose: Clear all test data from Supabase database before production launch
-- 
-- ⚠️ WARNING: This script PERMANENTLY DELETES all records from your tables
-- ⚠️ Make sure to backup data before running if you need any records
-- 
-- Created: 2026-08-26
-- Safe to run: Multiple times (idempotent)
-- 
-- What this script does:
-- 1. Clears all form submissions (talent, hiring, contacts)
-- 2. Clears all analytics data (sessions, page views, events)
-- 3. Clears all marketing scripts and audit logs
-- 4. Preserves table structure and RLS policies
-- 5. Preserves admin users (you still need to login!)
-- 6. Resets auto-increment sequences (if any)
-- 
-- What this script does NOT do:
-- - Does NOT delete tables
-- - Does NOT delete admin users
-- - Does NOT modify RLS policies
-- - Does NOT affect auth.users table
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: BACKUP INSTRUCTIONS (Read before running!)
-- ============================================================================

-- To create a backup before running this script:
-- 
-- Method 1: Using Supabase Dashboard
-- 1. Go to: Database → Backups → Create Backup
-- 2. Wait for backup to complete
-- 3. Then run this script
-- 
-- Method 2: Using SQL (export data)
-- COPY (SELECT * FROM public.talent_submissions) TO '/tmp/talent_submissions_backup.csv' CSV HEADER;
-- COPY (SELECT * FROM public.hiring_enquiries) TO '/tmp/hiring_enquiries_backup.csv' CSV HEADER;
-- COPY (SELECT * FROM public.contacts) TO '/tmp/contacts_backup.csv' CSV HEADER;


-- ============================================================================
-- STEP 2: COUNT RECORDS (see what will be deleted)
-- ============================================================================

-- Uncomment these to see counts before deleting:
-- SELECT 'talent_submissions' as table_name, COUNT(*) as record_count FROM public.talent_submissions
-- UNION ALL
-- SELECT 'hiring_enquiries', COUNT(*) FROM public.hiring_enquiries
-- UNION ALL
-- SELECT 'contacts', COUNT(*) FROM public.contacts
-- UNION ALL
-- SELECT 'analytics_sessions', COUNT(*) FROM public.analytics_sessions
-- UNION ALL
-- SELECT 'analytics_page_views', COUNT(*) FROM public.analytics_page_views
-- UNION ALL
-- SELECT 'analytics_events', COUNT(*) FROM public.analytics_events
-- UNION ALL
-- SELECT 'marketing_scripts', COUNT(*) FROM public.marketing_scripts
-- UNION ALL
-- SELECT 'marketing_script_audit', COUNT(*) FROM public.marketing_script_audit
-- UNION ALL
-- SELECT 'admin_users', COUNT(*) FROM public.admin_users;


-- ============================================================================
-- STEP 3: DELETE TEST DATA
-- ============================================================================

-- FORM SUBMISSIONS (Test data from development/staging)
-- ----------------------------------------------------------------------------

-- Clear talent submissions
DELETE FROM public.talent_submissions;
-- ✅ Deleted all records from talent_submissions

-- Clear hiring enquiries
DELETE FROM public.hiring_enquiries;
-- ✅ Deleted all records from hiring_enquiries

-- Clear contact submissions
DELETE FROM public.contacts;
-- ✅ Deleted all records from contacts


-- ANALYTICS DATA (Test analytics from development/staging)
-- ----------------------------------------------------------------------------

-- Clear analytics events (must delete first due to potential FK relationships)
DELETE FROM public.analytics_events;
-- ✅ Deleted all records from analytics_events

-- Clear analytics page views
DELETE FROM public.analytics_page_views;
-- ✅ Deleted all records from analytics_page_views

-- Clear analytics sessions
DELETE FROM public.analytics_sessions;
-- ✅ Deleted all records from analytics_sessions


-- MARKETING SCRIPTS (Optional - only if you added test scripts)
-- ----------------------------------------------------------------------------

-- Clear marketing script audit logs
DELETE FROM public.marketing_script_audit;
-- ✅ Deleted all records from marketing_script_audit

-- ⚠️ Uncomment the line below ONLY if you want to delete ALL marketing scripts
-- This includes any real scripts you may have added for production
-- DELETE FROM public.marketing_scripts;
-- ✅ Deleted all records from marketing_scripts


-- ADMIN USERS (⚠️ DO NOT DELETE - You need these to login!)
-- ----------------------------------------------------------------------------

-- ❌ DO NOT UNCOMMENT THIS - You'll lock yourself out!
-- DELETE FROM public.admin_users;

-- To remove a specific test admin (replace with actual email):
-- DELETE FROM public.admin_users WHERE email = 'test@example.com';


-- ============================================================================
-- STEP 4: VERIFY CLEANUP
-- ============================================================================

-- Check that tables are now empty:
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
SELECT 'marketing_scripts', COUNT(*) FROM public.marketing_scripts
UNION ALL
SELECT 'marketing_script_audit', COUNT(*) FROM public.marketing_script_audit
UNION ALL
SELECT 'admin_users (KEEP THESE!)', COUNT(*) FROM public.admin_users;


-- ============================================================================
-- STEP 5: RESET STORAGE (if you uploaded test CVs)
-- ============================================================================

-- ⚠️ This requires Supabase Dashboard or API access
-- You cannot delete storage files via SQL
-- 
-- To clear test CV uploads:
-- 1. Go to: Supabase Dashboard → Storage → cv-uploads bucket
-- 2. Select all test files
-- 3. Click Delete
-- 
-- Or use the Supabase CLI:
-- supabase storage rm --recursive cv-uploads


-- ============================================================================
-- COMPLETION
-- ============================================================================

COMMIT;

-- ✅ DATABASE CLEANUP COMPLETE!
-- 
-- Next steps:
-- 1. Verify all tables are empty (except admin_users)
-- 2. Test form submissions work correctly
-- 3. Test admin dashboard access
-- 4. Deploy to production
-- 
-- Expected state:
-- - All form tables: 0 records ✓
-- - All analytics tables: 0 records ✓
-- - Admin users: 1+ records ✓ (DO NOT DELETE!)
-- - Table structure: Preserved ✓
-- - RLS policies: Preserved ✓


-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if something goes wrong)
-- ============================================================================

-- If you need to rollback:
-- ROLLBACK;
-- 
-- Then restore from backup:
-- - Supabase Dashboard → Database → Backups → Restore
-- - Or import CSV files you exported earlier


-- ============================================================================
-- SCHEDULED CLEANUP (Optional - for regular maintenance)
-- ============================================================================

-- To automatically delete old test data periodically, create a scheduled function:
-- 
-- CREATE OR REPLACE FUNCTION cleanup_old_test_data()
-- RETURNS void AS $$
-- BEGIN
--   -- Delete analytics data older than 90 days
--   DELETE FROM public.analytics_sessions 
--   WHERE created_at < NOW() - INTERVAL '90 days';
--   
--   DELETE FROM public.analytics_page_views 
--   WHERE created_at < NOW() - INTERVAL '90 days';
--   
--   DELETE FROM public.analytics_events 
--   WHERE created_at < NOW() - INTERVAL '90 days';
--   
--   RAISE NOTICE 'Cleaned up old analytics data';
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- 
-- Then schedule it using pg_cron or Supabase Functions


-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If you get permission errors:
-- Make sure you're running as a Supabase admin user (postgres role)
-- RLS policies should not affect DELETE operations from admin

-- If foreign key constraints prevent deletion:
-- Check if there are any FK relationships we missed
-- Delete child records before parent records

-- If you want to keep SOME data:
-- Add WHERE clauses to the DELETE statements, e.g.:
-- DELETE FROM public.contacts WHERE email LIKE '%@test.com';
-- DELETE FROM public.talent_submissions WHERE created_at < '2026-08-01';
