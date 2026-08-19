alter table public.announcements
  add column if not exists attachment_url text;
