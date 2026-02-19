/**
 * useValidation Hook
 * Manages validation operations via edge functions
 */

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ValidationScore {
  overall: number;
  breakdown: {
    problemClarity: number;
    marketSize: number;
    solutionFit: number;
    competitiveMoat: number;
    teamFit: number;
    traction: number;
    unitEconomics: number;
    fundingFit: number;
  };
}

export interface ValidationRisk {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  mitigation: string;
}

export interface ValidationOpportunity {
  id: string;
  type: 'pivot' | 'market' | 'partnership' | 'feature';
  title: string;
  description: string;
  potential: 'high' | 'medium' | 'low';
}

export interface ValidationResult {
  score: ValidationScore;
  risks: ValidationRisk[];
  opportunities: ValidationOpportunity[];
  benchmarks: {
    industry: string;
    averageScore: number;
    topScore: number;
  };
  generatedTasks: Array<{ title: string; description: string; priority: string }>;
}

export interface ValidationHistoryItem {
  id: string;
  validationType: 'quick' | 'deep' | 'investor';
  score: number;
  createdAt: string;
}

async function runValidation(
  startupId: string,
  validationType: 'quick' | 'deep' | 'investor'
): Promise<ValidationResult> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');

  // Use prompt-pack edge function with validation pack
  const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
    body: { 
      action: 'validate_canvas',
      startup_id: startupId,
      validation_type: validationType,
    },
  });

  if (error) throw error;
  
  // Transform response to ValidationResult
  return {
    score: data.score || { overall: 0, breakdown: {} },
    risks: data.risks || [],
    opportunities: data.opportunities || [],
    benchmarks: data.benchmarks || { industry: 'Unknown', averageScore: 65, topScore: 85 },
    generatedTasks: data.tasks || [],
  };
}

async function fetchValidationHistory(startupId: string): Promise<ValidationHistoryItem[]> {
  // Use raw query to avoid type issues with validation_reports table
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return [];

  try {
    const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
      body: { 
        action: 'get_validation_history',
        startup_id: startupId,
      },
    });

    if (error || !data?.history) return [];

    return (data.history || []).map((item: any) => ({
      id: item.id,
      validationType: item.validation_type || 'quick',
      score: item.score || 0,
      createdAt: item.created_at || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export function useValidation(startupId: string | undefined) {
  const { toast } = useToast();
  const [currentResult, setCurrentResult] = useState<ValidationResult | null>(null);

  const historyQuery = useQuery({
    queryKey: ['validation-history', startupId],
    queryFn: () => fetchValidationHistory(startupId!),
    enabled: !!startupId,
  });

  const validateMutation = useMutation({
    mutationFn: (type: 'quick' | 'deep' | 'investor') => 
      runValidation(startupId!, type),
    onSuccess: (data) => {
      setCurrentResult(data);
      toast({
        title: 'Validation Complete',
        description: `Your score: ${data.score.overall}/100`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Validation Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  return {
    currentResult,
    history: historyQuery.data || [],
    isLoadingHistory: historyQuery.isLoading,
    isValidating: validateMutation.isPending,
    runValidation: (type: 'quick' | 'deep' | 'investor') => validateMutation.mutate(type),
  };
}
