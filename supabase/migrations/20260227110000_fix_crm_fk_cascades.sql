-- CRM-P0-FIX: Fix bare FK cascades on created_by columns
-- Purpose: Allow profile deletion when user created communications or contact_tags.
-- Fix: ON DELETE SET NULL — preserves rows, clears creator reference.
-- Affected: public.communications.created_by, public.contact_tags.created_by
-- Idempotent: Only alters tables if they exist (safe for shadow DB / db pull).

do $$
begin
  -- communications: drop existing FK, add FK with ON DELETE SET NULL
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'communications'
  ) then
    alter table public.communications
      drop constraint if exists communications_created_by_fkey;
    alter table public.communications
      add constraint communications_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;

  -- contact_tags: drop existing FK, add FK with ON DELETE SET NULL
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'contact_tags'
  ) then
    alter table public.contact_tags
      drop constraint if exists contact_tags_created_by_fkey;
    alter table public.contact_tags
      add constraint contact_tags_created_by_fkey
      foreign key (created_by) references public.profiles(id) on delete set null;
  end if;
end
$$;
