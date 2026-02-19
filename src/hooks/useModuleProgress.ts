/**
 * useModuleProgress Hook
 * Fetches progress data for all major modules (Canvas, Pitch, Tasks, CRM)
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ModuleProgressData {
  canvasProgress: number;
  pitchProgress: number;
  tasksCompleted: number;
  tasksTotal: number;
  activeDeals: number;
}

export function useModuleProgress(startupId?: string) {
  return useQuery({
    queryKey: ['module-progress', startupId],
    queryFn: async (): Promise<ModuleProgressData> => {
      if (!startupId) {
        return {
          canvasProgress: 0,
          pitchProgress: 0,
          tasksCompleted: 0,
          tasksTotal: 0,
          activeDeals: 0,
        };
      }

      // Fetch all module data in parallel
      const [canvasResult, pitchResult, tasksResult, dealsResult] = await Promise.all([
        // Lean Canvas progress
        supabase
          .from('documents')
          .select('content_json')
          .is('deleted_at', null)
          .eq('startup_id', startupId)
          .eq('type', 'lean_canvas')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single(),
        
        // Pitch Deck progress
        supabase
          .from('documents')
          .select('content_json, metadata')
          .is('deleted_at', null)
          .eq('startup_id', startupId)
          .eq('type', 'pitch_deck')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single(),
        
        // Tasks progress
        supabase
          .from('tasks')
          .select('id, status')
          .is('deleted_at', null)
          .eq('startup_id', startupId),
        
        // Active deals
        supabase
          .from('deals')
          .select('id')
          .is('deleted_at', null)
          .eq('startup_id', startupId)
          .eq('is_active', true),
      ]);

      // Calculate canvas progress (based on filled boxes)
      let canvasProgress = 0;
      if (canvasResult.data?.content_json) {
        const canvas = canvasResult.data.content_json as Record<string, unknown>;
        const boxNames = [
          'problem', 'solution', 'unique_value', 'unfair_advantage',
          'customer_segments', 'key_metrics', 'channels', 'cost_structure', 'revenue_streams'
        ];
        const filledBoxes = boxNames.filter(box => {
          const value = canvas[box];
          return value && (Array.isArray(value) ? value.length > 0 : String(value).trim().length > 0);
        });
        canvasProgress = Math.round((filledBoxes.length / boxNames.length) * 100);
      }

      // Calculate pitch progress (based on slides)
      let pitchProgress = 0;
      if (pitchResult.data?.content_json) {
        const slides = (pitchResult.data.content_json as Record<string, unknown>)?.slides;
        if (Array.isArray(slides)) {
          const targetSlides = 10; // Standard pitch deck has 10 slides
          pitchProgress = Math.min(Math.round((slides.length / targetSlides) * 100), 100);
        }
      }

      // Calculate task stats
      const tasks = tasksResult.data || [];
      const tasksTotal = tasks.length;
      const tasksCompleted = tasks.filter(t => t.status === 'completed' || t.status === 'done').length;

      // Active deals count
      const activeDeals = dealsResult.data?.length || 0;

      return {
        canvasProgress,
        pitchProgress,
        tasksCompleted,
        tasksTotal,
        activeDeals,
      };
    },
    enabled: !!startupId,
    staleTime: 60000, // 1 minute
  });
}

export default useModuleProgress;
