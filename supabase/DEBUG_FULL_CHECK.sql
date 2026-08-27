-- ============================================================================
-- COMPREHENSIVE DEBUG: Check EVERYTHING
-- ============================================================================

-- 1. Table schema - what columns exist?
SELECT 
  '1. TABLE SCHEMA' AS check_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'hiring_enquiries'
ORDER BY ordinal_position;

-- 2. RLS status
SELECT
  '2. RLS STATUS' AS check_name,
  tablename,
  rowsecurity AS rls_enabled,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'hiring_enquiries';

-- 3. ALL policies with full details
SELECT
  '3. ALL POLICIES' AS check_name,
  policyname,
  cmd,
  roles::TEXT AS target_roles,
  permissive AS is_permissive,
  qual::TEXT AS using_clause,
  with_check::TEXT AS with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'hiring_enquiries'
ORDER BY cmd, policyname;

-- 4. Table grants
SELECT
  '4. TABLE GRANTS' AS check_name,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'hiring_enquiries'
  AND grantee IN ('anon', 'authenticated', 'public', 'postgres')
ORDER BY grantee, privilege_type;

-- 5. Try a test INSERT as different roles
SELECT '5. TEST INSERT' AS check_name, 'Testing anon role...' AS status;

-- Attempt INSERT as anon (this is what your form does)
SET LOCAL ROLE anon;
INSERT INTO public.hiring_enquiries (
  company,
  contact_name,
  email,
  phone,
  location,
  roles,
  seniority,
  timeline,
  details
) VALUES (
  'Test Company',
  'Test User',
  'test-debug@example.com',
  '+44 1234 567890',
  'London',
  '[{"title": "Test Role", "count": 1}]'::jsonb,
  'Senior',
  'ASAP',
  'Test details'
);

-- Reset role
RESET ROLE;

-- Check if it worked
SELECT 
  '6. INSERT RESULT' AS check_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.hiring_enquiries WHERE email = 'test-debug@example.com')
    THEN '✅ INSERT WORKED! The problem is somewhere else in your application.'
    ELSE '❌ INSERT FAILED! RLS is blocking it.'
  END AS result;

-- Clean up
DELETE FROM public.hiring_enquiries WHERE email = 'test-debug@example.com';
