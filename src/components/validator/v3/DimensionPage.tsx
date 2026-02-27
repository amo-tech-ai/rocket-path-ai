/**
 * DimensionPage — Layout shell for a single V3 dimension page.
 * Orchestrates: headline, diagram (children), CompositeScoreCard, summary, PriorityActionList, RiskSignalCards.
 * Centralizes ALL state management — individual pages provide only the diagram.
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';
import { useDimensionPage } from '@/hooks/useDimensionPage';
import { CompositeScoreCard } from './CompositeScoreCard';
import { PriorityActionList } from './PriorityActionList';
import { RiskSignalCard } from './RiskSignalCard';

interface DimensionPageProps {
  dimensionId: DimensionId;
  reportId: string;
  /** Diagram component — receives dimensionData as render prop */
  children?: (data: { diagram: unknown; dimensionId: DimensionId }) => ReactNode;
}

/** Loading skeleton for the dimension page */
function DimensionSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

/** Error state */
function DimensionError({ message }: { message: string }) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-destructive font-medium">Failed to load dimension</p>
        <p className="text-xs text-muted-foreground max-w-md">{message}</p>
      </CardContent>
    </Card>
  );
}

/** Empty state — dimension not analyzed */
function DimensionEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <RefreshCw className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">This dimension could not be analyzed</p>
        <p className="text-xs text-muted-foreground max-w-md">
          Re-run validation to try again. Some dimensions may fail if the AI model returns malformed data.
        </p>
      </CardContent>
    </Card>
  );
}

/** V2 fallback state — report generated before V3 dimensions */
function DimensionV2Fallback() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <RefreshCw className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">V2 Report</p>
        <p className="text-xs text-muted-foreground max-w-md">
          This report was generated before dimension pages were available.
          Re-validate your startup to get the full 9-dimension analysis.
        </p>
      </CardContent>
    </Card>
  );
}

export const DimensionPage = memo(function DimensionPage({
  dimensionId,
  reportId,
  children,
}: DimensionPageProps) {
  const { state, data, error } = useDimensionPage(reportId, dimensionId);
  const config = DIMENSION_CONFIG[dimensionId];

  // Loading
  if (state === 'loading') return <DimensionSkeleton />;

  // Error
  if (state === 'error') return <DimensionError message={error?.message || 'Unknown error'} />;

  // V2 fallback
  if (state === 'v2-fallback') return <DimensionV2Fallback />;

  // Empty (dimension failed in pipeline)
  if (state === 'empty' || !data) return <DimensionEmpty />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Headline with dimension color accent */}
      {data.headline && (
        <div
          className="border-l-4 pl-4 py-1"
          style={{ borderLeftColor: config.color }}
        >
          <h2 className="text-lg font-semibold text-foreground leading-snug">
            {data.headline}
          </h2>
        </div>
      )}

      {/* Diagram slot — render prop for dimension-specific diagrams */}
      {children && data.diagram && (
        <div className="w-full">
          {children({ diagram: data.diagram, dimensionId })}
        </div>
      )}

      {/* Composite Score + Sub-scores */}
      <CompositeScoreCard
        score={data.compositeScore}
        subScores={data.subScores}
        dimensionColor={config.color}
      />

      {/* Executive Summary */}
      {data.summary && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Assessment
            </h3>
            <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Priority Actions */}
      {data.actions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Priority Actions
            </h3>
            <PriorityActionList actions={data.actions} />
          </CardContent>
        </Card>
      )}

      {/* Risk Signals — only shown if present */}
      {data.riskSignals.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Risk Signals
          </h3>
          <div className="space-y-2">
            {data.riskSignals.map((signal, i) => (
              <RiskSignalCard key={i} signal={signal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
