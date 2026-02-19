import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WeeklyReview {
  id: string;
  startup_id: string;
  week_start: string;
  week_end: string;
  summary: string | null;
  key_learnings: string[] | null;
  priorities_next_week: string[] | null;
  metrics: Record<string, unknown> | null;
  assumptions_tested: number | null;
  experiments_run: number | null;
  decisions_made: number | null;
  tasks_completed: number | null;
  health_score_start: number | null;
  health_score_end: number | null;
  ai_generated: boolean | null;
  edited_by_user: boolean | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useWeeklyReviews(startupId: string | undefined) {
  return useQuery({
    queryKey: ['weekly-reviews', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      const { data, error } = await supabase
        .from('weekly_reviews')
        .select('*')
        .eq('startup_id', startupId)
        .order('week_start', { ascending: false });
      if (error) throw error;
      return (data || []) as WeeklyReview[];
    },
    enabled: !!startupId,
  });
}

export function useCreateWeeklyReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: {
      startup_id: string;
      week_start: string;
      week_end: string;
      summary?: string;
      key_learnings?: string[];
      priorities_next_week?: string[];
      metrics?: Record<string, unknown>;
      assumptions_tested?: number;
      experiments_run?: number;
      decisions_made?: number;
      tasks_completed?: number;
      health_score_start?: number;
      health_score_end?: number;
      ai_generated?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .insert(review)
        .select()
        .single();
      if (error) throw error;
      return data as WeeklyReview;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['weekly-reviews'] });
    },
  });
}

export function useUpdateWeeklyReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .update({ ...updates, edited_by_user: true })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as WeeklyReview;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['weekly-reviews'] });
    },
  });
}

export function useDeleteWeeklyReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weekly_reviews')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['weekly-reviews'] });
    },
  });
}

// ============ AI-powered: Generate + Coach ============

export interface WeeklyCoaching {
  headline: string;
  observation: string;
  suggestion: string;
  question: string;
}

export interface GenerateReviewResult {
  success: boolean;
  review: WeeklyReview;
  coaching: WeeklyCoaching;
  priorities_detail: { priority: string; reason: string; success_metric: string }[];
  metrics_summary: Record<string, string>;
  is_update: boolean;
  error?: string;
}

export interface CoachReviewResult {
  success: boolean;
  review_id: string;
  insights: { type: string; title: string; detail: string }[];
  patterns: string[];
  action_items: { action: string; why: string; when: string }[];
  coach_note?: string;
  error?: string;
}

async function invokeWeeklyReview<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.refreshSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('weekly-review', {
    body: { action, ...payload },
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  if (error) throw new Error(error.message || 'Edge function error');
  if (data?.error) throw new Error(data.error);
  return data as T;
}

/**
 * Generate an AI-powered weekly review.
 * Gathers startup context, calls Gemini, saves to DB, returns coaching insights.
 */
export function useGenerateWeeklyReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ startupId }: { startupId: string }) => {
      return invokeWeeklyReview<GenerateReviewResult>('generate', {
        startup_id: startupId,
      });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['weekly-reviews'] });
      if (data.success) {
        const score = data.review?.health_score_end;
        if (score != null) {
          if (score >= 80) toast.success(`Week score: ${score}/100 — Great week!`);
          else if (score >= 60) toast.info(`Week score: ${score}/100 — Solid progress`);
          else toast.warning(`Week score: ${score}/100 — Room for improvement`);
        }
      }
    },
    onError: (error) => {
      console.error('Generate weekly review error:', error);
      toast.error('Failed to generate weekly review');
    },
  });
}

/**
 * Get AI coaching insights for a specific review.
 * Analyzes the review + history to give patterns, strengths, risks, and action items.
 */
export function useCoachWeeklyReview() {
  return useMutation({
    mutationFn: async ({ startupId, reviewId }: { startupId: string; reviewId: string }) => {
      return invokeWeeklyReview<CoachReviewResult>('coach', {
        startup_id: startupId,
        review_id: reviewId,
      });
    },
    onError: (error) => {
      console.error('Coach weekly review error:', error);
      toast.error('Failed to get coaching insights');
    },
  });
}
