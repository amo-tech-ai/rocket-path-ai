import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface Founder {
  id: string;
  name: string;
  role: string;
  linkedin_url?: string;
  enriched?: boolean;
}

export interface TractionData {
  current_mrr?: number;
  mrr_range?: string;
  growth_rate?: number;
  growth_range?: string;
  users?: number;
  users_range?: string;
  customers?: number;
  [key: string]: unknown; // Allow additional dynamic fields from backend
}

export interface FundingData {
  is_raising?: boolean | string;
  target_amount?: number | string;
  use_of_funds?: string[];
  [key: string]: unknown; // Allow additional dynamic fields from backend
}

export interface ReadinessScore {
  overall_score: number;
  category_scores: {
    product: number;
    market: number;
    team: number;
    clarity: number;
  };
  benchmarks: string[];
  recommendations: string[];
}

export interface InvestorScore {
  total_score: number;
  breakdown: {
    team: number;
    traction: number;
    market: number;
    product: number;
    fundraising: number;
  };
  recommendations: { action: string; points_gain: number }[];
}

export interface AISummary {
  summary: string;
  strengths: string[];
  improvements: string[];
}

export interface InterviewAnswer {
  question_id: string;
  answer_id: string;
  answer_text?: string;
  timestamp: string;
}

export interface WizardFormData {
  // Step 1: Context & Enrichment
  name?: string;
  company_name?: string;
  website_url?: string;
  linkedin_url?: string;
  additional_urls?: string[];
  description?: string;
  target_market?: string;
  search_terms?: string;
  industry?: string;
  business_model?: string[];
  stage?: string;
  year_founded?: number;
  cover_image_url?: string;
  tagline?: string;
  key_features?: string[];
  target_customers?: string[];
  competitors?: string[];
  founders?: Founder[];
  
  // Step 2: Analysis (read from session)
  readiness_score?: ReadinessScore | null;
  url_insights?: Record<string, unknown> | null;
  
  // Step 3: Interview
  interview_answers?: InterviewAnswer[];
  signals?: string[];
  extracted_traction?: TractionData;
  extracted_funding?: FundingData;
  current_question_index?: number; // FIX 7: Persist question progress
  
  // Step 4: Review
  investor_score?: InvestorScore | null;
  ai_summary?: AISummary | null;
}

export interface WizardSession {
  id: string;
  user_id: string;
  startup_id: string | null;
  current_step: number;
  status: 'in_progress' | 'completed';
  form_data: WizardFormData;
  ai_extractions: Record<string, unknown> | null;
  extracted_traction: Record<string, unknown> | null;
  extracted_funding: Record<string, unknown> | null;
  profile_strength: number | null;
  started_at: string | null;
  completed_at: string | null;
}

const DEBOUNCE_MS = 500;

