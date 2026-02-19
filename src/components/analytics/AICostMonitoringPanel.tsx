/**
 * AI Cost Monitoring Panel
 * Tracks AI API usage, costs, and spending trends
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Brain,
  DollarSign,
  Zap,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAIUsageLimits } from '@/hooks/useAIUsageLimits';
import { format, subDays } from 'date-fns';

interface AIUsageData {
  date: string;
  cost: number;
  tokens: number;
  requests: number;
}

interface AgentBreakdown {
  name: string;
  cost: number;
  requests: number;
  avgTokens: number;
}

interface AICostMonitoringPanelProps {
  startupId?: string;
  orgId?: string;
  loading?: boolean;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export function AICostMonitoringPanel({ startupId, orgId, loading: externalLoading }: AICostMonitoringPanelProps) {
  const { user } = useAuth();
  const { budgetDollars } = useAIUsageLimits();
  const [usageData, setUsageData] = useState<AIUsageData[]>([]);
  const [agentBreakdown, setAgentBreakdown] = useState<AgentBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const monthlyBudget = budgetDollars;

  useEffect(() => {
    fetchAIUsage();
  }, [startupId, orgId]);

  const fetchAIUsage = async () => {
    setLoading(true);
    try {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

      let query = supabase
        .from('ai_runs')
        .select('*')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });

      if (startupId) query = query.eq('startup_id', startupId);

      const { data: runs, error } = await query;

      if (error) throw error;

      if (runs && runs.length > 0) {
        // Process usage by date
        const dailyUsage: Record<string, AIUsageData> = {};
        const agentStats: Record<string, AgentBreakdown> = {};

        runs.forEach(run => {
          const date = format(new Date(run.created_at || ''), 'MMM dd');
          const runCost = Number(run.cost_usd) || 0;
          const runTokens = (run.input_tokens || 0) + (run.output_tokens || 0) + (run.thinking_tokens || 0);

          if (!dailyUsage[date]) {
            dailyUsage[date] = { date, cost: 0, tokens: 0, requests: 0 };
          }

          dailyUsage[date].cost += runCost;
          dailyUsage[date].tokens += runTokens;
          dailyUsage[date].requests += 1;

          // Agent breakdown
          const agentName = run.agent_name || 'unknown';
          if (!agentStats[agentName]) {
            agentStats[agentName] = { name: agentName, cost: 0, requests: 0, avgTokens: 0 };
          }
          agentStats[agentName].cost += runCost;
          agentStats[agentName].requests += 1;
          agentStats[agentName].avgTokens =
            (agentStats[agentName].avgTokens * (agentStats[agentName].requests - 1) +
            runTokens) / agentStats[agentName].requests;
        });

        setUsageData(Object.values(dailyUsage));
        setAgentBreakdown(Object.values(agentStats).sort((a, b) => b.cost - a.cost));
        setTotalCost(runs.reduce((sum, r) => sum + (Number(r.cost_usd) || 0), 0));
        setTotalTokens(runs.reduce((sum, r) => sum + ((r.input_tokens || 0) + (r.output_tokens || 0) + (r.thinking_tokens || 0)), 0));
        setTotalRequests(runs.length);
      } else {
        // No data — keep empty arrays (empty state rendered below)
        setUsageData([]);
        setAgentBreakdown([]);
        setTotalCost(0);
        setTotalTokens(0);
        setTotalRequests(0);
      }
    } catch (error) {
      console.error('Failed to fetch AI usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const budgetUsagePercent = (totalCost / monthlyBudget) * 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    
    return (
      <div className="bg-popover border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm" style={{ color: p.color }}>
            {p.name}: {p.name === 'cost' ? `$${p.value.toFixed(2)}` : p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  if (loading || externalLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Usage & Costs
            </CardTitle>
            <CardDescription>
              Monitor AI API spending and optimize usage
            </CardDescription>
          </div>
          <Badge 
            variant={budgetUsagePercent > 80 ? 'destructive' : 'secondary'}
            className="text-sm"
          >
            <DollarSign className="w-3.5 h-3.5 mr-1" />
            ${totalCost.toFixed(2)} / ${monthlyBudget}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Budget Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Budget</span>
            <span className="text-sm font-medium">{budgetUsagePercent.toFixed(0)}% used</span>
          </div>
          <Progress 
            value={budgetUsagePercent} 
            className={`h-2 ${budgetUsagePercent > 80 ? '[&>div]:bg-destructive' : ''}`}
          />
          {budgetUsagePercent > 80 && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Approaching budget limit
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-muted/50 text-center"
          >
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">${totalCost.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Total Cost</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-lg bg-muted/50 text-center"
          >
            <Zap className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{(totalTokens / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">Tokens</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-lg bg-muted/50 text-center"
          >
            <BarChart3 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{totalRequests}</p>
            <p className="text-xs text-muted-foreground">Requests</p>
          </motion.div>
        </div>

        {totalRequests === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Brain className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No AI usage data yet</p>
            <p className="text-xs text-muted-foreground mt-1">Usage will appear here as you use AI features</p>
          </div>
        ) : (
        <Tabs defaultValue="trend" className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="trend">Spending Trend</TabsTrigger>
            <TabsTrigger value="agents">By Agent</TabsTrigger>
          </TabsList>

          <TabsContent value="trend">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData}>
                  <defs>
                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#costGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {agentBreakdown.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div 
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{agent.name}</span>
                        <span className="text-sm font-bold">${agent.cost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{agent.requests} requests</span>
                        <span>•</span>
                        <span>{Math.round(agent.avgTokens).toLocaleString()} avg tokens</span>
                      </div>
                      <Progress 
                        value={(agent.cost / totalCost) * 100} 
                        className="h-1 mt-1"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

export default AICostMonitoringPanel;
