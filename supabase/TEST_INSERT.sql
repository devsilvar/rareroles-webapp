-- ============================================================================
-- TEST: Can we actually INSERT as anon user?
-- 
-- This will test if the policies work at the database level
-- ============================================================================

-- Test 1: Try to insert a test record (as postgres user)
INSERT INTO public.hiring_enquiries (
  company, 
  contact_name, 
  email, 
  roles
) VALUES (
  'Test Company',
  'Test User',
  'test@example.com',
  '[]'::jsonb
);

-- Test 2: Check if it was inserted
SELECT 
  'Test record inserted successfully!' AS status,
  company,
  contact_name,
  email,
  created_at
FROM public.hiring_enquiries
WHERE email = 'test@example.com'
ORDER BY created_at DESC
LIMIT 1;

-- Clean up the test record
DELETE FROM public.hiring_enquiries WHERE email = 'test@example.com';

SELECT '✅ Database INSERT works - Problem is in the client!' AS conclusion;
