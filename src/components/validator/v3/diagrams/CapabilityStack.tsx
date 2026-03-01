/**
 * CapabilityStack — Layered block visualization for tech capabilities.
 * Bottom layer = foundational, top = advanced. Maturity badges per layer.
 * Includes automation level and data strategy badges.
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { CapabilityStackData, CapabilityLayer } from '@/types/v3-report';

interface CapabilityStackProps {
  data: CapabilityStackData;
  color?: string;
}

const DEFAULT_COLOR = '#06B6D4';

const MATURITY_STYLES: Record<CapabilityLayer['maturity'], { bg: string; text: string; label: string }> = {
  nascent: {
    bg: 'bg-red-100 dark:bg-red-950/60',
    text: 'text-red-700 dark:text-red-400',
    label: 'Nascent',
  },
  developing: {
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Developing',
  },
  mature: {
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'Mature',
  },
};

const AUTOMATION_LABELS: Record<CapabilityStackData['automationLevel'], string> = {
  assist: 'AI Assist',
  copilot: 'AI Copilot',
  agent: 'AI Agent',
};

const DATA_LABELS: Record<CapabilityStackData['dataStrategy'], string> = {
  owned: 'Owned Data',
  borrowed: 'Borrowed Data',
  hybrid: 'Hybrid Data',
};

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
      Not enough data to display capability stack
    </div>
  );
}

export const CapabilityStack = memo(function CapabilityStack({
  data,
  color,
}: CapabilityStackProps) {
  if (!data?.layers || data.layers.length === 0) {
    return <EmptyState />;
  }

  const accentHex = color ?? DEFAULT_COLOR;
  const rgb = hexToRgb(accentHex);

  // Reverse so bottom layer (foundational) is at the bottom visually
  // Display: top of screen = last item (advanced), bottom = first item (foundational)
  const displayLayers = [...data.layers].reverse();

  return (
    <div className="w-full">
      {/* Title bar */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="h-1 w-8 rounded-full"
          style={{ backgroundColor: accentHex }}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Capability Stack
        </span>
      </div>

      {/* Strategy badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {data.automationLevel && (
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
            style={{
              backgroundColor: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)` : undefined,
              color: accentHex,
            }}
          >
            {AUTOMATION_LABELS[data.automationLevel]}
          </span>
        )}
        {data.dataStrategy && (
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-muted text-muted-foreground"
          >
            {DATA_LABELS[data.dataStrategy]}
          </span>
        )}
      </div>

      {/* Stacked layers */}
      <div className="flex flex-col gap-1.5">
        {displayLayers.map((layer, idx) => {
          const maturity = MATURITY_STYLES[layer.maturity] ?? MATURITY_STYLES.nascent;
          // Higher layers get stronger accent
          const layerOpacity = 0.06 + ((displayLayers.length - 1 - idx) / Math.max(displayLayers.length - 1, 1)) * 0.12;

          return (
            <div
              key={idx}
              className="rounded-lg border px-4 py-3"
              style={{
                backgroundColor: rgb
                  ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${layerOpacity})`
                  : undefined,
                borderColor: rgb
                  ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
                  : undefined,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {layer.name}
                    </h4>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0',
                        maturity.bg,
                        maturity.text,
                      )}
                    >
                      {maturity.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {layer.description}
                  </p>

                  {/* Components list */}
                  {layer.components && layer.components.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {layer.components.map((comp, ci) => (
                        <span
                          key={ci}
                          className="text-[10px] text-muted-foreground bg-background/60 border border-border/50 rounded px-1.5 py-0.5"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Foundation indicator */}
      <div className="flex justify-center mt-2">
        <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wide">
          Foundation
        </span>
      </div>
    </div>
  );
});
