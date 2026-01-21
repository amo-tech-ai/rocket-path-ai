import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStartup } from '@/hooks/useDashboardData';
import { useLeanCanvas } from '@/hooks/useLeanCanvas';

export type StartupStage = 'idea' | 'pre_seed' | 'seed' | 'series_a';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress?: number;
  target?: number;
  weight: number;
  category: 'discovery' | 'product' | 'growth' | 'fundraising' | 'team';
}

export interface StageInfo {
  key: StartupStage;
  label: string;
  description: string;
  color: string;
  milestones: Milestone[];
  recommendedActions: string[];
  keyMetrics: string[];
}

export const STAGE_CONFIG: Record<StartupStage, StageInfo> = {
  idea: {
    key: 'idea',
    label: 'Ideation',
    description: 'Validating your problem and building your vision',
    color: 'hsl(var(--warm))',
    milestones: [
      { id: 'lean-canvas', title: 'Complete Lean Canvas', description: 'Fill all 9 boxes with validated hypotheses', status: 'pending', weight: 20, category: 'discovery' },
      { id: 'interviews-20', title: '20+ Customer Interviews', description: 'Talk to potential customers to validate the problem', status: 'pending', progress: 0, target: 20, weight: 25, category: 'discovery' },
      { id: 'define-mvp', title: 'Define MVP Scope', description: 'Document core features for your minimum viable product', status: 'pending', weight: 20, category: 'product' },
      { id: 'competitor-analysis', title: 'Competitor Analysis', description: 'Research 5+ competitors and identify gaps', status: 'pending', weight: 15, category: 'discovery' },
      { id: 'problem-statement', title: 'Clear Problem Statement', description: 'One sentence that captures the core problem', status: 'pending', weight: 20, category: 'discovery' },
    ],
    recommendedActions: [
      'Schedule 3 customer discovery calls this week',
      'Document your key assumptions in Lean Canvas',
      'Research your top 5 competitors',
      'Define your ideal customer profile',
    ],
    keyMetrics: ['Customer interviews', 'Validated hypotheses', 'Problem clarity score'],
  },
  pre_seed: {
    key: 'pre_seed',
    label: 'Validation',
    description: 'Testing your solution with early adopters',
    color: 'hsl(var(--sage))',
    milestones: [
      { id: 'mvp-live', title: 'Launch MVP', description: 'Get your minimum viable product in front of users', status: 'pending', weight: 25, category: 'product' },
      { id: 'first-users', title: '100 Active Users', description: 'Acquire your first 100 engaged users', status: 'pending', progress: 0, target: 100, weight: 20, category: 'growth' },
      { id: 'first-revenue', title: 'First Paying Customer', description: 'Someone values your product enough to pay', status: 'pending', weight: 25, category: 'growth' },
      { id: 'retention-defined', title: 'Define Core Metrics', description: 'Identify your north star and supporting metrics', status: 'pending', weight: 15, category: 'product' },
      { id: 'landing-page', title: 'Optimized Landing Page', description: 'Clear value prop with >5% conversion rate', status: 'pending', weight: 15, category: 'growth' },
    ],
    recommendedActions: [
      'Ship your MVP this week',
      'Set up analytics to track user behavior',
      'Run your first acquisition experiment',
      'Collect feedback from every user',
    ],
    keyMetrics: ['Active users', 'Signups', 'Activation rate', 'First revenue'],
  },
  seed: {
    key: 'seed',
    label: 'Traction',
    description: 'Growing with repeatable acquisition channels',
    color: 'hsl(var(--primary))',
    milestones: [
      { id: 'mrr-10k', title: '$10K MRR', description: 'Reach $10,000 monthly recurring revenue', status: 'pending', progress: 0, target: 10000, weight: 25, category: 'growth' },
      { id: 'churn-5', title: '<5% Monthly Churn', description: 'Prove product stickiness with low churn', status: 'pending', weight: 20, category: 'product' },
      { id: 'channels-3', title: '3 Acquisition Channels', description: 'Identify and optimize 3 repeatable channels', status: 'pending', progress: 0, target: 3, weight: 20, category: 'growth' },
      { id: 'team-5', title: 'Team of 5+', description: 'Build your core team with key hires', status: 'pending', progress: 0, target: 5, weight: 15, category: 'team' },
      { id: 'pitch-deck', title: 'Investor-Ready Pitch Deck', description: 'Compelling 10-slide deck with data', status: 'pending', weight: 20, category: 'fundraising' },
    ],
    recommendedActions: [
      'Double down on your best acquisition channel',
      'Implement cohort retention analysis',
      'Hire your first key team member',
      'Start building investor relationships',
    ],
    keyMetrics: ['MRR', 'Monthly churn', 'CAC', 'LTV', 'LTV:CAC ratio'],
  },
  series_a: {
    key: 'series_a',
    label: 'Scaling',
    description: 'Expanding market presence and team',
    color: 'hsl(var(--accent))',
    milestones: [
      { id: 'arr-1m', title: '$1M ARR', description: 'Reach $1 million annual recurring revenue', status: 'pending', progress: 0, target: 1000000, weight: 25, category: 'growth' },
      { id: 'team-15', title: 'Team of 15+', description: 'Scale team with leadership roles filled', status: 'pending', progress: 0, target: 15, weight: 20, category: 'team' },
      { id: 'series-a', title: 'Close Series A', description: 'Secure Series A funding round', status: 'pending', weight: 25, category: 'fundraising' },
      { id: 'enterprise', title: 'Enterprise Customers', description: 'Land 3+ enterprise or high-value contracts', status: 'pending', progress: 0, target: 3, weight: 15, category: 'growth' },
      { id: 'market-expand', title: 'Market Expansion', description: 'Enter new market segment or geography', status: 'pending', weight: 15, category: 'growth' },
    ],
    recommendedActions: [
      'Build your executive team',
      'Prepare detailed Series A materials',
      'Target strategic enterprise accounts',
      'Develop expansion strategy',
    ],
    keyMetrics: ['ARR', 'Net Revenue Retention', 'Burn multiple', 'Runway'],
  },
};

