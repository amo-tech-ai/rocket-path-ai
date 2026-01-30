/**
 * StartupHealthEnhanced Component
 * Displays 6-component health score with visual breakdown
 */

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { HealthScore, HealthBreakdown } from '@/hooks/useHealthScore';

interface StartupHealthEnhancedProps {
  healthScore: HealthScore | undefined;
  isLoading: boolean;
}

const CATEGORY_COLORS: Record<keyof HealthBreakdown, string> = {
  problemClarity: 'bg-blue-500',
  solutionFit: 'bg-emerald-500',
  marketUnderstanding: 'bg-violet-500',
  tractionProof: 'bg-amber-500',
  teamReadiness: 'bg-rose-500',
  investorReadiness: 'bg-cyan-500',
};

export function StartupHealthEnhanced({ healthScore, isLoading }: StartupHealthEnhancedProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="card-premium p-5 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-6">
          <Skeleton className="w-28 h-28 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const score = healthScore?.overall ?? 0;
  const trend = healthScore?.trend ?? 0;
  const breakdown = healthScore?.breakdown;
  const warnings = healthScore?.warnings ?? [];

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const breakdownEntries = breakdown ? Object.entries(breakdown) as [keyof HealthBreakdown, { score: number; weight: number; label: string }][] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-premium p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Startup Health</h3>
          {trend !== 0 && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend > 0 ? '+' : ''}{trend}
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:text-primary/80 h-auto p-0 font-medium"
          onClick={() => navigate('/company-profile')}
        >
          View Report
        </Button>
      </div>

      <div className="flex items-start gap-6">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg className="w-28 h-28 -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="url(#healthGradientEnhanced)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="healthGradientEnhanced" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{score}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">/100</span>
          </div>
        </div>

        {/* Score Breakdown - 6 Categories */}
        <div className="flex-1 space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
          {breakdownEntries.map(([key, data]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{data.label}</span>
                <span className="text-xs font-semibold text-muted-foreground">{data.score}/100</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.score}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full rounded-full ${CATEGORY_COLORS[key]}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              {warnings.map((warning, i) => (
                <p key={i} className="text-xs text-amber-600 dark:text-amber-400">{warning}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Tip */}
      {breakdownEntries.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-accent border border-primary/10">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-semibold text-primary">AI Tip: </span>
              <span className="text-xs text-accent-foreground">
                {getAITip(breakdownEntries)}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function getAITip(breakdown: [keyof HealthBreakdown, { score: number; weight: number; label: string }][]): string {
  const sorted = [...breakdown].sort((a, b) => a[1].score - b[1].score);
  const weakest = sorted[0];
  
  if (!weakest) return 'Keep building! Every improvement counts.';
  
  const tips: Record<keyof HealthBreakdown, string> = {
    problemClarity: 'Focus on defining your problem statement more clearly in your Lean Canvas.',
    solutionFit: 'Strengthen your unique value proposition to stand out from competitors.',
    marketUnderstanding: 'Add more market research and customer segment details.',
    tractionProof: 'Log recent customer wins, metrics, or milestones to boost your traction score.',
    teamReadiness: 'Complete your team profile and highlight relevant experience.',
    investorReadiness: 'Complete your pitch deck and prepare investor materials.',
  };
  
  return tips[weakest[0]] || 'Keep building! Every improvement counts.';
}
