import DashboardLayout from "@/components/layout/DashboardLayout";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SummaryMetrics } from "@/components/dashboard/SummaryMetrics";
import { StartupHealth } from "@/components/dashboard/StartupHealth";
import { DeckActivity } from "@/components/dashboard/DeckActivity";
import { InsightsTabs } from "@/components/dashboard/InsightsTabs";
import { AIStrategicReview } from "@/components/dashboard/AIStrategicReview";
import { EventCard } from "@/components/dashboard/EventCard";
import { DashboardCalendar } from "@/components/dashboard/DashboardCalendar";
import { StageGuidanceCard } from "@/components/dashboard/StageGuidanceCard";
import { useStartup, useTasks } from "@/hooks/useDashboardData";
import { useDashboardMetrics, useMetricChanges } from "@/hooks/useDashboardMetrics";
import { useAuth } from "@/hooks/useAuth";
import { StartupStage } from "@/hooks/useStageGuidance";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Bell, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: tasks = [] } = useTasks(startup?.id);
  
  // Real dashboard metrics
  const { data: metrics } = useDashboardMetrics(startup?.id);
  const { data: changes } = useMetricChanges(startup?.id);

  const firstName = profile?.full_name?.split(' ')[0] || 'Founder';
  
  // Calculate startup data for stage guidance
  const hasLeanCanvas = (metrics?.documentsCount || 0) > 0;
  const currentStage = (startup?.stage as StartupStage) || 'idea';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();

  const pendingTasks = metrics?.tasksCount || 0;

  // Right panel content
  const rightPanel = (
    <div className="space-y-6">
      <StageGuidanceCard 
        stage={currentStage}
        startupData={{
          hasLeanCanvas,
          profileStrength: startup?.profile_strength || 0,
          investorCount: metrics?.investorsCount || 0,
          taskCompletionRate: tasks.length > 0 ? Math.round(((tasks.length - pendingTasks) / tasks.length) * 100) : 0,
          documentCount: metrics?.documentsCount || 0,
        }}
      />
      <AIStrategicReview />
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
                  {greeting}, {firstName}.
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your command center for growth and fundraising.
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

        {/* Summary Metrics - Using real data */}
        <SummaryMetrics 
          decksCount={metrics?.decksCount || 0}
          investorsCount={metrics?.investorsCount || 0}
          tasksCount={pendingTasks}
          eventsCount={metrics?.eventsCount || 0}
          changes={changes}
        />

        {/* Startup Health & Deck Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StartupHealth 
            overallScore={startup?.profile_strength || 75}
            brandStoryScore={80}
            tractionScore={40}
          />
          <DeckActivity />
        </div>

        {/* Insights Tabs */}
        <InsightsTabs />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;