import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesUpdate } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;
export type Startup = Tables<'startups'>;
export type Organization = Tables<'organizations'>;

// Fetch current user's profile
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: TablesUpdate<'profiles'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Fetch user's startup (fallback to first available startup for demo)
export function useUserStartup() {
  return useQuery({
    queryKey: ['user-startup'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Try to get startup via user's org first
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.org_id) {
          const { data: startup } = await supabase
            .from('startups')
            .select('*')
            .is('deleted_at', null)
            .eq('org_id', profile.org_id)
            .maybeSingle();

          if (startup) return startup;
        }
      }

      // Fallback: Get first available startup (for demo/development)
      const { data: fallbackStartup, error } = await supabase
        .from('startups')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return fallbackStartup;
    },
  });
}

// Update startup
export function useUpdateStartup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'startups'> }) => {
      const { data, error } = await supabase
        .from('startups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-startup'] });
      queryClient.invalidateQueries({ queryKey: ['startup'] });
    },
  });
}

// Fetch organization
export function useOrganization() {
  return useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) return null;

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.org_id)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// Update organization
export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'organizations'> }) => {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
    },
  });
}

// Fetch org members
export function useOrgMembers() {
  return useQuery({
    queryKey: ['org-members'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) return [];

      const { data, error } = await supabase
        .from('org_members')
        .select(`
          *,
          user:profiles(id, full_name, email, avatar_url)
        `)
        .eq('org_id', profile.org_id);

      if (error) throw error;
      return data || [];
    },
  });
}

// Stage options for startups
export const STARTUP_STAGES = [
  { value: 'idea', label: 'Idea' },
  { value: 'pre_seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series_a', label: 'Series A' },
  { value: 'series_b', label: 'Series B' },
  { value: 'series_c', label: 'Series C+' },
  { value: 'growth', label: 'Growth' },
] as const;

// Industry options
export const INDUSTRIES = [
  { value: 'saas', label: 'SaaS' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'healthtech', label: 'HealthTech' },
  { value: 'edtech', label: 'EdTech' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'ai_ml', label: 'AI/ML' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'consumer', label: 'Consumer' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'biotech', label: 'BioTech' },
  { value: 'cleantech', label: 'CleanTech' },
  { value: 'other', label: 'Other' },
] as const;
