-- ============================================================================
-- RareRoles Database Setup - Complete Migration
-- Run this script in Supabase SQL Editor to set up all required tables
--
-- ⚠️  SECURITY WARNING — READ BEFORE RUNNING
--
-- The policies below grant "TO authenticated USING (true)", which lets ANY
-- logged-in account read every enquiry, talent submission and contact message.
-- Migrations 005 + 006 deliberately replaced those with is_admin() checks.
--
-- Running this file on an existing database will SILENTLY REOPEN that hole,
-- because the CREATE POLICY statements here overwrite the hardened ones.
--
-- This file is only safe for bootstrapping a BRAND NEW, EMPTY project — and
-- even then you must immediately apply:
--     migrations/005_create_admin_users.sql
--     migrations/006_enforce_admin_rls.sql
--
-- To verify which policies are actually live:
--     SELECT tablename, policyname, cmd, roles::TEXT,
--            COALESCE(qual, with_check) AS predicate
--     FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
-- Anything showing `true` for the authenticated role is a hole.
-- ============================================================================

-- ============================================================================
-- 1. TALENT SUBMISSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.talent_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  desired_role TEXT NOT NULL,
  experience TEXT,
  location TEXT,
  links TEXT,
  about TEXT,
  cv_url TEXT,
  cv_file_path TEXT,
  cv_file_name TEXT,
  contacted BOOLEAN DEFAULT FALSE,
  contacted_at TIMESTAMPTZ,
  contacted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_talent_submissions_email ON public.talent_submissions(email);
CREATE INDEX IF NOT EXISTS idx_talent_submissions_created_at ON public.talent_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_talent_submissions_contacted ON public.talent_submissions(contacted);

ALTER TABLE public.talent_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.talent_submissions;
CREATE POLICY "Allow public insert" ON public.talent_submissions
  FOR INSERT
  TO anon
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

GRANT INSERT ON public.talent_submissions TO anon;
GRANT SELECT, UPDATE ON public.talent_submissions TO authenticated;

-- ============================================================================
-- 2. HIRING ENQUIRIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.hiring_enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  roles JSONB NOT NULL DEFAULT '[]'::jsonb,
  seniority TEXT,
  timeline TEXT,
  details TEXT,
  contacted BOOLEAN DEFAULT FALSE,
  contacted_at TIMESTAMPTZ,
  contacted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_email ON public.hiring_enquiries(email);
CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_created_at ON public.hiring_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_contacted ON public.hiring_enquiries(contacted);
CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_roles ON public.hiring_enquiries USING GIN (roles);

ALTER TABLE public.hiring_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.hiring_enquiries;
CREATE POLICY "Allow public insert" ON public.hiring_enquiries
  FOR INSERT
  TO anon
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

-- ============================================================================
-- 3. CONTACTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  source TEXT NOT NULL,
  contacted BOOLEAN DEFAULT FALSE,
  contacted_at TIMESTAMPTZ,
  contacted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_contacted ON public.contacts(contacted);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON public.contacts(source);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.contacts;
CREATE POLICY "Allow public insert" ON public.contacts
  FOR INSERT
  TO anon
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
-- VERIFICATION QUERY
-- ============================================================================

-- Run this to verify all tables were created successfully:
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('talent_submissions', 'hiring_enquiries', 'contacts')
ORDER BY table_name;
