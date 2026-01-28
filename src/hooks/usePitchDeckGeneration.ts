/**
 * usePitchDeckGeneration Hook
 * Manages pitch deck generation state with realtime progress updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type GenerationStep = {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration: number; // Expected duration in seconds
};

export type GenerationState = {
  isGenerating: boolean;
  currentStep: number;
  progress: number;
  steps: GenerationStep[];
  error: string | null;
  deckId: string | null;
  slideCount: number;
  startedAt: Date | null;
  completedAt: Date | null;
};

const DEFAULT_STEPS: GenerationStep[] = [
  {
    id: 1,
    key: 'understanding',
    title: 'Understanding your startup',
    description: 'Parsing inputs from wizard steps and industry context',
    icon: '🧠',
    status: 'pending',
    duration: 4,
  },
  {
    id: 2,
    key: 'researching',
    title: 'Researching your market',
    description: 'Industry benchmarks, comparable companies, market trends',
    icon: '📊',
    status: 'pending',
    duration: 6,
  },
  {
    id: 3,
    key: 'structuring',
    title: 'Structuring your story',
    description: 'Slide order, narrative flow, investor logic',
    icon: '🧩',
    status: 'pending',
    duration: 4,
  },
  {
    id: 4,
    key: 'designing',
    title: 'Designing your deck',
    description: 'Layouts, visual hierarchy, content density',
    icon: '🎨',
    status: 'pending',
    duration: 6,
  },
  {
    id: 5,
    key: 'finalizing',
    title: 'Finalizing slides',
    description: 'Metrics validation, language clarity, signal strength',
    icon: '✨',
    status: 'pending',
    duration: 4,
  },
];

const TOTAL_DURATION = DEFAULT_STEPS.reduce((sum, step) => sum + step.duration, 0);

export function usePitchDeckGeneration(deckId: string | undefined) {
  const navigate = useNavigate();
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    currentStep: 0,
    progress: 0,
    steps: DEFAULT_STEPS,
    error: null,
    deckId: deckId || null,
    slideCount: 0,
    startedAt: null,
    completedAt: null,
  });

  // Calculate progress based on current step
  const calculateProgress = useCallback((stepIndex: number, stepProgress: number = 0) => {
    let completedDuration = 0;
    for (let i = 0; i < stepIndex; i++) {
      completedDuration += DEFAULT_STEPS[i].duration;
    }
    const currentStepDuration = DEFAULT_STEPS[stepIndex]?.duration || 0;
    const totalProgress = completedDuration + (currentStepDuration * stepProgress);
    return Math.min(Math.round((totalProgress / TOTAL_DURATION) * 100), 100);
  }, []);

  // Update step status
  const updateStep = useCallback((stepIndex: number, status: GenerationStep['status']) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map((step, idx) => ({
        ...step,
        status: idx < stepIndex ? 'completed' : 
                idx === stepIndex ? status : 
                step.status,
      })),
      currentStep: stepIndex,
      progress: status === 'completed' 
        ? calculateProgress(stepIndex + 1)
        : calculateProgress(stepIndex, 0.5),
    }));
  }, [calculateProgress]);

  // Start generation
  const startGeneration = useCallback(async () => {
    if (!deckId) {
      toast.error('No deck ID provided');
      return;
    }

    setState(prev => ({
      ...prev,
      isGenerating: true,
      currentStep: 0,
      progress: 0,
      error: null,
      startedAt: new Date(),
      completedAt: null,
      steps: DEFAULT_STEPS.map(step => ({ ...step, status: 'pending' as const })),
    }));

    // Start the first step
    updateStep(0, 'active');

    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'generate_deck',
          deck_id: deckId,
          template: 'standard',
        },
      });

      if (error) throw error;

      // Mark all steps as completed
      setState(prev => ({
        ...prev,
        isGenerating: false,
        currentStep: 5,
        progress: 100,
        slideCount: data?.total_slides || 10,
        completedAt: new Date(),
        steps: prev.steps.map(step => ({ ...step, status: 'completed' as const })),
      }));

      toast.success('Your pitch deck is ready!');

      // Navigate to editor after a short delay
      setTimeout(() => {
        navigate(`/app/pitch-deck/${deckId}/edit`);
      }, 2000);

    } catch (error) {
      console.error('Generation error:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Generation failed',
        steps: prev.steps.map((step, idx) => ({
          ...step,
          status: idx === prev.currentStep ? 'error' : step.status,
        })),
      }));
      toast.error('Failed to generate deck');
    }
  }, [deckId, updateStep, navigate]);

  // Simulate progress while waiting for real updates
  useEffect(() => {
    if (!state.isGenerating || state.error) return;

    let stepIndex = 0;
    const stepDurations = DEFAULT_STEPS.map(s => s.duration * 1000);
    let accumulatedTime = 0;
    
    const interval = setInterval(() => {
      accumulatedTime += 500;
      
      // Calculate which step we should be on
      let timeCheck = 0;
      for (let i = 0; i < stepDurations.length; i++) {
        timeCheck += stepDurations[i];
        if (accumulatedTime < timeCheck) {
          stepIndex = i;
          break;
        }
        if (i === stepDurations.length - 1) {
          stepIndex = i;
        }
      }

      // Update progress
      const stepStartTime = stepDurations.slice(0, stepIndex).reduce((a, b) => a + b, 0);
      const stepProgress = Math.min((accumulatedTime - stepStartTime) / stepDurations[stepIndex], 1);
      
      setState(prev => {
        if (!prev.isGenerating) return prev;
        
        return {
          ...prev,
          currentStep: stepIndex,
          progress: calculateProgress(stepIndex, stepProgress),
          steps: prev.steps.map((step, idx) => ({
            ...step,
            status: idx < stepIndex ? 'completed' :
                    idx === stepIndex ? 'active' :
                    'pending',
          })),
        };
      });

      // Stop after max time (30s safety limit)
      if (accumulatedTime > 30000) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [state.isGenerating, state.error, calculateProgress]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!deckId) return;

    const channel = supabase
      .channel(`pitch_deck_generation:${deckId}`)
      .on('broadcast', { event: 'step_progress' }, ({ payload }) => {
        const { step, progress: stepProgress, message } = payload as {
          step: number;
          progress: number;
          message: string;
        };
        
        updateStep(step - 1, 'active');
        setState(prev => ({
          ...prev,
          progress: calculateProgress(step - 1, stepProgress / 100),
        }));
      })
      .on('broadcast', { event: 'step_complete' }, ({ payload }) => {
        const { step } = payload as { step: number };
        updateStep(step - 1, 'completed');
      })
      .on('broadcast', { event: 'generation_complete' }, ({ payload }) => {
        const { slide_count } = payload as { slide_count: number };
        setState(prev => ({
          ...prev,
          isGenerating: false,
          progress: 100,
          slideCount: slide_count,
          completedAt: new Date(),
          steps: prev.steps.map(step => ({ ...step, status: 'completed' as const })),
        }));
      })
      .on('broadcast', { event: 'generation_failed' }, ({ payload }) => {
        const { error } = payload as { error: string };
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error,
          steps: prev.steps.map((step, idx) => ({
            ...step,
            status: idx === prev.currentStep ? 'error' : step.status,
          })),
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deckId, updateStep, calculateProgress]);

  // Retry generation
  const retry = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      steps: DEFAULT_STEPS.map(step => ({ ...step, status: 'pending' as const })),
    }));
    startGeneration();
  }, [startGeneration]);

  // Cancel and go back
  const cancel = useCallback(() => {
    setState(prev => ({
      ...prev,
      isGenerating: false,
    }));
    navigate(`/app/pitch-deck/${deckId}`);
  }, [navigate, deckId]);

  return {
    ...state,
    startGeneration,
    retry,
    cancel,
    elapsedTime: state.startedAt 
      ? Math.round((new Date().getTime() - state.startedAt.getTime()) / 1000)
      : 0,
  };
}
