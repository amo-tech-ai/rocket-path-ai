import { memo, useRef, useState, useEffect } from 'react';

interface AnimatedBarProps {
  label: string;
  value: number;
  maxValue?: number;
  showValue?: boolean;
}

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export const AnimatedBar = memo(function AnimatedBar({
  label,
  value,
  maxValue = 100,
  showValue = true,
}: AnimatedBarProps) {
  const { ref, inView } = useInView(0.3);
  const pct = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm text-muted-foreground">{label}</span>
        {showValue && (
          <span className="text-sm font-medium text-foreground">
            {value}/{maxValue}
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-border">
        <div
          className="h-2 rounded-full bg-primary motion-reduce:!transition-none"
          style={{
            width: inView ? `${pct}%` : '0%',
            transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
});
