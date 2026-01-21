import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Database } from '@/integrations/supabase/types';

// Type definitions from the events table
type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];
// Use any for child tables to avoid type instantiation issues
type EventSponsor = any;
type EventVenue = any;
type EventAttendee = any;
type EventAsset = any;

// Use actual enum types from events table
type EventStatus = Event['status'];
type EventType = Event['event_type'];

export interface EventWithRelations extends Omit<Event, 'attendees'> {
  event_sponsors?: Array<{ id: string; status: string }>;
  event_venues?: Array<{ id: string; name: string; city?: string | null; is_primary?: boolean | null }>;
  event_attendees?: Array<{ id: string; rsvp_status: string }>;
  event_assets?: EventAsset[];
  sponsors?: EventSponsor[];
  venues?: EventVenue[];
  attendees?: EventAttendee[];
  assets?: EventAsset[];
  attendee_count?: number;
  sponsor_count?: number;
  primary_venue_name?: string;
}

export interface EventFilters {
  status?: string[];
  event_type?: string[];
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
  const { data: startupId, isLoading: startupLoading } = useStartupId();

  return useQuery({
    queryKey: ['events', startupId, filters],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select(`
          *,
          event_sponsors(id, status),
          event_attendees(id, rsvp_status),
          event_venues(id, name, city, is_primary)
        `)
        .order('start_date', { ascending: true });

      // Only filter by startup if we have one
      if (startupId) {
        query = query.eq('startup_id', startupId);
      }

      // Apply status filter
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status as EventStatus[]);
      }

      // Apply event type filter
      if (filters?.event_type && filters.event_type.length > 0) {
        query = query.in('event_type', filters.event_type as EventType[]);
      }

      // Apply date range filter
      if (filters?.date_range === 'upcoming') {
        query = query.gte('start_date', new Date().toISOString());
      } else if (filters?.date_range === 'past') {
        query = query.lt('start_date', new Date().toISOString());
      }

      // Apply search filter
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform data to include counts and primary venue
      return (data || []).map((event: any) => {
        const primaryVenue = event.event_venues?.find((v: any) => v.is_primary) || event.event_venues?.[0];
        return {
          ...event,
          attendee_count: event.event_attendees?.filter((a: any) => 
            ['registered', 'confirmed'].includes(a.rsvp_status)
          ).length || 0,
          sponsor_count: event.event_sponsors?.filter((s: any) => 
            s.status === 'confirmed'
          ).length || 0,
          venues: event.event_venues,
          primary_venue_name: primaryVenue?.name || primaryVenue?.city,
        };
      }) as EventWithRelations[];
    },
    // Enable even if no startupId - show all events user can see
    enabled: !startupLoading,
  });
}

export function useEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from('events')
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
      return data as unknown as EventWithRelations;
    },
    enabled: !!eventId,
  });
}

export function useEventStats() {
  const { data: startupId, isLoading: startupLoading } = useStartupId();

  return useQuery({
    queryKey: ['event-stats', startupId],
    queryFn: async () => {
      const now = new Date().toISOString();
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      let query = supabase
        .from('events')
        .select('id, start_date, status');

      // Only filter by startup if we have one
      if (startupId) {
        query = query.eq('startup_id', startupId);
      }

      const { data: events, error } = await query;

      if (error) throw error;

      const today = new Date().toDateString();
      
      return {
        total: events?.length || 0,
        upcoming: events?.filter(e => e.start_date && new Date(e.start_date) > new Date()).length || 0,
        today: events?.filter(e => e.start_date && new Date(e.start_date).toDateString() === today).length || 0,
        thisWeek: events?.filter(e => e.start_date && new Date(e.start_date) >= new Date() && new Date(e.start_date) <= new Date(weekFromNow)).length || 0,
        scheduled: events?.filter(e => e.status === 'scheduled').length || 0,
        in_progress: events?.filter(e => e.status === 'in_progress').length || 0,
        confirmed: events?.filter(e => e.status === 'scheduled').length || 0, // Map scheduled to confirmed for UI
        completed: events?.filter(e => e.status === 'completed').length || 0,
        draft: 0, // events table doesn't have draft status
        planning: 0, // events table doesn't have planning status
      };
    },
    enabled: !startupLoading,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { data: startupId } = useStartupId();

  return useMutation({
    mutationFn: async (event: Omit<EventInsert, 'startup_id'>) => {
      if (!startupId) throw new Error('No startup selected');

      const { data, error } = await supabase
        .from('events')
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
    mutationFn: async ({ id, ...updates }: EventUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('events')
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
        .from('events')
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
    queryFn: async (): Promise<EventSponsor[]> => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_sponsors' as any)
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as EventSponsor[];
    },
    enabled: !!eventId,
  });
}

// Event Attendees
export function useEventAttendees(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: async (): Promise<EventAttendee[]> => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_attendees' as any)
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as EventAttendee[];
    },
    enabled: !!eventId,
  });
}

// Event Venues
export function useEventVenues(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-venues', eventId],
    queryFn: async (): Promise<EventVenue[]> => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_venues' as any)
        .select('*')
        .eq('event_id', eventId)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return (data || []) as EventVenue[];
    },
    enabled: !!eventId,
  });
}

// Event Assets (Marketing)
export function useEventAssets(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-assets', eventId],
    queryFn: async (): Promise<EventAsset[]> => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('event_assets' as any)
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as EventAsset[];
    },
    enabled: !!eventId,
  });
}
