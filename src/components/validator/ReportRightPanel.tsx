import { ChevronRight, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PanelDetailResponse } from '@/hooks/useReportPanelDetail';

interface ReportRightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sectionNumber: number | null;
  sectionTitle: string | null;
  data: PanelDetailResponse | null;
  loading: boolean;
  error: string | null;
}

export default function ReportRightPanel({
  isOpen,
  onClose,
  sectionNumber,
  sectionTitle,
  data,
  loading,
  error,
}: ReportRightPanelProps) {
  if (!isOpen) return null;

  return (
    <aside className="hidden lg:block w-80 flex-shrink-0 order-2">
      <div className="sticky top-20 rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Additional Details</h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Close panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {sectionNumber
              ? `Section ${sectionNumber}: ${sectionTitle}`
              : 'Click the \u24d8 button on any section for deeper context.'}
          </p>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Empty state */}
          {!sectionNumber && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="w-8 h-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                Click the <span className="font-medium">\u24d8</span> button on any section to see deeper context and validation ideas.
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="space-y-4">
              <div>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
              <div className="border-t border-border pt-4">
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="border-t border-border pt-4">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6 mt-1" />
                <Skeleton className="h-3 w-4/6 mt-1" />
              </div>
              <div className="border-t border-border pt-4">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6 mt-1" />
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Loaded state */}
          {data && !loading && !error && (
            <div className="space-y-4">
              {/* More Detail */}
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  More Detail
                </span>
                <p className="text-sm text-foreground mt-1 leading-relaxed">
                  {data.more_detail}
                </p>
              </div>

              {/* Why This Matters */}
              <div className="border-t border-border pt-4">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Why This Matters
                </span>
                <p className="text-sm text-foreground mt-1 leading-relaxed">
                  {data.why_this_matters}
                </p>
              </div>

              {/* Risks & Gaps */}
              {data.risks_gaps?.length > 0 && (
                <div className="border-t border-border pt-4">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Risks & Gaps
                  </span>
                  <ul className="mt-1 space-y-1">
                    {data.risks_gaps.map((item, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-1.5">
                        <span className="text-muted-foreground mt-0.5">*</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Validate Next */}
              {data.validate_next?.length > 0 && (
                <div className="border-t border-border pt-4">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Validate Next
                  </span>
                  <ul className="mt-1 space-y-1">
                    {data.validate_next.map((item, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-1.5">
                        <span className="text-muted-foreground mt-0.5">*</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
