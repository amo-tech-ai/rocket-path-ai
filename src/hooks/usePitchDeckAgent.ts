/**
 * Pitch Deck Agent Hook
 * Integrates frontend with pitch-deck-agent edge function
 * Provides typed actions for deck generation, refinement, and AI features
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { withRetry, getUserFriendlyError } from '@/lib/errorHandling';
import { useToast } from '@/hooks/use-toast';

// Types
export interface GenerateDeckParams {
  template: string;
  startup_data?: Record<string, unknown>;
  wizard_data?: {
    deck_id?: string;
    selected_industry?: string;
  };
  customizations?: Record<string, unknown>;
}

export interface GenerateDeckResult {
  id: string;
  title: string;
  template: string;
  slides: Array<{
    id: string;
    slide_number: number;
    title: string;
    content: Record<string, unknown>;
  }>;
  total_slides: number;
  saved_slides: number;
}

export interface SaveWizardStepParams {
  deck_id?: string;
  step: number;
  step_data: Record<string, unknown>;
  selected_industry?: string;
  template_selected?: string;
}

export interface RefineSlideParams {
  slide_content: string;
  feedback?: string;
  improvement_type?: string;
}

export interface GenerateSlideImageParams {
  slide_id: string;
  prompt: string;
  style?: string;
}

export interface ScoreSlideParams {
  slide_content: string;
  slide_type: string;
}

export interface ResearchMarketParams {
  industry: string;
  market_segment?: string;
}

export interface ApplySuggestionParams {
  suggestion_id: string;
  slide_id: string;
}

/**
 * Invoke pitch-deck-agent edge function with JWT auth
 */
