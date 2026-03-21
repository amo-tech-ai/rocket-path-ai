/**
 * Validation Scorecard — horizontal bar chart showing each dimension's score.
 * Replaces the radar/spider chart which was hard to interpret.
 * Each dimension is a labeled bar with score, color-coded by performance level.
 */
import { memo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Dimension {
  name: string;
  score: number;
  weight?: number;
}

interface ValidationRadarProps {
  dimensions: Dimension[];
}

function barColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-primary';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function levelLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: 'Strong', color: 'text-emerald-600' };
  if (score >= 60) return { text: 'Good', color: 'text-primary' };
  if (score >= 40) return { text: 'Needs Work', color: 'text-amber-600' };
  return { text: 'Critical', color: 'text-red-600' };
}

export const ValidationRadar = memo(function ValidationRadar({
  dimensions,
}: ValidationRadarProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (dimensions.length < 2) return null;

  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const avgScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  );
  const avgLevel = levelLabel(avgScore);

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          How strong is this idea?
        </h3>
        <div className="flex items-baseline gap-2">
          <span className={cn('text-xs font-semibold', avgLevel.color)}>
            {avgLevel.text}
          </span>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {avgScore}/100
          </span>
        </div>
      </div>

      {/* Plain English explanation */}
      <p className="text-[11px] text-muted-foreground leading-snug">
        Your idea was scored across {dimensions.length} areas that matter most to investors and customers.
        {avgScore >= 75
          ? ' Overall this is strong — focus on maintaining your lead in the top areas.'
          : avgScore >= 60
            ? ' Promising overall, but the weaker areas need attention before you scale.'
            : ' Several areas need work — prioritize the red and amber items first.'}
        {' '}Green (75+) = strong. Amber (40–74) = needs work. Red ({'<'}40) = fix before moving forward.
      </p>

      {/* Dimension bars */}
      <div className="space-y-3">
        {sorted.map((dim) => {
          const level = levelLabel(dim.score);
          return (
            <div key={dim.name} className="space-y-1">
              {/* Label row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-foreground font-medium truncate">
                  {dim.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('text-[10px] font-semibold uppercase', level.color)}>
                    {level.text}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-foreground w-8 text-right">
                    {dim.score}
                  </span>
                </div>
              </div>
              {/* Bar */}
              <div className="relative h-3 rounded-full bg-muted/30 overflow-hidden">
                {/* 75 threshold marker */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-border/60 z-10"
                  style={{ left: '75%' }}
                />
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-700 ease-out',
                    barColor(dim.score),
                  )}
                  style={{ width: animate ? `${Math.min(dim.score, 100)}%` : '0%' }}
                />
              </div>
              {dim.weight && (
                <span className="text-[10px] text-muted-foreground">
                  Weight: {dim.weight}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Scale */}
      <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
        <span>0 weak</span>
        <span>25</span>
        <span>50 okay</span>
        <span className="font-medium text-foreground">75 strong</span>
        <span>100</span>
      </div>
    </div>
  );
});
