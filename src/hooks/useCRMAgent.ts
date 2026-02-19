/**
 * CRM Agent Hook
 * Frontend interface for CRM AI actions (enrichment, scoring, pipeline analysis)
 */

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export interface EnrichmentResult {
  success: boolean;
  contact_id?: string;
  enriched_data?: {
    title?: string;
    company?: string;
    bio?: string;
    linkedin_url?: string;
    twitter_url?: string;
    ai_summary?: string;
  };
  error?: string;
}

export interface LeadScoreResult {
  success: boolean;
  contact_id?: string;
  score?: number;
  factors?: {
    factor: string;
    weight: number;
    reasoning: string;
  }[];
  recommendation?: string;
  error?: string;
}

export interface DealScoreResult {
  success: boolean;
  deal_id?: string;
  probability?: number;
  risk_factors?: string[];
  next_steps?: string[];
  ai_insights?: {
    summary: string;
    opportunities: string[];
    risks: string[];
  };
  error?: string;
}

export interface PipelineAnalysis {
  success: boolean;
  total_deals?: number;
  total_value?: number;
  weighted_value?: number;
  stage_breakdown?: {
    stage: string;
    count: number;
    value: number;
  }[];
  bottlenecks?: string[];
  recommendations?: string[];
  error?: string;
}

export interface EmailDraft {
  success: boolean;
  subject?: string;
  body?: string;
  tone?: string;
  error?: string;
}

export interface DuplicateResult {
  success: boolean;
  duplicates?: {
    contact_id: string;
    name: string;
    email: string;
    similarity: number;
  }[];
  error?: string;
}

export interface CommunicationSummary {
  success: boolean;
  summary?: string;
  key_points?: string[];
  action_items?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  error?: string;
}

export interface FollowUpSuggestion {
  success: boolean;
  suggestions?: {
    contact_id: string;
    contact_name: string;
    days_since_contact: number;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    suggested_action: string;
  }[];
  error?: string;
}

// ============================================================================
// Helper: Invoke CRM Agent
// ============================================================================

async function invokeCRMAgent<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('crm-agent', {
    body: { action, ...payload },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data as T;
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Enrich contact with professional data
 */
export function useEnrichContact() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      linkedinUrl, 
      name, 
      company 
    }: { 
      startupId: string; 
      linkedinUrl?: string; 
      name?: string; 
      company?: string;
    }) => {
      return invokeCRMAgent<EnrichmentResult>('enrich_contact', {
        startup_id: startupId,
        linkedin_url: linkedinUrl,
        name,
        company,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Contact enriched successfully');
      } else {
        toast.error(data.error || 'Failed to enrich contact');
      }
    },
    onError: (error) => {
      console.error('Enrich contact error:', error);
      toast.error('Failed to enrich contact');
    },
  });
}

/**
 * Score a lead based on profile and engagement
 */
export function useScoreLead() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      contactId 
    }: { 
      startupId: string; 
      contactId: string;
    }) => {
      return invokeCRMAgent<LeadScoreResult>('score_lead', {
        startup_id: startupId,
        contact_id: contactId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Lead scored: ${data.score}/100`);
      } else {
        toast.error(data.error || 'Failed to score lead');
      }
    },
    onError: (error) => {
      console.error('Score lead error:', error);
      toast.error('Failed to score lead');
    },
  });
}

/**
 * Score a deal with probability and risk factors
 */
export function useScoreDeal() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      dealId 
    }: { 
      startupId: string; 
      dealId: string;
    }) => {
      return invokeCRMAgent<DealScoreResult>('score_deal', {
        startup_id: startupId,
        deal_id: dealId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Deal probability: ${data.probability}%`);
      } else {
        toast.error(data.error || 'Failed to score deal');
      }
    },
    onError: (error) => {
      console.error('Score deal error:', error);
      toast.error('Failed to score deal');
    },
  });
}

/**
 * Analyze pipeline health and bottlenecks
 */
export function useAnalyzePipeline() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeCRMAgent<PipelineAnalysis>('analyze_pipeline', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Pipeline analysis complete');
      } else {
        toast.error(data.error || 'Failed to analyze pipeline');
      }
    },
    onError: (error) => {
      console.error('Analyze pipeline error:', error);
      toast.error('Failed to analyze pipeline');
    },
  });
}

/**
 * Generate personalized email draft
 */
export function useGenerateEmail() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      contactId, 
      purpose,
      tone 
    }: { 
      startupId: string; 
      contactId: string;
      purpose: string;
      tone?: 'formal' | 'friendly' | 'persuasive';
    }) => {
      return invokeCRMAgent<EmailDraft>('generate_email', {
        startup_id: startupId,
        contact_id: contactId,
        purpose,
        tone,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Email draft generated');
      } else {
        toast.error(data.error || 'Failed to generate email');
      }
    },
    onError: (error) => {
      console.error('Generate email error:', error);
      toast.error('Failed to generate email');
    },
  });
}

/**
 * Detect duplicate contacts
 */
export function useDetectDuplicates() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      name, 
      email 
    }: { 
      startupId: string; 
      name: string;
      email?: string;
    }) => {
      return invokeCRMAgent<DuplicateResult>('detect_duplicate', {
        startup_id: startupId,
        name,
        email,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.duplicates?.length) {
        toast.warning(`Found ${data.duplicates.length} potential duplicates`);
      }
    },
    onError: (error) => {
      console.error('Detect duplicates error:', error);
    },
  });
}

/**
 * Summarize communication history
 */
export function useSummarizeCommunication() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      contactId 
    }: { 
      startupId: string; 
      contactId: string;
    }) => {
      return invokeCRMAgent<CommunicationSummary>('summarize_communication', {
        startup_id: startupId,
        contact_id: contactId,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Communication summary ready');
      } else {
        toast.error(data.error || 'Failed to summarize');
      }
    },
    onError: (error) => {
      console.error('Summarize communication error:', error);
      toast.error('Failed to summarize communication');
    },
  });
}

/**
 * Get follow-up suggestions for stale contacts
 */
export function useSuggestFollowUps() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeCRMAgent<FollowUpSuggestion>('suggest_follow_ups', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.suggestions?.length) {
        toast.info(`${data.suggestions.length} contacts need follow-up`);
      }
    },
    onError: (error) => {
      console.error('Suggest follow-ups error:', error);
      toast.error('Failed to get follow-up suggestions');
    },
  });
}

// ============================================================================
// Composite Hook
// ============================================================================

export function useCRMAgent() {
  return {
    enrichContact: useEnrichContact(),
    scoreLead: useScoreLead(),
    scoreDeal: useScoreDeal(),
    analyzePipeline: useAnalyzePipeline(),
    generateEmail: useGenerateEmail(),
    detectDuplicates: useDetectDuplicates(),
    summarizeCommunication: useSummarizeCommunication(),
    suggestFollowUps: useSuggestFollowUps(),
  };
}
