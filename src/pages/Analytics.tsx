import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCompletionChart } from "@/components/analytics/TaskCompletionChart";
import { ProjectVelocityChart } from "@/components/analytics/ProjectVelocityChart";
import { PipelineConversionChart } from "@/components/analytics/PipelineConversionChart";
import { InvestorEngagementChart } from "@/components/analytics/InvestorEngagementChart";
import { DateRangeFilter } from "@/components/analytics/DateRangeFilter";
import { useAnalyticsMetrics } from "@/hooks/useAnalytics";
import { useStartup } from "@/hooks/useDashboardData";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Target, RefreshCw, Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useState } from "react";

export default function Analytics() {
  const { data: startup } = useStartup();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const { data: metrics, isLoading, refetch, isRefetching } = useAnalyticsMetrics(
    startup?.id,
    dateRange
  );

  const handleExport = () => {
    if (!metrics) return;
    
    const dataStr = JSON.stringify(metrics, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your startup's performance and growth metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={!metrics}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStatCard
            title="Tasks Completed"
            value={metrics?.taskTrends?.reduce((sum, t) => sum + t.completed, 0) || 0}
            icon={<Target className="w-5 h-5" />}
            loading={isLoading}
          />
          <QuickStatCard
            title="Active Projects"
            value={metrics?.projectVelocity?.find(p => p.name === 'Active')?.active || 0}
            icon={<TrendingUp className="w-5 h-5" />}
            loading={isLoading}
          />
          <QuickStatCard
            title="Pipeline Deals"
            value={metrics?.pipelineConversion?.reduce((sum, p) => sum + p.count, 0) || 0}
            icon={<BarChart3 className="w-5 h-5" />}
            loading={isLoading}
          />
          <QuickStatCard
            title="Investors Tracked"
            value={metrics?.investorEngagement?.reduce((sum, i) => sum + i.count, 0) || 0}
            icon={<Users className="w-5 h-5" />}
            loading={isLoading}
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TaskCompletionChart data={metrics?.taskTrends} loading={isLoading} />
              <ProjectVelocityChart data={metrics?.projectVelocity} loading={isLoading} />
              <PipelineConversionChart data={metrics?.pipelineConversion} loading={isLoading} />
              <InvestorEngagementChart data={metrics?.investorEngagement} loading={isLoading} />
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <TaskCompletionChart data={metrics?.taskTrends} loading={isLoading} fullWidth />
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <PipelineConversionChart data={metrics?.pipelineConversion} loading={isLoading} fullWidth />
            </div>
          </TabsContent>

          <TabsContent value="investors" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              <InvestorEngagementChart data={metrics?.investorEngagement} loading={isLoading} fullWidth />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function QuickStatCard({ 
  title, 
  value, 
  icon, 
  loading 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">{icon}</div>
          {loading ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <span className="text-2xl font-bold">{value}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{title}</p>
      </CardContent>
    </Card>
  );
}
