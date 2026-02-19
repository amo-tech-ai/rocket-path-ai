/**
 * Pitch Deck Wizard Hook
 * Manages wizard state, auto-save, and edge function communication
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { 
  WizardData, 
  Step1Data, 
  Step2Data, 
  Step3Data, 
  Step4Data,
  InterviewQuestion,
  PitchDeckMetadata 
} from '@/lib/pitchDeckSchema';
import { calculateSignalStrength } from '@/lib/pitchDeckSchema';

interface UsePitchDeckWizardOptions {
  deckId?: string;
  startupId?: string;
}

interface WizardState {
  currentStep: number;
  deckId: string | null;
  startupId: string | null;
  wizardData: WizardData;
  isLoading: boolean;
  isSaving: boolean;
  isGenerating: boolean;
  error: string | null;
  signalStrength: number;
}

export function usePitchDeckWizard(options: UsePitchDeckWizardOptions = {}) {
  const navigate = useNavigate();
  
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    deckId: options.deckId || null,
    startupId: options.startupId || null,
    wizardData: {},
    isLoading: true,
    isSaving: false,
    isGenerating: false,
    error: null,
    signalStrength: 0,
  });

  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [researchContext, setResearchContext] = useState<Record<string, unknown>>({});

  // ============================================================================
  // Initialize Wizard
  // ============================================================================

  useEffect(() => {
    async function initializeWizard() {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Get current user's startup
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user's startup
        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', user.id)
          .maybeSingle();

        if (!profile?.org_id) {
          toast.error('Please complete onboarding first');
          navigate('/onboarding');
          return;
        }

        const { data: startup } = await supabase
          .from('startups')
          .select('*')
          .is('deleted_at', null)
          .eq('org_id', profile.org_id)
          .maybeSingle();

        if (!startup) {
          toast.error('No startup found. Please complete onboarding.');
          navigate('/onboarding');
          return;
        }

        // If we have a deck ID, load existing wizard data
        if (options.deckId) {
          const { data: deck, error: deckError } = await supabase
            .from('pitch_decks')
            .select('*')
            .eq('id', options.deckId)
            .single();

          if (deckError || !deck) {
            toast.error('Deck not found');
            navigate('/app/pitch-decks');
            return;
          }

          const metadata = deck.metadata as PitchDeckMetadata | null;
          setState(prev => ({
            ...prev,
            deckId: deck.id,
            startupId: deck.startup_id,
            wizardData: metadata?.wizard_data || {},
            signalStrength: calculateSignalStrength(metadata?.wizard_data || {}),
            isLoading: false,
          }));
        } else {
          // Create new deck or find existing in-progress deck
          const { data: existingDeck } = await supabase
            .from('pitch_decks')
            .select('*')
            .eq('startup_id', startup.id)
            .eq('status', 'in_progress')
            .maybeSingle();

          if (existingDeck) {
            const metadata = existingDeck.metadata as PitchDeckMetadata | null;
            setState(prev => ({
              ...prev,
              deckId: existingDeck.id,
              startupId: startup.id,
              wizardData: metadata?.wizard_data || {},
              signalStrength: calculateSignalStrength(metadata?.wizard_data || {}),
              isLoading: false,
            }));
          } else {
            // Pre-fill Step 1 from startup data
            const prefillData: Step1Data = {
              company_name: startup.name || '',
              website_url: startup.website_url || '',
              tagline: startup.tagline || '',
              industry: startup.industry || '',
              sub_category: startup.sub_industry || '',
              stage: (startup.stage as Step1Data['stage']) || 'seed',
            };

            setState(prev => ({
              ...prev,
              startupId: startup.id,
              wizardData: { step1_startup_info: prefillData },
              isLoading: false,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to initialize wizard:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load wizard data',
        }));
      }
    }

    initializeWizard();
  }, [options.deckId, navigate]);

  // ============================================================================
  // Save Step Data
  // ============================================================================

  const saveStepData = useCallback(async (step: number, data: Step1Data | Step2Data | Step3Data | Step4Data) => {
    try {
      setState(prev => ({ ...prev, isSaving: true }));

      const stepKey = `step${step}_${['startup_info', 'market_traction', 'smart_interview', 'review'][step - 1]}` as keyof WizardData;
      
      const newWizardData: WizardData = {
        ...state.wizardData,
        [stepKey]: data,
        updated_at: new Date().toISOString(),
      };

      // If step 1, also set selected_industry
      if (step === 1 && 'industry' in data) {
        newWizardData.selected_industry = data.industry;
      }

      const newMetadata: PitchDeckMetadata = {
        wizard_data: newWizardData,
      };

      if (state.deckId) {
        // Update existing deck
        const { error } = await supabase
          .from('pitch_decks')
          .update({ 
            metadata: JSON.parse(JSON.stringify(newMetadata)),
            updated_at: new Date().toISOString(),
          })
          .eq('id', state.deckId);

        if (error) throw error;
      } else {
        // Create new deck
        const step1 = data as Step1Data;
        const deckTitle = step1.company_name ? `${step1.company_name} Pitch Deck` : 'New Pitch Deck';
        
        const { data: newDeck, error } = await supabase
          .from('pitch_decks')
          .insert([{
            startup_id: state.startupId!,
            title: deckTitle,
            status: 'in_progress' as const,
            metadata: JSON.parse(JSON.stringify(newMetadata)),
          }])
          .select()
          .single();

        if (error) throw error;

        setState(prev => ({ ...prev, deckId: newDeck.id }));
      }

      const signalStrength = calculateSignalStrength(newWizardData);
      setState(prev => ({
        ...prev,
        wizardData: newWizardData,
        signalStrength,
        isSaving: false,
      }));

      return true;
    } catch (error) {
      console.error('Failed to save step data:', error);
      setState(prev => ({ ...prev, isSaving: false }));
      toast.error('Failed to save progress');
      return false;
    }
  }, [state.deckId, state.startupId, state.wizardData]);

  // ============================================================================
  // Navigation
  // ============================================================================

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 4) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, []);

  const nextStep = useCallback(async (currentData?: Step1Data | Step2Data | Step3Data | Step4Data) => {
    if (currentData) {
      const saved = await saveStepData(state.currentStep, currentData);
      if (!saved) return;
    }

    if (state.currentStep < 4) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  }, [state.currentStep, saveStepData]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  }, [state.currentStep]);

  // ============================================================================
  // Generate Interview Questions (Step 3)
  // ============================================================================

  const generateInterviewQuestions = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'generate_interview_questions',
          deck_id: state.deckId,
          step1_data: state.wizardData.step1_startup_info,
          step2_data: state.wizardData.step2_market_traction,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      setInterviewQuestions(response.data.questions || []);
      setResearchContext(response.data.research_context || {});

      return response.data;
    } catch (error) {
      console.error('Failed to generate questions:', error);
      // Return fallback questions
      const fallbackQuestions: InterviewQuestion[] = [
        {
          id: 'q1',
          question: 'What specific metrics demonstrate your product-market fit?',
          category: 'traction',
          source: 'gap_analysis',
          slide_mapping: 'traction',
        },
        {
          id: 'q2', 
          question: 'How do you acquire customers today?',
          category: 'market',
          source: 'gap_analysis',
          slide_mapping: 'go_to_market',
        },
        {
          id: 'q3',
          question: 'What are your unit economics (CAC, LTV)?',
          category: 'financials',
          source: 'gap_analysis',
          slide_mapping: 'business_model',
        },
        {
          id: 'q4',
          question: 'Who are your key competitors and how are you different?',
          category: 'competition',
          source: 'gap_analysis',
          slide_mapping: 'competition',
        },
        {
          id: 'q5',
          question: "What's your team's unfair advantage?",
          category: 'team',
          source: 'gap_analysis',
          slide_mapping: 'team',
        },
      ];
      setInterviewQuestions(fallbackQuestions);
      return { questions: fallbackQuestions, research_context: {} };
    }
  }, [state.deckId, state.wizardData]);

  // ============================================================================
  // Generate Deck (Step 4) - Navigates to progress page
  // ============================================================================

  const generateDeck = useCallback(async () => {
    try {
      if (!state.deckId) {
        toast.error('No deck ID found');
        return null;
      }

      // Save step 4 data before navigating
      await saveStepData(4, {
        deck_type: 'seed',
        tone: 'clear',
        signal_strength: state.signalStrength,
      });

      // Navigate to generation progress page - the page will handle the actual generation
      navigate(`/app/pitch-deck/${state.deckId}/generating`);

      return { redirected: true };
    } catch (error) {
      console.error('Failed to start generation:', error);
      toast.error('Failed to start generation. Please try again.');
      return null;
    }
  }, [state.deckId, state.signalStrength, saveStepData, navigate]);

  // ============================================================================
  // Return Hook Values
  // ============================================================================

  return {
    // State
    currentStep: state.currentStep,
    deckId: state.deckId,
    startupId: state.startupId,
    wizardData: state.wizardData,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    isGenerating: state.isGenerating,
    error: state.error,
    signalStrength: state.signalStrength,
    interviewQuestions,
    researchContext,

    // Actions
    saveStepData,
    goToStep,
    nextStep,
    prevStep,
    generateInterviewQuestions,
    generateDeck,

    // Helpers
    getStep1Data: () => state.wizardData.step1_startup_info,
    getStep2Data: () => state.wizardData.step2_market_traction,
    getStep3Data: () => state.wizardData.step3_smart_interview,
    getStep4Data: () => state.wizardData.step4_review,
  };
}
