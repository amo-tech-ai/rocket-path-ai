/**
 * Dashboard — Focus + Expand layout
 *
 * 3 zones, ~25 data points visible by default:
 *   Zone 1: HeroStatus — score, stage, journey, tags
 *   Zone 2: FocusActions — top 3 AI-recommended actions
 *   Zone 3: QuickGlance — collapsible Risks / Health / Feed
 *
 * Conditional cards (unchanged):
 *   - WelcomeBanner — first-visit only
 *   - Day1PlanCard — guided mode only
 */

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { HeroStatus } from '@/components/dashboard/HeroStatus';
import { FocusActions } from '@/components/dashboard/FocusActions';
import { QuickGlance } from '@/components/dashboard/QuickGlance';
import { WelcomeBanner, useFirstVisitAfterOnboarding } from '@/components/dashboard/WelcomeBanner';
import { Day1PlanCard, Day1Task } from '@/components/dashboard/Day1PlanCard';
import { useStartup, useTaskStats } from '@/hooks/useDashboardData';
import { useDashboardRealtime } from '@/hooks/useRealtimeSubscription';
import { useHealthScore } from '@/hooks/useHealthScore';
import { useActionRecommender } from '@/hooks/useActionRecommender';
import { useModuleProgress } from '@/hooks/useModuleProgress';
import { useTopRisks } from '@/hooks/useTopRisks';
import { useAuth } from '@/hooks/useAuth';
import { useFirstVisit } from '@/hooks/useFirstVisit';
import { StartupStage } from '@/hooks/useStageGuidance';
import { useJourneyStage } from '@/hooks/useJourneyStage';
import { useAIAssistant } from '@/providers/AIAssistantProvider';
import { AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: startup, isLoading: startupLoading } = useStartup();

  // Task stats for welcome banner
  const { data: taskStats } = useTaskStats(startup?.id);

  // Guided mode for first-time visitors
  const { isGuidedMode, hasCompletedFirstTask, dismissGuidedMode } = useFirstVisit(startup?.id);

  // Health score from edge function
  const { data: healthScore, isLoading: healthLoading } = useHealthScore(startup?.id);

  // Action recommendations based on health score
  const { data: recommendations, isLoading: actionsLoading } = useActionRecommender(
    startup?.id,
    healthScore?.breakdown,
  );

  // Module progress (for journey calculation)
  const { data: moduleProgress } = useModuleProgress(startup?.id);

  // Top risks (derived from health breakdown)
  const topRisks = useTopRisks(healthScore?.breakdown, healthScore?.warnings);

  // Journey stage (derived from existing data, no extra queries)
  const journey = useJourneyStage({
    hasStartup: !!startup,
    validationScore: healthScore?.overall ?? null,
    canvasProgress: moduleProgress?.canvasProgress ?? 0,
    experimentCount: 0,
    sprintProgress: 0,
    healthScore: healthScore?.overall ?? 0,
  });

  // Enable real-time updates for all dashboard data
  useDashboardRealtime(startup?.id);

  // Check if first visit after onboarding
  const isFirstVisit = useFirstVisitAfterOnboarding(
    profile?.onboarding_completed,
    startup?.id,
  );

  // Memoize risk titles to prevent cascading re-renders
  const topRiskTitles = useMemo(() => topRisks.map((r) => r.title), [topRisks]);

  // Dispatch dashboard context to AI assistant for contextual prompts
  const { setDashboardContext } = useAIAssistant();
  useEffect(() => {
    setDashboardContext({
      healthScore: healthScore?.overall ?? null,
      healthTrend: healthScore?.trend ?? null,
      topRisks: topRiskTitles,
      currentStage: startup?.stage ?? null,
      journeyPercent: journey.percentComplete,
    });
    return () => setDashboardContext(null);
  }, [
    healthScore?.overall,
    healthScore?.trend,
    topRiskTitles,
    startup?.stage,
    journey.percentComplete,
    setDashboardContext,
  ]);

  // Computed values
  const startupName = startup?.name || 'Your Startup';
  const currentStage = (startup?.stage as StartupStage) || 'idea';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Traction data from onboarding
  const tractionData = startup?.traction_data as { mrr?: number; users?: number; growth_rate_monthly?: number } | null;
  const firstName = profile?.full_name?.split(' ')[0] || 'Founder';

  // Day 1 Plan tasks for guided mode
  const day1Tasks: Day1Task[] = [
    {
      id: 'review-summary',
      title: 'Review your AI Summary',
      description: 'See what our AI learned about your startup',
      estimatedMinutes: 2,
      completed: false,
      action: () => navigate('/company-profile'),
    },
    {
      id: 'first-task',
      title: 'Complete your first task',
      description: 'Take action on the top priority item',
      estimatedMinutes: 10,
      completed: hasCompletedFirstTask,
      action: () => navigate('/tasks'),
    },
    {
      id: 'lean-canvas',
      title: 'Generate your Lean Canvas',
      description: 'Create a strategic business model canvas',
      estimatedMinutes: 5,
      completed: false,
      action: () => navigate('/lean-canvas'),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Zone 1: Hero Status */}
        <HeroStatus
          startupName={startupName}
          greeting={greeting}
          healthScore={healthScore?.overall ?? null}
          healthTrend={healthScore?.trend ?? null}
          journeyStep={journey.currentStep}
          journeyPercent={journey.percentComplete}
          industry={startup?.industry ?? null}
          stage={startup?.stage ?? null}
          isLoading={startupLoading || healthLoading}
        />

        {/* Conditional: Welcome Banner — first visit only */}
        {isFirstVisit && startup && (
          <WelcomeBanner
            startupName={startupName}
            founderName={firstName}
            profileStrength={healthScore?.overall || startup?.profile_strength || 0}
            stage={currentStage}
            industry={(startup?.industry as string) || ''}
            tractionData={{
              mrr: tractionData?.mrr || 0,
              users: tractionData?.users || 0,
              growthRate: tractionData?.growth_rate_monthly || 0,
            }}
            tasks={{
              total: taskStats?.total || 0,
              pending: taskStats?.pending || 0,
            }}
          />
        )}

        {/* Conditional: Day 1 Plan — guided mode only */}
        <AnimatePresence>
          {isGuidedMode && startup && (
            <Day1PlanCard
              startupName={startupName}
              tasks={day1Tasks}
              canDismiss={hasCompletedFirstTask}
              onDismiss={dismissGuidedMode}
            />
          )}
        </AnimatePresence>

        {/* Zone 2: Focus Actions */}
        <FocusActions
          startupId={startup?.id}
          fallbackActions={recommendations?.todaysFocus}
          fallbackLoading={actionsLoading}
        />

        {/* Zone 3: Quick Glance (all collapsed) */}
        <QuickGlance
          risks={topRisks}
          healthScore={healthScore}
          healthLoading={healthLoading}
          startupId={startup?.id}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
