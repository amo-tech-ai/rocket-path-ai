import { useMemo } from 'react';

// Stage definitions - self-contained to avoid circular dependencies
export type StartupStage = 'idea' | 'pre_seed' | 'seed' | 'series_a';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  weight: number;
  progress?: number;
  target?: number;
}

export interface StageInfo {
  stage: StartupStage;
  label: string;
  description: string;
  milestones: Milestone[];
  nextStage: StartupStage | null;
  nextStageCriteria: string[];
}

export interface StageGuidanceResult {
  currentStage: StageInfo;
  progressPercent: number;
  completedMilestones: number;
  totalMilestones: number;
}

// Stage configuration
const STAGE_CONFIG: Record<StartupStage, Omit<StageInfo, 'milestones'>> = {
  idea: {
    stage: 'idea',
    label: 'Ideation',
    description: 'Validating problem and early customer discovery',
    nextStage: 'pre_seed',
    nextStageCriteria: [
      'Complete Lean Canvas',
      '20+ customer interviews',
      'MVP concept defined',
    ],
  },
  pre_seed: {
    stage: 'pre_seed',
    label: 'Validation',
    description: 'Building MVP and finding product-market fit signals',
    nextStage: 'seed',
    nextStageCriteria: [
      'Landing page live with signups',
      'First paying customers',
      'Core metrics defined',
    ],
  },
  seed: {
    stage: 'seed',
    label: 'Traction',
    description: 'Scaling acquisition channels and reducing churn',
    nextStage: 'series_a',
    nextStageCriteria: [
      'MRR > $10K',
      'Monthly churn < 5%',
      '3 acquisition channels identified',
    ],
  },
  series_a: {
    stage: 'series_a',
    label: 'Scaling',
    description: 'Team growth and market expansion',
    nextStage: null,
    nextStageCriteria: [
      'MRR > $100K',
      'Team > 10 people',
      'Series A readiness score > 80%',
    ],
  },
};

// Generate milestones based on startup data
function generateMilestones(
  stage: StartupStage,
  startupData: {
    hasLeanCanvas?: boolean;
    profileStrength?: number;
    investorCount?: number;
    taskCompletionRate?: number;
    documentCount?: number;
  }
): Milestone[] {
  const { hasLeanCanvas, profileStrength = 0, investorCount = 0, taskCompletionRate = 0, documentCount = 0 } = startupData;

  const baseMilestones: Record<StartupStage, Milestone[]> = {
    idea: [
      {
        id: 'lean-canvas',
        title: 'Complete Lean Canvas',
        description: 'Define your business model hypothesis',
        status: hasLeanCanvas ? 'completed' : 'pending',
        weight: 25,
      },
      {
        id: 'profile',
        title: 'Complete Startup Profile',
        description: 'Fill in all startup details',
        status: profileStrength >= 80 ? 'completed' : profileStrength >= 40 ? 'in_progress' : 'pending',
        weight: 20,
        progress: profileStrength,
        target: 100,
      },
      {
        id: 'customer-interviews',
        title: 'Customer Interviews',
        description: 'Talk to 20+ potential customers',
        status: 'in_progress',
        weight: 30,
        progress: Math.min(12, investorCount * 2), // Approximation
        target: 20,
      },
      {
        id: 'mvp-scope',
        title: 'Define MVP Scope',
        description: 'Document core features for first version',
        status: documentCount >= 2 ? 'completed' : 'pending',
        weight: 25,
      },
    ],
    pre_seed: [
      {
        id: 'mvp-launch',
        title: 'Launch MVP',
        description: 'Ship first working version',
        status: 'in_progress',
        weight: 30,
      },
      {
        id: 'first-users',
        title: 'Get First 100 Users',
        description: 'Acquire early adopters',
        status: 'pending',
        weight: 25,
        progress: 0,
        target: 100,
      },
      {
        id: 'first-revenue',
        title: 'First Paying Customer',
        description: 'Validate willingness to pay',
        status: 'pending',
        weight: 25,
      },
      {
        id: 'metrics-dashboard',
        title: 'Set Up Metrics',
        description: 'Track key performance indicators',
        status: taskCompletionRate >= 50 ? 'completed' : 'pending',
        weight: 20,
      },
    ],
    seed: [
      {
        id: 'mrr-10k',
        title: 'Reach $10K MRR',
        description: 'Monthly recurring revenue milestone',
        status: 'in_progress',
        weight: 30,
        progress: 0,
        target: 10000,
      },
      {
        id: 'churn-reduction',
        title: 'Reduce Churn to <5%',
        description: 'Improve customer retention',
        status: 'pending',
        weight: 25,
      },
      {
        id: 'acquisition-channels',
        title: 'Identify 3 Channels',
        description: 'Find scalable acquisition sources',
        status: 'pending',
        weight: 25,
      },
      {
        id: 'seed-pitch',
        title: 'Prepare Seed Deck',
        description: 'Create investor-ready materials',
        status: investorCount >= 5 ? 'in_progress' : 'pending',
        weight: 20,
      },
    ],
    series_a: [
      {
        id: 'mrr-100k',
        title: 'Reach $100K MRR',
        description: 'Scale to significant revenue',
        status: 'in_progress',
        weight: 30,
        progress: 0,
        target: 100000,
      },
      {
        id: 'team-growth',
        title: 'Grow Team to 10+',
        description: 'Build core team',
        status: 'pending',
        weight: 25,
        progress: 3,
        target: 10,
      },
      {
        id: 'series-a-deck',
        title: 'Series A Deck',
        description: 'Comprehensive fundraise materials',
        status: 'pending',
        weight: 25,
      },
      {
        id: 'investor-meetings',
        title: '20 Investor Meetings',
        description: 'Build investor pipeline',
        status: investorCount >= 10 ? 'in_progress' : 'pending',
        weight: 20,
        progress: investorCount,
        target: 20,
      },
    ],
  };

  return baseMilestones[stage];
}

// Calculate progress percentage from milestones
function calculateProgress(milestones: Milestone[]): number {
  let totalWeight = 0;
  let completedWeight = 0;

  for (const milestone of milestones) {
    totalWeight += milestone.weight;
    
    if (milestone.status === 'completed') {
      completedWeight += milestone.weight;
    } else if (milestone.status === 'in_progress' && milestone.progress && milestone.target) {
      const partialProgress = (milestone.progress / milestone.target) * milestone.weight;
      completedWeight += Math.min(partialProgress, milestone.weight * 0.9); // Cap at 90% for in-progress
    }
  }

  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
}

export function useStageGuidance(
  currentStage: StartupStage = 'idea',
  startupData: {
    hasLeanCanvas?: boolean;
    profileStrength?: number;
    investorCount?: number;
    taskCompletionRate?: number;
    documentCount?: number;
  } = {}
): StageGuidanceResult {
  return useMemo(() => {
    const stageConfig = STAGE_CONFIG[currentStage];
    const milestones = generateMilestones(currentStage, startupData);
    const progressPercent = calculateProgress(milestones);
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;

    return {
      currentStage: {
        ...stageConfig,
        milestones,
      },
      progressPercent,
      completedMilestones,
      totalMilestones: milestones.length,
    };
  }, [currentStage, startupData]);
}
