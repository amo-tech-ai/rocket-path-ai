/**
 * ICPFunnel — Narrowing funnel visualization for Ideal Customer Profile tiers.
 * Broadest tier at top, narrowest at bottom. Each tier shows label, count, and criteria.
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { ICPFunnelData } from '@/types/v3-report';

interface ICPFunnelProps {
  data: ICPFunnelData;
  color?: string;
}

const DEFAULT_COLOR = '#8B5CF6';

/** Convert hex to rgb for opacity manipulation */
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

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
      Not enough data to display ICP funnel
    </div>
  );
}

export const ICPFunnel = memo(function ICPFunnel({ data, color }: ICPFunnelProps) {
  if (!data?.tiers || data.tiers.length === 0) {
    return <EmptyState />;
  }

  const accentHex = color ?? DEFAULT_COLOR;
  const rgb = hexToRgb(accentHex);
  const totalTiers = data.tiers.length;

  return (
    <div className="w-full">
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: accentHex }}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          ICP Funnel
        </span>
      </div>

      {/* Funnel tiers */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {data.tiers.map((tier, idx) => {
          // Width decreases per tier: 100% -> progressively narrower
          const widthPercent = 100 - (idx / totalTiers) * 40;
          // Opacity decreases per tier: 1.0 -> 0.3
          const opacity = 1 - (idx / Math.max(totalTiers - 1, 1)) * 0.6;
          const bgColor = rgb
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.15})`
            : undefined;
          const borderColor = rgb
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.4})`
            : undefined;

          return (
            <div
              key={idx}
              className="rounded-lg border px-4 py-3 transition-all"
              style={{
                width: `${widthPercent}%`,
                minWidth: '200px',
                backgroundColor: bgColor,
                borderColor: borderColor,
              }}
            >
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="text-sm font-semibold text-foreground truncate">
                  {tier.label}
                </span>
                <span
                  className="text-xs font-bold tabular-nums shrink-0"
                  style={{ color: accentHex }}
                >
                  {tier.count}
                </span>
              </div>

              {tier.criteria && tier.criteria.length > 0 && (
                <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                  {tier.criteria.map((c, ci) => (
                    <li
                      key={ci}
                      className="text-[11px] text-muted-foreground before:content-[''] before:inline-block before:w-1 before:h-1 before:rounded-full before:bg-muted-foreground/40 before:mr-1.5 before:align-middle"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel arrow indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex flex-col items-center gap-0.5 text-muted-foreground/40">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path
              d="M1 1L8 8L15 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[10px] text-muted-foreground">Most Qualified</span>
        </div>
      </div>
    </div>
  );
});
