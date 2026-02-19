import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Step {
  action: string;
  timeframe: 'week_1' | 'month_1' | 'quarter_1';
  effort: 'low' | 'medium' | 'high';
}

interface NextStepsTimelineProps {
  steps: Step[];
}

const effortPill = {
  low: 'bg-sage-light text-primary',
  medium: 'bg-warm text-warm-foreground',
  high: 'bg-muted text-muted-foreground',
} as const;

const columns = [
  { key: 'week_1' as const, label: 'THIS WEEK', eyebrow: 'text-primary', dot: 'Wk1' },
  { key: 'month_1' as const, label: 'THIS MONTH', eyebrow: 'text-sage', dot: 'Wk2-4' },
  { key: 'quarter_1' as const, label: 'THIS QUARTER', eyebrow: 'text-muted-foreground', dot: 'Wk5-12' },
] as const;

export const NextStepsTimeline = memo(function NextStepsTimeline({ steps }: NextStepsTimelineProps) {
  const grouped = useMemo(() => {
    const map: Record<Step['timeframe'], Step[]> = { week_1: [], month_1: [], quarter_1: [] };
    steps.forEach((s) => map[s.timeframe].push(s));
    return map;
  }, [steps]);

  return (
    <div>
      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.key} className="bg-card rounded-xl border border-border p-5">
            <span className={cn('text-xs font-medium uppercase tracking-wider', col.eyebrow)}>
              {col.label}
            </span>
            <ul className="mt-3 space-y-2.5">
              {grouped[col.key].map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sm text-foreground leading-snug shrink-0" aria-hidden="true">&bull;</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-foreground">{s.action}</span>
                    <span className={cn('text-xs rounded-full px-2.5 py-0.5 font-medium', effortPill[s.effort])}>
                      {s.effort}
                    </span>
                  </div>
                </li>
              ))}
              {grouped[col.key].length === 0 && (
                <li className="text-sm text-muted-foreground italic">No steps yet</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Timeline connector */}
      <div className="hidden md:flex items-center gap-0 mt-4 px-6" aria-hidden="true">
        {columns.map((col, i) => (
          <div key={col.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground mt-2">{col.dot}</span>
            </div>
            {i < columns.length - 1 && <div className="h-0.5 bg-border flex-1" />}
          </div>
        ))}
      </div>
    </div>
  );
});
