-- Create hiring_enquiries table
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_email ON public.hiring_enquiries(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_created_at ON public.hiring_enquiries(created_at DESC);

-- Create index on contacted for filtering
CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_contacted ON public.hiring_enquiries(contacted);

-- Create GIN index on roles JSONB column for efficient queries
CREATE INDEX IF NOT EXISTS idx_hiring_enquiries_roles ON public.hiring_enquiries USING GIN (roles);

-- Enable Row Level Security (RLS)
ALTER TABLE public.hiring_enquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for public form submissions)
CREATE POLICY "Allow public insert" ON public.hiring_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated read" ON public.hiring_enquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated updates (for marking as contacted)
CREATE POLICY "Allow authenticated update" ON public.hiring_enquiries
  FOR UPDATE
  TO authenticated
  USING (true);

-- Grant permissions
GRANT INSERT ON public.hiring_enquiries TO anon;
GRANT SELECT, UPDATE ON public.hiring_enquiries TO authenticated;
