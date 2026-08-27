-- ============================================================================
-- SUPER SIMPLE DIAGNOSTIC - Just the essential checks
-- ============================================================================

-- Check 1: Does INSERT policy exist for anon?
SELECT 
  'INSERT POLICY CHECK' AS test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'hiring_enquiries'
        AND cmd = 'INSERT'
        AND roles::TEXT LIKE '%anon%'
    ) THEN '✅ INSERT policy EXISTS'
    ELSE '❌ INSERT policy MISSING - RUN FIX'
  END AS result;

-- Check 2: Does anon have INSERT grant?
SELECT 
  'INSERT GRANT CHECK' AS test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.role_table_grants
      WHERE table_name = 'hiring_enquiries'
        AND grantee = 'anon'
        AND privilege_type = 'INSERT'
    ) THEN '✅ INSERT grant EXISTS'
    ELSE '❌ INSERT grant MISSING - RUN FIX'
  END AS result;

-- Check 3: Show me ALL policies (if any exist)
SELECT 
  policyname,
  cmd,
  roles::TEXT
FROM pg_policies
WHERE tablename = 'hiring_enquiries'
ORDER BY cmd;