export function useWizardSession() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const createPromiseRef = useRef<Promise<string> | null>(null);

  // Fetch existing session
  const {
    data: session,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['wizard-session', user?.id],
    queryFn: async (): Promise<WizardSession | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('wizard_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          id: data.id,
          user_id: data.user_id,
          startup_id: data.startup_id,
          current_step: data.current_step || 1,
          status: (data.status as 'in_progress' | 'completed') || 'in_progress',
          form_data: (typeof data.form_data === 'object' && data.form_data !== null ? data.form_data : {}) as WizardFormData,
          ai_extractions: (typeof data.ai_extractions === 'object' && data.ai_extractions !== null && !Array.isArray(data.ai_extractions) ? data.ai_extractions : null) as Record<string, unknown> | null,
          extracted_traction: (typeof data.extracted_traction === 'object' && data.extracted_traction !== null && !Array.isArray(data.extracted_traction) ? data.extracted_traction : null) as Record<string, unknown> | null,
          extracted_funding: (typeof data.extracted_funding === 'object' && data.extracted_funding !== null && !Array.isArray(data.extracted_funding) ? data.extracted_funding : null) as Record<string, unknown> | null,
          profile_strength: data.profile_strength,
          started_at: data.started_at,
          completed_at: data.completed_at,
        };
      }
      
      return null;
    },
    enabled: !!user?.id,
  });

  // Create session with retry and proper waiting
  const createSessionInternal = async (): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');

    console.log('[WizardSession] Creating session...');
    setIsCreatingSession(true);

    try {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'create_session',
          user_id: user.id,
        },
      });

      if (response.error) throw response.error;
      
      const sessionId = response.data?.session_id || response.data?.id;
      if (!sessionId) {
        throw new Error('No session ID returned from server');
      }

      console.log('[WizardSession] Session created:', sessionId);
      
      // Invalidate and refetch to get the real DB row
      await queryClient.invalidateQueries({ queryKey: ['wizard-session', user?.id] });
      
      // Wait for the query to actually refetch and find the session
      let retries = 0;
      const maxRetries = 5;
      while (retries < maxRetries) {
        await new Promise(r => setTimeout(r, 200));
        const { data: freshSession } = await supabase
          .from('wizard_sessions')
          .select('id')
          .eq('id', sessionId)
          .single();
        
        if (freshSession?.id) {
          console.log('[WizardSession] Session confirmed in DB');
          await queryClient.invalidateQueries({ queryKey: ['wizard-session', user?.id] });
          return sessionId;
        }
        retries++;
      }

      // Even if we couldn't verify, return the ID since it was created
      console.warn('[WizardSession] Session created but not yet visible in query');
      return sessionId;
    } finally {
      setIsCreatingSession(false);
      createPromiseRef.current = null;
    }
  };

  // Ensure session exists - CRITICAL: prevents race conditions
  const ensureSession = useCallback(async (): Promise<string> => {
    // If we already have a session, return it
    if (session?.id) {
      console.log('[WizardSession] ensureSession: Using existing session', session.id);
      return session.id;
    }

    // If creation is already in progress, wait for it
    if (createPromiseRef.current) {
      console.log('[WizardSession] ensureSession: Waiting for in-flight creation');
      return createPromiseRef.current;
    }

    // Start new creation
    console.log('[WizardSession] ensureSession: Starting new session creation');
    createPromiseRef.current = createSessionInternal();
    return createPromiseRef.current;
  }, [session?.id, user?.id]);

  // Create new session mutation (for backwards compatibility)
  const createSessionMutation = useMutation({
    mutationFn: async (): Promise<WizardSession> => {
      const sessionId = await ensureSession();
      return {
        id: sessionId,
        user_id: user?.id || '',
        startup_id: null,
        current_step: 1,
        status: 'in_progress',
        form_data: {},
        ai_extractions: null,
        extracted_traction: null,
        extracted_funding: null,
        profile_strength: null,
        started_at: new Date().toISOString(),
        completed_at: null,
      };
    },
    onError: (error) => {
      console.error('Failed to create session:', error);
      toast({
        title: 'Error creating session',
        description: 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update session
  const updateSessionMutation = useMutation({
    mutationFn: async ({
      sessionId,
      updates,
    }: {
      sessionId: string;
      updates: Partial<Pick<WizardSession, 'current_step' | 'form_data'>>;
    }) => {
      const response = await supabase.functions.invoke('onboarding-agent', {
        body: {
          action: 'update_session',
          session_id: sessionId,
          ...updates,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      setIsSaving(false);
    },
    onError: (error) => {
      console.error('Failed to update session:', error);
      setIsSaving(false);
    },
  });

  // Debounced save
  const saveFormData = useCallback(
    (formData: WizardFormData) => {
      if (!session?.id) {
        console.warn('[WizardSession] saveFormData: No session ID, skipping');
        return;
      }

      setIsSaving(true);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        updateSessionMutation.mutate({
          sessionId: session.id,
          updates: { form_data: formData },
        });
      }, DEBOUNCE_MS);
    },
    [session?.id, updateSessionMutation]
  );

  // Flush pending saves (for navigation)
  const flushSave = useCallback(
    async (formData: WizardFormData) => {
      if (!session?.id) {
        console.warn('[WizardSession] flushSave: No session ID');
        return;
      }

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      setIsSaving(true);
      try {
        await updateSessionMutation.mutateAsync({
          sessionId: session.id,
          updates: { form_data: formData },
        });
      } finally {
        setIsSaving(false);
      }
    },
    [session?.id, updateSessionMutation]
  );

  // Update current step
  const setCurrentStep = useCallback(
    async (step: number) => {
      // Get session ID, creating if needed
      let sessionId = session?.id;
      if (!sessionId) {
        console.log('[WizardSession] setCurrentStep: No session, ensuring one exists');
        try {
          sessionId = await ensureSession();
        } catch (e) {
          console.error('[WizardSession] setCurrentStep: Failed to ensure session', e);
          return;
        }
      }

      console.log('[WizardSession] setCurrentStep:', step, 'sessionId:', sessionId);

      // Optimistic update
      queryClient.setQueryData(['wizard-session', user?.id], (old: WizardSession | null) =>
        old ? { ...old, current_step: step } : null
      );

      updateSessionMutation.mutate({
        sessionId,
        updates: { current_step: step },
      });
    },
    [session?.id, user?.id, queryClient, updateSessionMutation, ensureSession]
  );

  // Initialize session on mount (only if none exists)
  useEffect(() => {
    if (user?.id && !isLoading && !session && !isCreatingSession && !createPromiseRef.current) {
      console.log('[WizardSession] Auto-creating session on mount');
      ensureSession().catch(console.error);
    }
  }, [user?.id, isLoading, session, isCreatingSession, ensureSession]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Check if wizard is complete
  const isWizardComplete = session?.status === 'completed' && session?.startup_id !== null;

  return {
    session,
    isLoading: isLoading || isCreatingSession,
    isSaving,
    error,
    isWizardComplete,
    ensureSession,
    saveFormData,
    flushSave,
    setCurrentStep,
    refetch,
  };
}

export default useWizardSession;
