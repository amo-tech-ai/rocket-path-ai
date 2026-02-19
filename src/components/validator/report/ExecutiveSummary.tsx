/**
 * ExecutiveSummary — Investor-ready at-a-glance card
 * Placed between ReportHero and section shells in ReportV2Layout
 * Surfaces: key metrics, dimension scores, top threat, fatal risk, revenue model
 */
import { AnimatedBar } from './shared/AnimatedBar';
import { formatMarketSize } from '@/types/validation-report';

interface MetricChip {
  label: string;
  value: string;
}

interface DimensionRow {
  name: string;
  score: number;
  weight?: number;
}

interface ExecutiveSummaryProps {
  analysis?: string;
  metrics: MetricChip[];
  dimensions: DimensionRow[];
  topThreat?: {
    name: string;
    threatLevel: 'high' | 'medium' | 'low';
    description: string;
  };
  fatalRisk?: { assumption: string };
  revenueModel?: string;
}

export function ExecutiveSummary({ analysis, metrics, dimensions, topThreat, fatalRisk, revenueModel }: ExecutiveSummaryProps) {
  // Hide if insufficient data
  const validMetrics = metrics.filter(m => m.value && m.value !== '—');
  if (validMetrics.length < 2 && dimensions.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-5">
      <p className="text-xs tracking-[0.2em] uppercase text-primary font-medium">Executive Summary</p>

      {/* Analysis paragraphs */}
      {analysis && (
        <div className="space-y-3">
          {analysis.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground">{para}</p>
          ))}
        </div>
      )}

      {/* Key Metrics Row */}
      {validMetrics.length >= 2 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {validMetrics.map(m => (
            <div key={m.label} className="bg-background-secondary rounded-lg p-3 text-center">
              <p className="text-lg font-display font-medium text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Dimension Scores */}
      {dimensions.length > 0 && (
        <>
          <div className="border-b border-border/50" />
          <div>
            <p className="text-xs tracking-wider uppercase text-muted-foreground mb-3">
              {dimensions.length} Dimension Analysis
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {dimensions
                .sort((a, b) => b.score - a.score)
                .map(dim => (
                  <div key={dim.name} className="flex items-center gap-3">
                    <div className="flex-1">
                      <AnimatedBar label={dim.name} value={dim.score} maxValue={100} showValue />
                    </div>
                    {dim.weight != null && dim.weight > 0 && (
                      <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
                        {Math.round(dim.weight * 100)}%
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom Row: Threat + Fatal Risk */}
      {(topThreat || fatalRisk) && (
        <>
          <div className="border-b border-border/50" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topThreat && (
              <div className="bg-background-secondary rounded-lg p-4">
                <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">Top Threat</p>
                <p className="text-sm font-medium text-foreground">
                  {topThreat.name}
                  <span className="ml-2 text-xs text-muted-foreground">{topThreat.threatLevel} threat</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{topThreat.description}</p>
              </div>
            )}
            {fatalRisk && (
              <div className="bg-destructive/5 border-l-4 border-l-destructive rounded-lg p-4">
                <p className="text-xs tracking-wider uppercase text-destructive mb-2">Fatal Risk</p>
                <p className="text-sm text-foreground">{fatalRisk.assumption}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Revenue Model Badge */}
      {revenueModel && (
        <p className="text-sm text-muted-foreground mt-1">
          Recommended: <span className="font-medium text-foreground">{revenueModel}</span>
        </p>
      )}
    </div>
  );
}
