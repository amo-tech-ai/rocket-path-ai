import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Contact = Tables<'contacts'>;
export type Deal = Tables<'deals'>;
export type NewContact = TablesInsert<'contacts'>;
export type UpdateContact = TablesUpdate<'contacts'>;
export type NewDeal = TablesInsert<'deals'>;
export type UpdateDeal = TablesUpdate<'deals'>;

// Contact types
export const CONTACT_TYPES = [
  { value: 'investor', label: 'Investor' },
  { value: 'customer', label: 'Customer' },
  { value: 'partner', label: 'Partner' },
  { value: 'advisor', label: 'Advisor' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'other', label: 'Other' },
] as const;

// Relationship strength
export const RELATIONSHIP_STRENGTH = [
  { value: 'cold', label: 'Cold', color: 'bg-muted-foreground' },
  { value: 'warm', label: 'Warm', color: 'bg-warm-foreground' },
  { value: 'hot', label: 'Hot', color: 'bg-sage' },
] as const;

// Deal stages
export const DEAL_STAGES = [
  { value: 'research', label: 'Research', color: 'bg-muted' },
  { value: 'outreach', label: 'Outreach', color: 'bg-secondary' },
  { value: 'meeting', label: 'Meeting', color: 'bg-warm' },
  { value: 'due_diligence', label: 'Due Diligence', color: 'bg-sage-light' },
  { value: 'termsheet', label: 'Term Sheet', color: 'bg-sage/50' },
  { value: 'closed_won', label: 'Closed Won', color: 'bg-sage' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'bg-destructive/20' },
] as const;

// Fetch all contacts
export function useContacts(startupId: string | undefined) {
  return useQuery({
    queryKey: ['contacts', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null)
        .eq('startup_id', startupId)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });
}

// Fetch single contact with deals
export function useContact(contactId: string | undefined) {
  return useQuery({
    queryKey: ['contact', contactId],
    queryFn: async () => {
      if (!contactId) return null;
      
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .is('deleted_at', null)
        .eq('id', contactId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contactId,
  });
}

// Fetch all deals
export function useDeals(startupId: string | undefined) {
  return useQuery({
    queryKey: ['deals', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          contact:contacts(id, name, email, company)
        `)
        .is('deleted_at', null)
        .eq('startup_id', startupId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });
}

// Create contact
export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: NewContact) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Update contact
export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateContact }) => {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact', data.id] });
    },
  });
}

// Delete contact
export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Create deal
export function useCreateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (deal: NewDeal) => {
      const { data, error } = await supabase
        .from('deals')
        .insert(deal)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

// Update deal
export function useUpdateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateDeal }) => {
      const { data, error } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

// Delete deal
export function useDeleteDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

// Format currency
export function formatDealAmount(amount: number | null): string {
  if (!amount) return '$0';
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}
