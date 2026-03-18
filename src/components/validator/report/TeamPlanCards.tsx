import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { User, DollarSign } from 'lucide-react';

interface TeamPlanCardsProps {
  monthlyBurn: number;
  burnComparison: string;
  hires: { priority: number; role: string; costPerMonth: number; description: string }[];
  gaps: string[];
}

const TYPICAL_SEED_BURN = 50_000;

function formatCurrency(n: number): string {
  return n >= 1_000
    ? `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`
    : `$${n.toLocaleString()}`;
}

export const TeamPlanCards = memo(function TeamPlanCards({
  monthlyBurn,
  burnComparison,
  hires,
  gaps,
}: TeamPlanCardsProps) {
  const sorted = useMemo(
    () => [...hires].sort((a, b) => a.priority - b.priority),
    [hires],
  );

  const burnPct = Math.min(100, Math.round((monthlyBurn / TYPICAL_SEED_BURN) * 100));
  const totalHireCost = sorted.reduce((sum, h) => sum + h.costPerMonth, 0);

  return (
    <div className="space-y-8">
      {/* Burn rate — prominent with bar */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly burn
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <p
            className="text-3xl font-semibold text-foreground"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontVariantNumeric: 'tabular-nums' }}
          >
            ${monthlyBurn.toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground">
            {burnComparison}
          </span>
        </div>

        {/* Burn bar vs typical */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Your burn</span>
            <span>Typical seed: ${TYPICAL_SEED_BURN.toLocaleString()}</span>
          </div>
          <div className="relative h-3 rounded-full bg-border/40 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                burnPct <= 70 ? 'bg-emerald-500' : burnPct <= 90 ? 'bg-amber-500' : 'bg-red-500',
              )}
              style={{ width: `${burnPct}%` }}
            />
            {/* Typical marker */}
            <div className="absolute top-0 bottom-0 w-px bg-foreground/30" style={{ left: '100%' }} />
          </div>
          <p className="text-xs text-muted-foreground">
            {burnPct}% of typical seed burn — {burnPct <= 70 ? 'lean operation' : burnPct <= 90 ? 'on track' : 'running hot'}
          </p>
        </div>
      </div>

      {/* Hiring plan */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Team you need
          </span>
          <span className="text-xs text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{formatCurrency(totalHireCost)}/mo</span>
          </span>
        </div>
        <div className="space-y-3">
          {sorted.map((hire) => {
            const costPct = totalHireCost > 0 ? Math.round((hire.costPerMonth / totalHireCost) * 100) : 0;
            return (
              <div
                key={hire.role}
                className="rounded-xl border border-border bg-card p-5 flex items-start gap-4"
              >
                {/* Priority number */}
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center shrink-0">
                  {hire.priority}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {hire.role}
                    </p>
                    <span className="text-sm font-semibold text-primary tabular-nums shrink-0">
                      {formatCurrency(hire.costPerMonth)}/mo
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {hire.description}
                  </p>
                  {/* Cost proportion bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-border/40 overflow-hidden">
                      <div className="h-full rounded-full bg-primary/40" style={{ width: `${costPct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{costPct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill gaps */}
      {gaps.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Key skills needed
          </span>
          <div className="flex flex-wrap gap-2">
            {gaps.map((gap) => (
              <span
                key={gap}
                className="inline-flex items-center gap-1.5 bg-primary/5 text-primary border border-primary/20 text-xs font-medium rounded-full px-3 py-1.5"
              >
                <User className="w-3 h-3" />
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
