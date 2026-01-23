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
          {investorScore && (
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
          )}

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
              {isGeneratingSummary ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
                    {data.extracted_traction?.current_mrr 
                      ? `$${data.extracted_traction.current_mrr.toLocaleString()}`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="text-sm font-medium">
                    {data.extracted_traction?.growth_rate 
                      ? `${data.extracted_traction.growth_rate}% MoM`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Users</p>
                  <p className="text-sm font-medium">
                    {data.extracted_traction?.users || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Raising</p>
                  <p className="text-sm font-medium">
                    {data.extracted_funding?.is_raising 
                      ? `$${(data.extracted_funding.target_amount || 0).toLocaleString()}`
                      : 'Not raising'}
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
