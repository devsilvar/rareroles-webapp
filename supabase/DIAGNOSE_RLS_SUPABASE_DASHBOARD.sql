-- ============================================================================
-- DIAGNOSTIC SCRIPT: Check RLS Configuration for hiring_enquiries
-- 
-- This version works in Supabase Dashboard SQL Editor
-- Run this to understand what's configured before applying any fixes
-- ============================================================================

-- ============================================================================
-- 1. CHECK IF RLS IS ENABLED
-- ============================================================================
SELECT 
  '1. RLS STATUS' AS check_type,
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED ✅' ELSE 'DISABLED ❌' END AS rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'hiring_enquiries';

-- ============================================================================
-- 2. LIST ALL POLICIES (THIS IS THE MOST IMPORTANT CHECK)
-- ============================================================================
SELECT
  '2. POLICIES' AS check_type,
  policyname,
  cmd AS command,
  roles::TEXT AS target_roles,
  CASE 
    WHEN COALESCE(with_check::TEXT, '') LIKE '%true%' THEN 'WITH CHECK: true (allows all)'
    WHEN COALESCE(qual::TEXT, '') LIKE '%is_admin%' THEN 'USING: is_admin() (admin only)'
    ELSE COALESCE(qual::TEXT, with_check::TEXT, 'no restriction')
  END AS policy_condition
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'hiring_enquiries'
ORDER BY cmd, policyname;

-- ============================================================================
-- 3. CHECK ROLE PERMISSIONS (GRANTS)
-- ============================================================================
SELECT
  '3. GRANTS' AS check_type,
  grantee AS role_name,
  privilege_type,
  CASE 
    WHEN is_grantable = 'YES' THEN 'grantable'
    ELSE 'not grantable'
  END AS grant_options
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'hiring_enquiries'
  AND grantee IN ('anon', 'authenticated', 'postgres')
ORDER BY grantee, privilege_type;

-- ============================================================================
-- 4. CRITICAL CHECK: Does anon have INSERT policy AND grant?
-- ============================================================================
SELECT
  '4. ANON INSERT CHECK' AS check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND tablename = 'hiring_enquiries'
        AND cmd = 'INSERT'
        AND roles::TEXT LIKE '%anon%'
    ) THEN '✅ INSERT policy exists for anon'
    ELSE '❌ INSERT policy MISSING for anon (THIS IS THE PROBLEM!)'
  END AS policy_status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.role_table_grants
      WHERE table_schema = 'public'
        AND table_name = 'hiring_enquiries'
        AND grantee = 'anon'
        AND privilege_type = 'INSERT'
    ) THEN '✅ INSERT grant exists for anon'
    ELSE '❌ INSERT grant MISSING for anon (THIS IS THE PROBLEM!)'
  END AS grant_status;

-- ============================================================================
-- 5. SUMMARY - What should you see?
-- ============================================================================
SELECT
  '5. EXPECTED CONFIG' AS info_type,
  'You should have:' AS description
UNION ALL
SELECT '', '✅ RLS enabled: true'
UNION ALL
SELECT '', '✅ Policy: INSERT for anon role (name: "Allow public insert" or "Allow public insert hiring")'
UNION ALL
SELECT '', '✅ Policy: SELECT for authenticated with is_admin() check'
UNION ALL
SELECT '', '✅ Policy: UPDATE for authenticated with is_admin() check'
UNION ALL
SELECT '', '✅ Grant: INSERT to anon'
UNION ALL
SELECT '', '✅ Grant: SELECT, UPDATE to authenticated'
UNION ALL
SELECT '', ''
UNION ALL
SELECT '', 'If anything is ❌ above, run FIX_ALL_FORM_RLS.sql';
