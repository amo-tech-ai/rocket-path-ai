import { memo } from 'react';
import { FlaskConical, Target, Clock } from 'lucide-react';

interface MVPScopeProps {
  oneLiner: string;
  build: string[];
  buy: string[];
  skipForNow: string[];
  testsAssumption: string;
  successMetric: string;
  timelineWeeks: number;
}

const columns = [
  {
    key: 'build' as const,
    label: 'BUILD',
    style: 'bg-sage-light border border-primary/20 rounded-xl p-5',
    labelColor: 'text-primary',
  },
  {
    key: 'buy' as const,
    label: 'BUY',
    style: 'bg-card border border-border rounded-xl p-5',
    labelColor: 'text-sage',
  },
  {
    key: 'skipForNow' as const,
    label: 'SKIP FOR NOW',
    style: 'bg-muted/30 border border-border/50 rounded-xl p-5 opacity-75',
    labelColor: 'text-muted-foreground',
  },
] as const;

export const MVPScope = memo(function MVPScope({
  oneLiner,
  build,
  buy,
  skipForNow,
  testsAssumption,
  successMetric,
  timelineWeeks,
}: MVPScopeProps) {
  const lists = { build, buy, skipForNow } as const;

  return (
    <div>
      {/* One-liner */}
      <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
        Build this first:
      </span>
      <p className="text-lg font-display font-medium text-foreground mt-1">
        {oneLiner}
      </p>

      {/* Build / Buy / Skip grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {columns.map(({ key, label, style, labelColor }) => (
          <div key={key} className={style}>
            <span className={`text-xs font-medium tracking-wider uppercase ${labelColor}`}>
              {label}
            </span>
            <ul className="mt-3 space-y-1.5">
              {lists[key].map((item) => (
                <li key={item} className="text-sm text-foreground">
                  &bull; {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-3 mt-6">
        <span className="bg-sage-light text-primary text-xs rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5" />
          Tests: {testsAssumption}
        </span>
        <span className="bg-sage-light text-primary text-xs rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          Metric: {successMetric}
        </span>
        <span className="bg-sage-light text-primary text-xs rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          ~{timelineWeeks} weeks
        </span>
      </div>
    </div>
  );
});
