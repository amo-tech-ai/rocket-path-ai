/**
 * DimensionNavGrid — 3-act grouped navigation for V3 dimension pages.
 * Shows dimension cards organized by narrative act:
 *   Act 1: "Is This Worth Building?" — problem, customer, market
 *   Act 2: "Can You Win?" — competition, revenue, ai-strategy
 *   Act 3: "Can You Do This?" — execution, traction, risk
 */
import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';

const ACT_META = [
  { act: 1, title: 'Is This Worth Building?', subtitle: 'Problem, customer, and market validation' },
  { act: 2, title: 'Can You Win?', subtitle: 'Competitive edge, revenue model, and technology' },
  { act: 3, title: 'Can You Do This?', subtitle: 'Execution ability, traction evidence, and risk profile' },
] as const;

interface DimensionNavGridProps {
  onNavigate: (dimensionId: string) => void;
  /** Optional: dimension scores keyed by dimension ID (to show score badges) */
  scores?: Partial<Record<DimensionId, number>>;
}

export const DimensionNavGrid = memo(function DimensionNavGrid({
  onNavigate,
  scores,
}: DimensionNavGridProps) {
  // Group dimensions by act
  const byAct = ACT_META.map(({ act, title, subtitle }) => {
    const dims = (Object.entries(DIMENSION_CONFIG) as [DimensionId, (typeof DIMENSION_CONFIG)[DimensionId]][])
      .filter(([, cfg]) => cfg.act === act);
    return { act, title, subtitle, dims };
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Dimension Deep Dive</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Explore each of the 9 evaluation dimensions with detailed analysis, diagrams, and action items.
        </p>
      </div>

      {byAct.map(({ act, title, subtitle, dims }) => (
        <div key={act}>
          <div className="mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Act {act}
            </h3>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {dims.map(([dimId, cfg]) => {
              const score = scores?.[dimId];
              return (
                <button
                  key={dimId}
                  onClick={() => onNavigate(dimId)}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.98]"
                >
                  {/* Color dot */}
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {cfg.label}
                      </span>
                      {score !== undefined && (
                        <span className="text-xs font-medium text-muted-foreground tabular-nums">
                          {score}/100
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {cfg.role === 'modifier' ? 'Risk modifier' : `Weight: ${(cfg.weight * 100).toFixed(0)}%`}
                    </span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
});
