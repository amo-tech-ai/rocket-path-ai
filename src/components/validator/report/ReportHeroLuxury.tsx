/**
 * ReportHeroLuxury — Luxury AI investment briefing hero
 * Merges old ExecutiveSummary + ReportHero into a unified consulting-grade hero.
 * 5 sub-sections: Hero Briefing, Divider, Executive Summary, Divider, Dimensions Grid + Threat/Risk
 */
import { memo, useState, useEffect } from 'react';
import { AnimatedBar } from './shared/AnimatedBar';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────
export interface ReportHeroLuxuryProps {
  startupName?: string;
  industry?: string;
  stage?: string;
  tagline?: string;
  score: number | null;
  signal: 'go' | 'caution' | 'no-go' | 'unavailable';
  analysis?: string;
  metrics: { label: string; value: string; subtitle?: string }[];
  dimensions: { name: string; score: number; weight?: number }[];
  topThreat?: { name: string; threatLevel: string; description: string };
  fatalRisk?: { assumption: string };
  revenueModel?: string;
  nextSteps?: string[];
}

/** Format stage slug "pre_seed" → "Pre-Seed" */
function formatStage(s: string): string {
  return s.replace(/_/g, '-').replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Constants ──────────────────────────────────────────────────────
const R = 52;
const CIRCUMFERENCE = 2 * Math.PI * R;
const SIGNAL_LABELS = { go: 'GO', caution: 'CAUTION', 'no-go': 'NO-GO', unavailable: 'N/A' } as const;

const signalStyles = {
  go: 'bg-emerald-100 text-emerald-800',
  caution: 'bg-amber-100 text-amber-800',
  'no-go': 'bg-red-100 text-red-800',
  unavailable: 'bg-muted text-muted-foreground',
} as const;

// ─── Score Ring ─────────────────────────────────────────────────────
function ScoreRing({ score, signal }: { score: number | null; signal: 'go' | 'caution' | 'no-go' | 'unavailable' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const safeScore = score ?? 0;
  const offset = CIRCUMFERENCE * (1 - Math.min(safeScore, 100) / 100);

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <svg
        width={120}
        height={120}
        viewBox="0 0 120 120"
        aria-label={score !== null ? `Validation score: ${score} out of 100` : 'Score unavailable'}
        role="img"
      >
        {/* Track */}
        <circle
          cx={60} cy={60} r={R} fill="none" strokeWidth={6}
          className="stroke-border/60" strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        {/* Fill */}
        <circle
          cx={60} cy={60} r={R} fill="none" strokeWidth={6}
          className="stroke-primary motion-reduce:transition-none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={mounted && score !== null ? offset : CIRCUMFERENCE}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
        {/* Score number */}
        <text
          x="60" y="56" textAnchor="middle" dominantBaseline="central"
          className="fill-foreground"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '32px', fontWeight: 600 }}
        >
          {score !== null ? score : '—'}
        </text>
        {/* /100 label */}
        <text
          x="60" y="78" textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500 }}
        >
          {score !== null ? '/100' : ''}
        </text>
      </svg>

      {/* Signal pill */}
      <span className={cn(
        'rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider',
        signalStyles[signal],
      )}>
        {SIGNAL_LABELS[signal]}
      </span>
    </div>
  );
}

