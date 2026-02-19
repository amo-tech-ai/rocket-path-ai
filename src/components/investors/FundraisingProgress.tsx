import { DollarSign, Target, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Investor } from '@/hooks/useInvestors';

interface FundraisingProgressProps {
  startup: {
    is_raising: boolean | null;
    raise_amount: number | null;
    valuation_cap: number | null;
    funding_rounds: unknown;
  } | null;
  investors: Investor[];
}

function formatCurrency(amount: number | null) {
  if (!amount) return '$0';
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

export function FundraisingProgress({ startup, investors }: FundraisingProgressProps) {
  const targetAmount = startup?.raise_amount || 0;
  
  // Calculate committed/term sheet amounts
  const committedInvestors = investors.filter(i => 
    i.status === 'committed' || i.status === 'term_sheet'
  );
  const committedAmount = committedInvestors.reduce((sum, inv) => {
    // Use average of min/max check size as estimate
    const avgCheck = ((inv.check_size_min || 0) + (inv.check_size_max || 0)) / 2;
    return sum + avgCheck;
  }, 0);

  const progressPercent = targetAmount > 0 ? Math.min((committedAmount / targetAmount) * 100, 100) : 0;

  // Calculate pipeline stats
  const activeInvestors = investors.filter(i => 
    !['passed', 'committed'].includes(i.status || '')
  ).length;
  const meetingsScheduled = investors.filter(i => 
    i.status === 'meeting_scheduled' || i.status === 'pitched'
  ).length;
  const inDueDiligence = investors.filter(i => i.status === 'due_diligence').length;
  const termSheets = investors.filter(i => i.status === 'term_sheet').length;

  if (!startup?.is_raising) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Progress Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Fundraising Progress</h3>
            <p className="text-sm text-muted-foreground">
              {startup.valuation_cap && `Target valuation: ${formatCurrency(startup.valuation_cap)}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(committedAmount)}
            </p>
            <p className="text-sm text-muted-foreground">
              of {formatCurrency(targetAmount)} target
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progressPercent} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progressPercent.toFixed(0)}% committed</span>
            <span>{formatCurrency(targetAmount - committedAmount)} remaining</span>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeInvestors}</p>
              <p className="text-xs text-muted-foreground">Active Pipeline</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{meetingsScheduled}</p>
              <p className="text-xs text-muted-foreground">Meetings/Pitched</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inDueDiligence}</p>
              <p className="text-xs text-muted-foreground">Due Diligence</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{termSheets}</p>
              <p className="text-xs text-muted-foreground">Term Sheets</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
