-- Add columns to support targeted student broadcasts
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS student_id uuid REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS student_ids uuid[] DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_personal boolean DEFAULT false;

-- The original target constraint did not include specific student broadcasts.
-- Recreate it so the target used by the admin/supervisor broadcast forms is
-- accepted by existing databases as well as new installations.
ALTER TABLE public.announcements
  DROP CONSTRAINT IF EXISTS announcements_target_check;

ALTER TABLE public.announcements
  ADD CONSTRAINT announcements_target_check CHECK (
    target IN ('all_students', 'supervisor_students', 'single_student', 'specific_students')
  );

-- Create index for faster filtering of announcements by student
CREATE INDEX IF NOT EXISTS idx_announcements_student_id ON public.announcements(student_id);

-- Ask PostgREST/Supabase to refresh its schema cache immediately after the
-- migration is run, so API inserts using student_ids work without a restart.
NOTIFY pgrst, 'reload schema';
