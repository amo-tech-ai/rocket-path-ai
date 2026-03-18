import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check, X, Crown } from 'lucide-react';

interface RevenueModelDashProps {
  recommended: string;
  description: string;
  metrics: { label: string; value: string; explanation: string }[];
  alternatives: { name: string; pros: string[]; cons: string[] }[];
}

function isHealthy(label: string, value: string): boolean | null {
  const lower = label.toLowerCase();
  if (lower.includes('ltv:cac') || lower.includes('ltv/cac')) {
    const num = parseFloat(value.replace('x', ''));
    return !isNaN(num) && num >= 3;
  }
  if (lower.includes('payback')) {
    const num = parseInt(value);
    return !isNaN(num) && num <= 12;
  }
  return null;
}

function parseLtvCac(metrics: { label: string; value: string }[]): number | null {
  const m = metrics.find(m => {
    const l = m.label.toLowerCase();
    return l.includes('ltv:cac') || l.includes('ltv/cac');
  });
  if (!m) return null;
  const match = m.value.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : null;
}

export const RevenueModelDash = memo(function RevenueModelDash({
  recommended,
  description,
  metrics,
  alternatives,
}: RevenueModelDashProps) {
  const ltvCac = useMemo(() => parseLtvCac(metrics), [metrics]);

  return (
    <div className="space-y-8">
      {/* Recommended model — hero callout */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/[0.02] p-6">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Recommended model
          </span>
        </div>
        <p className="text-xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {recommended}
        </p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      {/* Customer value gauge — plain English */}
      {ltvCac !== null && (
        <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Is each customer worth it?
            </span>
            <span className={cn(
              'text-xs font-semibold',
              ltvCac >= 5 ? 'text-emerald-600' : ltvCac >= 3 ? 'text-emerald-500' : ltvCac >= 2 ? 'text-amber-500' : 'text-red-500',
            )}>
              {ltvCac >= 5 ? 'Very profitable' : ltvCac >= 3 ? 'Profitable' : ltvCac >= 2 ? 'Barely profitable' : 'Losing money'}
            </span>
          </div>
          <div className="relative h-4 rounded-full bg-muted/30 overflow-hidden">
            <div className="absolute top-0 bottom-0 left-[30%] w-px bg-border/60 z-10" />
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                ltvCac >= 3 ? 'bg-emerald-500' : ltvCac >= 2 ? 'bg-amber-500' : 'bg-red-500',
              )}
              style={{ width: `${Math.min(100, (ltvCac / 10) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Break even</span>
            <span style={{ position: 'absolute', left: '30%' }} className="relative font-medium text-foreground">3x = good</span>
            <span>10x+</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 leading-snug">
            For every <span className="font-semibold text-foreground">$1</span> you spend getting a customer, you make <span className="font-semibold text-foreground">${ltvCac.toFixed(1)}0</span> back over their lifetime. {ltvCac >= 3 ? "That's a healthy return." : ltvCac >= 2 ? 'Aim for at least 3x to build a sustainable business.' : 'You need to either reduce acquisition costs or increase customer value.'}
          </p>
        </div>
      )}

      {/* KPI metric cards — bigger numbers, health indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const healthy = isHealthy(m.label, m.value);
          return (
            <div
              key={m.label}
              className={cn(
                'rounded-xl border p-5 text-center',
                healthy === true
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : healthy === false
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-border/50 bg-card',
              )}
            >
              <p
                className="text-3xl font-semibold text-foreground"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontVariantNumeric: 'tabular-nums' }}
              >
                {m.value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mt-2">
                {m.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
                {m.explanation}
              </p>
            </div>
          );
        })}
      </div>

      {/* Alternatives — cleaner pros/cons with icons */}
      {alternatives.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Alternatives considered
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {alternatives.map((alt) => (
              <div
                key={alt.name}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-sm font-semibold text-foreground mb-3">
                  {alt.name}
                </p>
                <div className="space-y-1.5">
                  {alt.pros.map((p) => (
                    <div key={p} className="flex items-start gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{p}</span>
                    </div>
                  ))}
                  {alt.cons.map((c) => (
                    <div key={c} className="flex items-start gap-2 text-sm">
                      <X className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
