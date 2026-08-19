-- Allow announcements to exist without a valid author_id.
-- Removes the NOT NULL constraint and the FK reference to users(id)
-- so broadcasts can be created even when the author is an admin
-- whose session ID is unavailable.

ALTER TABLE public.announcements
  ALTER COLUMN author_id DROP NOT NULL;

ALTER TABLE public.announcements
  DROP CONSTRAINT IF EXISTS announcements_author_id_fkey;
