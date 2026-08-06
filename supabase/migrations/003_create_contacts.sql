-- Create contacts table (renamed from contact_submissions)
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);

-- Create index on contacted for filtering
CREATE INDEX IF NOT EXISTS idx_contacts_contacted ON public.contacts(contacted);

-- Create index on source for analytics
CREATE INDEX IF NOT EXISTS idx_contacts_source ON public.contacts(source);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for public form submissions)
CREATE POLICY "Allow public insert" ON public.contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated read" ON public.contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated updates (for marking as contacted)
CREATE POLICY "Allow authenticated update" ON public.contacts
  FOR UPDATE
  TO authenticated
  USING (true);

-- Grant permissions
GRANT INSERT ON public.contacts TO anon;
GRANT SELECT, UPDATE ON public.contacts TO authenticated;
