/**
 * TAMPyramid — 3-tier nested container visualization for market sizing.
 * TAM (outermost) -> SAM -> SOM (innermost). Shows dollar values and methodology.
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { TAMPyramidData } from '@/types/v3-report';

interface TAMPyramidProps {
  data: TAMPyramidData;
  color?: string;
}

const DEFAULT_COLOR = '#3B82F6';

/** Format large numbers into readable format: $38.1B, $2.4M, etc. */
function formatValue(value: number): string {
  if (value >= 1_000_000_000) {
    const v = value / 1_000_000_000;
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const v = value / 1_000_000;
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const v = value / 1_000;
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

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
      Not enough data to display market sizing
    </div>
  );
}

export const TAMPyramid = memo(function TAMPyramid({ data, color }: TAMPyramidProps) {
  if (!data?.tam || !data?.sam || !data?.som) {
    return <EmptyState />;
  }

  const accentHex = color ?? DEFAULT_COLOR;
  const rgb = hexToRgb(accentHex);

  const tiers = [
    { key: 'tam', tier: data.tam, label: 'TAM', sublabel: 'Total Addressable Market', opacity: 0.08 },
    { key: 'sam', tier: data.sam, label: 'SAM', sublabel: 'Serviceable Addressable Market', opacity: 0.14 },
    { key: 'som', tier: data.som, label: 'SOM', sublabel: 'Serviceable Obtainable Market', opacity: 0.22 },
  ];

  return (
    <div className="w-full">
      {/* Title bar with optional growth badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="h-1 w-8 rounded-full"
            style={{ backgroundColor: accentHex }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Market Sizing
          </span>
        </div>
        {data.growthRate != null && data.growthRate > 0 && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)` : undefined,
              color: accentHex,
            }}
          >
            {data.growthRate}% CAGR
          </span>
        )}
      </div>

      {/* Nested containers */}
      <div
        className="rounded-2xl border-2 p-4 sm:p-5"
        style={{
          borderColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)` : undefined,
          backgroundColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${tiers[0].opacity})` : undefined,
        }}
      >
        {/* TAM header */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: accentHex }}
            >
              {tiers[0].label}
            </span>
            <span className="text-[10px] text-muted-foreground ml-2 hidden sm:inline">
              {tiers[0].sublabel}
            </span>
          </div>
          <span className="text-lg font-bold tabular-nums text-foreground">
            {formatValue(data.tam.value)}
          </span>
        </div>
        {data.tam.label && (
          <p className="text-xs text-muted-foreground mb-3">{data.tam.label}</p>
        )}
        {data.tam.methodology && (
          <p className="text-[10px] text-muted-foreground/60 mb-3 italic">{data.tam.methodology}</p>
        )}

        {/* SAM nested */}
        <div
          className="rounded-xl border-2 p-4"
          style={{
            borderColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)` : undefined,
            backgroundColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${tiers[1].opacity})` : undefined,
          }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: accentHex }}
              >
                {tiers[1].label}
              </span>
              <span className="text-[10px] text-muted-foreground ml-2 hidden sm:inline">
                {tiers[1].sublabel}
              </span>
            </div>
            <span className="text-base font-bold tabular-nums text-foreground">
              {formatValue(data.sam.value)}
            </span>
          </div>
          {data.sam.label && (
            <p className="text-xs text-muted-foreground mb-3">{data.sam.label}</p>
          )}
          {data.sam.methodology && (
            <p className="text-[10px] text-muted-foreground/60 mb-3 italic">{data.sam.methodology}</p>
          )}

          {/* SOM innermost */}
          <div
            className="rounded-lg border-2 p-3 sm:p-4"
            style={{
              borderColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)` : undefined,
              backgroundColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${tiers[2].opacity})` : undefined,
            }}
          >
            <div className="flex items-baseline justify-between mb-1">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: accentHex }}
                >
                  {tiers[2].label}
                </span>
                <span className="text-[10px] text-muted-foreground ml-2 hidden sm:inline">
                  {tiers[2].sublabel}
                </span>
              </div>
              <span className="text-base font-bold tabular-nums text-foreground">
                {formatValue(data.som.value)}
              </span>
            </div>
            {data.som.label && (
              <p className="text-xs text-muted-foreground">{data.som.label}</p>
            )}
            {data.som.methodology && (
              <p className="text-[10px] text-muted-foreground/60 mt-1 italic">{data.som.methodology}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sources */}
      {data.sources && data.sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {data.sources.map((source, i) => (
            <span
              key={i}
              className="text-[10px] text-muted-foreground/60 bg-muted/50 rounded px-1.5 py-0.5"
            >
              {source}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
