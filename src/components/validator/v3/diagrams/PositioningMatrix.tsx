/**
 * PositioningMatrix — 2x2 scatter plot for competitive positioning.
 * Plots founder vs competitors on two axes. Founder dot is larger and accent-colored.
 * Quadrant backgrounds use subtle differentiation.
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { PositioningMatrixData } from '@/types/v3-report';

interface PositioningMatrixProps {
  data: PositioningMatrixData;
  color?: string;
}

const DEFAULT_COLOR = '#F97316';

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
      Not enough data to display positioning matrix
    </div>
  );
}

export const PositioningMatrix = memo(function PositioningMatrix({
  data,
  color,
}: PositioningMatrixProps) {
  if (!data?.positions || data.positions.length === 0 || !data.xAxis || !data.yAxis) {
    return <EmptyState />;
  }

  const accentHex = color ?? DEFAULT_COLOR;
  const rgb = hexToRgb(accentHex);

  // Quadrant subtle background colors
  const QUADRANT_BG = [
    'bg-emerald-50/40 dark:bg-emerald-950/10', // top-right (high/high — best)
    'bg-blue-50/40 dark:bg-blue-950/10',        // top-left
    'bg-amber-50/40 dark:bg-amber-950/10',      // bottom-right
    'bg-muted/30',                               // bottom-left (low/low — weakest)
  ];

  return (
    <div className="w-full">
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: accentHex }}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Competitive Positioning
        </span>
      </div>

      {/* Matrix container */}
      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 -translate-x-full hidden sm:block">
          <span
            className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
            style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
          >
            {data.yAxis}
          </span>
        </div>

        {/* Y-axis label — mobile (top) */}
        <div className="sm:hidden mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Y: {data.yAxis}
          </span>
        </div>

        {/* Grid area */}
        <div className="ml-0 sm:ml-5">
          {/* Y-axis markers */}
          <div className="flex justify-between mb-1 px-1">
            <span className="text-[10px] text-muted-foreground/60">High</span>
            <span className="text-[10px] text-muted-foreground/60">High</span>
          </div>

          {/* The 2x2 grid with plotted positions */}
          <div className="relative aspect-square w-full max-w-[400px] mx-auto border border-border/60 rounded-lg overflow-hidden">
            {/* Quadrant backgrounds: 2x2 grid */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              {/* Row 1: top-left, top-right */}
              <div className={cn('border-r border-b border-border/30', QUADRANT_BG[1])} />
              <div className={cn('border-b border-border/30', QUADRANT_BG[0])} />
              {/* Row 2: bottom-left, bottom-right */}
              <div className={cn('border-r border-border/30', QUADRANT_BG[3])} />
              <div className={cn(QUADRANT_BG[2])} />
            </div>

            {/* Center crosshair lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/40" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border/40" />

            {/* Plot positions */}
            {data.positions.map((pos, idx) => {
              const isFounder = pos.isFounder;
              // Convert 0-100 to percentage coordinates
              // x: 0=left, 100=right; y: 0=bottom, 100=top
              const left = Math.min(95, Math.max(5, pos.x));
              const bottom = Math.min(95, Math.max(5, pos.y));

              return (
                <div
                  key={idx}
                  className="absolute group"
                  style={{
                    left: `${left}%`,
                    bottom: `${bottom}%`,
                    transform: 'translate(-50%, 50%)',
                    zIndex: isFounder ? 20 : 10,
                  }}
                >
                  {/* Dot */}
                  <div
                    className={cn(
                      'rounded-full border-2 transition-transform group-hover:scale-125',
                      isFounder
                        ? 'border-white dark:border-foreground shadow-lg'
                        : 'border-muted-foreground/30 bg-muted-foreground/20',
                    )}
                    style={{
                      width: isFounder ? '20px' : '12px',
                      height: isFounder ? '20px' : '12px',
                      backgroundColor: isFounder
                        ? accentHex
                        : undefined,
                    }}
                  />

                  {/* Label */}
                  <div
                    className={cn(
                      'absolute left-1/2 -translate-x-1/2 whitespace-nowrap',
                      'text-[10px] leading-tight px-1 py-0.5 rounded',
                      isFounder
                        ? 'font-bold text-foreground -top-5'
                        : 'text-muted-foreground -top-4',
                    )}
                  >
                    {pos.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis markers */}
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[10px] text-muted-foreground/60">Low</span>
            <span className="text-[10px] text-muted-foreground/60">High</span>
          </div>

          {/* X-axis label */}
          <div className="text-center mt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {data.xAxis}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3.5 h-3.5 rounded-full border-2 border-white dark:border-foreground"
            style={{ backgroundColor: accentHex }}
          />
          <span className="text-[10px] text-muted-foreground">Your Position</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20 border border-muted-foreground/30" />
          <span className="text-[10px] text-muted-foreground">Competitors</span>
        </div>
      </div>
    </div>
  );
});
