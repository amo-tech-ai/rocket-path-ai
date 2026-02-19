import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Document = Tables<'documents'>;
export type NewDocument = TablesInsert<'documents'>;
export type UpdateDocument = TablesUpdate<'documents'>;

// Fetch all documents for a startup
export function useDocuments(startupId: string | undefined) {
  return useQuery({
    queryKey: ['documents', startupId],
    queryFn: async () => {
      if (!startupId) return [];

      const { data, error } = await supabase
        .from('documents')
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

// Fetch single document
export function useDocument(documentId: string | undefined) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      if (!documentId) return null;

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .is('deleted_at', null)
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!documentId,
  });
}

// Create document
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document: NewDocument) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...document,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Update document
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateDocument }) => {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', data.id] });
    },
  });
}

// Delete document
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Document type options
export const DOCUMENT_TYPES = [
  { value: 'pitch_deck', label: 'Pitch Deck', icon: '📊' },
  { value: 'one_pager', label: 'One Pager', icon: '📄' },
  { value: 'memo', label: 'Investor Memo', icon: '📝' },
  { value: 'business_plan', label: 'Business Plan', icon: '📋' },
  { value: 'financial_model', label: 'Financial Model', icon: '💰' },
  { value: 'lean_canvas', label: 'Lean Canvas', icon: '🎯' },
  { value: 'gtm_strategy', label: 'GTM Strategy', icon: '🚀' },
  { value: 'product_spec', label: 'Product Spec', icon: '⚙️' },
  { value: 'meeting_notes', label: 'Meeting Notes', icon: '📅' },
  { value: 'other', label: 'Other', icon: '📁' },
] as const;

// Document status options
export const DOCUMENT_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-muted-foreground' },
  { value: 'in_review', label: 'In Review', color: 'bg-warm' },
  { value: 'approved', label: 'Approved', color: 'bg-sage' },
  { value: 'archived', label: 'Archived', color: 'bg-muted' },
] as const;
