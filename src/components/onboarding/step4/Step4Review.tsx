import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  Loader2, 
  ChevronDown, 
  ChevronRight,
  Pencil,
  RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  WizardFormData, 
  InvestorScore, 
  AISummary,
  InterviewAnswer,
} from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';

// Traction/funding display helpers - aligned with backend storage
const MRR_LABELS: Record<string, string> = {
  'pre_revenue': 'Pre-revenue',
  '0_1k': '$0 - $1K',
  '1k_10k': '$1K - $10K',
  '10k_50k': '$10K - $50K',
  '50k_100k': '$50K - $100K',
  '100k_plus': '$100K+',
};

const GROWTH_LABELS: Record<string, string> = {
  'negative': 'Declining',
  '0_5': '0-5% MoM',
  '5_10': '5-10% MoM',
  '10_20': '10-20% MoM',
  '20_plus': '20%+ MoM',
};

const USERS_LABELS: Record<string, string> = {
  '0_100': '0-100',
  '100_1k': '100-1K',
  '1k_10k': '1K-10K',
  '10k_100k': '10K-100K',
  '100k_plus': '100K+',
};

function parseTractionValue(value: unknown, labels: Record<string, string>, fallback = 'Not set'): string {
  if (typeof value === 'string' && labels[value]) {
    return labels[value];
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return fallback;
}

function parseFundingStatus(extracted_funding?: Record<string, unknown>): string {
  if (!extracted_funding) return 'Not set';
  
  const isRaising = extracted_funding.is_raising;
  const targetAmount = extracted_funding.target_amount;
  
  if (isRaising === false || isRaising === 'no') {
    return 'Not raising';
  }
  if (isRaising === true || isRaising === 'yes') {
    if (typeof targetAmount === 'number') {
      return `Raising $${targetAmount.toLocaleString()}`;
    }
    if (typeof targetAmount === 'string') {
      return `Raising ${targetAmount}`;
    }
    return 'Currently raising';
  }
  return 'Not set';
}

interface Step4ReviewProps {
  data: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  investorScore: InvestorScore | null;
  aiSummary: AISummary | null;
  onRecalculateScore: () => void;
  onRegenerateSummary: () => void;
  onComplete: () => void;
  isCalculatingScore: boolean;
  isGeneratingSummary: boolean;
  isCompleting: boolean;
}

function getScoreLabel(score: number) {
  if (score >= 85) return { label: 'EXCELLENT', sublabel: 'Ready for Series A talks', color: 'text-primary' };
  if (score >= 70) return { label: 'STRONG', sublabel: 'Ready for Seed talks', color: 'text-primary/90' };
  if (score >= 55) return { label: 'GOOD', sublabel: 'Building momentum', color: 'text-primary/80' };
  if (score >= 40) return { label: 'FAIR', sublabel: 'Keep building', color: 'text-muted-foreground' };
  return { label: 'EARLY', sublabel: 'Focus on fundamentals', color: 'text-destructive' };
}

interface ScoreBreakdownBarProps {
  label: string;
  score: number;
  maxScore: number;
}

function ScoreBreakdownBar({ label, score, maxScore }: ScoreBreakdownBarProps) {
  const percent = (score / maxScore) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}

export function Step4Review({
  data,
  onUpdate,
  investorScore,
  aiSummary,
  onRecalculateScore,
  onRegenerateSummary,
  onComplete,
  isCalculatingScore,
  isGeneratingSummary,
  isCompleting,
}: Step4ReviewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    summary: true,
    company: false,
    traction: false,
    interview: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const scoreInfo = investorScore 
    ? getScoreLabel(investorScore.total_score) 
    : { label: 'CALCULATING', sublabel: '', color: 'text-muted-foreground' };

  return (
    <div className="space-y-6">
      {/* Investor Score Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              INVESTOR-READY SCORE
            </p>
            <div className="relative inline-flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                {isCalculatingScore ? (
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
          {isCalculatingScore && !investorScore ? (
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
              {Object.entries(investorScore.breakdown).map(([key, value]) => {
                const maxScores: Record<string, number> = {
                  team: 25,
                  traction: 25,
                  market: 20,
                  product: 15,
                  fundraising: 15,
                };
                return (
                  <div key={key} className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-accent mx-auto flex items-center justify-center mb-1">
                      <span className="font-semibold text-sm">{value}</span>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">{key}</span>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onRecalculateScore}
              disabled={isCalculatingScore}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isCalculatingScore && 'animate-spin')} />
              Recalculate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Collapsible open={openSections.summary} onOpenChange={() => toggleSection('summary')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI-Generated Summary
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegenerateSummary();
                    }}
                    disabled={isGeneratingSummary}
                  >
                    {isGeneratingSummary ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                  {openSections.summary ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {isGeneratingSummary && !aiSummary ? (
                <div className="space-y-3 py-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                </div>
              ) : aiSummary ? (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">{aiSummary.summary}</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        STRENGTHS
                      </p>
                      <ul className="space-y-1">
                        {aiSummary.strengths.map((s, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        AREAS TO IMPROVE
                      </p>
                      <ul className="space-y-1">
                        {aiSummary.improvements.map((s, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Click the sparkle button to generate your AI summary.
                </p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Company Details */}
      <Collapsible open={openSections.company} onOpenChange={() => toggleSection('company')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Company Details</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {openSections.company ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{data.name || data.company_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm">{data.description}</p>
              </div>
              <div className="flex gap-2">
                {data.industry && <Badge>{data.industry}</Badge>}
                {data.business_model?.map((m, i) => <Badge key={i} variant="secondary">{m}</Badge>)}
                {data.stage && <Badge variant="outline">{data.stage}</Badge>}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Traction & Funding */}
      <Collapsible open={openSections.traction} onOpenChange={() => toggleSection('traction')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Traction & Funding</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {openSections.traction ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">MRR</p>
                  <p className="text-sm font-medium">
                    {parseTractionValue(
                      data.extracted_traction?.mrr_range || data.extracted_traction?.current_mrr,
                      MRR_LABELS
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="text-sm font-medium">
                    {parseTractionValue(
                      data.extracted_traction?.growth_range || data.extracted_traction?.growth_rate,
                      GROWTH_LABELS
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Users</p>
                  <p className="text-sm font-medium">
                    {parseTractionValue(
                      data.extracted_traction?.users_range || data.extracted_traction?.users,
                      USERS_LABELS
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fundraising</p>
                  <p className="text-sm font-medium">
                    {parseFundingStatus(data.extracted_funding)}
                  </p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Complete Button */}
      <div className="pt-4">
        <Button
          onClick={onComplete}
          disabled={isCompleting}
          size="lg"
          className="w-full"
        >
          {isCompleting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Creating your profile...
            </>
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              Complete Setup
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          You can edit your profile anytime from the Company Profile page.
        </p>
      </div>
    </div>
  );
}

export default Step4Review;
