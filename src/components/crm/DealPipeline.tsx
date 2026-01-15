import { motion } from 'framer-motion';
import { DEAL_STAGES, formatDealAmount } from '@/hooks/useCRM';
import { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { Building2, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

type DealWithContact = Tables<'deals'> & {
  contact: { id: string; name: string; email: string | null; company: string | null } | null;
};

interface DealPipelineProps {
  deals: DealWithContact[];
  onDealClick?: (deal: DealWithContact) => void;
}

export function DealPipeline({ deals, onDealClick }: DealPipelineProps) {
  // Group deals by stage
  const stages = DEAL_STAGES.filter(s => s.value !== 'closed_lost');
  
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.value] = deals.filter(d => d.stage === stage.value);
    return acc;
  }, {} as Record<string, DealWithContact[]>);

  // Calculate totals
  const totalPipeline = deals
    .filter(d => d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  return (
    <div className="space-y-4">
      {/* Pipeline header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sage" />
          <h2 className="font-semibold">Deal Pipeline</h2>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{formatDealAmount(totalPipeline)}</p>
          <p className="text-xs text-muted-foreground">{deals.length} active deals</p>
        </div>
      </div>

      {/* Pipeline columns */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage, stageIndex) => {
          const stageDeals = dealsByStage[stage.value] || [];
          const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
          
          return (
            <motion.div
              key={stage.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stageIndex * 0.05 }}
              className="flex-shrink-0 w-64"
            >
              {/* Stage header */}
              <div className={cn(
                "rounded-t-xl px-3 py-2 border-b-2",
                stage.color
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{stage.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDealAmount(stageTotal)}
                </p>
              </div>

              {/* Deals in stage */}
              <div className="bg-secondary/30 rounded-b-xl p-2 min-h-[200px] space-y-2">
                {stageDeals.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No deals
                  </div>
                ) : (
                  stageDeals.map((deal, dealIndex) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: dealIndex * 0.02 }}
                      className="bg-card rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-border/50"
                      onClick={() => onDealClick?.(deal)}
                    >
                      <h4 className="font-medium text-sm truncate mb-1">
                        {deal.name}
                      </h4>
                      
                      {deal.contact && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">
                            {deal.contact.company || deal.contact.name}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-sage">
                          {formatDealAmount(Number(deal.amount))}
                        </span>
                        {deal.probability !== null && (
                          <span className="text-xs text-muted-foreground">
                            {deal.probability}%
                          </span>
                        )}
                      </div>

                      {deal.expected_close && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                          <Calendar className="w-3 h-3" />
                          <span>Close: {format(new Date(deal.expected_close), 'MMM d')}</span>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
