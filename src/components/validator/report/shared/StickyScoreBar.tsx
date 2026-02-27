import { memo } from 'react';
import { cn } from '@/lib/utils';

interface StickyScoreBarProps {
  score: number | null;
  signal: 'go' | 'caution' | 'no-go' | 'unavailable';
  metrics: { label: string; value: string }[];
  visible: boolean;
}

const signalStyles = {
  go: 'bg-sage-light text-primary border border-primary/20',
  caution: 'bg-warm text-warm-foreground border border-warm-foreground/20',
  'no-go': 'bg-destructive/10 text-destructive border border-destructive/20',
  unavailable: 'bg-muted text-muted-foreground border border-border',
} as const;

const signalLabels = { go: 'GO', caution: 'CAUTION', 'no-go': 'NO-GO', unavailable: 'N/A' } as const;

export const StickyScoreBar = memo(function StickyScoreBar({
  score,
  signal,
  metrics,
  visible,
}: StickyScoreBarProps) {
  return (
    <div
      className={cn(
        'bg-card/95 backdrop-blur-md border-b border-border fixed top-0 right-0 left-0 lg:left-64 z-30',
        'px-4 lg:px-8 py-3',
        'motion-reduce:!transition-none',
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none',
      )}
      style={{ transition: 'transform 300ms ease, opacity 300ms ease' }}
      aria-hidden={!visible}
    >
      <div className="max-w-[1000px] mx-auto flex items-center justify-center gap-5">
        <span className="text-xl font-display font-medium text-foreground tabular-nums">
          {score !== null ? `${score}/100` : '—'}
        </span>

        <span
          className={cn(
            'text-sm uppercase tracking-wide font-medium px-3 py-1 rounded',
            signalStyles[signal],
          )}
        >
          {signalLabels[signal]}
        </span>

        {metrics.map((m, i) => (
          <div
            key={i}
            className="hidden sm:flex items-center gap-5"
          >
            <div className="border-l border-border h-6" />
            <span className="text-base text-muted-foreground whitespace-nowrap">
              {m.label}: <span className="font-medium text-foreground">{m.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
