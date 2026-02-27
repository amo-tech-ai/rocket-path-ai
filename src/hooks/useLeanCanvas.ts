import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface LeanCanvasBox {
  items: string[];
  validation?: 'valid' | 'warning' | 'error';
  validationMessage?: string;
}

export interface LeanCanvasData {
  problem: LeanCanvasBox;
  solution: LeanCanvasBox;
  uniqueValueProp: LeanCanvasBox;
  unfairAdvantage: LeanCanvasBox;
  customerSegments: LeanCanvasBox;
  keyMetrics: LeanCanvasBox;
  channels: LeanCanvasBox;
  costStructure: LeanCanvasBox;
  revenueStreams: LeanCanvasBox;
}

export const EMPTY_CANVAS: LeanCanvasData = {
  problem: { items: [] },
  solution: { items: [] },
  uniqueValueProp: { items: [] },
  unfairAdvantage: { items: [] },
  customerSegments: { items: [] },
  keyMetrics: { items: [] },
  channels: { items: [] },
  costStructure: { items: [] },
  revenueStreams: { items: [] },
};

export const CANVAS_BOX_CONFIG = [
  { key: 'problem' as const, title: 'Problem', description: 'Top 3 customer problems', placeholder: 'e.g., Freelancers waste 8+ hours/month on bookkeeping', row: 1, col: 1 },
  { key: 'solution' as const, title: 'Solution', description: 'Key features that solve problems', placeholder: 'e.g., AI-powered auto-categorization', row: 1, col: 2 },
  { key: 'uniqueValueProp' as const, title: 'Unique Value Proposition', description: 'Single compelling message', placeholder: 'e.g., The fastest way for freelancers to stay tax-ready', row: 1, col: 3 },
  { key: 'unfairAdvantage' as const, title: 'Unfair Advantage', description: "What can't be easily copied", placeholder: 'e.g., Proprietary AI tax classifier', row: 1, col: 4 },
  { key: 'customerSegments' as const, title: 'Customer Segments', description: 'Target customers and users', placeholder: 'e.g., Freelancers earning over $50k', row: 1, col: 5 },
  { key: 'keyMetrics' as const, title: 'Key Metrics', description: 'Numbers that matter', placeholder: 'e.g., Monthly Active Users, Retention (D30)', row: 2, col: 1 },
  { key: 'channels' as const, title: 'Channels', description: 'Path to customers', placeholder: 'e.g., TikTok influencer ads, LinkedIn content', row: 2, col: 2 },
  { key: 'costStructure' as const, title: 'Cost Structure', description: 'Fixed and variable costs', placeholder: 'e.g., Cloud compute, AI inference, Payroll', row: 3, col: 'left' },
  { key: 'revenueStreams' as const, title: 'Revenue Streams', description: 'Sources of revenue', placeholder: 'e.g., $15/mo subscriptions, Premium add-ons', row: 3, col: 'right' },
];

// Fetch canvas data from startup
export function useLeanCanvas(startupId: string | undefined) {
  return useQuery({
    queryKey: ['lean-canvas', startupId],
    queryFn: async () => {
      if (!startupId) return null;
      
      const { data: doc, error } = await supabase
        .from('documents')
        .select('*')
        .is('deleted_at', null)
        .eq('startup_id', startupId)
        .eq('type', 'lean_canvas')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (doc?.content_json) {
        return {
          id: doc.id,
          data: doc.content_json as unknown as LeanCanvasData,
          version: doc.version || 1,
          updatedAt: doc.updated_at,
        };
      }
      
      return null;
    },
    enabled: !!startupId,
  });
}

// Save canvas data
export function useSaveLeanCanvas() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ startupId, canvasData, existingId }: { startupId: string; canvasData: LeanCanvasData; existingId?: string }) => {
      if (existingId) {
        const { data, error } = await supabase
          .from('documents')
          .update({ content_json: canvasData as unknown as Json, updated_at: new Date().toISOString() })
          .eq('id', existingId)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('documents')
          .insert({ startup_id: startupId, type: 'lean_canvas', title: 'Lean Canvas', content_json: canvasData as unknown as Json, status: 'draft', version: 1 })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lean-canvas', variables.startupId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Pre-fill canvas from startup profile
export function usePreFillCanvas() {
  return useMutation({
    mutationFn: async (startupId: string) => {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: 'Pre-fill my Lean Canvas based on my startup profile. Return structured data for each of the 9 boxes.',
          action: 'extract_profile',
          context: { screen: 'lean-canvas', startup_id: startupId }
        }
      });
      if (error) throw error;
      return data;
    },
  });
}

// Validate canvas hypotheses
export function useValidateCanvas() {
  return useMutation({
    mutationFn: async ({ startupId, canvasData }: { startupId: string; canvasData: LeanCanvasData }) => {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: 'Validate my Lean Canvas hypotheses. Identify weak assumptions and suggest improvements.',
          action: 'chat',
          context: { screen: 'lean-canvas', startup_id: startupId, data: { canvas: canvasData } }
        }
      });
      if (error) throw error;
      return data;
    },
  });
}

// Generate canvas from a completed validation report
export function useGenerateCanvasFromReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, startupId, existingCanvasId }: {
      reportId: string;
      startupId: string;
      existingCanvasId?: string;
    }) => {
      // Call lean-canvas-agent with generate_from_report action
      const { data: result, error } = await supabase.functions.invoke('lean-canvas-agent', {
        body: {
          action: 'generate_from_report',
          report_id: reportId,
        }
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.message || result.error);

      const canvasData = result.canvas as LeanCanvasData;
      if (!canvasData) throw new Error('No canvas data returned');

      // Save the generated canvas
      if (existingCanvasId) {
        const { data: saved, error: saveError } = await supabase
          .from('documents')
          .update({
            content_json: canvasData as unknown as Json,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingCanvasId)
          .select()
          .single();
        if (saveError) throw saveError;
        return { document: saved, canvas: canvasData, summary: result.summary };
      } else {
        const { data: saved, error: saveError } = await supabase
          .from('documents')
          .insert({
            startup_id: startupId,
            type: 'lean_canvas',
            title: 'Lean Canvas',
            content_json: canvasData as unknown as Json,
            status: 'draft',
            version: 1,
          })
          .select()
          .single();
        if (saveError) throw saveError;
        return { document: saved, canvas: canvasData, summary: result.summary };
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lean-canvas', variables.startupId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