// ─── Metric Card ────────────────────────────────────────────────────
function MetricCard({ label, value, subtitle, delay }: {
  label: string; value: string; subtitle?: string; delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={cn(
      'p-5 rounded-xl border border-border/50 shadow-sm',
      'hover:shadow-md hover:-translate-y-px transition-all duration-200',
      'motion-reduce:!transition-none motion-reduce:!transform-none',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
    )}
    style={{
      transition: 'opacity 400ms ease-out, transform 400ms ease-out, box-shadow 200ms ease',
      transitionDelay: visible ? '0ms' : `${delay}ms`,
    }}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-2xl font-semibold text-foreground mt-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export const ReportHeroLuxury = memo(function ReportHeroLuxury({
  startupName,
  industry,
  stage,
  tagline,
  score,
  signal,
  analysis,
  metrics,
  dimensions,
  topThreat,
  fatalRisk,
  revenueModel,
}: ReportHeroLuxuryProps) {
  const validMetrics = metrics.filter(m => m.value && m.value !== '—');
  const sortedDimensions = [...dimensions].sort((a, b) => b.score - a.score);
  const metaPills = [industry, stage ? formatStage(stage) : null].filter(Boolean) as string[];

  return (
    <article aria-label="Validation report overview" className="space-y-0">
      {/* ── 1. Hero Briefing ──────────────────────────────────────── */}
      <section className="bg-card border border-border rounded-xl p-6 lg:p-8">
        <div className="flex flex-col-reverse sm:flex-row sm:items-start sm:justify-between gap-6">
          {/* Left: Name + metadata + tagline */}
          <div className="flex-1 min-w-0">
            {startupName && (
              <h1
                className="text-3xl sm:text-5xl lg:text-[56px] font-semibold text-foreground leading-tight"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  letterSpacing: '-0.02em',
                }}
              >
                {startupName}
              </h1>
            )}

            {metaPills.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {metaPills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-block text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50 rounded-full px-3 py-1"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}

            {tagline && (
              <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-lg">
                {tagline}
              </p>
            )}
          </div>

          {/* Right: Score ring */}
          <ScoreRing score={score} signal={signal} />
        </div>
      </section>

      {/* ── 2. Executive Summary ──────────────────────────────────── */}
      {(analysis || validMetrics.length >= 2) && (
        <section className="bg-card border border-border border-t-0 rounded-b-xl -mt-px p-6 lg:p-8 space-y-6">
          <div>
            <h2
              className="text-lg sm:text-xl font-semibold text-foreground"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Executive Summary
            </h2>
            <div className="border-b border-border/30 mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left: Analysis text (3/5 = 60%) */}
            {analysis && (
              <div className="lg:col-span-3 space-y-3">
                {analysis.split('\n\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Right: Financial metrics (2/5 = 40%) */}
            {validMetrics.length >= 2 && (
              <div className={cn(
                'grid grid-cols-2 gap-4 self-start',
                analysis ? 'lg:col-span-2' : 'lg:col-span-5',
              )}>
                {validMetrics.map((m, i) => (
                  <MetricCard
                    key={m.label}
                    label={m.label}
                    value={m.value}
                    subtitle={m.subtitle}
                    delay={100 + i * 100}
                  />
                ))}
              </div>
            )}
          </div>

          {revenueModel && (
            <p className="text-sm text-muted-foreground">
              Recommended model: <span className="font-medium text-foreground">{revenueModel}</span>
            </p>
          )}
        </section>
      )}

      {/* ── 3. Dimensions Grid ────────────────────────────────────── */}
      {sortedDimensions.length > 0 && (
        <section className="bg-card border border-border border-t-0 rounded-b-xl -mt-px p-6 lg:p-8 space-y-6">
          <div>
            <h2
              className="text-lg sm:text-xl font-semibold text-foreground"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Strategic Dimensions
            </h2>
            <div className="border-b border-border/30 mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {sortedDimensions.map((dim) => (
              <div
                key={dim.name}
                className="flex items-center gap-3"
                role="progressbar"
                aria-valuenow={dim.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${dim.name}: ${dim.score} out of 100`}
              >
                <div className="flex-1">
                  <AnimatedBar label={dim.name} value={dim.score} maxValue={100} showValue />
                </div>
                {dim.weight != null && dim.weight > 0 && (
                  <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
                    {Math.round(dim.weight <= 1 ? dim.weight * 100 : dim.weight)}%
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Threat + Risk Footer */}
          {(topThreat || fatalRisk) && (
            <>
              <div className="border-b border-border/30" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topThreat && (
                  <div className="p-5 rounded-xl border-l-4 border-l-amber-500 bg-amber-50/50">
                    <p className="text-xs font-medium uppercase tracking-wider text-amber-700 mb-2">
                      Top Threat
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      {topThreat.name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {topThreat.threatLevel} threat
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{topThreat.description}</p>
                  </div>
                )}
                {fatalRisk && (
                  <div className="p-5 rounded-xl border-l-4 border-l-red-500 bg-red-50/50">
                    <p className="text-xs font-medium uppercase tracking-wider text-red-700 mb-2">
                      Fatal Risk
                    </p>
                    <p className="text-sm text-foreground">{fatalRisk.assumption}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      )}
    </article>
  );
});
