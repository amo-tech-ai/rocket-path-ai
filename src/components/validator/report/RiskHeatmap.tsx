import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Eye, Skull, FlaskConical } from 'lucide-react';

interface RiskItem {
  assumption: string;
  ifWrong: string;
  severity: 'fatal' | 'risky' | 'watch';
  impact: 'high' | 'low';
  probability: 'high' | 'low';
  howToTest: string;
}

interface RiskHeatmapProps {
  risks: RiskItem[];
}

const severityConfig = {
  fatal: {
    icon: Skull,
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    pill: 'bg-red-100 text-red-700',
    barColor: 'bg-red-500',
    barWidth: 'w-full',
    label: 'DEAL BREAKER',
    desc: 'Fix this or the idea won\'t work',
    level: 3,
  },
  risky: {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    pill: 'bg-amber-100 text-amber-700',
    barColor: 'bg-amber-500',
    barWidth: 'w-2/3',
    label: 'RISKY',
    desc: 'Test this soon — could hurt you',
    level: 2,
  },
  watch: {
    icon: Eye,
    color: 'text-slate-500',
    bg: 'bg-slate-50 border-slate-200',
    pill: 'bg-slate-100 text-slate-600',
    barColor: 'bg-slate-400',
    barWidth: 'w-1/3',
    label: 'KEEP AN EYE',
    desc: 'Not urgent, but track it',
    level: 1,
  },
} as const;

const severityOrder = { fatal: 0, risky: 1, watch: 2 } as const;

export const RiskHeatmap = memo(function RiskHeatmap({ risks }: RiskHeatmapProps) {
  const sorted = useMemo(
    () => [...risks].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]),
    [risks],
  );

  const counts = useMemo(() => {
    const c = { fatal: 0, risky: 0, watch: 0 };
    risks.forEach((r) => c[r.severity]++);
    return c;
  }, [risks]);

  const total = risks.length;

  return (
    <div className="space-y-6">
      {/* Risk severity distribution — stacked horizontal bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            What could go wrong?
          </span>
          <span className="text-xs text-muted-foreground">
            {total} thing{total !== 1 ? 's' : ''} to check
          </span>
        </div>

        {/* Stacked severity bar */}
        <div className="h-3 rounded-full bg-muted/30 overflow-hidden flex">
          {counts.fatal > 0 && (
            <div
              className="bg-red-500 h-full transition-all duration-500"
              style={{ width: `${(counts.fatal / total) * 100}%` }}
            />
          )}
          {counts.risky > 0 && (
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${(counts.risky / total) * 100}%` }}
            />
          )}
          {counts.watch > 0 && (
            <div
              className="bg-slate-400 h-full transition-all duration-500"
              style={{ width: `${(counts.watch / total) * 100}%` }}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          {(['fatal', 'risky', 'watch'] as const).map((level) => {
            const config = severityConfig[level];
            return counts[level] > 0 ? (
              <div key={level} className="flex items-center gap-1.5">
                <span className={cn('w-2.5 h-2.5 rounded-sm', config.barColor)} />
                <span className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{counts[level]}</span> {config.label.toLowerCase()}
                </span>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Risk cards with severity bar */}
      <div className="flex flex-col gap-4">
        {sorted.map((r, i) => {
          const config = severityConfig[r.severity];
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={cn('rounded-xl border p-5 space-y-3', config.bg)}
            >
              {/* Header: icon + severity pill + level indicator */}
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4 shrink-0', config.color)} />
                <span className={cn(
                  'text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-0.5',
                  config.pill,
                )}>
                  {config.label}
                </span>
                {/* Severity level dots */}
                <div className="flex items-center gap-1 ml-auto">
                  {[1, 2, 3].map((dot) => (
                    <span
                      key={dot}
                      className={cn(
                        'w-2 h-2 rounded-full',
                        dot <= config.level ? config.barColor : 'bg-border',
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Assumption text */}
              <p className="text-sm font-semibold text-foreground leading-snug">
                {r.assumption}
              </p>

              {/* What happens if wrong */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {r.ifWrong}
              </p>

              {/* How to test — action box */}
              <div className="rounded-lg bg-white/60 dark:bg-background/60 border border-border/30 px-4 py-3 flex items-start gap-2.5">
                <FlaskConical className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">TEST: </span>
                  {r.howToTest}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
