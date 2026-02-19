import { Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InvestorScore } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';
import { getScoreLabel, MAX_SCORES } from './constants';

interface InvestorScoreCardProps {
  investorScore: InvestorScore | null;
  isCalculating: boolean;
  onRecalculate: () => void;
}

export function InvestorScoreCard({
  investorScore,
  isCalculating,
  onRecalculate,
}: InvestorScoreCardProps) {
  const scoreInfo = investorScore 
    ? getScoreLabel(investorScore.total_score) 
    : { label: 'CALCULATING', sublabel: '', color: 'text-muted-foreground' };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            INVESTOR-READY SCORE
          </p>
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
              {isCalculating ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <div className="text-center">
                  <span className="text-4xl font-bold">
                    {investorScore?.total_score || '--'}
                  </span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
              )}
            </div>
          </div>
          <p className={cn('font-semibold mt-2', scoreInfo.color)}>{scoreInfo.label}</p>
          <p className="text-sm text-muted-foreground">{scoreInfo.sublabel}</p>
        </div>

        {/* Score Breakdown */}
        {isCalculating && !investorScore ? (
          <div className="grid grid-cols-5 gap-4 mt-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-12 h-12 rounded-lg mx-auto mb-1" />
                <Skeleton className="h-3 w-10 mx-auto" />
              </div>
            ))}
          </div>
        ) : investorScore ? (
          <div className="grid grid-cols-5 gap-4 mt-6">
            {Object.entries(investorScore.breakdown).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="w-12 h-12 rounded-lg bg-accent mx-auto flex items-center justify-center mb-1">
                  <span className="font-semibold text-sm">{value}</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{key}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRecalculate}
            disabled={isCalculating}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', isCalculating && 'animate-spin')} />
            Recalculate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvestorScoreCard;
