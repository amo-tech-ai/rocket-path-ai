/**
 * EvidenceFunnel — Tiered evidence visualization sorted by confidence level.
 * Verified evidence at top (strongest), assumed at bottom (weakest).
 * Confidence badges: verified (green), partial (amber), assumed (red).
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { EvidenceFunnelData, EvidenceItem } from '@/types/v3-report';

interface EvidenceFunnelProps {
  data: EvidenceFunnelData;
  color?: string;
}

const DEFAULT_COLOR = '#14B8A6';

const CONFIDENCE_STYLES: Record<
  EvidenceItem['confidence'],
  { bg: string; text: string; border: string; label: string }
> = {
  verified: {
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-300 dark:border-emerald-700',
    label: 'Verified',
  },
  partial: {
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-300 dark:border-amber-700',
    label: 'Partial',
  },
  assumed: {
    bg: 'bg-red-100 dark:bg-red-950/60',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-300 dark:border-red-700',
    label: 'Assumed',
  },
};

const OVERALL_CONFIDENCE_STYLES: Record<
  EvidenceFunnelData['overallConfidence'],
  { bg: string; text: string; label: string }
> = {
  high: {
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: 'High Confidence',
  },
  medium: {
    bg: 'bg-amber-100 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-400',
    label: 'Medium Confidence',
  },
  low: {
    bg: 'bg-red-100 dark:bg-red-950/60',
    text: 'text-red-700 dark:text-red-400',
    label: 'Low Confidence',
  },
  none: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    label: 'No Confidence',
  },
};

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
      Not enough data to display evidence funnel
    </div>
  );
}

export const EvidenceFunnel = memo(function EvidenceFunnel({
  data,
  color,
}: EvidenceFunnelProps) {
  if (!data?.tiers || data.tiers.length === 0) {
    return <EmptyState />;
  }

  // Check if there are any items across all tiers
  const totalItems = data.tiers.reduce((sum, tier) => sum + (tier.items?.length ?? 0), 0);
  if (totalItems === 0) {
    return <EmptyState />;
  }

  const accentHex = color ?? DEFAULT_COLOR;
  const overallStyle = OVERALL_CONFIDENCE_STYLES[data.overallConfidence] ?? OVERALL_CONFIDENCE_STYLES.none;

  return (
    <div className="w-full">
      {/* Title bar with overall confidence badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="h-1 w-8 rounded-full"
            style={{ backgroundColor: accentHex }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Evidence Assessment
          </span>
        </div>
        <span
          className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-full',
            overallStyle.bg,
            overallStyle.text,
          )}
        >
          {overallStyle.label}
        </span>
      </div>

      {/* Tiers — sorted: verified first, assumed last */}
      <div className="space-y-3">
        {data.tiers.map((tier, idx) => {
          if (!tier.items || tier.items.length === 0) return null;

          return (
            <div key={idx} className="space-y-2">
              {/* Tier header */}
              <h4 className="text-xs font-semibold text-foreground">
                {tier.label}
              </h4>

              {/* Evidence items */}
              <div className="space-y-1.5">
                {tier.items.map((item, ii) => {
                  const confidence = CONFIDENCE_STYLES[item.confidence] ?? CONFIDENCE_STYLES.assumed;

                  return (
                    <div
                      key={ii}
                      className={cn(
                        'rounded-lg border px-3 py-2.5',
                        confidence.border,
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground leading-tight">
                            {item.claim}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {item.evidence}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0',
                            confidence.bg,
                            confidence.text,
                          )}
                        >
                          {confidence.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confidence funnel indicator */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
        {(['verified', 'partial', 'assumed'] as const).map((level) => {
          const style = CONFIDENCE_STYLES[level];
          return (
            <div key={level} className="flex items-center gap-1.5">
              <div className={cn('w-2.5 h-2.5 rounded-sm', style.bg)} />
              <span className="text-[10px] text-muted-foreground capitalize">
                {style.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
