-- Allow an internship to be visible to multiple departments.
ALTER TABLE public.internships
  ADD COLUMN IF NOT EXISTS department_categories text[] DEFAULT NULL;

NOTIFY pgrst, 'reload schema';
