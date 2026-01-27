import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for investor agent responses
interface InvestorProfile {
  name: string;
  firm: string;
  type: string;
  fit_score: number;
  thesis_match: string;
  check_size: string;
  focus_areas: string[];
  stage_preference: string;
  notable_investments: string[];
  outreach_angle: string;
}

interface DiscoverResult {
  success: boolean;
  investors: InvestorProfile[];
  search_strategy: string;
  criteria_used: Record<string, unknown>;
}

interface FitAnalysis {
  success: boolean;
  overall_score: number;
  breakdown: Record<string, { score: number; reasoning: string }>;
  strengths: string[];
  concerns: string[];
  recommendation: string;
  next_steps: string[];
}

interface WarmPath {
  path_type: string;
  through: string;
  connection_strength: string;
  reasoning: string;
  suggested_approach: string;
}

interface WarmPathsResult {
  success: boolean;
  investor_name: string;
  warm_paths: WarmPath[];
  cold_approach_tips: string[];
  best_entry_point: string;
}

interface OutreachResult {
  success: boolean;
  outreach_type: string;
  subject_lines: string[];
  email_body: string;
  personalization_points: string[];
  call_to_action: string;
  follow_up_strategy: string;
  tips: string[];
}

interface PipelineAnalysis {
  success: boolean;
  total_investors: number;
  by_status: Record<string, number>;
  health_score: number;
  summary: string;
  bottlenecks: string[];
  wins: string[];
  recommendations: { priority: string; action: string; reasoning: string }[];
  conversion_analysis: Record<string, string>;
  forecast: Record<string, unknown>;
}

interface DealScore {
  success: boolean;
  investor_name: string;
  deal_score: number;
  probability: number;
  factors: Record<string, { score: number; evidence: string }>;
  risk_factors: string[];
  accelerators: string[];
  recommended_next_action: string;
}

interface MeetingPrep {
  success: boolean;
  investor_name: string;
  key_talking_points: string[];
  questions_to_expect: { question: string; suggested_answer: string }[];
  questions_to_ask: string[];
  portfolio_connections: string[];
  thesis_alignment_points: string[];
  red_flags_to_address: string[];
  desired_outcomes: string[];
  follow_up_plan: string;
}

interface EnrichResult {
  success: boolean;
  enriched_bio: string;
  investment_thesis: string;
  typical_check_size: { min: number; max: number };
  preferred_stages: string[];
  focus_sectors: string[];
  notable_investments: string[];
  engagement_tips: string[];
}

interface CompareResult {
  success: boolean;
  investors_compared: number;
  comparison_matrix: Record<string, { winner: string; analysis: string }>;
  overall_ranking: { rank: number; name: string; reasoning: string }[];
  recommendation: string;
  parallel_strategy: string;
}

interface FundraisingReport {
  success: boolean;
  startup_name: string;
  generated_at: string;
  executive_summary: string;
  progress_metrics: Record<string, unknown>;
  funnel_analysis: Record<string, string>;
  top_prospects: string[];
  risks: string[];
  this_week_priorities: string[];
  forecast: Record<string, unknown>;
}

// Helper to invoke the investor agent
async function invokeInvestorAgent<T>(action: string, params: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('investor-agent', {
    body: { action, ...params },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.success) {
    throw new Error(data.error || 'Unknown error');
  }

  return data as T;
}

// 1. Discover matching investors
export function useDiscoverInvestors() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      criteria 
    }: { 
      startupId: string; 
      criteria?: { stage?: string; industry?: string; geography?: string; checkSize?: number } 
    }) => {
      return invokeInvestorAgent<DiscoverResult>('discover_investors', {
        startup_id: startupId,
        criteria: criteria || {},
      });
    },
    onSuccess: (data) => {
      toast.success(`Found ${data.investors.length} matching investors`);
    },
    onError: (error) => {
      toast.error(`Discovery failed: ${error.message}`);
    },
  });
}

// 2. Analyze investor fit
export function useAnalyzeInvestorFit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ startupId, investorId }: { startupId: string; investorId: string }) => {
      return invokeInvestorAgent<FitAnalysis>('analyze_investor_fit', {
        startup_id: startupId,
        investor_id: investorId,
      });
    },
    onSuccess: (data) => {
      toast.success(`Fit score: ${data.overall_score}/100`);
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    },
  });
}

// 3. Find warm introduction paths
export function useFindWarmPaths() {
  return useMutation({
    mutationFn: async ({ startupId, investorId }: { startupId: string; investorId: string }) => {
      return invokeInvestorAgent<WarmPathsResult>('find_warm_paths', {
        startup_id: startupId,
        investor_id: investorId,
      });
    },
    onSuccess: (data) => {
      toast.success(`Found ${data.warm_paths.length} potential intro paths`);
    },
    onError: (error) => {
      toast.error(`Path finding failed: ${error.message}`);
    },
  });
}

