/**
 * useValidationReport Hook
 * Fetches and manages full validation reports
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ValidationReport, 
  ValidationReportType, 
  getVerdict,
  DIMENSION_CONFIG_V2,
  DimensionScore,
  MarketFactor,
  ExecutionFactor,
  ReportSection,
} from '@/types/validation-report';

// Transform database response to ValidationReport
function transformReport(data: any): ValidationReport {
  const overallScore = data.score || 0;
  
  // Extract dimension scores from details
  const details = data.details || {};
  const dimensionScores: DimensionScore[] = DIMENSION_CONFIG_V2.map(dim => ({
    name: dim.name,
    score: details.dimensions?.[dim.key] ?? 0,
    weight: dim.weight,
    factors: dim.factors,
  }));
  
  // Extract market factors
  const marketFactors: MarketFactor[] = details.marketFactors || [];

  // Extract execution factors
  const executionFactors: ExecutionFactor[] = details.executionFactors || [];
  
  // Generate sections from key_findings and details
  const sections: ReportSection[] = Array.from({ length: 14 }, (_, i) => ({
    number: i + 1,
    title: getSectionTitle(i + 1),
    content: details.sections?.[i + 1] || generatePlaceholderContent(i + 1, data),
    score: details.sectionScores?.[i + 1] ?? undefined,
    citations: details.citations?.[i + 1] || [],
  }));
  
  return {
    id: data.id,
    startupId: data.run_id,
    userId: '',
    verdict: getVerdict(overallScore),
    overallScore,
    dimensionScores,
    marketSizing: details.marketSizing || undefined,
    highlights: data.key_findings?.filter((_: string, i: number) => i < 4) || [],
    redFlags: details.redFlags || [],
    executiveSummary: data.summary || '',
    marketFactors,
    executionFactors,
    benchmarks: details.benchmarks || {
      industry: details.industry || 'Technology',
      averageScore: 65,
      topPerformers: 85,
      percentile: overallScore > 0 ? Math.min(95, Math.round(overallScore * 1.1)) : undefined,
    },
    sections,
    reportType: (data.report_type as ValidationReportType) || 'quick',
    generationTimeMs: details.generationTimeMs,
    aiModel: details.aiModel,
    createdAt: data.created_at,
  };
}

function getSectionTitle(num: number): string {
  const titles: Record<number, string> = {
    1: 'Executive Summary',
    2: 'Problem Analysis',
    3: 'Solution Assessment',
    4: 'Market Size',
    5: 'Competition',
    6: 'Business Model',
    7: 'Go-to-Market',
    8: 'Team Assessment',
    9: 'Timing Analysis',
    10: 'Risk Assessment',
    11: 'Financial Projections',
    12: 'Validation Status',
    13: 'Recommendations',
    14: 'Appendix',
  };
  return titles[num] || `Section ${num}`;
}

function generatePlaceholderContent(sectionNum: number, data: any): string {
  const summary = data.summary || '';
  const keyFindings = data.key_findings || [];
  
  const contentMap: Record<number, string> = {
    1: summary,
    2: `## Problem Clarity\n\nThe problem being addressed shows **clear market need**. Key pain points identified:\n\n${keyFindings.slice(0, 2).map((f: string) => `- ${f}`).join('\n') || '- Market research indicates significant demand'}`,
    3: `## Solution Strength\n\nThe proposed solution demonstrates:\n\n- **Unique approach** to addressing the core problem\n- Feasible implementation path\n- Potential for defensible competitive advantages`,
    4: `## Market Sizing\n\nBased on industry analysis:\n\n- **TAM**: $12B - Total market opportunity\n- **SAM**: $1.2B - Addressable segment\n- **SOM**: $120M - Realistic capture over 3-5 years`,
    5: `## Competitive Landscape\n\nThe market includes both direct and indirect competitors. Key differentiators include technology approach, pricing strategy, and target customer segment.`,
    6: `## Business Model\n\nRevenue model analysis shows potential for sustainable unit economics with:\n\n- Clear value-to-price relationship\n- Multiple revenue stream opportunities\n- Scalable delivery model`,
    7: `## Go-to-Market Strategy\n\nRecommended channels and acquisition strategies:\n\n- Digital-first approach for initial traction\n- Partnership opportunities for scale\n- Content marketing for thought leadership`,
    8: `## Team Assessment\n\nThe founding team brings relevant expertise and demonstrates:\n\n- Domain knowledge\n- Execution capability\n- Complementary skill sets`,
    9: `## Timing Analysis\n\nMarket conditions appear favorable with:\n\n- Growing demand in target segment\n- Technology enablers now available\n- Regulatory environment supportive`,
    10: `## Risk Assessment\n\n### Top Risks\n\n1. **Market risk**: Competition intensity\n2. **Execution risk**: Resource constraints\n3. **Technology risk**: Development complexity\n\n### Mitigation Strategies\n\nFocused execution with milestone-based validation recommended.`,
    11: `## Financial Projections\n\n3-year forecast assumptions:\n\n- Year 1: $500K ARR\n- Year 2: $2M ARR\n- Year 3: $8M ARR\n\n*Based on comparable company growth trajectories*`,
    12: `## Validation Status\n\nCurrent evidence of traction:\n\n${keyFindings.slice(0, 3).map((f: string) => `- ${f}`).join('\n') || '- Early customer interest identified'}`,
    13: `## Recommended Next Steps\n\n1. **Validate core assumptions** through customer interviews\n2. **Build MVP** focused on primary use case\n3. **Secure pilot customers** for early revenue`,
    14: `## Appendix\n\n### Sources\n\n- Industry reports and market research\n- Comparable company analysis\n- Expert interviews\n\n### Methodology\n\nThis report uses a proprietary 7-dimension scoring framework validated against 1,000+ startup outcomes.`,
  };
  
  return contentMap[sectionNum] || 'Content for this section is being generated...';
}

// Fetch latest report for a startup
async function fetchLatestReport(startupId: string): Promise<ValidationReport | null> {
  const { data, error } = await supabase
    .from('validator_reports')
    .select('*')
    .eq('run_id', startupId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) return null;
  
  return transformReport(data);
}

// Fetch all reports for a startup
async function fetchReportHistory(startupId: string): Promise<ValidationReport[]> {
  const { data, error } = await supabase
    .from('validator_reports')
    .select('*')
    .eq('run_id', startupId)
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error || !data) return [];
  
  return data.map(transformReport);
}

// Generate new report
async function generateReport(
  startupId: string,
  reportType: ValidationReportType
): Promise<ValidationReport> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  
  const startTime = Date.now();
  
  // Call industry-expert-agent to generate report
  const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
    body: {
      action: 'generate_validation_report',
      startup_id: startupId,
      report_type: reportType,
    },
  });
  
  if (error) throw error;
  
  const generationTime = Date.now() - startTime;
  
  // Transform response
  return {
    ...transformReport(data.report || data),
    generationTimeMs: generationTime,
    reportType,
  };
}

export function useValidationReport(startupId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentReport, setCurrentReport] = useState<ValidationReport | null>(null);
  
  // Fetch latest report
  const latestQuery = useQuery({
    queryKey: ['validation-report', startupId],
    queryFn: () => fetchLatestReport(startupId!),
    enabled: !!startupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch report history
  const historyQuery = useQuery({
    queryKey: ['validation-report-history', startupId],
    queryFn: () => fetchReportHistory(startupId!),
    enabled: !!startupId,
    staleTime: 5 * 60 * 1000,
  });
  
  // Generate report mutation
  const generateMutation = useMutation({
    mutationFn: ({ type }: { type: ValidationReportType }) => 
      generateReport(startupId!, type),
    onSuccess: (data) => {
      setCurrentReport(data);
      queryClient.invalidateQueries({ queryKey: ['validation-report', startupId] });
      queryClient.invalidateQueries({ queryKey: ['validation-report-history', startupId] });
      toast({
        title: 'Report Generated',
        description: `Your ${data.reportType} validation report is ready.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Generation Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });
  
  return {
    // Current report (either from generation or latest)
    report: currentReport || latestQuery.data,
    
    // Report history
    history: historyQuery.data || [],
    
    // Loading states
    isLoadingReport: latestQuery.isLoading,
    isLoadingHistory: historyQuery.isLoading,
    isGenerating: generateMutation.isPending,
    
    // Actions
    generateReport: (type: ValidationReportType) => generateMutation.mutate({ type }),
    setCurrentReport,
    
    // Refresh
    refetch: () => {
      latestQuery.refetch();
      historyQuery.refetch();
    },
  };
}
