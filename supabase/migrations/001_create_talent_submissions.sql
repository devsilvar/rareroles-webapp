-- Create talent_submissions table
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_talent_submissions_email ON public.talent_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_talent_submissions_created_at ON public.talent_submissions(created_at DESC);

-- Create index on contacted for filtering
CREATE INDEX IF NOT EXISTS idx_talent_submissions_contacted ON public.talent_submissions(contacted);

-- Enable Row Level Security (RLS)
ALTER TABLE public.talent_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for public form submissions)
CREATE POLICY "Allow public insert" ON public.talent_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated read" ON public.talent_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated updates (for marking as contacted)
CREATE POLICY "Allow authenticated update" ON public.talent_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Grant permissions
GRANT INSERT ON public.talent_submissions TO anon;
GRANT SELECT, UPDATE ON public.talent_submissions TO authenticated;
