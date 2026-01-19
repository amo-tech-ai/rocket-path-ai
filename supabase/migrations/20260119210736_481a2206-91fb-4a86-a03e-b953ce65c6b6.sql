-- Allow all authenticated users to view startup events for demo/discovery purposes
CREATE POLICY "authenticated users can view all events for demo" 
ON public.startup_events 
FOR SELECT 
TO authenticated
USING (true);

-- Also update existing events to be public for demo purposes
UPDATE public.startup_events SET is_public = true WHERE is_public IS NULL OR is_public = false;