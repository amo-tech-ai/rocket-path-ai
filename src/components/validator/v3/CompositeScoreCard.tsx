/**
 * CompositeScoreCard — Big score display with verdict badge + sub-score breakdown.
 * Uses SubScoreBar for each sub-score.
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubScoreBar } from './SubScoreBar';
import type { SubScore, Verdict } from '@/types/v3-report';

interface CompositeScoreCardProps {
  score: number;
  subScores: SubScore[];
  verdict?: Verdict;
  dimensionColor?: string;
}

const VERDICT_STYLES: Record<Verdict, { bg: string; text: string; label: string }> = {
  GO: {
    bg: 'bg-emerald-100 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'GO',
  },
  CAUTION: {
    bg: 'bg-amber-100 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'CAUTION',
  },
  'NO-GO': {
    bg: 'bg-red-100 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-400',
    label: 'NO-GO',
  },
};

function getVerdict(score: number): Verdict {
  if (score >= 75) return 'GO';
  if (score >= 50) return 'CAUTION';
  return 'NO-GO';
}

export const CompositeScoreCard = memo(function CompositeScoreCard({
  score,
  subScores,
  verdict,
  dimensionColor,
}: CompositeScoreCardProps) {
  const resolvedVerdict = verdict ?? getVerdict(score);
  const style = VERDICT_STYLES[resolvedVerdict];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* Big score number */}
          <div className="flex items-baseline gap-2">
            <span
              className="text-5xl font-display font-bold tabular-nums"
              style={dimensionColor ? { color: dimensionColor } : undefined}
            >
              {score}
            </span>
            <span className="text-lg text-muted-foreground font-medium">/100</span>
          </div>

          {/* Verdict badge */}
          <Badge
            className={cn(
              'text-sm px-3 py-1 font-bold tracking-wide',
              style.bg,
              style.text,
              'border-transparent',
            )}
          >
            {style.label}
          </Badge>
        </div>
      </CardHeader>

      {subScores.length > 0 && (
        <CardContent className="space-y-3">
          {subScores.map((sub) => (
            <SubScoreBar
              key={sub.id}
              label={sub.label}
              score={sub.score}
              weight={sub.weight}
              color={sub.color || dimensionColor}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
});
