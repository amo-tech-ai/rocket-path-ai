-- Add development policy to allow reading investors when user has no org (for demo/development)
CREATE POLICY "Dev: Allow read investors when no auth" 
  ON public.investors 
  FOR SELECT 
  USING ((user_org_id() IS NULL) OR startup_in_org(startup_id));