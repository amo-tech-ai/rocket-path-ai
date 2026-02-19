import { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { InvestorCard } from './InvestorCard';
import { Investor, INVESTOR_STATUSES, useUpdateInvestorStatus } from '@/hooks/useInvestors';
import { cn } from '@/lib/utils';

interface InvestorPipelineProps {
  investors: Investor[];
  onInvestorClick: (investor: Investor) => void;
}

export function InvestorPipeline({ investors, onInvestorClick }: InvestorPipelineProps) {
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const updateStatus = useUpdateInvestorStatus();

  const getInvestorsByStatus = (status: string) => {
    return investors.filter(inv => inv.status === status);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverStatus(null);
    
    const investorId = e.dataTransfer.getData('investorId');
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (investorId && currentStatus !== newStatus) {
      updateStatus.mutate({ id: investorId, status: newStatus });
    }
  };

  // Calculate pipeline stats
  const activeCount = investors.filter(i => 
    !['passed', 'committed'].includes(i.status || '')
  ).length;
  const termSheetCount = investors.filter(i => i.status === 'term_sheet').length;
  const committedValue = investors
    .filter(i => i.status === 'committed' || i.status === 'term_sheet')
    .reduce((sum, i) => sum + ((i.check_size_min || 0) + (i.check_size_max || 0)) / 2, 0);

  return (
    <div className="space-y-4">
      {/* Pipeline Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Active Leads:</span>{' '}
          <span className="font-medium">{activeCount}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Term Sheets:</span>{' '}
          <span className="font-medium text-emerald-600">{termSheetCount}</span>
        </div>
        {committedValue > 0 && (
          <div>
            <span className="text-muted-foreground">Potential Committed:</span>{' '}
            <span className="font-medium text-green-600">
              ${(committedValue / 1000000).toFixed(1)}M
            </span>
          </div>
        )}
      </div>

      {/* Pipeline Kanban */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-max">
          {INVESTOR_STATUSES.map((status) => {
            const statusInvestors = getInvestorsByStatus(status.value);
            const isDropTarget = dragOverStatus === status.value;
            
            return (
              <div
                key={status.value}
                className={cn(
                  "w-72 flex-shrink-0 rounded-lg bg-muted/30 p-3 transition-colors",
                  isDropTarget && "bg-primary/10 ring-2 ring-primary/20"
                )}
                onDragOver={(e) => handleDragOver(e, status.value)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status.value)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", status.color)} />
                    <h3 className="font-medium text-sm">{status.label}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                    {statusInvestors.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {statusInvestors.map((investor) => (
                    <InvestorCard
                      key={investor.id}
                      investor={investor}
                      onClick={() => onInvestorClick(investor)}
                      onStatusChange={(newStatus) => {
                        updateStatus.mutate({ id: investor.id, status: newStatus });
                      }}
                    />
                  ))}
                  
                  {statusInvestors.length === 0 && (
                    <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
