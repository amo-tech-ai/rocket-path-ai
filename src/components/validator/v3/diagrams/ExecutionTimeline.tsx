/**
 * ExecutionTimeline — Horizontal Gantt-style phase visualization.
 * Each phase is a horizontal bar segment with status colors and milestones.
 * Status: completed (green), in-progress (amber), planned (muted).
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { ExecutionTimelineData, TimelinePhase } from '@/types/v3-report';

interface ExecutionTimelineProps {
  data: ExecutionTimelineData;
  color?: string;
}

const DEFAULT_COLOR = '#EAB308';

const STATUS_STYLES: Record<
  NonNullable<TimelinePhase['status']>,
  { bar: string; badge: string; badgeText: string; dot: string }
> = {
  completed: {
    bar: 'bg-emerald-500/20 border-emerald-500/40',
    badge: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  'in-progress': {
    bar: 'bg-amber-500/20 border-amber-500/40',
    badge: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  planned: {
    bar: 'bg-muted border-border',
    badge: 'bg-muted',
    badgeText: 'text-muted-foreground',
    dot: 'bg-muted-foreground/40',
  },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
      Not enough data to display execution timeline
    </div>
  );
}

export const ExecutionTimeline = memo(function ExecutionTimeline({
  data,
  color,
}: ExecutionTimelineProps) {
  if (!data?.phases || data.phases.length === 0) {
    return <EmptyState />;
  }

  const accentHex = color ?? DEFAULT_COLOR;
  const rgb = hexToRgb(accentHex);

  return (
    <div className="w-full">
      {/* Title bar with total duration */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="h-1 w-8 rounded-full"
            style={{ backgroundColor: accentHex }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Execution Timeline
          </span>
        </div>
        {data.totalDuration && (
          <span className="text-[10px] text-muted-foreground font-medium">
            Total: {data.totalDuration}
          </span>
        )}
      </div>

      {/* Gantt-style bars */}
      <div className="space-y-3">
        {data.phases.map((phase, idx) => {
          const status = phase.status ?? 'planned';
          const styles = STATUS_STYLES[status];
          // Bar width represents relative proportion (equal if no duration info)
          const barWidthPercent = 100;

          return (
            <div key={idx} className="space-y-1.5">
              {/* Phase header row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Status dot */}
                  <div className={cn('w-2 h-2 rounded-full shrink-0', styles.dot)} />

                  <span className="text-sm font-semibold text-foreground truncate">
                    {phase.name}
                  </span>

                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 capitalize',
                      styles.badge,
                      styles.badgeText,
                    )}
                  >
                    {status.replace('-', ' ')}
                  </span>
                </div>

                <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                  {phase.duration}
                </span>
              </div>

              {/* Phase bar */}
              <div
                className={cn('rounded-lg border h-2', styles.bar)}
                style={{ width: `${barWidthPercent}%` }}
              >
                {status === 'in-progress' && (
                  <div
                    className="h-full rounded-lg"
                    style={{
                      width: '60%',
                      backgroundColor: accentHex,
                      opacity: 0.5,
                    }}
                  />
                )}
                {status === 'completed' && (
                  <div
                    className="h-full w-full rounded-lg"
                    style={{
                      backgroundColor: accentHex,
                      opacity: 0.4,
                    }}
                  />
                )}
              </div>

              {/* Milestones */}
              {phase.milestones && phase.milestones.length > 0 && (
                <ul className="pl-4 space-y-0.5">
                  {phase.milestones.map((milestone, mi) => (
                    <li
                      key={mi}
                      className="flex items-start gap-1.5 text-xs text-muted-foreground"
                    >
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                        style={{ backgroundColor: accentHex, opacity: 0.6 }}
                      />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase flow indicator */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
        {(['completed', 'in-progress', 'planned'] as const).map((status) => {
          const styles = STATUS_STYLES[status];
          return (
            <div key={status} className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', styles.dot)} />
              <span className="text-[10px] text-muted-foreground capitalize">
                {status.replace('-', ' ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
