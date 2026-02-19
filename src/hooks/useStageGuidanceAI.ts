import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { StartupStage, Milestone } from './useStageGuidance';

export interface StageRecommendation {
  priority: 'high' | 'medium';
  action: string;
  category: 'discovery' | 'product' | 'growth' | 'fundraising';
  time_estimate?: string;
}

export interface StageGuidanceAIResponse {
  stage_assessment: string;
  primary_focus: string;
  recommendations: StageRecommendation[];
  templates: string[];
  encouragement: string;
}

export interface UseStageGuidanceAIResult {
  isLoading: boolean;
  error: string | null;
  guidance: StageGuidanceAIResponse | null;
  fetchGuidance: (stage: StartupStage, milestones: Milestone[], startupData: Record<string, unknown>) => Promise<void>;
}

export function useStageGuidanceAI(): UseStageGuidanceAIResult {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<StageGuidanceAIResponse | null>(null);

  const fetchGuidance = useCallback(async (
    stage: StartupStage,
    milestones: Milestone[],
    startupData: Record<string, unknown>
  ) => {
    if (!user) {
      setError('You must be logged in to get AI guidance');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: `Analyze my startup progress and provide personalized stage guidance`,
          action: 'stage_guidance',
          context: {
            screen: 'dashboard',
            data: {
              current_stage: stage,
              milestones: milestones.map(m => ({
                id: m.id,
                title: m.title,
                status: m.status,
                progress: m.progress,
                target: m.target,
              })),
              completed_milestones: milestones.filter(m => m.status === 'completed').length,
              total_milestones: milestones.length,
              ...startupData,
            }
          }
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      // Parse the AI response - it may be in the response field as a JSON string
      const responseText = data?.response || data?.message || '';
      
      // Try to extract JSON from the response
      let parsedGuidance: StageGuidanceAIResponse;
      
      try {
        // First try direct JSON parse
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedGuidance = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback to structured response from text
          parsedGuidance = {
            stage_assessment: responseText.slice(0, 200),
            primary_focus: 'Continue making progress on your current milestones',
            recommendations: [
              { priority: 'high', action: 'Focus on completing your next milestone', category: 'product' }
            ],
            templates: [],
            encouragement: 'Keep up the great work!'
          };
        }
      } catch {
        // If parsing fails, create a structured response from the text
        parsedGuidance = {
          stage_assessment: responseText.slice(0, 200),
          primary_focus: 'Continue making progress on your current milestones',
          recommendations: [
            { priority: 'high', action: 'Focus on completing your next milestone', category: 'product' }
          ],
          templates: [],
          encouragement: 'Keep up the great work!'
        };
      }

      setGuidance(parsedGuidance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI guidance';
      setError(errorMessage);
      console.error('Stage Guidance AI error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    error,
    guidance,
    fetchGuidance,
  };
}
