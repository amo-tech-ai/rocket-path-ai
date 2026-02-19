/**
 * CompetitorLuxury — Consulting-grade competitive landscape
 *
 * Four stacked zones:
 *   1. Plain English intro paragraph
 *   2. Enhanced 2×2 positioning matrix (SVG)
 *   3. Competitor profile cards with threat bar + SWOT
 *   4. Your Strategic Edge callout
 *
 * Typography: Playfair Display for headings, Inter for body
 * Animation: staggered fade-up cards, animated dots + threat bars
 */
import { memo, useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────
export interface CompetitorLuxuryProps {
  competitors: {
    name: string;
    threatLevel: 'high' | 'medium' | 'low';
    description?: string;
    strengths?: string[];
    weaknesses?: string[];
    position?: { x: number; y: number };
  }[];
  positioning?: {
    xAxis: string;
    yAxis: string;
    description?: string;
    yourPosition?: { x: number; y: number };
  };
  yourEdge?: string;
  marketGaps?: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────
const threatConfig = {
  high: { color: 'text-red-600', bg: 'bg-red-500', border: 'border-l-red-500', pill: 'bg-red-100 text-red-700', label: 'High Threat' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-500', border: 'border-l-amber-500', pill: 'bg-amber-100 text-amber-700', label: 'Medium' },
  low: { color: 'text-muted-foreground', bg: 'bg-border', border: 'border-l-border', pill: 'bg-muted text-muted-foreground', label: 'Low' },
} as const;

// ─── Positioning Matrix SVG ─────────────────────────────────────────
function PositioningMatrix({
  competitors,
  positioning,
}: {
  competitors: CompetitorLuxuryProps['competitors'];
  positioning: NonNullable<CompetitorLuxuryProps['positioning']>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const size = 320;
  const pad = 40;
  const innerSize = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;
  const yourPos = positioning.yourPosition || { x: 70, y: 70 };

  const toSvgX = (x: number) => pad + (x / 100) * innerSize;
  const toSvgY = (y: number) => size - pad - (y / 100) * innerSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Competitive positioning: ${positioning.xAxis} vs ${positioning.yAxis}`}
      className="mx-auto max-w-full"
    >
      {/* Quadrant backgrounds */}
      <rect x={cx} y={pad} width={innerSize / 2} height={innerSize / 2} fill="hsl(var(--primary) / 0.03)" />
      <rect x={pad} y={cx} width={innerSize / 2} height={innerSize / 2} fill="hsl(var(--primary) / 0.03)" />

      {/* Grid lines */}
      <line x1={pad} y1={cy} x2={size - pad} y2={cy} stroke="hsl(var(--border))" strokeWidth={1} strokeDasharray="4 4" />
      <line x1={cx} y1={pad} x2={cx} y2={size - pad} stroke="hsl(var(--border))" strokeWidth={1} strokeDasharray="4 4" />

      {/* Border */}
      <rect x={pad} y={pad} width={innerSize} height={innerSize} fill="none" stroke="hsl(var(--border) / 0.5)" strokeWidth={1} rx={4} />

      {/* Axis labels */}
      <text x={cx} y={size - 8} textAnchor="middle"
        style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', fill: 'hsl(var(--muted-foreground))', textTransform: 'uppercase' as const }}>
        {positioning.xAxis}
      </text>
      <text x={12} y={cy} textAnchor="middle" dominantBaseline="central"
        transform={`rotate(-90, 12, ${cy})`}
        style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', fill: 'hsl(var(--muted-foreground))', textTransform: 'uppercase' as const }}>
        {positioning.yAxis}
      </text>

      {/* Competitor dots */}
      {competitors.map((c, i) => {
        const pos = c.position || { x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 };
        const sx = toSvgX(pos.x);
        const sy = toSvgY(pos.y);
        const threat = threatConfig[c.threatLevel];
        return (
          <g key={c.name} style={{
            opacity: mounted ? 1 : 0,
            transition: `opacity 0.5s ease-out ${0.2 + i * 0.1}s`,
          }}>
            <circle cx={sx} cy={sy} r={5}
              fill={c.threatLevel === 'high' ? 'hsl(0 84% 60%)' : c.threatLevel === 'medium' ? 'hsl(38 92% 50%)' : 'hsl(var(--muted-foreground))'}
              opacity={0.7}
            />
            <text x={sx} y={sy - 10} textAnchor="middle"
              style={{ fontSize: '9px', fontWeight: 500, fill: 'hsl(var(--muted-foreground))' }}>
              {c.name}
            </text>
          </g>
        );
      })}

      {/* Your position — larger, animated */}
      <g style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'scale(1)' : 'scale(0)',
        transformOrigin: `${toSvgX(yourPos.x)}px ${toSvgY(yourPos.y)}px`,
        transition: 'opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s',
      }}>
        <circle cx={toSvgX(yourPos.x)} cy={toSvgY(yourPos.y)} r={16}
          fill="hsl(var(--primary) / 0.08)" stroke="none" />
        <circle cx={toSvgX(yourPos.x)} cy={toSvgY(yourPos.y)} r={7}
          fill="hsl(var(--primary))" stroke="white" strokeWidth={2} />
        <text x={toSvgX(yourPos.x)} y={toSvgY(yourPos.y) - 14} textAnchor="middle"
          style={{ fontSize: '10px', fontWeight: 600, fill: 'hsl(var(--primary))' }}>
          You
        </text>
      </g>
    </svg>
  );
}

// ─── Threat Bar ─────────────────────────────────────────────────────
function ThreatBar({ level }: { level: 'high' | 'medium' | 'low' }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const widthMap = { high: '100%', medium: '60%', low: '25%' };
  const config = threatConfig[level];

  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex-1 h-1.5 rounded-full bg-border/40 overflow-hidden">
        <div
          className={cn('h-full rounded-full', config.bg)}
          style={{
            width: mounted ? widthMap[level] : '0%',
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
      <span className={cn('text-[10px] font-semibold uppercase tracking-wider', config.color)}>
        {config.label}
      </span>
    </div>
  );
}

// ─── Competitor Card ────────────────────────────────────────────────
function CompetitorCard({
  competitor,
  delay,
}: {
  competitor: CompetitorLuxuryProps['competitors'][number];
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const config = threatConfig[competitor.threatLevel];
  const hasSwot = (competitor.strengths?.length || 0) > 0 || (competitor.weaknesses?.length || 0) > 0;

  return (
    <div
      className={cn(
        'rounded-xl border border-l-4 shadow-sm bg-card',
        config.border,
        'hover:shadow-md hover:-translate-y-px',
        'motion-reduce:!transition-none motion-reduce:!transform-none',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
      )}
      style={{
        padding: '20px',
        transition: 'opacity 400ms ease-out, transform 400ms ease-out, box-shadow 200ms ease',
      }}
    >
      {/* Header: name + threat pill */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground">{competitor.name}</h4>
        <span className={cn('text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5', config.pill)}>
          {config.label}
        </span>
      </div>

      {/* Threat bar */}
      <ThreatBar level={competitor.threatLevel} />

      {/* Description */}
      {competitor.description && (
        <p className="text-[13px] text-muted-foreground mt-3 leading-relaxed line-clamp-2">
          {competitor.description}
        </p>
      )}

      {/* SWOT — Strengths & Weaknesses */}
      {hasSwot && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            Strengths & Weaknesses
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {expanded && (
            <div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              {competitor.strengths && competitor.strengths.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Strengths</span>
                  <ul className="mt-1 space-y-0.5">
                    {competitor.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                        <TrendingUp className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {competitor.weaknesses && competitor.weaknesses.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">Weaknesses</span>
                  <ul className="mt-1 space-y-0.5">
                    {competitor.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                        <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export const CompetitorLuxury = memo(function CompetitorLuxury({
  competitors,
  positioning,
  yourEdge,
  marketGaps,
}: CompetitorLuxuryProps) {
  if (!competitors || competitors.length === 0) return null;

  const highCount = competitors.filter(c => c.threatLevel === 'high').length;
  const xAxis = positioning?.xAxis || 'Price';
  const yAxis = positioning?.yAxis || 'Quality';

  // Auto-generate plain English intro
  const intro = positioning?.description
    ? positioning.description
    : `Here's how your startup compares to ${competitors.length} competitor${competitors.length === 1 ? '' : 's'}. The chart maps each one on two dimensions — ${xAxis} and ${yAxis}. Your position (the green dot) shows where you sit. ${highCount > 0 ? `Watch out: ${highCount} competitor${highCount === 1 ? ' is' : 's are'} rated as a high threat.` : 'None are rated as high threats — good news for your positioning.'}`;

  return (
    <div className="space-y-8">
      {/* Zone 1: Plain English intro */}
      <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
        {intro}
      </p>

      {/* Zone 2: Positioning Matrix */}
      {positioning && (
        <div className="flex justify-center">
          <PositioningMatrix competitors={competitors} positioning={positioning} />
        </div>
      )}

      {/* Zone 3: Competitor Profile Cards */}
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">
          Competitor Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((c, i) => (
            <CompetitorCard key={c.name} competitor={c} delay={200 + i * 100} />
          ))}
        </div>
      </div>

      {/* Zone 4: Your Strategic Edge */}
      {(yourEdge || (marketGaps && marketGaps.length > 0)) && (
        <div className="rounded-xl border-l-4 border-l-primary bg-primary/[0.03] p-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary"
            >
              Your Competitive Moat
            </span>
          </div>

          {yourEdge && (
            <p
              className="text-foreground leading-relaxed"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px' }}
            >
              {yourEdge}
            </p>
          )}

          {marketGaps && marketGaps.length > 0 && (
            <div className="mt-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Market gaps you can own
              </span>
              <ul className="mt-1.5 space-y-1">
                {marketGaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
