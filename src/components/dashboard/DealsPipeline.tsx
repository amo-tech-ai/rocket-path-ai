import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';
import { formatCurrency } from '@/hooks/useDashboardData';

type Deal = Tables<'deals'>;

interface DealsPipelineProps {
  deals: Deal[];
  isLoading?: boolean;
}

const STAGE_ORDER = ['research', 'outreach', 'meeting', 'due_diligence', 'termsheet', 'closed_won'];
const STAGE_LABELS: Record<string, string> = {
  research: 'Research',
  outreach: 'Outreach',
  meeting: 'Meeting',
  due_diligence: 'Due Diligence',
  termsheet: 'Term Sheet',
  closed_won: 'Closed',
};

export function DealsPipeline({ deals, isLoading }: DealsPipelineProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-premium p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-32 rounded-xl" />
      </motion.div>
    );
  }

  // Group deals by stage
  const dealsByStage = STAGE_ORDER.reduce((acc, stage) => {
    acc[stage] = deals.filter(d => d.stage === stage);
    return acc;
  }, {} as Record<string, Deal[]>);

  // Calculate totals
  const totalPipeline = deals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const weightedPipeline = deals.reduce((sum, d) => {
    const amount = Number(d.amount) || 0;
    const probability = d.probability || 0;
    return sum + (amount * probability / 100);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card-premium p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sage" />
          <h2 className="font-semibold">Deal Pipeline</h2>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{formatCurrency(totalPipeline)}</p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(weightedPipeline)} weighted
          </p>
        </div>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No active deals</p>
          <Button variant="link" size="sm" className="mt-2" asChild>
            <Link to="/investors">Add your first deal</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {STAGE_ORDER.filter(stage => dealsByStage[stage].length > 0).map((stage) => {
            const stageDeals = dealsByStage[stage];
            const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
            
            return (
              <div key={stage} className="flex items-center gap-4">
                <div className="w-24 text-xs font-medium text-muted-foreground">
                  {STAGE_LABELS[stage]}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 bg-secondary rounded-lg overflow-hidden flex items-center px-2">
                    <span className="text-xs font-medium">
                      {stageDeals.length} deal{stageDeals.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-xs font-medium w-16 text-right">
                    {formatCurrency(stageTotal)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground" asChild>
        <Link to="/investors">
          View full pipeline
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </motion.div>
  );
}
