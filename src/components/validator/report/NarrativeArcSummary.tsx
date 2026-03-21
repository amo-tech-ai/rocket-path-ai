/**
 * NarrativeArcSummary — Three-act narrative arc cards.
 * Derives from the executive summary (summary_verdict) text or explicit data.
 *
 * Act 1: Setup (Market Context) — blue
 * Act 2: Conflict (Core Risk) — amber
 * Act 3: Resolution (What Must Happen) — green
 *
 * If no structured data, attempts to split summary_verdict by paragraph heuristic.
 * If that fails, renders nothing (graceful degradation).
 */
import { Globe, AlertTriangle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NarrativeArc {
  setup: string;       // Market context / opportunity
  conflict: string;    // Core risk / biggest danger
  resolution: string;  // What must happen / verdict
}

interface NarrativeArcSummaryProps {
  arc?: NarrativeArc;
  /** Fallback: attempt to derive from summary_verdict text */
  summaryVerdict?: string;
  className?: string;
}

const ACTS = [
  { key: 'setup' as const, label: 'The Opportunity', icon: Globe, border: 'border-l-blue-500', bg: 'bg-blue-50/50 dark:bg-blue-950/20', tag: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  { key: 'conflict' as const, label: 'The Risk', icon: AlertTriangle, border: 'border-l-amber-500', bg: 'bg-amber-50/50 dark:bg-amber-950/20', tag: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
  { key: 'resolution' as const, label: 'The Path Forward', icon: Target, border: 'border-l-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', tag: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
] as const;

/**
 * Attempt to derive a 3-act arc from summary_verdict text.
 * Heuristic: split by double-newline or sentence boundaries into 3 chunks.
 * Returns null if text is too short or doesn't split well.
 */
function deriveArc(text: string): NarrativeArc | null {
  if (!text || text.length < 100) return null;

  // Try double-newline split first (most Composer outputs use this)
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 20);

  if (paragraphs.length >= 3) {
    return {
      setup: paragraphs[0],
      conflict: paragraphs[1],
      resolution: paragraphs.slice(2).join(' '),
    };
  }

  // Fallback: split roughly into thirds by sentences
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 10);
  if (sentences.length >= 3) {
    const third = Math.ceil(sentences.length / 3);
    return {
      setup: sentences.slice(0, third).join(' '),
      conflict: sentences.slice(third, third * 2).join(' '),
      resolution: sentences.slice(third * 2).join(' '),
    };
  }

  return null;
}

export function NarrativeArcSummary({ arc, summaryVerdict, className }: NarrativeArcSummaryProps) {
  const resolvedArc = arc || (summaryVerdict ? deriveArc(summaryVerdict) : null);
  if (!resolvedArc) return null;

  return (
    <div className={cn('grid gap-4 sm:grid-cols-3', className)}>
      {ACTS.map(({ key, label, icon: Icon, border, bg, tag }) => (
        <div
          key={key}
          className={cn(
            'rounded-lg border border-l-4 p-4 transition-all hover:shadow-sm',
            border,
            bg
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded', tag)}>
              <Icon className="h-3 w-3" />
              {label}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed line-clamp-5">
            {resolvedArc[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
