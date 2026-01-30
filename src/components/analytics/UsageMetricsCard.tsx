/**
 * Usage Metrics Card
 * Displays platform usage statistics and trends
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  MessageSquare,
  Zap,
  Activity,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UsageMetric {
  label: string;
  value: number;
  previousValue?: number;
  unit?: string;
  limit?: number;
  icon: React.ReactNode;
}

interface UsageMetricsCardProps {
  metrics?: UsageMetric[];
  loading?: boolean;
  title?: string;
  description?: string;
}

export function UsageMetricsCard({ 
  metrics, 
  loading = false,
  title = "Platform Usage",
  description = "Track your team's activity and resource consumption"
}: UsageMetricsCardProps) {
  const defaultMetrics: UsageMetric[] = [
    {
      label: 'Active Users',
      value: 5,
      previousValue: 4,
      icon: <Users className="w-4 h-4" />
    },
    {
      label: 'Documents Created',
      value: 24,
      previousValue: 18,
      unit: 'this month',
      icon: <FileText className="w-4 h-4" />
    },
    {
      label: 'AI Conversations',
      value: 156,
      previousValue: 120,
      unit: 'this month',
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      label: 'Tasks Completed',
      value: 48,
      previousValue: 35,
      unit: 'this week',
      icon: <Zap className="w-4 h-4" />
    }
  ];

  const displayMetrics = metrics || defaultMetrics;

  const getTrend = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change >= 0 ? 'up' : 'down',
      percentage: Math.abs(change).toFixed(0)
    };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {displayMetrics.map((metric, index) => {
            const trend = getTrend(metric.value, metric.previousValue);
            
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-md bg-background">
                    {metric.icon}
                  </div>
                  {trend && (
                    <Badge 
                      variant={trend.direction === 'up' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {trend.direction === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {trend.percentage}%
                    </Badge>
                  )}
                </div>
                
                <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                
                {metric.limit && (
                  <div className="mt-2">
                    <Progress 
                      value={(metric.value / metric.limit) * 100} 
                      className="h-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.value} / {metric.limit} {metric.unit}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default UsageMetricsCard;
