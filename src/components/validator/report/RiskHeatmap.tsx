import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';

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

const dotColor = {
  fatal: 'bg-destructive',
  risky: 'bg-warm-foreground',
  watch: 'bg-muted-foreground',
} as const;

const cardStyle = {
  fatal: 'border-l-4 border-l-destructive bg-destructive/5',
  risky: 'border-l-4 border-l-warm-foreground bg-warm',
  watch: 'border-l-4 border-l-muted-foreground bg-background',
} as const;

const labelStyle = {
  fatal: 'text-destructive',
  risky: 'text-warm-foreground',
  watch: 'text-muted-foreground',
} as const;

const labelText = { fatal: 'FATAL', risky: 'RISKY', watch: 'WATCH' } as const;
const severityOrder = { fatal: 0, risky: 1, watch: 2 } as const;

type Quadrant = 'hh' | 'hl' | 'lh' | 'll';
const quadrantKey = (i: 'high' | 'low', p: 'high' | 'low'): Quadrant =>
  `${i[0]}${p[0]}` as Quadrant;

const quadrantPos: Record<Quadrant, string> = {
  hh: 'top-[12%] right-[12%]',
  hl: 'top-[12%] left-[12%]',
  lh: 'bottom-[12%] right-[12%]',
  ll: 'bottom-[12%] left-[12%]',
};

export const RiskHeatmap = memo(function RiskHeatmap({ risks }: RiskHeatmapProps) {
  const sorted = useMemo(
    () => [...risks].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]),
    [risks],
  );

  const quadrants = useMemo(() => {
    const map: Record<Quadrant, RiskItem[]> = { hh: [], hl: [], lh: [], ll: [] };
    risks.forEach((r) => map[quadrantKey(r.impact, r.probability)].push(r));
    return map;
  }, [risks]);

  return (
    <div>
      {/* 2x2 Heatmap grid */}
      <div className="relative bg-background rounded-lg p-6 border border-border aspect-square max-w-sm mx-auto">
        {/* Axis labels */}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs uppercase tracking-wider text-muted-foreground">
          Impact
        </span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs uppercase tracking-wider text-muted-foreground">
          Probability
        </span>

        <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-1 rounded overflow-hidden">
          {/* High impact / Low prob */}
          <div className="relative bg-warm/50 rounded-tl-md" />
          {/* High impact / High prob */}
          <div className="relative bg-destructive/5 rounded-tr-md" />
          {/* Low impact / Low prob */}
          <div className="relative bg-sage-light/30 rounded-bl-md" />
          {/* Low impact / High prob */}
          <div className="relative bg-warm/30 rounded-br-md" />
        </div>

        {/* Dots */}
        {(Object.entries(quadrants) as [Quadrant, RiskItem[]][]).map(([q, items]) =>
          items.map((r, i) => (
            <span
              key={`${q}-${i}`}
              className={cn('absolute w-2.5 h-2.5 rounded-full', dotColor[r.severity], quadrantPos[q])}
              style={{ transform: `translate(${i * 10}px, ${i * 10}px)` }}
              aria-label={`${r.severity}: ${r.assumption}`}
            />
          )),
        )}
      </div>

      {/* Severity cards */}
      <div className="flex flex-col gap-3 mt-6">
        {sorted.map((r, i) => (
          <div key={i} className={cn('rounded-lg p-4', cardStyle[r.severity])}>
            <span className={cn('text-xs uppercase tracking-wider font-medium', labelStyle[r.severity])}>
              {labelText[r.severity]}
            </span>
            <p className="text-base font-medium text-foreground mt-1.5">{r.assumption}</p>
            <p className="text-sm text-muted-foreground mt-1">{r.ifWrong}</p>
            <p className="text-xs text-muted-foreground italic mt-1.5">
              <span className="font-medium not-italic">TEST:</span> {r.howToTest}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});
