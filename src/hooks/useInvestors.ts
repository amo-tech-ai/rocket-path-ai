import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export type Investor = {
  id: string;
  startup_id: string;
  name: string;
  firm_name: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  type: string | null;
  investment_focus: string[] | null;
  stage_focus: string[] | null;
  check_size_min: number | null;
  check_size_max: number | null;
  portfolio_companies: string[] | null;
  status: string | null;
  priority: string | null;
  warm_intro_from: string | null;
  first_contact_date: string | null;
  last_contact_date: string | null;
  next_follow_up: string | null;
  meetings_count: number | null;
  notes: string | null;
  tags: string[] | null;
  custom_fields: Json | null;
  created_at: string | null;
  updated_at: string | null;
};

export type InvestorInsert = Omit<Investor, 'id' | 'created_at' | 'updated_at'>;
export type InvestorUpdate = Partial<InvestorInsert>;

export const INVESTOR_STATUSES = [
  { value: 'researching', label: 'Researching', color: 'bg-slate-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-500' },
  { value: 'meeting_scheduled', label: 'Meeting Scheduled', color: 'bg-cyan-500' },
  { value: 'pitched', label: 'Pitched', color: 'bg-purple-500' },
  { value: 'due_diligence', label: 'Due Diligence', color: 'bg-amber-500' },
  { value: 'term_sheet', label: 'Term Sheet', color: 'bg-emerald-500' },
  { value: 'committed', label: 'Committed', color: 'bg-green-600' },
  { value: 'passed', label: 'Passed', color: 'bg-red-500' },
] as const;

export const INVESTOR_TYPES = [
  { value: 'vc', label: 'Venture Capital' },
  { value: 'angel', label: 'Angel Investor' },
  { value: 'family_office', label: 'Family Office' },
  { value: 'corporate', label: 'Corporate VC' },
  { value: 'accelerator', label: 'Accelerator' },
] as const;

export const INVESTOR_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-slate-500' },
  { value: 'medium', label: 'Medium', color: 'text-blue-500' },
  { value: 'high', label: 'High', color: 'text-amber-500' },
  { value: 'top', label: 'Top', color: 'text-red-500' },
] as const;

export function useInvestors(startupId: string | undefined) {
  return useQuery({
    queryKey: ['investors', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('startup_id', startupId)
        .order('priority', { ascending: false })
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Investor[];
    },
    enabled: !!startupId,
  });
}

export function useAllInvestors() {
  return useQuery({
    queryKey: ['investors', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .order('priority', { ascending: false })
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Investor[];
    },
  });
}

export function useCreateInvestor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (investor: InvestorInsert) => {
      const { data, error } = await supabase
        .from('investors')
        .insert([investor])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
      toast.success('Investor added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add investor: ' + error.message);
    },
  });
}

export function useUpdateInvestor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Omit<Investor, 'id' | 'created_at' | 'updated_at'>> & { id: string }) => {
      const { data, error } = await supabase
        .from('investors')
        .update(updates as Record<string, unknown>)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
      toast.success('Investor updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update investor: ' + error.message);
    },
  });
}

export function useUpdateInvestorStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('investors')
        .update({ status, last_contact_date: new Date().toISOString().split('T')[0] })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + error.message);
    },
  });
}

export function useDeleteInvestor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('investors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors'] });
      toast.success('Investor removed');
    },
    onError: (error) => {
      toast.error('Failed to remove investor: ' + error.message);
    },
  });
}

export function useStartupForInvestors() {
  return useQuery({
    queryKey: ['startup-for-investors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startups')
        .select('id, name, is_raising, raise_amount, valuation_cap, funding_rounds')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}
