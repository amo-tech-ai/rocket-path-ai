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

// ─── Market Funnel — 3 narrowing bars showing TAM → SAM → SOM ──────
function MarketFunnel({
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

  const safeSam = Math.min(sam, tam);
  const safeSom = Math.min(som, safeSam || tam);

  // Bar widths as percentage of full width (TAM = 100%)
  const samPct = tam > 0 ? Math.max(15, (safeSam / tam) * 100) : 50;
  const somPct = tam > 0 ? Math.max(8, (safeSom / tam) * 100) : 20;

  const bars = [
    { label: 'Everyone', sublabel: 'Total people who could buy this', value: safeValue(rawTam), pct: 100, color: 'bg-primary/10 border-primary/20', textColor: 'text-foreground', delay: 0 },
    { label: 'You can reach', sublabel: 'People your marketing can find', value: safeValue(rawSam), pct: samPct, color: 'bg-primary/20 border-primary/30', textColor: 'text-foreground', delay: 150 },
    { label: 'You will get', sublabel: 'Realistic customers in year 1–3', value: safeValue(rawSom), pct: somPct, color: 'bg-primary border-primary', textColor: 'text-primary-foreground', delay: 300 },
  ];

  return (
    <div
      className="space-y-2"
      aria-label={`Market funnel: TAM ${safeValue(rawTam)}, SAM ${safeValue(rawSam)}, SOM ${safeValue(rawSom)}`}
      role="img"
    >
      {bars.map((bar) => (
        <div key={bar.label} className="flex items-center gap-3">
          {/* Bar */}
          <div
            className={cn(
              'h-12 rounded-lg border flex items-center px-4 gap-2 transition-all duration-700 ease-out',
              bar.color,
            )}
            style={{ width: mounted ? `${bar.pct}%` : '0%', minWidth: '80px' }}
          >
            <span className={cn('text-xs font-bold uppercase tracking-wider shrink-0', bar.textColor)}>
              {bar.label}
            </span>
            <span
              className={cn('font-semibold shrink-0', bar.textColor)}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px' }}
            >
              {bar.value}
            </span>
          </div>
          {/* Description — outside the bar for readability */}
          <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
            {bar.sublabel}
          </span>
        </div>
      ))}
      {/* Plain English explanation */}
      <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
        Think of it like a funnel: {safeValue(rawTam)} is everyone who could ever buy this. {safeValue(rawSam)} is the slice you can actually reach with your sales and marketing. {safeValue(rawSom)} is what you can realistically win in the first few years.
      </p>
    </div>
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

      {/* 4. Context */}
      <p className="text-[13px] text-muted-foreground/70 mt-0.5 leading-snug">
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

      {/* ── Market funnel (replaces concentric rings) ── */}
      {tamNum > 0 ? (
        <MarketFunnel tam={tam} sam={sam} som={som} />
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Market data unavailable
        </div>
      )}

      {/* ── Metric cards — detailed breakdown ── */}
      <div className="space-y-4">
        <MarketMetricCard
          label="Total Market"
          sublabel="How big is the whole pie?"
          value={tam}
          context="The total spending on this type of product across all buyers worldwide"
          delay={200}
        />
        <div className="grid grid-cols-2 gap-4">
          <MarketMetricCard
            label="Your Reach"
            sublabel="How much can you go after?"
            value={sam}
            context="The portion of buyers you can actually find and sell to with your team and budget"
            delay={350}
          />
          <MarketMetricCard
            label="Your Target"
            sublabel="How much will you win?"
            value={som}
            context={somContext || 'The revenue you can realistically earn in the first 1–3 years'}
            highlight
            delay={500}
          />
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
