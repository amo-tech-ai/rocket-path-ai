/**
 * SubScoreBar — Animated horizontal bar for a single sub-score.
 * Color: green >= 75, amber 50-74, red < 50.
 * Animates width on mount using CSS transition + IntersectionObserver.
 */
import { memo, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SubScoreBarProps {
  label: string;
  score: number;
  weight?: number;
  color?: string;
}

function scoreColor(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

export const SubScoreBar = memo(function SubScoreBar({
  label,
  score,
  weight,
  color,
}: SubScoreBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pct = Math.min(100, Math.max(0, score));

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-foreground font-medium truncate">{label}</span>
        <div className="flex items-center gap-2">
          {weight != null && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {Math.round(weight * 100)}%
            </span>
          )}
          <span className="text-sm font-semibold tabular-nums w-8 text-right">{score}</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-border">
        <div
          className={cn(
            'h-2 rounded-full motion-reduce:!transition-none',
            color ? undefined : scoreColor(score),
          )}
          style={{
            width: animate ? `${pct}%` : '0%',
            transition: 'width 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            ...(color ? { backgroundColor: color } : {}),
          }}
        />
      </div>
    </div>
  );
});
