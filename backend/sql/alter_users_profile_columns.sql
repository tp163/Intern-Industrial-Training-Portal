-- Run this once in the Supabase SQL Editor for an existing project.
-- It adds the profile fields the frontend/backend already read and write.

alter table public.users add column if not exists student_id text;
alter table public.users add column if not exists faculty text;
alter table public.users add column if not exists program text;
alter table public.users add column if not exists year int;
alter table public.users add column if not exists gpa numeric;
alter table public.users add column if not exists department_code text;
alter table public.users add column if not exists batch text;
alter table public.users add column if not exists title text;
alter table public.users add column if not exists assigned_students int default 0;
alter table public.users add column if not exists supervisor_id uuid references public.users(id);
alter table public.users add column if not exists allocation_status text;
alter table public.users add column if not exists internship_status text;
alter table public.users add column if not exists internship_company text;
alter table public.users add column if not exists internship_role text;
alter table public.users add column if not exists cv_url text;
alter table public.users add column if not exists cv_file_name text;
alter table public.users add column if not exists permissions jsonb default '{}'::jsonb;

create unique index if not exists users_student_id_idx
  on public.users(student_id)
  where student_id is not null;
