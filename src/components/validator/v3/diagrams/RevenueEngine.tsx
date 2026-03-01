/**
 * RevenueEngine — Pipeline flow visualization for revenue stages.
 * Left-to-right connected blocks with conversion rates between stages.
 * Optional unit economics card below.
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { RevenueEngineData } from '@/types/v3-report';

interface RevenueEngineProps {
  data: RevenueEngineData;
  color?: string;
}

const DEFAULT_COLOR = '#10B981';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
      Not enough data to display revenue engine
    </div>
  );
}

export const RevenueEngine = memo(function RevenueEngine({ data, color }: RevenueEngineProps) {
  if (!data?.stages || data.stages.length === 0) {
    return <EmptyState />;
  }

  const accentHex = color ?? DEFAULT_COLOR;
  const rgb = hexToRgb(accentHex);

  return (
    <div className="w-full">
      {/* Title bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="h-1 w-8 rounded-full"
            style={{ backgroundColor: accentHex }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Revenue Engine
          </span>
        </div>
        {data.model && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{
              backgroundColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)` : undefined,
              color: accentHex,
            }}
          >
            {data.model}
          </span>
        )}
      </div>

      {/* Pipeline stages — horizontal flow, stacks on mobile */}
      <div className="overflow-x-auto">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 min-w-0">
          {data.stages.map((stage, idx) => {
            const isLast = idx === data.stages.length - 1;
            // Progressively stronger accent per stage
            const opacity = 0.08 + (idx / Math.max(data.stages.length - 1, 1)) * 0.14;

            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-0 min-w-0"
              >
                {/* Stage block */}
                <div
                  className="rounded-xl border px-4 py-3 min-w-[120px] max-w-[180px] shrink-0 text-center"
                  style={{
                    backgroundColor: rgb
                      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
                      : undefined,
                    borderColor: rgb
                      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
                      : undefined,
                  }}
                >
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {stage.label}
                  </p>
                  <p
                    className="text-lg font-bold tabular-nums mt-0.5"
                    style={{ color: accentHex }}
                  >
                    {stage.value}
                  </p>
                </div>

                {/* Arrow + conversion rate connector */}
                {!isLast && (
                  <div className="flex flex-col sm:flex-row items-center gap-0.5 px-1 shrink-0">
                    {/* Desktop arrow */}
                    <div className="hidden sm:flex flex-col items-center gap-0.5">
                      <div className="flex items-center text-muted-foreground/50">
                        <div className="w-3 h-px bg-current" />
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="shrink-0">
                          <path
                            d="M1 1L6 6L1 11"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      {stage.conversionRate != null && (
                        <span
                          className="text-[10px] font-bold tabular-nums"
                          style={{ color: accentHex }}
                        >
                          {stage.conversionRate}%
                        </span>
                      )}
                    </div>

                    {/* Mobile arrow */}
                    <div className="flex sm:hidden flex-col items-center gap-0.5">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-muted-foreground/50">
                        <path
                          d="M1 1L6 6L11 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {stage.conversionRate != null && (
                        <span
                          className="text-[10px] font-bold tabular-nums"
                          style={{ color: accentHex }}
                        >
                          {stage.conversionRate}%
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unit Economics card */}
      {data.unitEconomics && (
        <div
          className="mt-5 rounded-xl border p-4"
          style={{
            borderColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)` : undefined,
          }}
        >
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Unit Economics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">CAC</p>
              <p className="text-sm font-bold tabular-nums text-foreground">
                {formatCurrency(data.unitEconomics.cac)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">LTV</p>
              <p className="text-sm font-bold tabular-nums text-foreground">
                {formatCurrency(data.unitEconomics.ltv)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">LTV:CAC</p>
              <p
                className={cn(
                  'text-sm font-bold tabular-nums',
                  data.unitEconomics.ltvCacRatio >= 3
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : data.unitEconomics.ltvCacRatio >= 1
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400',
                )}
              >
                {data.unitEconomics.ltvCacRatio.toFixed(1)}x
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Payback</p>
              <p className="text-sm font-bold tabular-nums text-foreground">
                {data.unitEconomics.paybackMonths} mo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
