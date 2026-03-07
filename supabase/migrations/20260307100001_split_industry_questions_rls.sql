-- Split FOR ALL into granular RLS policies (best practice).
-- Table: industry_questions. Replaces single "Authenticated users can manage industry questions"
-- with separate select/insert/update/delete policies per .cursor/rules/supabase/supabase-create-rls-policies.mdc
-- SELECT already exists ("Anyone can view active industry questions"); we only replace the FOR ALL manage policy.

drop policy if exists "Authenticated users can manage industry questions" on public.industry_questions;

create policy "Authenticated users can insert industry questions"
  on public.industry_questions for insert to authenticated
  with check (true);

create policy "Authenticated users can update industry questions"
  on public.industry_questions for update to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete industry questions"
  on public.industry_questions for delete to authenticated
  using (true);
