/**
 * BCG-style Gap Analysis Bars — shows each dimension's score vs a "fundable" threshold.
 * Per BCG doc: "Forces intellectual honesty. The gap is the story."
 *
 * Horizontal bars with an animated fill + a vertical threshold line at 75.
 * Colors: green (>=75), amber (50-74), red (<50).
 */
import { memo, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Dimension {
  name: string;
  score: number;
  weight?: number;
}

interface GapAnalysisBarsProps {
  dimensions: Dimension[];
  threshold?: number;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function scoreColor(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function gapLabel(score: number, threshold: number): string {
  const gap = threshold - score;
  if (gap <= 0) return 'Fundable';
  return `${gap}pt gap`;
}

export const GapAnalysisBars = memo(function GapAnalysisBars({
  dimensions,
  threshold = 75,
}: GapAnalysisBarsProps) {
  const { ref, inView } = useInView(0.2);

  if (dimensions.length === 0) return null;

  // Sort by score ascending so biggest gaps are at top (most urgent)
  const sorted = [...dimensions].sort((a, b) => a.score - b.score);

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Gap Analysis
        </h3>
        <span className="text-xs text-muted-foreground">
          Fundable threshold: {threshold}/100
        </span>
      </div>
      <div className="space-y-3">
        {sorted.map((dim) => {
          const pct = Math.min(100, Math.max(0, dim.score));
          const threshPct = threshold;
          return (
            <div key={dim.name}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm text-foreground font-medium truncate max-w-[60%]">
                  {dim.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded font-medium',
                      dim.score >= threshold
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : dim.score >= 50
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
                    )}
                  >
                    {gapLabel(dim.score, threshold)}
                  </span>
                  <span className="text-sm tabular-nums font-medium text-foreground w-10 text-right">
                    {dim.score}
                  </span>
                </div>
              </div>
              <div className="relative h-2.5 rounded-full bg-border">
                {/* Threshold marker */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-foreground/30 z-10"
                  style={{ left: `${threshPct}%` }}
                />
                {/* Score fill */}
                <div
                  className={cn(
                    'h-2.5 rounded-full motion-reduce:!transition-none',
                    scoreColor(dim.score),
                  )}
                  style={{
                    width: inView ? `${pct}%` : '0%',
                    transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
