/**
 * Validation Maturity — shows each dimension's validation stage.
 * Vertical list format: each dimension gets a row with its stage badge and score.
 * 4 stages: Hypothesis (<25) → Testing (25-50) → Evidence (50-75) → Validated (75+)
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface Dimension {
  name: string;
  score: number;
  weight?: number;
}

interface MaturityFunnelProps {
  dimensions: Dimension[];
}

const STAGES = [
  { key: 'hypothesis', label: 'Just a guess', min: 0, max: 25, pill: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  { key: 'testing', label: 'Needs testing', min: 25, max: 50, pill: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  { key: 'evidence', label: 'Some proof', min: 50, max: 75, pill: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  { key: 'validated', label: 'Proven', min: 75, max: 101, pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
] as const;

function getStage(score: number) {
  return STAGES.find(s => score >= s.min && score < s.max) || STAGES[0];
}

export const MaturityFunnel = memo(function MaturityFunnel({
  dimensions,
}: MaturityFunnelProps) {
  if (dimensions.length === 0) return null;

  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const validatedCount = dimensions.filter(d => d.score >= 75).length;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          How proven is each area?
        </h3>
        <span className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{validatedCount}/{dimensions.length}</span> proven
        </span>
      </div>

      {/* Stage legend */}
      <div className="flex flex-wrap gap-2">
        {STAGES.map(stage => {
          const count = dimensions.filter(d => d.score >= stage.min && d.score < stage.max).length;
          return (
            <div key={stage.key} className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', stage.dot)} />
              <span className="text-[10px] text-muted-foreground">
                {stage.label} <span className="font-medium text-foreground">{count}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Dimension rows */}
      <div className="space-y-2">
        {sorted.map((dim) => {
          const stage = getStage(dim.score);
          return (
            <div
              key={dim.name}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-2.5"
            >
              {/* Stage badge */}
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5 border shrink-0',
                stage.pill,
              )}>
                {stage.label}
              </span>
              {/* Dimension name — full, no truncation */}
              <span className="text-sm text-foreground flex-1">
                {dim.name}
              </span>
              {/* Score */}
              <span className="text-sm font-semibold tabular-nums text-foreground shrink-0">
                {dim.score}
              </span>
            </div>
          );
        })}
      </div>

      {/* What this means */}
      <p className="text-[11px] text-muted-foreground leading-snug">
        Green means you have real evidence this works. Red means it's still just a guess — you need to test it before investing time or money.
      </p>
    </div>
  );
});
