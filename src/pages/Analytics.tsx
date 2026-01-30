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
import { UsageMetricsCard } from "@/components/analytics/UsageMetricsCard";
import { ConversionTrackingChart } from "@/components/analytics/ConversionTrackingChart";
import { AICostMonitoringPanel } from "@/components/analytics/AICostMonitoringPanel";
import { TeamPresenceIndicator } from "@/components/collaboration/TeamPresenceIndicator";
import { useAnalyticsMetrics } from "@/hooks/useAnalytics";
import { useStartup } from "@/hooks/useDashboardData";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Target, RefreshCw, Download, Brain, Filter, Activity } from "lucide-react";
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
              Track your startup's performance, AI usage, and growth metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <TeamPresenceIndicator 
              channelName={`analytics:${startup?.id || 'global'}`}
              currentPage="Analytics"
              compact
            />
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
            <TabsTrigger value="usage">
              <Activity className="w-4 h-4 mr-1" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="conversion">
              <Filter className="w-4 h-4 mr-1" />
              Conversion
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Brain className="w-4 h-4 mr-1" />
              AI Costs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TaskCompletionChart data={metrics?.taskTrends} loading={isLoading} />
              <ProjectVelocityChart data={metrics?.projectVelocity} loading={isLoading} />
              <PipelineConversionChart data={metrics?.pipelineConversion} loading={isLoading} />
              <InvestorEngagementChart data={metrics?.investorEngagement} loading={isLoading} />
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsageMetricsCard loading={isLoading} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Activity Heatmap
                  </CardTitle>
                  <CardDescription>
                    Team activity patterns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Activity data visualization</p>
                      <p className="text-xs">Coming with more usage data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConversionTrackingChart 
                title="Investor Pipeline Conversion"
                type="funnel"
                loading={isLoading}
              />
              <ConversionTrackingChart 
                title="Deal Stage Progression"
                type="bar"
                data={[
                  { name: 'Lead', value: metrics?.pipelineConversion?.find(p => p.stage === 'Lead')?.count || 0 },
                  { name: 'Qualified', value: metrics?.pipelineConversion?.find(p => p.stage === 'Qualified')?.count || 0 },
                  { name: 'Proposal', value: metrics?.pipelineConversion?.find(p => p.stage === 'Proposal')?.count || 0 },
                  { name: 'Negotiation', value: metrics?.pipelineConversion?.find(p => p.stage === 'Negotiation')?.count || 0 },
                  { name: 'Closed', value: metrics?.pipelineConversion?.find(p => p.stage === 'Closed')?.count || 0 },
                ]}
                loading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AICostMonitoringPanel 
                startupId={startup?.id}
                loading={isLoading}
              />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Efficiency Insights
                  </CardTitle>
                  <CardDescription>
                    Optimize AI usage and reduce costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-chart-2" />
                        <span className="text-sm font-medium">Efficient Usage</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        AI Chat has optimal token usage with 2.5k avg per request
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-chart-4" />
                        <span className="text-sm font-medium">Optimization Tip</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Consider caching frequent investor research queries
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium">Cost Saving</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Using smaller models for simple tasks saves ~40% costs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
