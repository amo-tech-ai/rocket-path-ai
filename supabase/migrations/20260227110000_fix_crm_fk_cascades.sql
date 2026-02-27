-- CRM-P0-FIX: Fix bare FK cascades on created_by columns
-- Problem: NO ACTION blocks profile deletion if user created communications or contact tags
-- Fix: ON DELETE SET NULL — preserves records, clears creator reference

-- fix communications.created_by
alter table public.communications
    drop constraint if exists communications_created_by_fkey;
alter table public.communications
    add constraint communications_created_by_fkey
    foreign key (created_by) references public.profiles(id) on delete set null;

-- fix contact_tags.created_by
alter table public.contact_tags
    drop constraint if exists contact_tags_created_by_fkey;
alter table public.contact_tags
    add constraint contact_tags_created_by_fkey
    foreign key (created_by) references public.profiles(id) on delete set null;