async function invokePitchDeckAgent<T>(body: Record<string, unknown>): Promise<T> {
  return withRetry(async () => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession();
      
      if (refreshError || !refreshedSession?.access_token) {
        throw new Error('No active Supabase session. Please sign in.');
      }

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body,
        headers: {
          Authorization: `Bearer ${refreshedSession.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(getUserFriendlyError(response.error));
      }
      return response.data as T;
    }

    const response = await supabase.functions.invoke('pitch-deck-agent', {
      body,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (response.error) {
      throw new Error(getUserFriendlyError(response.error));
    }
    return response.data as T;
  });
}

/**
 * Hook for pitch deck agent operations
 */
export function usePitchDeckAgent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate deck
  const generateDeck = useMutation({
    mutationFn: (params: GenerateDeckParams): Promise<GenerateDeckResult> =>
      invokePitchDeckAgent<GenerateDeckResult>({
        action: 'generate_deck',
        ...params,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pitch-decks'] });
      queryClient.invalidateQueries({ queryKey: ['pitch-deck', data.id] });
      toast({
        title: 'Deck generated',
        description: `Created ${data.saved_slides} slides`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Generation failed',
        description: getUserFriendlyError(error),
        variant: 'destructive',
      });
    },
  });

  // Save wizard step
  const saveWizardStep = useMutation({
    mutationFn: (params: SaveWizardStepParams) =>
      invokePitchDeckAgent({
        action: 'save_wizard_step',
        ...params,
      }),
    onSuccess: (data: { deck_id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['pitch-deck-wizard', data.deck_id] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to save',
        description: getUserFriendlyError(error),
        variant: 'destructive',
      });
    },
  });

  // Resume wizard
  const resumeWizard = useQuery({
    queryKey: ['pitch-deck-wizard', 'resume'],
    queryFn: async (): Promise<{ deck_id: string; wizard_data: Record<string, unknown> | null } | null> => {
      // This would be called with deck_id from component
      return null;
    },
    enabled: false,
  });

  // Refine slide
  const refineSlide = useMutation({
    mutationFn: (params: RefineSlideParams) =>
      invokePitchDeckAgent({
        action: 'refine_slide',
        ...params,
      }),
    onSuccess: () => {
      toast({
        title: 'Slide refined',
        description: 'Content has been improved',
      });
    },
    onError: (error) => {
      toast({
        title: 'Refinement failed',
        description: getUserFriendlyError(error),
        variant: 'destructive',
      });
    },
  });

  // Generate slide image
  const generateSlideImage = useMutation({
    mutationFn: (params: GenerateSlideImageParams) =>
      invokePitchDeckAgent<{ slide_id: string; image_url: string; mime_type: string }>({
        action: 'generate_slide_image',
        ...params,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pitch-deck-slide', data.slide_id] });
      toast({
        title: 'Image generated',
        description: 'Slide image created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Image generation failed',
        description: getUserFriendlyError(error),
        variant: 'destructive',
      });
    },
  });

  // Score slide
  const scoreSlide = useMutation({
    mutationFn: (params: ScoreSlideParams) =>
      invokePitchDeckAgent({
        action: 'score_slide',
        ...params,
      }),
  });

  // Research market
  const researchMarket = useMutation({
    mutationFn: (params: ResearchMarketParams) =>
      invokePitchDeckAgent({
        action: 'research_market',
        ...params,
      }),
  });

  // Apply suggestion
  const applySuggestion = useMutation({
    mutationFn: (params: ApplySuggestionParams) =>
      invokePitchDeckAgent({
        action: 'apply_suggestion',
        ...params,
      }),
    onSuccess: (data: { suggestion_id: string; applied: boolean }) => {
      queryClient.invalidateQueries({ queryKey: ['pitch-deck-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['pitch-deck', 'signal-strength'] });
      toast({
        title: 'Suggestion applied',
        description: 'AI suggestion has been applied to the slide',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to apply suggestion',
        description: getUserFriendlyError(error),
        variant: 'destructive',
      });
    },
  });

  // Update signal strength
  const updateSignalStrength = useMutation({
    mutationFn: (deckId: string) =>
      invokePitchDeckAgent<{ deck_id: string; signal_strength: number; signal_breakdown: Record<string, number> }>({
        action: 'update_signal_strength',
        deck_id: deckId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pitch-deck', 'signal-strength'] });
    },
  });

  // Create version snapshot
  const createVersionSnapshot = useMutation({
    mutationFn: (params: { deck_id: string; change_summary?: string }) =>
      invokePitchDeckAgent({
        action: 'create_version_snapshot',
        ...params,
      }),
    onSuccess: () => {
      toast({
        title: 'Version saved',
        description: 'Deck version has been saved',
      });
    },
  });

  // Restore from version
  const restoreFromVersion = useMutation({
    mutationFn: (params: { deck_id: string; version_id: string }) =>
      invokePitchDeckAgent({
        action: 'restore_from_version',
        ...params,
      }),
    onSuccess: (data: { restored: boolean }) => {
      if (data.restored) {
        queryClient.invalidateQueries({ queryKey: ['pitch-deck'] });
        toast({
          title: 'Version restored',
          description: 'Deck has been restored from version',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Restore failed',
        description: getUserFriendlyError(error),
        variant: 'destructive',
      });
    },
  });

  // Extract URL context
  const extractUrlContext = useMutation({
    mutationFn: (url: string) =>
      invokePitchDeckAgent({
        action: 'extract_url_context',
        url,
      }),
  });

  // Recommend template
  const recommendTemplate = useMutation({
    mutationFn: (params: { industry: string; stage: string; audience: string }) =>
      invokePitchDeckAgent({
        action: 'recommend_template',
        ...params,
      }),
  });

  return {
    // Mutations
    generateDeck: generateDeck.mutateAsync,
    saveWizardStep: saveWizardStep.mutateAsync,
    refineSlide: refineSlide.mutateAsync,
    generateSlideImage: generateSlideImage.mutateAsync,
    scoreSlide: scoreSlide.mutateAsync,
    researchMarket: researchMarket.mutateAsync,
    applySuggestion: applySuggestion.mutateAsync,
    updateSignalStrength: updateSignalStrength.mutateAsync,
    createVersionSnapshot: createVersionSnapshot.mutateAsync,
    restoreFromVersion: restoreFromVersion.mutateAsync,
    extractUrlContext: extractUrlContext.mutateAsync,
    recommendTemplate: recommendTemplate.mutateAsync,

    // Loading states
    isGenerating: generateDeck.isPending,
    isSavingWizard: saveWizardStep.isPending,
    isRefining: refineSlide.isPending,
    isGeneratingImage: generateSlideImage.isPending,
    isScoring: scoreSlide.isPending,
    isResearching: researchMarket.isPending,
    isApplyingSuggestion: applySuggestion.isPending,
    isUpdatingSignal: updateSignalStrength.isPending,
    isCreatingVersion: createVersionSnapshot.isPending,
    isRestoring: restoreFromVersion.isPending,
    isExtractingUrl: extractUrlContext.isPending,
    isRecommendingTemplate: recommendTemplate.isPending,

    // Errors
    generateError: generateDeck.error,
    refineError: refineSlide.error,
    imageError: generateSlideImage.error,
  };
}
