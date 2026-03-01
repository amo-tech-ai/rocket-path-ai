/**
 * RiskHeatGrid — 3x3 probability vs impact matrix for startup risk assessment.
 * X-axis = probability (low, medium, high), Y-axis = impact (low, medium, high).
 * Cells are color-coded from green (low/low) to deep red (high/high).
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { RiskHeatGridData, RiskGridItem } from '@/types/v3-report';

interface RiskHeatGridProps {
  data: RiskHeatGridData;
  color?: string;
}

const DEFAULT_COLOR = '#EF4444';

type Level = 'low' | 'medium' | 'high';
const LEVELS: Level[] = ['low', 'medium', 'high'];
// Impact rows: high at top, low at bottom
const IMPACT_ROWS: Level[] = ['high', 'medium', 'low'];

/**
 * Cell background based on combined risk severity.
 * Higher probability + higher impact = more severe.
 */
function getCellStyle(probability: Level, impact: Level): { bg: string; text: string } {
  const severity: Record<Level, number> = { low: 0, medium: 1, high: 2 };
  const score = severity[probability] + severity[impact];

  switch (score) {
    case 0: // low/low
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-800 dark:text-emerald-300' };
    case 1: // low/medium or medium/low
      return { bg: 'bg-emerald-100/60 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400' };
    case 2: // medium/medium, low/high, high/low
      return { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-800 dark:text-amber-300' };
    case 3: // medium/high, high/medium
      return { bg: 'bg-orange-100 dark:bg-orange-950/40', text: 'text-orange-800 dark:text-orange-300' };
    case 4: // high/high
      return { bg: 'bg-red-100 dark:bg-red-950/40', text: 'text-red-800 dark:text-red-300' };
    default:
      return { bg: 'bg-muted', text: 'text-muted-foreground' };
  }
}

/** Group risks by their grid cell position */
function groupRisksByCell(
  risks: RiskGridItem[],
): Map<string, RiskGridItem[]> {
  const map = new Map<string, RiskGridItem[]>();
  for (const risk of risks) {
    const key = `${risk.probability}-${risk.impact}`;
    const list = map.get(key) ?? [];
    list.push(risk);
    map.set(key, list);
  }
  return map;
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
      Not enough data to display risk heat grid
    </div>
  );
}

export const RiskHeatGrid = memo(function RiskHeatGrid({
  data,
  color,
}: RiskHeatGridProps) {
  if (!data?.risks || data.risks.length === 0) {
    return <EmptyState />;
  }

  const accentHex = color ?? DEFAULT_COLOR;
  const grouped = groupRisksByCell(data.risks);

  return (
    <div className="w-full">
      {/* Title bar with risk count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="h-1 w-8 rounded-full"
            style={{ backgroundColor: accentHex }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Risk Heat Map
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">
          {data.risks.length} risk{data.risks.length !== 1 ? 's' : ''} identified
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          {/* Y-axis label */}
          <div className="flex items-stretch">
            {/* Y-axis column */}
            <div className="flex flex-col items-center justify-center w-8 shrink-0 mr-1">
              <span
                className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
              >
                Impact
              </span>
            </div>

            {/* Grid content */}
            <div className="flex-1">
              {/* Y-axis level labels + grid rows */}
              <div className="space-y-1">
                {IMPACT_ROWS.map((impact) => (
                  <div key={impact} className="flex items-stretch gap-1">
                    {/* Impact level label */}
                    <div className="w-14 shrink-0 flex items-center justify-end pr-2">
                      <span className="text-[10px] text-muted-foreground capitalize font-medium">
                        {impact}
                      </span>
                    </div>

                    {/* Row cells */}
                    <div className="flex-1 grid grid-cols-3 gap-1">
                      {LEVELS.map((probability) => {
                        const cellKey = `${probability}-${impact}`;
                        const cellRisks = grouped.get(cellKey) ?? [];
                        const style = getCellStyle(probability, impact);

                        return (
                          <div
                            key={cellKey}
                            className={cn(
                              'rounded-lg border border-border/30 p-2 min-h-[60px] transition-colors',
                              style.bg,
                            )}
                          >
                            {cellRisks.length > 0 ? (
                              <div className="space-y-1">
                                {cellRisks.map((risk) => (
                                  <div key={risk.id} className="group relative">
                                    <p
                                      className={cn(
                                        'text-[10px] font-semibold leading-tight truncate',
                                        style.text,
                                      )}
                                      title={risk.mitigation ?? risk.label}
                                    >
                                      {risk.label}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground truncate">
                                      {risk.category}
                                    </p>
                                    {/* Tooltip on hover for mitigation */}
                                    {risk.mitigation && (
                                      <div className="hidden group-hover:block absolute z-30 bottom-full left-0 mb-1 w-48 p-2 rounded-lg bg-popover border shadow-lg text-[10px] text-popover-foreground">
                                        <span className="font-bold">Mitigation:</span>{' '}
                                        {risk.mitigation}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-[10px] text-muted-foreground/30">--</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="flex items-center gap-1 mt-1 ml-[60px]">
                <div className="flex-1 grid grid-cols-3 gap-1">
                  {LEVELS.map((level) => (
                    <div key={level} className="text-center">
                      <span className="text-[10px] text-muted-foreground capitalize font-medium">
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* X-axis title */}
              <div className="text-center mt-1 ml-[60px]">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Probability
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories legend */}
      {data.categories && data.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground font-semibold mr-1">Categories:</span>
          {data.categories.map((cat, i) => (
            <span
              key={i}
              className="text-[10px] text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Severity legend */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-[10px] text-muted-foreground font-semibold mr-1">Severity:</span>
        {[
          { label: 'Low', bg: 'bg-emerald-100 dark:bg-emerald-950/30' },
          { label: 'Medium', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'High', bg: 'bg-orange-100 dark:bg-orange-950/40' },
          { label: 'Critical', bg: 'bg-red-100 dark:bg-red-950/40' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={cn('w-2.5 h-2.5 rounded-sm border border-border/30', item.bg)} />
            <span className="text-[10px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