// 4. Generate outreach email
export function useGenerateOutreach() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      investorId, 
      outreachType 
    }: { 
      startupId: string; 
      investorId: string; 
      outreachType?: 'cold' | 'warm' | 'follow_up' 
    }) => {
      return invokeInvestorAgent<OutreachResult>('generate_outreach', {
        startup_id: startupId,
        investor_id: investorId,
        outreach_type: outreachType || 'cold',
      });
    },
    onSuccess: () => {
      toast.success('Outreach email generated');
    },
    onError: (error) => {
      toast.error(`Generation failed: ${error.message}`);
    },
  });
}

// 5. Track investor engagement
export function useTrackEngagement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      investorId, 
      engagement 
    }: { 
      investorId: string; 
      engagement: { 
        type: 'email_sent' | 'email_opened' | 'meeting' | 'follow_up' | 'response'; 
        notes?: string; 
        outcome?: string 
      } 
    }) => {
      return invokeInvestorAgent<{ success: boolean; new_status: string }>('track_engagement', {
        investor_id: investorId,
        engagement,
      });
    },
    onSuccess: () => {
      toast.success('Engagement logged');
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
    onError: (error) => {
      toast.error(`Tracking failed: ${error.message}`);
    },
  });
}

// 6. Analyze fundraising pipeline
export function useAnalyzePipeline() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeInvestorAgent<PipelineAnalysis>('analyze_pipeline', {
        startup_id: startupId,
      });
    },
    onSuccess: () => {
      toast.success('Pipeline analysis complete');
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    },
  });
}

// 7. Score deal quality
export function useScoreDeal() {
  return useMutation({
    mutationFn: async ({ investorId }: { investorId: string }) => {
      return invokeInvestorAgent<DealScore>('score_deal', {
        investor_id: investorId,
      });
    },
    onSuccess: (data) => {
      toast.success(`Deal score: ${data.deal_score}/100, ${Math.round(data.probability * 100)}% probability`);
    },
    onError: (error) => {
      toast.error(`Scoring failed: ${error.message}`);
    },
  });
}

// 8. Prepare for meeting
export function usePrepareMeeting() {
  return useMutation({
    mutationFn: async ({ startupId, investorId }: { startupId: string; investorId: string }) => {
      return invokeInvestorAgent<MeetingPrep>('prepare_meeting', {
        startup_id: startupId,
        investor_id: investorId,
      });
    },
    onSuccess: () => {
      toast.success('Meeting prep generated');
    },
    onError: (error) => {
      toast.error(`Prep failed: ${error.message}`);
    },
  });
}

// 9. Enrich investor profile
export function useEnrichInvestor() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ investorId, linkedinUrl }: { investorId: string; linkedinUrl?: string }) => {
      return invokeInvestorAgent<EnrichResult>('enrich_investor', {
        investor_id: investorId,
        linkedin_url: linkedinUrl,
      });
    },
    onSuccess: () => {
      toast.success('Investor profile enriched');
      queryClient.invalidateQueries({ queryKey: ['investors'] });
    },
    onError: (error) => {
      toast.error(`Enrichment failed: ${error.message}`);
    },
  });
}

// 10. Compare investors
export function useCompareInvestors() {
  return useMutation({
    mutationFn: async ({ investorIds }: { investorIds: string[] }) => {
      return invokeInvestorAgent<CompareResult>('compare_investors', {
        investor_ids: investorIds,
      });
    },
    onSuccess: () => {
      toast.success('Comparison complete');
    },
    onError: (error) => {
      toast.error(`Comparison failed: ${error.message}`);
    },
  });
}

// 11. Analyze term sheet
export function useAnalyzeTermSheet() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      termSheetData 
    }: { 
      startupId: string; 
      termSheetData: { 
        valuation: number; 
        amount: number; 
        investor_name: string; 
        key_terms?: Record<string, unknown> 
      } 
    }) => {
      return invokeInvestorAgent<{
        success: boolean;
        valuation_assessment: Record<string, unknown>;
        dilution_analysis: Record<string, unknown>;
        terms_review: { term: string; assessment: string; explanation: string }[];
        negotiation_points: string[];
        overall_recommendation: string;
        next_steps: string[];
      }>('analyze_term_sheet', {
        startup_id: startupId,
        term_sheet_data: termSheetData,
      });
    },
    onSuccess: () => {
      toast.success('Term sheet analysis complete');
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    },
  });
}

// 12. Generate fundraising report
export function useGenerateReport() {
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeInvestorAgent<FundraisingReport>('generate_report', {
        startup_id: startupId,
      });
    },
    onSuccess: () => {
      toast.success('Report generated');
    },
    onError: (error) => {
      toast.error(`Report failed: ${error.message}`);
    },
  });
}
