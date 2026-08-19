alter table public.applications
  add column if not exists student_id uuid references public.users(id),
  add column if not exists student_name text,
  add column if not exists internship_id uuid references public.internships(id),
  add column if not exists internship_title text,
  add column if not exists company_name text,
  add column if not exists status text default 'pending',
  add column if not exists applied_at timestamptz default now(),
  add column if not exists cover_letter text,
  add column if not exists cv_url text,
  add column if not exists document_url text,
  add column if not exists document_file_name text,
  add column if not exists document_path text;
