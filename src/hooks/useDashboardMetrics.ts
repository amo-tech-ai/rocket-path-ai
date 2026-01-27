import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardMetrics {
  decksCount: number;
  investorsCount: number;
  tasksCount: number;
  eventsCount: number;
  documentsCount: number;
  contactsCount: number;
  dealsCount: number;
  projectsCount: number;
}

export interface MetricChanges {
  decks: number;
  investors: number;
  tasks: number;
  events: number;
}

// Fetch all dashboard metrics in a single optimized query
export function useDashboardMetrics(startupId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard-metrics', startupId],
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!startupId) {
        return {
          decksCount: 0,
          investorsCount: 0,
          tasksCount: 0,
          eventsCount: 0,
          documentsCount: 0,
          contactsCount: 0,
          dealsCount: 0,
          projectsCount: 0,
        };
      }

      // Run all queries in parallel for efficiency
      const [
        pitchDecksResult,
        investorsResult,
        tasksResult,
        eventsResult,
        documentsResult,
        contactsResult,
        dealsResult,
        projectsResult,
      ] = await Promise.all([
        // Pitch decks count
        supabase
          .from('pitch_decks')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId),
        
        // Investors count
        supabase
          .from('investors')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId),
        
        // Pending tasks count (not completed)
        supabase
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId)
          .neq('status', 'completed'),
        
        // Upcoming events count (from today onwards)
        supabase
          .from('events')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId)
          .gte('start_date', new Date().toISOString().split('T')[0]),
        
        // Documents count
        supabase
          .from('documents')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId),
        
        // Contacts count
        supabase
          .from('contacts')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId),
        
        // Active deals count
        supabase
          .from('deals')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId)
          .eq('is_active', true),
        
        // Active projects count
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId)
          .eq('status', 'active'),
      ]);

      return {
        decksCount: pitchDecksResult.count || 0,
        investorsCount: investorsResult.count || 0,
        tasksCount: tasksResult.count || 0,
        eventsCount: eventsResult.count || 0,
        documentsCount: documentsResult.count || 0,
        contactsCount: contactsResult.count || 0,
        dealsCount: dealsResult.count || 0,
        projectsCount: projectsResult.count || 0,
      };
    },
    enabled: !!startupId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Calculate week-over-week changes
export function useMetricChanges(startupId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard-metric-changes', startupId],
    queryFn: async (): Promise<MetricChanges> => {
      if (!startupId) {
        return { decks: 0, investors: 0, tasks: 0, events: 0 };
      }

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekAgoISO = oneWeekAgo.toISOString();

      const [
        newDecks,
        newInvestors,
        newTasks,
        newEvents,
      ] = await Promise.all([
        // New pitch decks this week
        supabase
          .from('pitch_decks')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId)
          .gte('created_at', weekAgoISO),
        
        // New investors this week
        supabase
          .from('investors')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId)
          .gte('created_at', weekAgoISO),
        
        // Completed tasks this week
        supabase
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId)
          .eq('status', 'completed')
          .gte('updated_at', weekAgoISO),
        
        // New events this week
        supabase
          .from('events')
          .select('id', { count: 'exact', head: true })
          .eq('startup_id', startupId)
          .gte('created_at', weekAgoISO),
      ]);

      return {
        decks: newDecks.count || 0,
        investors: newInvestors.count || 0,
        tasks: newTasks.count || 0,
        events: newEvents.count || 0,
      };
    },
    enabled: !!startupId,
    staleTime: 60 * 1000, // 1 minute
  });
}
