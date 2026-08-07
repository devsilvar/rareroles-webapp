-- ============================================================================
-- DIAGNOSTIC: Check Supabase Permissions and Policies
-- Run this in Supabase SQL Editor to diagnose the issue
--
-- ⚠️  SECURITY WARNING — the "FIX" half of this file is now UNSAFE
--
-- The read/update policies recreated below grant "TO authenticated
-- USING (true)", which lets ANY logged-in account read every enquiry, talent
-- submission (including CV URLs) and contact message. Migrations 005 + 006
-- replaced those with is_admin() checks.
--
-- The SELECT/diagnostic queries in this file remain safe to run.
-- The CREATE POLICY statements DO NOT — they will silently reopen the hole.
--
-- If you need to restore admin access, re-apply:
--     migrations/006_enforce_admin_rls.sql
-- and confirm your account is present in public.admin_users.
-- ============================================================================

-- 1. Check if tables exist
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('talent_submissions', 'hiring_enquiries', 'contacts');

-- 2. Check Row Level Security status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('talent_submissions', 'hiring_enquiries', 'contacts');

-- 3. Check existing policies on talent_submissions
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'talent_submissions';

-- 4. Check grants/permissions
SELECT 
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name = 'talent_submissions';

-- ============================================================================
-- If the policies don't show 'anon' role, run this fix:
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Re-create policies with explicit permissions
DROP POLICY IF EXISTS "Allow public insert" ON public.talent_submissions;
CREATE POLICY "Allow public insert" ON public.talent_submissions
  FOR INSERT
  TO public  -- Allow ALL roles including anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.talent_submissions;
CREATE POLICY "Allow authenticated read" ON public.talent_submissions
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON public.talent_submissions;
CREATE POLICY "Allow authenticated update" ON public.talent_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Grant explicit permissions to anon role
GRANT INSERT ON public.talent_submissions TO anon;
GRANT SELECT, UPDATE ON public.talent_submissions TO authenticated;

-- Same for hiring_enquiries
DROP POLICY IF EXISTS "Allow public insert" ON public.hiring_enquiries;
CREATE POLICY "Allow public insert" ON public.hiring_enquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.hiring_enquiries;
CREATE POLICY "Allow authenticated read" ON public.hiring_enquiries
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON public.hiring_enquiries;
CREATE POLICY "Allow authenticated update" ON public.hiring_enquiries
  FOR UPDATE
  TO authenticated
  USING (true);

GRANT INSERT ON public.hiring_enquiries TO anon;
GRANT SELECT, UPDATE ON public.hiring_enquiries TO authenticated;

-- Same for contacts
DROP POLICY IF EXISTS "Allow public insert" ON public.contacts;
CREATE POLICY "Allow public insert" ON public.contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON public.contacts;
CREATE POLICY "Allow authenticated read" ON public.contacts
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON public.contacts;
CREATE POLICY "Allow authenticated update" ON public.contacts
  FOR UPDATE
  TO authenticated
  USING (true);

GRANT INSERT ON public.contacts TO anon;
GRANT SELECT, UPDATE ON public.contacts TO authenticated;

-- ============================================================================
-- Final verification
-- ============================================================================

SELECT 
  'Table exists: ' || table_name as check_result
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'talent_submissions'

UNION ALL

SELECT 
  'RLS enabled: ' || CASE WHEN rowsecurity THEN 'YES' ELSE 'NO' END
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'talent_submissions'

UNION ALL

SELECT 
  'Policies count: ' || COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'talent_submissions';
