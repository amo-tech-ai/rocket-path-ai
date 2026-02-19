-- Allow authenticated users to view child event tables for demo purposes
CREATE POLICY "authenticated users can view all event attendees for demo" 
ON public.event_attendees 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "authenticated users can view all event sponsors for demo" 
ON public.event_sponsors 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "authenticated users can view all event venues for demo" 
ON public.event_venues 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "authenticated users can view all event assets for demo" 
ON public.event_assets 
FOR SELECT 
TO authenticated
USING (true);