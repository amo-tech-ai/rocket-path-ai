/**
 * MarketSizeLuxury — Consulting-grade TAM/SAM/SOM visualization
 *
 * Balanced 50/50 two-column layout:
 *   Left:  Elegant concentric rings (70% scale, labeled)
 *   Right: Structured metric cards (number-first, max 4 lines each)
 *
 * Typography hierarchy (strict):
 *   1. Financial metric: 40px Playfair Display serif
 *   2. Market label: 11px uppercase, 0.15em tracking
 *   3. Sublabel: 13px sans, muted
 *   4. Explanation: 13px sans, muted, max 2 lines
 */
import { memo, useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMarketSize } from '@/types/validation-report';

// ─── Types ──────────────────────────────────────────────────────────
export interface MarketSizeLuxuryProps {
  tam: unknown;
  sam: unknown;
  som: unknown;
  methodology?: string;
  growthRate?: number;
  citations?: { source: string; url?: string }[];
  scenario?: string;
  captureRate?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────

/** Parse unknown value to a numeric amount for SVG sizing.
 *  Handles: 32200000000, "$32.2B total market...", "$14.4M ARR" */
function toNumber(val: unknown): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const dollarMatch = val.match(/\$?([\d,.]+)\s*([BMKbmk])?/);
    if (dollarMatch) {
      const num = parseFloat(dollarMatch[1].replace(/,/g, ''));
      if (!isNaN(num)) {
        const suffix = (dollarMatch[2] || '').toUpperCase();
        if (suffix === 'B') return num * 1_000_000_000;
        if (suffix === 'M') return num * 1_000_000;
        if (suffix === 'K') return num * 1_000;
        return num;
      }
    }
  }
  return 0;
}

/** Safe market value display — ALWAYS returns a short string like "$32.3B".
 *  Handles: numbers, Gemini description strings, objects, edge cases.
 *  Never returns more than ~8 characters. */
function safeValue(val: unknown): string {
  // 1. Direct number
  if (typeof val === 'number' && !isNaN(val) && val > 0) return formatMarketSize(val);
  // 2. Coerce to string for all other types
  const str = String(val ?? '').trim();
  if (!str || str === 'undefined' || str === 'null') return '—';
  // 3. Parse to number (handles "$32.26B total market..." → 32.26B → number)
  const num = toNumber(str);
  if (num > 0) return formatMarketSize(num);
  // 4. Regex extract short dollar pattern
  const match = str.match(/\$[\d,.]+\s*[BMKbmk]?/);
  if (match && match[0].length <= 12) return match[0].trim();
  // 5. Hard fallback — never show raw Gemini text
  return '—';
}

// ─── Concentric Rings SVG (70% of original — refined) ──────────────
function ConcentricRings({
  tam: rawTam,
  sam: rawSam,
  som: rawSom,
}: {
  tam: unknown;
  sam: unknown;
  som: unknown;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const tam = toNumber(rawTam);
  const sam = toNumber(rawSam);
  const som = toNumber(rawSom);

  if (tam <= 0) return null;

  // Clamp for safe visual rendering
  const safeSam = Math.min(sam, tam);
  const safeSom = Math.min(som, safeSam);

  // Radii — 70% scale: max 70px outer
  const maxR = 70;
  const tamR = maxR;
  const samR = Math.max(28, (safeSam / tam) * maxR);
  const somR = Math.max(14, (safeSom / tam) * maxR);

  const size = 190;
  const cx = size / 2;
  const cy = size / 2;

  const fadeIn = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transition: `opacity 0.6s ease-out ${delay}s`,
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`Market size: TAM ${safeValue(rawTam)}, SAM ${safeValue(rawSam)}, SOM ${safeValue(rawSom)}`}
      role="img"
      className="mx-auto"
    >
      {/* TAM — outer ring */}
      <circle cx={cx} cy={cy} r={tamR} fill="hsl(var(--primary) / 0.04)" stroke="none" style={fadeIn(0.1)} />
      <circle cx={cx} cy={cy} r={tamR} fill="none" strokeWidth={1} className="stroke-border/50" style={fadeIn(0.1)} />

      {/* SAM — middle ring */}
      <circle cx={cx} cy={cy} r={samR} fill="hsl(var(--primary) / 0.08)" stroke="none" style={fadeIn(0.3)} />
      <circle cx={cx} cy={cy} r={samR} fill="none" strokeWidth={1} className="stroke-primary/25" style={fadeIn(0.3)} />

      {/* SOM — inner filled */}
      <circle
        cx={cx} cy={cy} r={somR}
        fill="hsl(var(--primary) / 0.80)"
        stroke="none"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'scale(1)' : 'scale(0)',
          transformOrigin: `${cx}px ${cy}px`,
          transition: 'opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s',
        }}
      />

      {/* Labels inside rings */}
      <text x={cx} y={cy - tamR + 13} textAnchor="middle"
        style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', fill: 'hsl(var(--muted-foreground))' }}>
        TAM
      </text>
      {samR > 36 && (
        <text x={cx} y={cy - samR + 13} textAnchor="middle"
          style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', fill: 'hsl(var(--primary) / 0.5)' }}>
          SAM
        </text>
      )}
      <text x={cx} y={cy + 4} textAnchor="middle" dominantBaseline="central"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '11px', fontWeight: 600,
          fill: 'hsl(var(--primary-foreground))',
        }}>
        SOM
      </text>

      {/* Dollar values next to rings */}
      <text x={cx + tamR + 6} y={cy - tamR + 6} textAnchor="start"
        style={{ fontSize: '10px', fontWeight: 500, fill: 'hsl(var(--muted-foreground))' }}>
        {safeValue(rawTam)}
      </text>
      <text x={cx + samR + 6} y={cy - samR + 6} textAnchor="start"
        style={{ fontSize: '10px', fontWeight: 500, fill: 'hsl(var(--muted-foreground) / 0.7)' }}>
        {safeValue(rawSam)}
      </text>
    </svg>
  );
}

