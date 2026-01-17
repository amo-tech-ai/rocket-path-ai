import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Database, Enums } from '@/integrations/supabase/types';

type StartupEvent = Database['public']['Tables']['startup_events']['Row'];
type StartupEventInsert = Database['public']['Tables']['startup_events']['Insert'];
type StartupEventUpdate = Database['public']['Tables']['startup_events']['Update'];
type EventSponsor = Database['public']['Tables']['event_sponsors']['Row'];
type EventVenue = Database['public']['Tables']['event_venues']['Row'];
type EventAttendee = Database['public']['Tables']['event_attendees']['Row'];
type EventAsset = Database['public']['Tables']['event_assets']['Row'];

type StartupEventStatus = Enums<'startup_event_status'>;
type StartupEventType = Enums<'startup_event_type'>;

export interface EventWithRelations extends StartupEvent {
  sponsors?: EventSponsor[];
  venues?: EventVenue[];
  attendees?: EventAttendee[];
  assets?: EventAsset[];
  attendee_count?: number;
  sponsor_count?: number;
}

export interface EventFilters {
  status?: StartupEventStatus[];
  event_type?: StartupEventType[];
  date_range?: 'upcoming' | 'past' | 'all';
  search?: string;
}

// Helper hook to get startup ID from profile
function useStartupId() {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['startup', profile?.org_id],
    queryFn: async () => {
      if (!profile?.org_id) return null;

      const { data, error } = await supabase
        .from('startups')
        .select('id')
        .eq('org_id', profile.org_id)
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching startup:', error);
        return null;
      }
      return data?.id || null;
    },
    enabled: !!profile?.org_id,
  });
}

export function useEvents(filters?: EventFilters) {
  const { data: startupId } = useStartupId();

  return useQuery({
    queryKey: ['events', startupId, filters],
    queryFn: async () => {
      if (!startupId) return [];

      let query = supabase
        .from('startup_events')
        .select(`
          *,
          event_sponsors(id, status),
          event_attendees(id, rsvp_status)
        `)
        .eq('startup_id', startupId)
        .order('event_date', { ascending: true });

      // Apply status filter
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      // Apply event type filter
      if (filters?.event_type && filters.event_type.length > 0) {
        query = query.in('event_type', filters.event_type);
      }

      // Apply date range filter
      if (filters?.date_range === 'upcoming') {
        query = query.gte('event_date', new Date().toISOString());
      } else if (filters?.date_range === 'past') {
        query = query.lt('event_date', new Date().toISOString());
      }

      // Apply search filter
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform data to include counts
      return (data || []).map((event: any) => ({
        ...event,
        attendee_count: event.event_attendees?.filter((a: any) => 
          ['registered', 'confirmed'].includes(a.rsvp_status)
        ).length || 0,
        sponsor_count: event.event_sponsors?.filter((s: any) => 
          s.status === 'confirmed'
        ).length || 0,
      })) as EventWithRelations[];
    },
    enabled: !!startupId,
  });
}

export function useEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from('startup_events')
        .select(`
          *,
          event_sponsors(*),
          event_venues(*),
          event_attendees(*),
          event_assets(*)
        `)
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return data as EventWithRelations;
    },
    enabled: !!eventId,
  });
}

export function useEventStats() {
  const { data: startupId } = useStartupId();

  return useQuery({
    queryKey: ['event-stats', startupId],
    queryFn: async () => {
      if (!startupId) return null;

      const now = new Date().toISOString();
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get all events
      const { data: events, error } = await supabase
        .from('startup_events')
        .select('id, event_date, status')
        .eq('startup_id', startupId);

      if (error) throw error;

      const today = new Date().toDateString();
      
      return {
        total: events?.length || 0,
        upcoming: events?.filter(e => e.event_date && new Date(e.event_date) > new Date()).length || 0,
        today: events?.filter(e => e.event_date && new Date(e.event_date).toDateString() === today).length || 0,
        thisWeek: events?.filter(e => e.event_date && new Date(e.event_date) >= new Date() && new Date(e.event_date) <= new Date(weekFromNow)).length || 0,
        draft: events?.filter(e => e.status === 'draft').length || 0,
        planning: events?.filter(e => e.status === 'planning').length || 0,
        confirmed: events?.filter(e => e.status === 'confirmed').length || 0,
        completed: events?.filter(e => e.status === 'completed').length || 0,
      };
    },
    enabled: !!startupId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { data: startupId } = useStartupId();

  return useMutation({
    mutationFn: async (event: Omit<StartupEventInsert, 'startup_id'>) => {
      if (!startupId) throw new Error('No startup selected');

      const { data, error } = await supabase
        .from('startup_events')
        .insert({ ...event, startup_id: startupId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-stats'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: StartupEventUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('startup_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
      queryClient.invalidateQueries({ queryKey: ['event-stats'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('startup_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-stats'] });
    },
  });
}

// Event Sponsors
export function useEventSponsors(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-sponsors', eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_sponsors')
        .select('*')
        .eq('startup_event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EventSponsor[];
    },
    enabled: !!eventId,
  });
}

// Event Attendees
export function useEventAttendees(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('startup_event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EventAttendee[];
    },
    enabled: !!eventId,
  });
}

// Event Venues
export function useEventVenues(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-venues', eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_venues')
        .select('*')
        .eq('startup_event_id', eventId)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data as EventVenue[];
    },
    enabled: !!eventId,
  });
}

// Event Assets (Marketing)
export function useEventAssets(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-assets', eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_assets')
        .select('*')
        .eq('startup_event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EventAsset[];
    },
    enabled: !!eventId,
  });
}
