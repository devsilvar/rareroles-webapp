-- ============================================================================
-- FIX: Allow BOTH anon AND authenticated users to submit forms
-- 
-- PROBLEM: Currently only anon can INSERT. If a user is logged in 
-- (authenticated role), they can't submit forms.
--
-- SOLUTION: Add INSERT policy for authenticated users as well
-- ============================================================================

-- Add INSERT policy for authenticated users (in addition to anon)
DROP POLICY IF EXISTS "Allow authenticated insert hiring" ON public.hiring_enquiries;
CREATE POLICY "Allow authenticated insert hiring" ON public.hiring_enquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure authenticated role has INSERT grant
GRANT INSERT ON public.hiring_enquiries TO authenticated;

-- Verify all policies
SELECT
  'FINAL POLICIES' AS status,
  policyname,
  cmd,
  roles::TEXT
FROM pg_policies
WHERE tablename = 'hiring_enquiries'
ORDER BY cmd, roles::TEXT;

SELECT '✅ Both anon AND authenticated users can now submit forms!' AS result;