export const STAGE_ORDER: StartupStage[] = ['idea', 'pre_seed', 'seed', 'series_a'];

// Calculate stage progress based on startup data
function calculateStageProgress(
  stage: StartupStage,
  startup: any,
  canvasCompletion: number
): { milestones: Milestone[]; progress: number } {
  const stageInfo = STAGE_CONFIG[stage];
  const milestones = stageInfo.milestones.map(m => {
    let status = m.status;
    let progress = m.progress;

    // Auto-detect milestone completion based on data
    switch (m.id) {
      case 'lean-canvas':
        if (canvasCompletion >= 100) status = 'completed';
        else if (canvasCompletion > 50) status = 'in_progress';
        break;
      case 'mrr-10k':
        const mrr = startup?.traction_data?.mrr || 0;
        progress = mrr;
        if (mrr >= 10000) status = 'completed';
        else if (mrr > 0) status = 'in_progress';
        break;
      case 'team-5':
      case 'team-15':
        const teamSize = startup?.team_size || 1;
        progress = teamSize;
        const target = m.target || 5;
        if (teamSize >= target) status = 'completed';
        else if (teamSize > 1) status = 'in_progress';
        break;
      case 'pitch-deck':
        if (startup?.profile_strength >= 80) status = 'completed';
        else if (startup?.profile_strength >= 50) status = 'in_progress';
        break;
    }

    return { ...m, status, progress };
  });

  const completedWeight = milestones
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.weight, 0);
  
  const inProgressWeight = milestones
    .filter(m => m.status === 'in_progress')
    .reduce((sum, m) => sum + (m.weight * 0.5), 0);

  const totalWeight = milestones.reduce((sum, m) => sum + m.weight, 0);
  const progress = Math.round(((completedWeight + inProgressWeight) / totalWeight) * 100);

  return { milestones, progress };
}

export function useStageGuidance() {
  const { data: startup } = useStartup();
  const { data: canvas } = useLeanCanvas(startup?.id);

  return useQuery({
    queryKey: ['stage-guidance', startup?.id],
    queryFn: async () => {
      if (!startup) return null;

      const currentStage = (startup.stage as StartupStage) || 'idea';
      const stageInfo = STAGE_CONFIG[currentStage];
      
      // Calculate canvas completion
      const canvasData = canvas?.data;
      const filledBoxes = canvasData 
        ? Object.values(canvasData).filter((box: any) => box?.items?.length > 0).length 
        : 0;
      const canvasCompletion = Math.round((filledBoxes / 9) * 100);

      const { milestones, progress } = calculateStageProgress(
        currentStage,
        startup,
        canvasCompletion
      );

      const currentIndex = STAGE_ORDER.indexOf(currentStage);
      const nextStage = currentIndex < STAGE_ORDER.length - 1 
        ? STAGE_CONFIG[STAGE_ORDER[currentIndex + 1]]
        : null;

      return {
        currentStage: stageInfo,
        milestones,
        progress,
        nextStage,
        canvasCompletion,
        isRaising: startup.is_raising,
        raiseAmount: startup.raise_amount,
      };
    },
    enabled: !!startup,
  });
}

// Update startup stage
export function useUpdateStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ startupId, stage }: { startupId: string; stage: StartupStage }) => {
      const { data, error } = await supabase
        .from('startups')
        .update({ stage })
        .eq('id', startupId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startup'] });
      queryClient.invalidateQueries({ queryKey: ['stage-guidance'] });
    },
  });
}

// Get AI-powered stage recommendations
export function useStageRecommendations() {
  return useMutation({
    mutationFn: async (startupId: string) => {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: 'Analyze my current startup stage and provide specific, actionable recommendations for what I should focus on next. Consider my milestones, traction metrics, and team size.',
          action: 'chat',
          context: {
            screen: 'stage-guidance',
            startup_id: startupId,
          }
        }
      });

      if (error) throw error;
      return data;
    },
  });
}
