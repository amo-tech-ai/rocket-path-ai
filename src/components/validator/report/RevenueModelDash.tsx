import { memo } from 'react';

interface RevenueModelDashProps {
  recommended: string;
  description: string;
  metrics: { label: string; value: string; explanation: string }[];
  alternatives: { name: string; pros: string[]; cons: string[] }[];
}

export const RevenueModelDash = memo(function RevenueModelDash({
  recommended,
  description,
  metrics,
  alternatives,
}: RevenueModelDashProps) {
  return (
    <div>
      {/* Recommended model */}
      <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
        Recommended model
      </span>
      <p className="text-lg font-display font-medium text-foreground mt-1">
        {recommended}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>

      {/* KPI metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-card rounded-xl border border-border/50 p-4"
          >
            <span className="text-2xl font-display font-medium text-foreground">
              {m.value}
            </span>
            <p className="text-xs font-medium uppercase text-primary mt-1">
              {m.label}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {m.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <>
          <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground mt-6 block">
            Alternatives considered
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {alternatives.map((alt) => (
              <div
                key={alt.name}
                className="bg-background rounded-lg p-4 border border-border"
              >
                <p className="text-sm font-medium text-foreground">
                  {alt.name}
                </p>
                <ul className="mt-2 space-y-0.5">
                  {alt.pros.map((p) => (
                    <li key={p} className="text-sm text-primary">
                      + {p}
                    </li>
                  ))}
                  {alt.cons.map((c) => (
                    <li key={c} className="text-sm text-destructive/60">
                      - {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});
