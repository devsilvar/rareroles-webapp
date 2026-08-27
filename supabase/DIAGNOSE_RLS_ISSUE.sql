-- ============================================================================
-- DIAGNOSTIC SCRIPT: Check RLS Configuration for hiring_enquiries
-- 
-- This script will show you EXACTLY what's configured in your database
-- Run this FIRST to understand the problem before applying any fixes
-- ============================================================================

\echo '=========================================='
\echo 'DIAGNOSTIC: hiring_enquiries RLS Status'
\echo '=========================================='
\echo ''

-- 1. Check if RLS is enabled
\echo '1. RLS ENABLED STATUS:'
SELECT 
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'hiring_enquiries';

\echo ''
\echo '2. CURRENT POLICIES:'
-- 2. List all policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd AS command,
  roles::TEXT AS target_roles,
  COALESCE(qual::TEXT, '-') AS using_expression,
  COALESCE(with_check::TEXT, '-') AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'hiring_enquiries'
ORDER BY cmd, policyname;

\echo ''
\echo '3. ROLE PERMISSIONS (GRANTS):'
-- 3. Check table-level grants for anon and authenticated
SELECT
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'hiring_enquiries'
  AND grantee IN ('anon', 'authenticated', 'postgres')
ORDER BY grantee, privilege_type;

\echo ''
\echo '4. TABLE INFO:'
-- 4. Basic table info
SELECT
  schemaname,
  tablename,
  tableowner,
  tablespace,
  hasindexes,
  hasrules,
  hastriggers
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'hiring_enquiries';

\echo ''
\echo '=========================================='
\echo 'EXPECTED CONFIGURATION:'
\echo '=========================================='
\echo '✅ RLS should be: ENABLED (true)'
\echo '✅ Should have INSERT policy for anon role'
\echo '   Policy names: "Allow public insert" OR "Allow public insert hiring"'
\echo '✅ Should have SELECT policy for authenticated role (with is_admin check)'
\echo '✅ Should have UPDATE policy for authenticated role (with is_admin check)'
\echo '✅ anon role should have INSERT grant'
\echo '✅ authenticated role should have SELECT, UPDATE grants'
\echo ''
\echo 'If anything is missing above, run the FIX script'
\echo '=========================================='
