/**
 * PriorityActionList — Numbered actions with timeframe/effort chips.
 * Effort: Low = green, Medium = amber, High = red.
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { PriorityAction } from '@/types/v3-report';

interface PriorityActionListProps {
  actions: PriorityAction[];
}

const EFFORT_STYLES: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  High: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

const IMPACT_STYLES: Record<string, string> = {
  Critical: 'text-red-600 dark:text-red-400',
  High: 'text-amber-600 dark:text-amber-400',
  Medium: 'text-foreground',
  Low: 'text-muted-foreground',
};

export const PriorityActionList = memo(function PriorityActionList({
  actions,
}: PriorityActionListProps) {
  if (actions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No priority actions generated for this dimension.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <div key={action.rank} className="flex gap-3">
          {/* Rank circle */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary tabular-nums">{action.rank}</span>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="text-sm text-foreground leading-relaxed">{action.action}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {action.timeframe && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal px-2 py-0"
                >
                  {action.timeframe}
                </Badge>
              )}
              {action.effort && (
                <Badge
                  className={cn(
                    'text-xs font-medium px-2 py-0 border-transparent',
                    EFFORT_STYLES[action.effort] || EFFORT_STYLES.Medium,
                  )}
                >
                  {action.effort}
                </Badge>
              )}
              {action.impact && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    IMPACT_STYLES[action.impact] || IMPACT_STYLES.Medium,
                  )}
                >
                  {action.impact} impact
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
