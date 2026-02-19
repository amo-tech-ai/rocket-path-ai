/**
 * IndustryBenchmarks Component
 * Displays MRR vs Seed Average and other industry comparisons
 * Uses industry-expert-agent for real data
 */

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  Users,
  DollarSign,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getIndustryLabel } from '@/constants/industries';

interface BenchmarkData {
  mrrComparison: {
    yours: number;
    seedAverage: number;
    percentile: number;
  };
  growthComparison: {
    yours: number;
    seedAverage: number;
    percentile: number;
  };
  usersComparison: {
    yours: number;
    seedAverage: number;
    percentile: number;
  };
  runwayComparison: {
    yours: number;
    seedAverage: number;
    percentile: number;
  };
}

interface IndustryBenchmarksProps {
  startupId?: string;
  industry?: string;
  stage?: string;
  mrr?: number;
  users?: number;
  growthRate?: number;
}

export function IndustryBenchmarks({ 
  startupId, 
  industry,
  stage = 'Seed',
  mrr = 0,
  users = 0,
  growthRate = 0
}: IndustryBenchmarksProps) {
  const { data: benchmarks, isLoading } = useQuery({
    queryKey: ['industry-benchmarks', startupId, industry],
    queryFn: async (): Promise<BenchmarkData> => {
      if (!industry) {
        return getDefaultBenchmarks(mrr, users, growthRate);
      }

      try {
        const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
          body: { 
            action: 'get_benchmarks',
            industry,
            stage,
            metrics: { mrr, users, growthRate }
          },
        });

        if (error || !data?.benchmarks) {
          return getDefaultBenchmarks(mrr, users, growthRate);
        }

        return data.benchmarks as BenchmarkData;
      } catch {
        return getDefaultBenchmarks(mrr, users, growthRate);
      }
    },
    enabled: !!startupId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="card-premium p-4">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!benchmarks) return null;

  const metrics = [
    {
      label: 'MRR',
      icon: DollarSign,
      yours: formatCurrency(benchmarks.mrrComparison.yours),
      average: formatCurrency(benchmarks.mrrComparison.seedAverage),
      percentile: benchmarks.mrrComparison.percentile,
      color: getPercentileColor(benchmarks.mrrComparison.percentile),
    },
    {
      label: 'Growth Rate',
      icon: TrendingUp,
      yours: `${benchmarks.growthComparison.yours}%`,
      average: `${benchmarks.growthComparison.seedAverage}%`,
      percentile: benchmarks.growthComparison.percentile,
      color: getPercentileColor(benchmarks.growthComparison.percentile),
    },
    {
      label: 'Active Users',
      icon: Users,
      yours: formatNumber(benchmarks.usersComparison.yours),
      average: formatNumber(benchmarks.usersComparison.seedAverage),
      percentile: benchmarks.usersComparison.percentile,
      color: getPercentileColor(benchmarks.usersComparison.percentile),
    },
  ];

  return (
    <div className="card-premium p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Industry Benchmarks
          </span>
        </div>
        {industry && (
          <Badge variant="outline" className="text-xs">
            {getIndustryLabel(industry)}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.percentile >= 50 ? TrendingUp : 
                           metric.percentile < 30 ? TrendingDown : Minus;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                    <Icon className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendIcon className={`w-3 h-3 ${metric.color}`} />
                  <span className={`text-xs font-medium ${metric.color}`}>
                    P{metric.percentile}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress value={metric.percentile} className="h-2" />
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-semibold text-foreground">{metric.yours}</p>
                  <p className="text-xs text-muted-foreground">vs {metric.average}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-primary" />
          <p className="text-xs text-muted-foreground">
            {benchmarks.mrrComparison.percentile >= 75 
              ? "You're outperforming most startups at your stage!" 
              : benchmarks.mrrComparison.percentile >= 50
              ? "You're tracking well against industry averages."
              : "Focus on key metrics to improve your standing."}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getDefaultBenchmarks(mrr: number, users: number, growthRate: number): BenchmarkData {
  // Default Seed stage benchmarks
  const seedMrrAvg = 15000;
  const seedGrowthAvg = 15;
  const seedUsersAvg = 1000;
  const seedRunwayAvg = 18;

  return {
    mrrComparison: {
      yours: mrr,
      seedAverage: seedMrrAvg,
      percentile: Math.min(Math.round((mrr / seedMrrAvg) * 50), 99),
    },
    growthComparison: {
      yours: growthRate,
      seedAverage: seedGrowthAvg,
      percentile: Math.min(Math.round((growthRate / seedGrowthAvg) * 50), 99),
    },
    usersComparison: {
      yours: users,
      seedAverage: seedUsersAvg,
      percentile: Math.min(Math.round((users / seedUsersAvg) * 50), 99),
    },
    runwayComparison: {
      yours: 12,
      seedAverage: seedRunwayAvg,
      percentile: 50,
    },
  };
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
}

function getPercentileColor(percentile: number): string {
  if (percentile >= 75) return 'text-status-success';
  if (percentile >= 50) return 'text-status-warning';
  return 'text-status-critical';
}

export default IndustryBenchmarks;
