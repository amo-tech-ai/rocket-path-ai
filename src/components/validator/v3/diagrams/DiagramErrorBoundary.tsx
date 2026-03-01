/**
 * DiagramErrorBoundary -- Catches render errors in diagram children and
 * falls back to DiagramFallbackTable so the user always sees their data.
 *
 * Usage:
 *   <DiagramErrorBoundary dimensionId="market" data={diagramData}>
 *     <MarketDiagram data={diagramData} />
 *   </DiagramErrorBoundary>
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { DiagramFallbackTable } from './DiagramFallbackTable';

interface DiagramErrorBoundaryProps {
  dimensionId: string;
  data: unknown;
  children: ReactNode;
}

interface DiagramErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showRawData: boolean;
}

export class DiagramErrorBoundary extends Component<
  DiagramErrorBoundaryProps,
  DiagramErrorBoundaryState
> {
  constructor(props: DiagramErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, showRawData: false };
  }

  static getDerivedStateFromError(error: Error): Partial<DiagramErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      `[DiagramErrorBoundary] Render error in dimension "${this.props.dimensionId}":`,
      error,
      info.componentStack,
    );
  }

  /** Reset boundary so the user can retry */
  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null, showRawData: false });
  };

  private handleToggleRawData = (): void => {
    this.setState((prev) => ({ showRawData: !prev.showRawData }));
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { dimensionId, data } = this.props;
    const { error, showRawData } = this.state;

    return (
      <div className="space-y-3">
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Diagram failed to render
                </p>
                {error?.message && (
                  <p className="text-xs text-muted-foreground font-mono break-all leading-relaxed">
                    {error.message}
                  </p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={this.handleRetry}
                    className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-md transition-colors',
                      'bg-background border border-border',
                      'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    onClick={this.handleToggleRawData}
                    className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-md transition-colors',
                      'bg-background border border-border',
                      'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                  >
                    {showRawData ? 'Hide raw data' : 'Show raw data'}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showRawData && (
          <DiagramFallbackTable data={data} dimensionId={dimensionId} />
        )}
      </div>
    );
  }
}
