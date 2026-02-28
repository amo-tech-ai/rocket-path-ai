/**
 * HeroStatus Component (Zone 1)
 * Compact hero card: greeting, health score ring, stage, journey progress, tags.
 * Replaces: Header + JourneyStepper + SummaryMetrics (~25 data points → ~7)
 */

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { JourneyStep } from '@/hooks/useJourneyStage';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface HeroStatusProps {
  startupName: string;
  greeting: string;
  healthScore: number | null;
  healthTrend: number | null;
  journeyStep: JourneyStep;
  journeyPercent: number;
  industry: string | null;
  stage: string | null;
  isLoading: boolean;
}

// ---------------------------------------------------------------------------
// ScoreRing — compact 48px SVG circular progress
// ---------------------------------------------------------------------------

function ScoreRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex-shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="url(#heroScoreGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="heroScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TrendBadge
// ---------------------------------------------------------------------------

function TrendBadge({ trend }: { trend: number }) {
  if (trend === 0) return null;
  const positive = trend > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        positive ? 'text-status-success' : 'text-status-critical'
      }`}
    >
      {positive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {positive ? '+' : ''}
      {trend}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroStatus({
  startupName,
  greeting,
  healthScore,
  healthTrend,
  journeyStep,
  journeyPercent,
  industry,
  stage,
  isLoading,
}: HeroStatusProps) {
  if (isLoading) {
    return (
      <div className="card-premium p-5 space-y-3">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-1.5 w-32" />
          </div>
        </div>
      </div>
    );
  }

  const formattedStage = stage
    ? stage.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-5"
    >
      {/* Row 1: Greeting + Stage */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {greeting}
          </p>
          <h2 className="text-lg font-bold text-foreground mt-0.5">
            {startupName}
          </h2>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="text-xs font-semibold">
            {journeyStep.label}
          </Badge>
          <div className="mt-1.5 flex items-center gap-2">
            <Progress value={journeyPercent} className="h-1 w-20" />
            <span className="text-[10px] text-muted-foreground">
              {journeyPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Score ring + trend + tags */}
      <div className="flex items-center gap-4">
        {healthScore !== null ? (
          <ScoreRing score={healthScore} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">--</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {healthScore !== null && (
              <span className="text-sm font-semibold text-foreground">
                {healthScore}/100
              </span>
            )}
            {healthTrend !== null && <TrendBadge trend={healthTrend} />}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {industry && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {industry}
              </Badge>
            )}
            {formattedStage && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {formattedStage}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
