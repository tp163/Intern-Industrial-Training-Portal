create table if not exists public.report_deadlines (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.users(id) on delete cascade,
  student_name text,
  month_number int not null,
  period text not null,
  due_date timestamptz not null,
  report_type text default 'Monthly Logbook',
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_report_deadlines_student_due
  on public.report_deadlines(student_id, due_date);

create unique index if not exists idx_report_deadlines_student_month
  on public.report_deadlines(student_id, month_number);
