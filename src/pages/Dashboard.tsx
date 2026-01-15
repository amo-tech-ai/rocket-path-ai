import DashboardLayout from "@/components/layout/DashboardLayout";
import AIPanel from "@/components/dashboard/AIPanel";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { ProjectList } from "@/components/dashboard/ProjectList";
import { DealsPipeline } from "@/components/dashboard/DealsPipeline";
import { 
  useStartup, 
  useProjects, 
  useTasks, 
  useDeals,
  useKeyMetrics,
  formatCurrency,
  formatNumber
} from "@/hooks/useDashboardData";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { profile } = useAuth();
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: projects = [], isLoading: projectsLoading } = useProjects(startup?.id);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(startup?.id);
  const { data: deals = [], isLoading: dealsLoading } = useDeals(startup?.id);
  
  const metrics = useKeyMetrics(startup);
  
  // Get first name for greeting
  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  
  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  
  // Count priority tasks
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  return (
    <DashboardLayout aiPanel={<AIPanel />}>
      <div className="max-w-5xl">
        {/* Page header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {startupLoading ? (
            <>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-1">
                {greeting}, {firstName}
              </h1>
              <p className="text-muted-foreground">
                {startup ? (
                  <>
                    Here's {startup.name} at a glance.
                    {pendingTasks > 0 && ` You have ${pendingTasks} priority task${pendingTasks !== 1 ? 's' : ''} for today.`}
                  </>
                ) : (
                  "Welcome to StartupAI. Set up your startup profile to get started."
                )}
              </p>
            </>
          )}
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="MRR"
            value={formatCurrency(metrics.mrr)}
            change={metrics.growthRate > 0 ? `+${metrics.growthRate}%` : undefined}
            trend={metrics.growthRate > 0 ? 'up' : 'neutral'}
            index={0}
          />
          <MetricCard
            label="Active Users"
            value={formatNumber(metrics.users)}
            trend="neutral"
            index={1}
          />
          <MetricCard
            label="Customers"
            value={formatNumber(metrics.customers)}
            trend="neutral"
            index={2}
          />
          <MetricCard
            label="Team Size"
            value={String(metrics.teamSize)}
            trend="neutral"
            index={3}
          />
        </div>

        {/* Fundraising Banner (if raising) */}
        {metrics.isRaising && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 p-4 rounded-2xl bg-sage-light border border-sage/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-foreground">
                  Currently Raising
                </p>
                <p className="text-xl font-semibold text-sage-foreground">
                  {formatCurrency(metrics.raiseAmount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-sage-foreground/70">Pipeline Value</p>
                <p className="text-lg font-semibold text-sage-foreground">
                  {formatCurrency(deals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0))}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Priorities */}
          <TaskList 
            tasks={tasks as Array<{
              id: string;
              title: string;
              status: string | null;
              priority: string | null;
              project: { name: string } | null;
            }>} 
            isLoading={tasksLoading || startupLoading} 
          />

          {/* Active Projects */}
          <ProjectList 
            projects={projects} 
            isLoading={projectsLoading || startupLoading} 
          />
        </div>

        {/* Deals Pipeline */}
        <DealsPipeline 
          deals={deals} 
          isLoading={dealsLoading || startupLoading} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
