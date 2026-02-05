import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Startup = Tables<'startups'>;
export type Project = Tables<'projects'>;
export type Task = Tables<'tasks'>;
export type Deal = Tables<'deals'>;

// Fetch user's startup via proper user isolation
export function useStartup() {
  return useQuery({
    queryKey: ['startup'],
    queryFn: async () => {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return null;
      
      // First try: Get startup via wizard session (most reliable for onboarded users)
      // Order by updated_at DESC to get the most recent completed session
      const { data: session } = await supabase
        .from('wizard_sessions')
        .select('startup_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('startup_id', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (session?.startup_id) {
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('id', session.startup_id)
          .single();
        if (!error && data) return data;
      }
      
      // Second try: Get startup via profile org_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profile?.org_id) {
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('org_id', profile.org_id)
          .maybeSingle();
        if (!error) return data;
      }
      
      return null;
    },
  });
}

// Fetch projects for a startup
export function useProjects(startupId: string | undefined) {
  return useQuery({
    queryKey: ['projects', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('startup_id', startupId)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });
}

// Fetch tasks (today's priorities)
export function useTasks(startupId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(name)
        `)
        .eq('startup_id', startupId)
        .in('priority', ['high', 'urgent'])
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });
}

// Fetch all tasks count by status
export function useTaskStats(startupId: string | undefined) {
  return useQuery({
    queryKey: ['task-stats', startupId],
    queryFn: async () => {
      if (!startupId) return { total: 0, completed: 0, pending: 0 };
      
      const { data, error } = await supabase
        .from('tasks')
        .select('status')
        .eq('startup_id', startupId);
      
      if (error) throw error;
      
      const tasks = data || [];
      return {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
      };
    },
    enabled: !!startupId,
  });
}

// Fetch deals for pipeline value
export function useDeals(startupId: string | undefined) {
  return useQuery({
    queryKey: ['deals', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('startup_id', startupId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });
}

// Calculate key metrics from startup data
export function useKeyMetrics(startup: Startup | null | undefined) {
  const traction = startup?.traction_data as {
    mrr?: number;
    arr?: number;
    users?: number;
    customers?: number;
    growth_rate_monthly?: number;
  } | null;

  return {
    mrr: traction?.mrr || 0,
    arr: traction?.arr || 0,
    users: traction?.users || 0,
    customers: traction?.customers || 0,
    growthRate: traction?.growth_rate_monthly || 0,
    teamSize: startup?.team_size || 0,
    isRaising: startup?.is_raising || false,
    raiseAmount: startup?.raise_amount || 0,
  };
}

// Format currency for display
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount}`;
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
