import { memo, useState, useEffect } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InsightCard } from '@/components/validator/report/shared/InsightCard';

interface ReportHeroProps {
  score: number;
  signal: 'go' | 'caution' | 'no-go';
  oneLiner: string;
  strengths: { title: string; description: string }[];
  concerns: { title: string; description: string }[];
  nextSteps: string[];
}

const SIGNAL_LABELS = { go: 'GO', caution: 'CAUTION', 'no-go': 'NO-GO' } as const;

const signalStyles = {
  go: 'bg-sage-light text-primary border border-primary/20',
  caution: 'bg-warm text-warm-foreground border border-warm-foreground/20',
  'no-go': 'bg-destructive/10 text-destructive border border-destructive/20',
} as const;

const R = 52;
const CIRCUMFERENCE = 2 * Math.PI * R;

function ScoreGauge({ score }: { score: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(id); }, []);

  const offset = CIRCUMFERENCE * (1 - Math.min(score, 100) / 100);

  return (
    <svg width={120} height={120} viewBox="0 0 120 120" className="shrink-0" aria-hidden="true">
      <circle cx={60} cy={60} r={R} fill="none" strokeWidth={8}
        className="stroke-border" strokeLinecap="round"
        transform="rotate(-90 60 60)" />
      <circle cx={60} cy={60} r={R} fill="none" strokeWidth={8}
        className="stroke-primary motion-reduce:transition-none"
        strokeLinecap="round" strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={mounted ? offset : CIRCUMFERENCE}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
    </svg>
  );
}

export const ReportHero = memo(function ReportHero({
  score, signal, oneLiner, strengths, concerns, nextSteps,
}: ReportHeroProps) {
  const displaySteps = nextSteps.slice(0, 4);

  return (
    <section
      aria-label="Validation score overview"
      className="bg-background-secondary rounded-2xl p-8 lg:p-12"
    >
      {/* Score header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <ScoreGauge score={score} />

        <div className="text-center sm:text-left">
          <div className="flex items-baseline gap-3 justify-center sm:justify-start">
            <span className="text-5xl lg:text-7xl font-display text-foreground leading-none">
              {score}
            </span>
            <span className="text-lg text-muted-foreground font-body">/100</span>
          </div>

          <span className={cn(
            'inline-block mt-3 text-xs font-medium font-body uppercase tracking-wider rounded-full px-3 py-1',
            signalStyles[signal],
          )}>
            {SIGNAL_LABELS[signal]}
          </span>

          <p className="mt-2 text-base italic text-muted-foreground font-body max-w-lg">
            {oneLiner}
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-border/50 my-6" />

      {/* Insight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strengths.slice(0, 2).map((s) => (
          <InsightCard key={s.title} icon={Sparkles} title={s.title}
            description={s.description} variant="strength" />
        ))}
        {concerns.slice(0, 1).map((c) => (
          <InsightCard key={c.title} icon={AlertTriangle} title={c.title}
            description={c.description} variant="concern" />
        ))}
      </div>

      {/* Next steps */}
      {displaySteps.length > 0 && (
        <>
          <hr className="border-border/50 my-6" />
          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-medium mb-3">
            Recommended Next Steps
          </p>
          <div className="flex flex-wrap gap-2">
            {displaySteps.map((step) => (
              <span key={step}
                className="bg-sage-light text-primary text-sm font-body rounded-full px-4 py-1.5">
                {step}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
});