// ─── Metric Card (strict hierarchy: number → label → context) ──────
function MarketMetricCard({
  label,
  sublabel,
  value,
  context,
  highlight,
  delay,
}: {
  label: string;
  sublabel: string;
  value: unknown;
  context: string;
  highlight?: boolean;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'rounded-xl border shadow-sm',
        'motion-reduce:!transition-none motion-reduce:!transform-none',
        highlight
          ? 'border-primary/25 bg-primary/[0.02]'
          : 'border-border/40 bg-card',
        'hover:shadow-md hover:-translate-y-px',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
      style={{
        padding: '20px',
        transition: 'opacity 400ms ease-out, transform 400ms ease-out, box-shadow 200ms ease',
        transitionDelay: visible ? '0ms' : `${delay}ms`,
      }}
    >
      {/* 1. Label tag */}
      <span className={cn(
        'inline-block text-[11px] font-medium uppercase tracking-[0.15em] rounded-sm px-1.5 py-0.5',
        highlight
          ? 'bg-primary/10 text-primary'
          : 'bg-muted/60 text-muted-foreground',
      )}>
        {label}
      </span>

      {/* 2. Financial metric — dominant, short dollar string only */}
      <p
        className={cn(
          'mt-2 font-semibold truncate',
          highlight ? 'text-primary' : 'text-foreground',
        )}
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '32px',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        {safeValue(value)}
      </p>

      {/* 3. Sublabel */}
      <p className="text-[13px] text-muted-foreground mt-1">
        {sublabel}
      </p>

      {/* 4. Context — max 2 lines, 13px */}
      <p className="text-[13px] text-muted-foreground/70 mt-0.5 leading-snug line-clamp-2">
        {context}
      </p>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export const MarketSizeLuxury = memo(function MarketSizeLuxury({
  tam,
  sam,
  som,
  methodology,
  growthRate,
  scenario,
  captureRate,
}: MarketSizeLuxuryProps) {
  const tamNum = toNumber(tam);
  const samNum = toNumber(sam);
  const somNum = toNumber(som);

  // Validation warnings
  const warnings: string[] = [];
  if (samNum > 0 && tamNum > 0 && samNum > tamNum)
    warnings.push('SAM exceeds TAM — AI estimate may need review');
  if (somNum > 0 && samNum > 0 && somNum > samNum)
    warnings.push('SOM exceeds SAM — AI estimate may need review');

  // Build SOM context (max 2 lines)
  const somContext =
    scenario || captureRate
      ? `${scenario || ''}${scenario && captureRate ? '. ' : ''}${captureRate ? `Capture rate: ${captureRate}` : ''}`
      : 'Your realistic market share in the first 3–5 years';

  return (
    <div className="space-y-8">
      {/* Growth rate badge */}
      {growthRate != null && growthRate > 0 && (
        <div className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/50">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">
            {growthRate}% CAGR
          </span>
        </div>
      )}

      {/* ── Two-column: Rings (left) + Cards (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left: Concentric rings visualization */}
        <div className="flex items-center justify-center">
          {tamNum > 0 ? (
            <ConcentricRings tam={tam} sam={sam} som={som} />
          ) : (
            <div className="w-[190px] h-[190px] flex items-center justify-center text-sm text-muted-foreground">
              Market data unavailable
            </div>
          )}
        </div>

        {/* Right: Financial metric cards */}
        <div className="space-y-4">
          <MarketMetricCard
            label="TAM"
            sublabel="Total Addressable Market"
            value={tam}
            context="The total global demand for this product category"
            delay={200}
          />
          <div className="grid grid-cols-2 gap-4">
            <MarketMetricCard
              label="SAM"
              sublabel="Serviceable Market"
              value={sam}
              context="The segment you can reach with your go-to-market"
              delay={350}
            />
            <MarketMetricCard
              label="SOM"
              sublabel="Obtainable Market"
              value={som}
              context={somContext}
              highlight
              delay={500}
            />
          </div>
        </div>
      </div>

      {/* Validation warnings */}
      {warnings.length > 0 && (
        <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/50 space-y-1">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700">{w}</p>
            </div>
          ))}
        </div>
      )}

      {/* Methodology footer */}
      {methodology && (
        <div className="pt-5 border-t border-border/30">
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
              <span className="font-medium text-foreground">How we sized this: </span>
              {methodology}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
