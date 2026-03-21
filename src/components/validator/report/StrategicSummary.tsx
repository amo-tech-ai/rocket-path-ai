/**
 * StrategicSummary — 3-section strategic synthesis page
 *
 * Sections:
 *   A. Positioning Snapshot (competition + problem)
 *   B. Build Focus (top 5 cross-dimension actions)
 *   C. Fundability Signals (strengths vs weaknesses)
 *
 * Purely presentational — all derivation lives in useStrategicSummary hook.
 *
 * POST-01: Strategic Summary Report Page (Consolidated)
 */

import { Target, Hammer, TrendingUp, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Rocket, Loader2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';
import { useStrategicSummary, type BuildItem, type FundabilitySignal } from '@/hooks/useStrategicSummary';
import { useSprintImport } from '@/hooks/useSprintImport';
import type { ReportDetailsV2 } from '@/types/validation-report';
import { Link } from 'react-router-dom';
import { WinThemeLabel } from './WinThemeLabel';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DimBadge({ dimension }: { dimension: DimensionId }) {
  const cfg = DIMENSION_CONFIG[dimension];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full"
      style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-sage" />
        <h3 className="font-display text-base sm:text-lg text-foreground">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function PositioningSection({ sentence, differentiators, moatGap }: {
  sentence: string;
  differentiators: string[];
  moatGap: string | null;
}) {
  return (
    <section className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-premium-sm">
      <SectionHeader
        icon={Target}
        title="Positioning Snapshot"
        subtitle="How you're different and where your moat is weakest"
      />

      {/* Positioning statement */}
      <p className="text-sm text-foreground leading-relaxed mb-4">{sentence}</p>

      {/* Differentiators */}
      {differentiators.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Key differentiators
          </p>
          <ul className="space-y-1.5">
            {differentiators.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Moat gap warning */}
      {moatGap && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-0.5">
              Moat gap
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-300">{moatGap}</p>
          </div>
        </div>
      )}

      {differentiators.length === 0 && !moatGap && (
        <p className="text-sm text-muted-foreground italic">
          Complete the Competitive Edge and Problem Fit dimensions for positioning insights.
        </p>
      )}
    </section>
  );
}

function BuildFocusSection({ topActions, ninetyDayPreview, onImport, isImporting, importDone }: {
  topActions: BuildItem[];
  ninetyDayPreview: string;
  onImport?: (items: BuildItem[]) => void;
  isImporting?: boolean;
  importDone?: boolean;
}) {
  return (
    <section className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-premium-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <SectionHeader
          icon={Hammer}
          title="Build Focus"
          subtitle="Top priorities ordered by impact across all dimensions"
        />
        {/* Start Next Sprint button */}
        {topActions.length > 0 && onImport && (
          <Button
            size="sm"
            onClick={() => onImport(topActions)}
            disabled={isImporting || importDone}
            className="shrink-0 gap-1.5"
          >
            {isImporting ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Importing...</>
            ) : importDone ? (
              <><Check className="w-3.5 h-3.5" /> Imported</>
            ) : (
              <><Rocket className="w-3.5 h-3.5" /> Start Next Sprint</>
            )}
          </Button>
        )}
      </div>

      {topActions.length > 0 ? (
        <div className="space-y-3 mb-4">
          {topActions.map((item) => (
            <div
              key={`${item.source}-${item.rank}`}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
            >
              {/* Rank circle */}
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sage text-white text-xs font-bold shrink-0">
                {item.rank}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{item.action}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <DimBadge dimension={item.source} />
                  {item.timeframe && (
                    <span className="text-[10px] text-muted-foreground">{item.timeframe}</span>
                  )}
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${
                      item.impact.toLowerCase() === 'critical'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                        : item.impact.toLowerCase() === 'high'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400'
                          : ''
                    }`}
                  >
                    {item.impact} impact
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic mb-4">
          Complete more dimensions to see your build priorities.
        </p>
      )}

      {/* Import success link */}
      {importDone && (
        <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 mb-4">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            Actions added to your Sprint Board.{' '}
            <Link to="/sprint-plan" className="underline font-medium hover:text-emerald-800 dark:hover:text-emerald-300">
              View Sprint Board
            </Link>
          </p>
        </div>
      )}

      {/* 90-day preview */}
      {ninetyDayPreview && (
        <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
            90-day preview
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-300 leading-relaxed">
            {ninetyDayPreview}
          </p>
        </div>
      )}
    </section>
  );
}

function SignalItem({ signal, variant }: {
  signal: FundabilitySignal;
  variant: 'strength' | 'weakness';
}) {
  const isStrength = variant === 'strength';
  return (
    <div className="flex items-start gap-2">
      {isStrength ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
      ) : (
        <XCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">{signal.label}</span>
          {signal.score > 0 && (
            <span className={`text-[10px] font-medium tabular-nums ${
              isStrength ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {signal.score}/100
            </span>
          )}
        </div>
        <DimBadge dimension={signal.dimension} />
      </div>
    </div>
  );
}

function FundabilitySection({ strengths, weaknesses, improvementActions, winThemes }: {
  strengths: FundabilitySignal[];
  weaknesses: FundabilitySignal[];
  improvementActions: string[];
  winThemes?: string[];
}) {
  const hasSignals = strengths.length > 0 || weaknesses.length > 0;

  return (
    <section className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-premium-sm">
      <SectionHeader
        icon={TrendingUp}
        title="Fundability Signals"
        subtitle="Strengths, weaknesses, and what to improve before fundraising"
      />

      {winThemes && winThemes.length > 0 && (
        <div className="mb-4">
          <span className="text-xs font-medium text-muted-foreground block mb-1.5">Win Themes</span>
          <WinThemeLabel themes={winThemes} />
        </div>
      )}

      {hasSignals ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Strengths */}
            <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
                Strengths
              </p>
              <div className="space-y-2.5">
                {strengths.map((s, i) => (
                  <SignalItem key={i} signal={s} variant="strength" />
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
                Weaknesses
              </p>
              <div className="space-y-2.5">
                {weaknesses.map((w, i) => (
                  <SignalItem key={i} signal={w} variant="weakness" />
                ))}
              </div>
            </div>
          </div>

          {/* Improvement actions */}
          {improvementActions.length > 0 && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Improve these areas before approaching investors
              </p>
              <ul className="space-y-1.5">
                {improvementActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <ArrowRight className="w-3 h-3 text-sage mt-0.5 shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Complete more dimensions to see your fundability signals.
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface StrategicSummaryProps {
  details: ReportDetailsV2;
  reportId?: string;
  startupId?: string;
}

export function StrategicSummary({ details, reportId, startupId }: StrategicSummaryProps) {
  const { hasData, positioning, buildFocus, fundability } = useStrategicSummary(details);
  const { importTopActions, isImporting, importDone } = useSprintImport(startupId, reportId);

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <Target className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          Complete more dimension sections to unlock strategic insights.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          The Strategy tab synthesizes data from your Deep Dive dimensions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PositioningSection
        sentence={positioning.sentence}
        differentiators={positioning.differentiators}
        moatGap={positioning.moatGap}
      />
      <BuildFocusSection
        topActions={buildFocus.topActions}
        ninetyDayPreview={buildFocus.ninetyDayPreview}
        onImport={reportId && startupId ? importTopActions : undefined}
        isImporting={isImporting}
        importDone={importDone}
      />
      <FundabilitySection
        strengths={fundability.strengths}
        weaknesses={fundability.weaknesses}
        improvementActions={fundability.improvementActions}
        winThemes={fundability.strengths.slice(0, 3).map(s => s.label)}
      />
    </div>
  );
}
