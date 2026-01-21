import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { LeanCanvasData } from '@/types/canvas.types';

// Fetch canvas data from startup
export function useLeanCanvas(startupId: string | undefined) {
  return useQuery({
    queryKey: ['lean-canvas', startupId],
    queryFn: async () => {
      if (!startupId) return null;
      
      // Try to get from documents table first
      const { data: doc, error } = await supabase
        .from('documents')
        .select('*')
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
    mutationFn: async ({ 
      startupId, 
      canvasData, 
      existingId 
    }: { 
      startupId: string; 
      canvasData: LeanCanvasData; 
      existingId?: string;
    }) => {
      if (existingId) {
        const { data, error } = await supabase
          .from('documents')
          .update({
            content_json: canvasData as unknown as Json,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
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
          message: 'Pre-fill my Lean Canvas based on my startup profile. Return structured data for each of the 9 boxes: problem, solution, uniqueValueProp, unfairAdvantage, customerSegments, keyMetrics, channels, costStructure, revenueStreams. Each box should have an items array with 2-4 bullet points.',
          action: 'extract_profile',
          context: {
            screen: 'lean-canvas',
            startup_id: startupId,
          }
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
    mutationFn: async ({ 
      startupId, 
      canvasData 
    }: { 
      startupId: string; 
      canvasData: LeanCanvasData;
    }) => {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: 'Validate my Lean Canvas hypotheses. Identify weak assumptions, suggest improvements, and score each box.',
          action: 'chat',
          context: {
            screen: 'lean-canvas',
            startup_id: startupId,
            data: { canvas: canvasData }
          }
        }
      });

      if (error) throw error;
      return data;
    },
  });
}
