import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types for the events_directory view
export interface PublicEvent {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  display_location: string | null;
  event_type: string;
  status: string;
  event_source: 'hosted' | 'industry';
  event_scope: string | null;
  startup_id: string | null;
  capacity: number | null;
  budget: number | null;
  ticket_price: number | null;
  startup_relevance: number | null;
  ticket_cost_tier: 'free' | 'low' | 'medium' | 'high' | 'premium' | null;
  ticket_cost_min: number | null;
  ticket_cost_max: number | null;
  external_url: string | null;
  registration_url: string | null;
  categories: string[] | null;
  topics: string[] | null;
  slug: string | null;
  tags: string[] | null;
  cover_image_url: string | null;
  organizer_name: string | null;
  is_public: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface PublicEventFilters {
  event_source?: 'all' | 'hosted' | 'industry';
  date_range?: 'upcoming' | 'past' | 'all' | 'this_week' | 'this_month' | 'next_3_months';
  event_type?: string[];
  search?: string;
  startup_relevance?: number;
  ticket_cost_tier?: string[];
}

export function usePublicEvents(filters?: PublicEventFilters) {
  return useQuery({
    queryKey: ['public-events', filters],
    queryFn: async () => {
      // Query the events_directory view
      let query = supabase
        .from('events_directory' as any)
        .select('*')
        .eq('is_public', true)
        .order('start_date', { ascending: true });

      // Apply event source filter
      if (filters?.event_source && filters.event_source !== 'all') {
        query = query.eq('event_source', filters.event_source);
      }

      // Apply date range filter
      const now = new Date().toISOString();
      if (filters?.date_range === 'upcoming') {
        query = query.gte('start_date', now);
      } else if (filters?.date_range === 'past') {
        query = query.lt('start_date', now);
      } else if (filters?.date_range === 'this_week') {
        const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('start_date', now).lte('start_date', weekFromNow);
      } else if (filters?.date_range === 'this_month') {
        const monthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('start_date', now).lte('start_date', monthFromNow);
      } else if (filters?.date_range === 'next_3_months') {
        const threeMonthsFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('start_date', now).lte('start_date', threeMonthsFromNow);
      }

      // Apply event type filter
      if (filters?.event_type && filters.event_type.length > 0) {
        query = query.in('event_type', filters.event_type);
      }

      // Apply search filter
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply ticket cost tier filter for industry events
      if (filters?.ticket_cost_tier && filters.ticket_cost_tier.length > 0) {
        query = query.in('ticket_cost_tier', filters.ticket_cost_tier);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching public events:', error);
        throw error;
      }

      return (data || []) as unknown as PublicEvent[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function usePublicEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: ['public-event', eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from('events_directory' as any)
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching public event:', error);
        throw error;
      }

      return data as unknown as PublicEvent;
    },
    enabled: !!eventId,
  });
}

export function usePublicEventStats() {
  return useQuery({
    queryKey: ['public-event-stats'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('events_directory' as any)
        .select('id, start_date, event_source')
        .eq('is_public', true);

      if (error) {
        console.error('Error fetching public event stats:', error);
        throw error;
      }

      const events = data || [];
      const today = new Date().toDateString();

      return {
        total: events.length,
        hosted: events.filter((e: any) => e.event_source === 'hosted').length,
        industry: events.filter((e: any) => e.event_source === 'industry').length,
        upcoming: events.filter((e: any) => new Date(e.start_date) > new Date()).length,
        today: events.filter((e: any) => new Date(e.start_date).toDateString() === today).length,
        thisWeek: events.filter((e: any) => 
          new Date(e.start_date) >= new Date() && 
          new Date(e.start_date) <= new Date(weekFromNow)
        ).length,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}
