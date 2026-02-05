-- =============================================================================
-- Migration: Allow critic_reviews without validation_report_id (standalone critic)
-- Purpose: critic action can be called without a prior quick/deep report; allow
--          validation_report_id to be null so standalone critic runs can persist.
-- =============================================================================

alter table public.critic_reviews
  alter column validation_report_id drop not null;

alter table public.critic_reviews
  add column if not exists user_id uuid references auth.users(id);

comment on column public.critic_reviews.validation_report_id is 'Optional: link to validation report when critic run after quick/deep; null when critic run standalone';
comment on column public.critic_reviews.user_id is 'Owner when run standalone (validation_report_id null); used for RLS';

create index if not exists idx_critic_reviews_user on public.critic_reviews(user_id) where user_id is not null;

-- RLS: insert standalone (user_id = self, report null) or linked to own report
drop policy if exists "critic_reviews_insert_own" on public.critic_reviews;
create policy "critic_reviews_insert_own"
  on public.critic_reviews for insert
  with check (
    (validation_report_id is null and user_id = auth.uid())
    or validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );

-- RLS: select own (by user_id) or via validation report
drop policy if exists "critic_reviews_select_own" on public.critic_reviews;
create policy "critic_reviews_select_own"
  on public.critic_reviews for select
  using (
    user_id = auth.uid()
    or validation_report_id in (
      select id from public.validation_reports where user_id = auth.uid()
    )
  );
