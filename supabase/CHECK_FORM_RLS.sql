-- ============================================================================
-- Single-result diagnostic for the form-submission 42501 error.
--
-- The Supabase SQL editor only renders the LAST result set, so this is one
-- query rather than several. Run the whole thing and read every row.
--
-- Rows are ordered so anything needing attention sorts to the top.
-- Read-only: creates nothing, changes nothing.
-- ============================================================================

WITH
-- Did the INSERT policies end up in the intended shape?
policy_state AS (
  SELECT
    t.tablename,
    (SELECT COUNT(*) FROM pg_policies p
      WHERE p.schemaname = 'public' AND p.tablename = t.tablename
        AND p.cmd = 'INSERT') AS insert_policies,
    (SELECT COUNT(*) FROM pg_policies p
      WHERE p.schemaname = 'public' AND p.tablename = t.tablename
        AND p.cmd = 'INSERT' AND p.roles::TEXT LIKE '%anon%') AS anon_ok,
    (SELECT COUNT(*) FROM pg_policies p
      WHERE p.schemaname = 'public' AND p.tablename = t.tablename
        AND p.cmd = 'INSERT' AND p.roles::TEXT LIKE '%authenticated%') AS auth_ok,
    (SELECT COUNT(*) FROM pg_policies p
      WHERE p.schemaname = 'public' AND p.tablename = t.tablename
        AND p.permissive = 'RESTRICTIVE') AS restrictive,
    -- A SELECT policy open to anon would make every submission world-readable.
    (SELECT COUNT(*) FROM pg_policies p
      WHERE p.schemaname = 'public' AND p.tablename = t.tablename
        AND p.cmd = 'SELECT' AND p.roles::TEXT LIKE '%anon%') AS anon_can_read,
    c.relrowsecurity AS rls_on,
    c.relforcerowsecurity AS rls_forced
  FROM (VALUES ('hiring_enquiries'), ('talent_submissions'), ('contacts')) AS t(tablename)
  JOIN pg_class c ON c.relname = t.tablename
  JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'public'
),
findings AS (
  -- The INSERT path: this is what was actually broken.
  SELECT 1 AS sort, tablename,
         CASE WHEN insert_policies = 0 THEN 'FAIL' WHEN auth_ok = 0 OR anon_ok = 0 THEN 'FAIL' ELSE 'PASS' END AS status,
         'INSERT policy covers anon + authenticated' AS check_name,
         format('%s INSERT policy(s); anon=%s authenticated=%s',
                insert_policies,
                CASE WHEN anon_ok > 0 THEN 'yes' ELSE 'NO' END,
                CASE WHEN auth_ok > 0 THEN 'yes' ELSE 'NO' END) AS detail
  FROM policy_state

  UNION ALL

  -- RLS off means the policies are inert AND the stock Supabase grants
  -- (which include DELETE for anon) become live. Worse than the bug.
  SELECT 2, tablename,
         CASE WHEN rls_on THEN 'PASS' ELSE 'FAIL' END,
         'RLS enabled',
         CASE WHEN rls_on THEN 'on' ELSE 'OFF — anon grants are unguarded' END
  FROM policy_state

  UNION ALL

  -- One RESTRICTIVE policy ANDs with everything else and keeps causing 42501
  -- regardless of how many permissive policies exist.
  SELECT 3, tablename,
         CASE WHEN restrictive = 0 THEN 'PASS' ELSE 'FAIL' END,
         'No RESTRICTIVE policies',
         CASE WHEN restrictive = 0 THEN 'none' ELSE restrictive || ' found — these AND with everything' END
  FROM policy_state

  UNION ALL

  -- Not the reported bug, but if this fails the submissions are public.
  SELECT 4, tablename,
         CASE WHEN anon_can_read = 0 THEN 'PASS' ELSE 'FAIL' END,
         'Submissions not publicly readable',
         CASE WHEN anon_can_read = 0 THEN 'admin-only' ELSE 'anon CAN READ — data exposed' END
  FROM policy_state

  UNION ALL

  -- FORCE applies RLS to the table owner too and breaks admin tooling in
  -- ways that look unrelated to this bug.
  SELECT 5, tablename,
         CASE WHEN NOT rls_forced THEN 'PASS' ELSE 'WARN' END,
         'RLS not FORCEd',
         CASE WHEN rls_forced THEN 'FORCED — applies to owner too' ELSE 'normal' END
  FROM policy_state

  UNION ALL

  SELECT 6, tablename,
         CASE WHEN has_table_privilege('anon', 'public.' || tablename, 'INSERT')
              AND has_table_privilege('authenticated', 'public.' || tablename, 'INSERT')
              THEN 'PASS' ELSE 'FAIL' END,
         'INSERT granted to both roles',
         'grant check'
  FROM policy_state
)
SELECT status, tablename, check_name, detail
FROM findings
-- FAIL first, then WARN, then PASS.
ORDER BY CASE status WHEN 'FAIL' THEN 0 WHEN 'WARN' THEN 1 ELSE 2 END, sort, tablename;
