import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';

export interface TaskTrend {
  date: string;
  completed: number;
  created: number;
}

export interface ProjectVelocity {
  name: string;
  completed: number;
  active: number;
}

export interface PipelineConversion {
  stage: string;
  count: number;
  value: number;
}

export interface InvestorEngagement {
  status: string;
  count: number;
}

export interface AnalyticsMetrics {
  taskTrends: TaskTrend[];
  projectVelocity: ProjectVelocity[];
  pipelineConversion: PipelineConversion[];
  investorEngagement: InvestorEngagement[];
}

export function useAnalyticsMetrics(startupId: string | undefined, dateRange?: DateRange) {
  return useQuery({
    queryKey: ['analytics-metrics', startupId, dateRange?.from, dateRange?.to],
    queryFn: async (): Promise<AnalyticsMetrics> => {
      if (!startupId) {
        return {
          taskTrends: [],
          projectVelocity: [],
          pipelineConversion: [],
          investorEngagement: [],
        };
      }

      // Get date range or default to last 30 days
      const endDate = dateRange?.to || new Date();
      const startDate = dateRange?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Fetch all data in parallel
      const [tasksResult, projectsResult, dealsResult, investorsResult] = await Promise.all([
        supabase
          .from('tasks')
          .select('id, status, created_at, updated_at')
          .eq('startup_id', startupId)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('projects')
          .select('id, name, status')
          .eq('startup_id', startupId),
        supabase
          .from('deals')
          .select('id, stage, amount')
          .eq('startup_id', startupId)
          .eq('is_active', true),
        supabase
          .from('investors')
          .select('id, status')
          .eq('startup_id', startupId),
      ]);

      // Process task trends
      const taskTrends = processTaskTrends(
        tasksResult.data || [],
        startDate.toISOString(),
        endDate.toISOString()
      );

      // Process project velocity
      const projectVelocity = processProjectVelocity(projectsResult.data || []);

      // Process pipeline conversion
      const pipelineConversion = processPipelineConversion(dealsResult.data || []);

      // Process investor engagement
      const investorEngagement = processInvestorEngagement(investorsResult.data || []);

      return {
        taskTrends,
        projectVelocity,
        pipelineConversion,
        investorEngagement,
      };
    },
    enabled: !!startupId,
    staleTime: 60 * 1000, // 1 minute
  });
}

function processTaskTrends(
  tasks: Array<{ id: string; status: string; created_at: string; updated_at: string }>,
  startDate: string,
  endDate: string
): TaskTrend[] {
  const trends: Record<string, { completed: number; created: number }> = {};

  // Initialize days
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    trends[dateStr] = { completed: 0, created: 0 };
  }

  // Count tasks
  tasks.forEach((task) => {
    const createdDate = task.created_at.split('T')[0];
    if (trends[createdDate]) {
      trends[createdDate].created++;
    }
    if (task.status === 'completed') {
      const completedDate = task.updated_at.split('T')[0];
      if (trends[completedDate]) {
        trends[completedDate].completed++;
      }
    }
  });

  return Object.entries(trends)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // Last 14 days
}

function processProjectVelocity(
  projects: Array<{ id: string; name: string; status: string }>
): ProjectVelocity[] {
  const statusCounts = projects.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return [
    { name: 'Active', completed: 0, active: statusCounts['active'] || 0 },
    { name: 'Completed', completed: statusCounts['completed'] || 0, active: 0 },
    { name: 'On Hold', completed: 0, active: statusCounts['on_hold'] || 0 },
  ];
}

function processPipelineConversion(
  deals: Array<{ id: string; stage: string; amount: number | null }>
): PipelineConversion[] {
  const stageOrder = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];
  const stageData: Record<string, { count: number; value: number }> = {};

  stageOrder.forEach((stage) => {
    stageData[stage] = { count: 0, value: 0 };
  });

  deals.forEach((deal) => {
    const stage = deal.stage || 'lead';
    if (stageData[stage]) {
      stageData[stage].count++;
      stageData[stage].value += deal.amount || 0;
    }
  });

  return stageOrder.map((stage) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count: stageData[stage].count,
    value: stageData[stage].value,
  }));
}

function processInvestorEngagement(
  investors: Array<{ id: string; status: string }>
): InvestorEngagement[] {
  const statusCounts = investors.reduce(
    (acc, inv) => {
      const status = inv.status || 'researching';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    count,
  }));
}
