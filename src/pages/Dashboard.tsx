import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SummaryMetrics } from "@/components/dashboard/SummaryMetrics";
import { StartupHealthEnhanced } from "@/components/dashboard/StartupHealthEnhanced";
import { TodaysFocus } from "@/components/dashboard/TodaysFocus";
import { ModuleProgress } from "@/components/dashboard/ModuleProgress";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { IndustryBenchmarks } from "@/components/dashboard/IndustryBenchmarks";
import { InsightsTabs } from "@/components/dashboard/InsightsTabs";
import { AIStrategicReview } from "@/components/dashboard/AIStrategicReview";
import { EventCard } from "@/components/dashboard/EventCard";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { StageGuidanceCard } from "@/components/dashboard/StageGuidanceCard";
import { WelcomeBanner, useFirstVisitAfterOnboarding } from "@/components/dashboard/WelcomeBanner";
import { Day1PlanCard, Day1Task } from "@/components/dashboard/Day1PlanCard";
import { GuidedOverlay } from "@/components/dashboard/GuidedOverlay";
import { useStartup, useTasks, useTaskStats } from "@/hooks/useDashboardData";
import { useDashboardMetrics, useMetricChanges } from "@/hooks/useDashboardMetrics";
import { useDashboardRealtime } from "@/hooks/useRealtimeSubscription";
import { useHealthScore } from "@/hooks/useHealthScore";
import { useActionRecommender } from "@/hooks/useActionRecommender";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { useAuth } from "@/hooks/useAuth";
import { useFirstVisit } from "@/hooks/useFirstVisit";
import { StartupStage } from "@/hooks/useStageGuidance";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Bell, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: tasks = [] } = useTasks(startup?.id);

  // Task stats for welcome banner
  const { data: taskStats } = useTaskStats(startup?.id);

  // Guided mode for first-time visitors
  const { isGuidedMode, hasCompletedFirstTask, dismissGuidedMode } = useFirstVisit(startup?.id);

  // Real dashboard metrics
  const { data: metrics } = useDashboardMetrics(startup?.id);
  const { data: changes } = useMetricChanges(startup?.id);

  // Health score from edge function
  const { data: healthScore, isLoading: healthLoading } = useHealthScore(startup?.id);

  // Action recommendations based on health score
  const { data: recommendations, isLoading: actionsLoading } = useActionRecommender(
    startup?.id,
    healthScore?.breakdown
  );

  // Module progress (Canvas, Pitch, Tasks, CRM)
  const { data: moduleProgress, isLoading: moduleLoading } = useModuleProgress(startup?.id);

  // Enable real-time updates for all dashboard data
  useDashboardRealtime(startup?.id);

  // Check if first visit after onboarding
  const isFirstVisit = useFirstVisitAfterOnboarding(
    profile?.onboarding_completed,
    startup?.id
  );

  const firstName = profile?.full_name?.split(' ')[0] || 'Founder';
  const startupName = startup?.name || 'Your Startup';

  // Calculate startup data for stage guidance
  const hasLeanCanvas = (metrics?.documentsCount || 0) > 0;
  const currentStage = (startup?.stage as StartupStage) || 'idea';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Traction data from onboarding
  const tractionData = startup?.traction_data as { mrr?: number; users?: number; growth_rate_monthly?: number } | null;
  
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();

  const pendingTasks = metrics?.tasksCount || 0;

  // Day 1 Plan tasks for guided mode
  const day1Tasks: Day1Task[] = [
    {
      id: 'review-summary',
      title: 'Review your AI Summary',
      description: 'See what our AI learned about your startup',
      estimatedMinutes: 2,
      completed: false, // Could track in localStorage
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
      completed: false, // Could check if lean_canvas exists
      action: () => navigate('/lean-canvas'),
    },
  ];

  // Right panel content
  const rightPanel = (
    <div className="space-y-6">
      <StageGuidanceCard 
        stage={currentStage}
        startupId={startup?.id}
        startupData={{
          hasLeanCanvas,
          profileStrength: healthScore?.overall || startup?.profile_strength || 0,
          investorCount: metrics?.investorsCount || 0,
          taskCompletionRate: tasks.length > 0 ? Math.round(((tasks.length - pendingTasks) / tasks.length) * 100) : 0,
          documentCount: metrics?.documentsCount || 0,
        }}
      />
      <IndustryBenchmarks 
        startupId={startup?.id}
        industry={startup?.industry as string}
        stage={startup?.stage as string}
        mrr={(startup?.traction_data as any)?.mrr || 0}
        users={(startup?.traction_data as any)?.users || 0}
        growthRate={(startup?.traction_data as any)?.growth_rate_monthly || 0}
      />
      <AIStrategicReview startupId={startup?.id} />
      <EventCard />
      <DashboardCalendar />
    </div>
  );

  return (
    <DashboardLayout aiPanel={rightPanel}>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"
        >
          <div>
            <p className="text-xs font-medium text-primary tracking-wide mb-1">{dateString}</p>
            {startupLoading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                  {greeting}, {startup ? startupName : firstName}.
                </h1>
                <p className="text-muted-foreground mt-1">
                  {startup ? (
                    <>Your command center for <span className="text-primary font-medium">{startup.industry?.replace(/_/g, ' ') || 'startup'}</span> growth.</>
                  ) : (
                    'Your command center for growth and fundraising.'
                  )}
                </p>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search your startup..." 
                className="pl-9 w-48 md:w-64 bg-card"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Welcome Banner - First visit after onboarding */}
        {isFirstVisit && startup && (
          <WelcomeBanner
            startupName={startupName}
            founderName={firstName}
            profileStrength={healthScore?.overall || startup?.profile_strength || 0}
            stage={currentStage}
            industry={startup?.industry as string || ''}
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

        {/* Day 1 Plan - Guided mode for new users */}
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

        {/* Summary Metrics - Using real data */}
        <SummaryMetrics 
          decksCount={metrics?.decksCount || 0}
          investorsCount={metrics?.investorsCount || 0}
          tasksCount={pendingTasks}
          eventsCount={metrics?.eventsCount || 0}
          changes={changes}
        />

        {/* Today's Focus - AI Recommended Actions */}
        <TodaysFocus 
          actions={recommendations?.todaysFocus}
          isLoading={actionsLoading}
        />

        {/* Startup Health & Module Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StartupHealthEnhanced
            healthScore={healthScore}
            isLoading={healthLoading}
          />
          <GuidedOverlay
            isLocked={isGuidedMode && !hasCompletedFirstTask}
            tooltip="Complete your first task to unlock module progress"
          >
            <ModuleProgress
              data={moduleProgress}
              isLoading={moduleLoading}
            />
          </GuidedOverlay>
        </div>

        {/* Recent Activity Timeline */}
        <GuidedOverlay
          isLocked={isGuidedMode && !hasCompletedFirstTask}
          tooltip="Complete your first task to unlock activity timeline"
        >
          <RecentActivity startupId={startup?.id} />
        </GuidedOverlay>

        {/* Insights Tabs */}
        <GuidedOverlay
          isLocked={isGuidedMode && !hasCompletedFirstTask}
          tooltip="Complete your first task to unlock insights"
        >
          <InsightsTabs />
        </GuidedOverlay>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
