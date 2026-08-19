-- Add all columns used by student logbook submissions. This is safe to run
-- against an older logbook_reports table because every column is conditional.
ALTER TABLE public.logbook_reports
  ADD COLUMN IF NOT EXISTS student_id uuid,
  ADD COLUMN IF NOT EXISTS student_name text,
  ADD COLUMN IF NOT EXISTS supervisor_id uuid,
  ADD COLUMN IF NOT EXISTS month_number int,
  ADD COLUMN IF NOT EXISTS period text,
  ADD COLUMN IF NOT EXISTS month_key text,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS excerpt text,
  ADD COLUMN IF NOT EXISTS pdf_url text,
  ADD COLUMN IF NOT EXISTS pdf_file_name text,
  ADD COLUMN IF NOT EXISTS feedback text,
  ADD COLUMN IF NOT EXISTS marks int,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_current boolean DEFAULT false;

NOTIFY pgrst, 'reload schema';
