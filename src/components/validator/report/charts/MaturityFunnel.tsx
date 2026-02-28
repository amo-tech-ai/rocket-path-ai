/**
 * BCG-style Validation Maturity Funnel — maps each dimension to a maturity stage.
 * Per BCG doc: "Makes the validation journey feel structured and achievable."
 *
 * 4 stages: Hypothesis (<25) → Testing (25-50) → Evidence (50-75) → Validated (75+)
 * Shows dimensions grouped by stage with a horizontal pipeline visual.
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
  { key: 'hypothesis', label: 'Hypothesis', min: 0, max: 25, color: 'bg-red-500', lightBg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-900', text: 'text-red-700 dark:text-red-400' },
  { key: 'testing', label: 'Testing', min: 25, max: 50, color: 'bg-amber-500', lightBg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900', text: 'text-amber-700 dark:text-amber-400' },
  { key: 'evidence', label: 'Evidence', min: 50, max: 75, color: 'bg-blue-500', lightBg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900', text: 'text-blue-700 dark:text-blue-400' },
  { key: 'validated', label: 'Validated', min: 75, max: 101, color: 'bg-emerald-500', lightBg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-900', text: 'text-emerald-700 dark:text-emerald-400' },
] as const;

function getStage(score: number) {
  return STAGES.find(s => score >= s.min && score < s.max) || STAGES[0];
}

export const MaturityFunnel = memo(function MaturityFunnel({
  dimensions,
}: MaturityFunnelProps) {
  if (dimensions.length === 0) return null;

  // Group dimensions by stage
  const groups = STAGES.map(stage => ({
    ...stage,
    items: dimensions.filter(d => d.score >= stage.min && d.score < stage.max),
  }));

  return (
    <div className="w-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Validation Maturity
      </h3>

      {/* Stage pipeline — horizontal on desktop, stacked on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {groups.map((stage, i) => (
          <div
            key={stage.key}
            className={cn(
              'relative rounded-lg border p-3 min-h-[100px]',
              stage.lightBg,
              stage.border,
            )}
          >
            {/* Stage header */}
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('w-2 h-2 rounded-full', stage.color)} />
              <span className={cn('text-xs font-semibold uppercase tracking-wide', stage.text)}>
                {stage.label}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {stage.items.length}
              </span>
            </div>

            {/* Dimension pills in this stage */}
            {stage.items.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {stage.items.map((dim) => (
                  <span
                    key={dim.name}
                    className="inline-flex items-center gap-1 text-xs bg-card/80 border border-border rounded px-2 py-0.5"
                    title={`${dim.name}: ${dim.score}/100`}
                  >
                    <span className="truncate max-w-[80px]">{dim.name}</span>
                    <span className="tabular-nums text-muted-foreground">{dim.score}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">None</p>
            )}

            {/* Arrow connector (except last) */}
            {i < 3 && (
              <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40">
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                  <path d="M2 1L10 8L2 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary line */}
      <p className="text-xs text-muted-foreground mt-3">
        {groups[3].items.length}/{dimensions.length} dimensions validated
        {groups[0].items.length > 0 && (
          <> &middot; <span className="text-red-600 dark:text-red-400 font-medium">{groups[0].items.length} still at hypothesis stage</span></>
        )}
      </p>
    </div>
  );
});
