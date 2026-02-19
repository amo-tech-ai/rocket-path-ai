import { memo, useMemo } from 'react';
import { AnimatedBar } from '@/components/validator/report/shared/AnimatedBar';

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

  return (
    <div>
      {/* Monthly burn */}
      <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
        Monthly burn
      </span>
      <p className="text-2xl font-display font-medium text-foreground mt-1">
        ${monthlyBurn.toLocaleString()}
      </p>
      <div className="mt-3">
        <AnimatedBar value={burnPct} label={burnComparison} showValue={false} />
      </div>

      {/* Hiring plan */}
      <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground mt-6 block">
        Your team needs
      </span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        {sorted.map((hire) => (
          <div
            key={hire.role}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="w-7 h-7 rounded-full bg-sage-light text-primary text-xs font-medium flex items-center justify-center">
              #{hire.priority}
            </div>
            <p className="text-base font-display font-medium text-foreground mt-2">
              {hire.role}
            </p>
            <p className="text-sm font-medium text-primary">
              {formatCurrency(hire.costPerMonth)}/mo
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {hire.description}
            </p>
          </div>
        ))}
      </div>

      {/* Skill gaps */}
      {gaps.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {gaps.map((gap) => (
            <span
              key={gap}
              className="bg-warm text-warm-foreground text-xs rounded-full px-3 py-1"
            >
              {gap}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
