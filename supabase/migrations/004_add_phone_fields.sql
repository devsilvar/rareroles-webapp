-- ============================================================================
-- Migration: Add Phone Number Fields
-- Adds phone field to both talent_submissions and hiring_enquiries tables
-- ============================================================================

-- Add phone field to talent_submissions table
ALTER TABLE public.talent_submissions 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add phone field to hiring_enquiries table
ALTER TABLE public.hiring_enquiries 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add custom_role field to talent_submissions for custom role entries
ALTER TABLE public.talent_submissions 
ADD COLUMN IF NOT EXISTS custom_role TEXT;

-- Create indexes for phone fields for faster searching
CREATE INDEX IF NOT EXISTS idx_talent_submissions_phone ON public.talent_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_phone ON public.hiring_enquiries(phone);

-- Verification query
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('talent_submissions', 'hiring_enquiries')
  AND column_name IN ('phone', 'custom_role')
ORDER BY table_name, column_name;
