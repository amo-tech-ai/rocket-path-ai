import { Sparkles, Check, AlertTriangle, ArrowRight, Globe, Signal, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ReadinessScore } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';

interface AnalysisConfidencePanelProps {
  readinessScore: ReadinessScore | null;
  urlsAnalyzed: number;
  signalsExtracted: number;
  groundingActive: boolean;
  aiSummary?: {
    brief: string;
    strengths: string[];
    risks: string[];
  };
  recommendations: { text: string; completed: boolean; section: string }[];
  isCalculating: boolean;
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-primary';
  if (score >= 65) return 'text-primary/80';
  if (score >= 50) return 'text-muted-foreground';
  return 'text-destructive';
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'High';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Low';
}

export function AnalysisConfidencePanel({
  readinessScore,
  urlsAnalyzed,
  signalsExtracted,
  groundingActive,
  aiSummary,
  recommendations,
  isCalculating,
}: AnalysisConfidencePanelProps) {
  const overallScore = readinessScore?.overall_score || 0;

  return (
    <div className="space-y-4">
      {/* Analysis Confidence */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Signal className="h-3 w-3" />
            Analysis Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Circular Score */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  strokeWidth="8"
                  stroke="hsl(var(--muted))"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  strokeWidth="8"
                  stroke="hsl(var(--primary))"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 251.2} 251.2`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-2xl font-bold', getScoreColor(overallScore))}>
                  {isCalculating ? '...' : `${overallScore}%`}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getScoreLabel(overallScore)}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sources Analyzed</span>
              <span className="font-medium">{urlsAnalyzed} URLs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Signals Extracted</span>
              <span className="font-medium">{signalsExtracted} Signals</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Grounding</span>
              <Badge 
                variant="outline" 
                className={cn(
                  'text-xs',
                  groundingActive ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted'
                )}
              >
                {groundingActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analyst Brief */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI Analyst Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground/90 leading-relaxed">
            {aiSummary?.brief || 'Strong founder-market fit with ex-Adobe pedigree. Clear product positioning in growing GenAI creative ops space. Competitive landscape is dense but differentiation via enterprise integrations is defensible.'}
          </p>
          
          <Separator className="bg-primary/10" />
          
          <div className="space-y-2">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Primary Strengths
            </span>
            <p className="text-xs text-foreground/80">
              {aiSummary?.strengths?.join(', ') || 'Deep domain expertise + proven enterprise execution'}
            </p>
          </div>
          
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Primary Risks
            </span>
            <p className="text-xs text-muted-foreground">
              {aiSummary?.risks?.join(', ') || 'High competitor density in DAM/creative space'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recommendations.map((rec, i) => (
            <div 
              key={i} 
              className={cn(
                'flex items-start gap-2 p-2 rounded-md transition-colors cursor-pointer hover:bg-accent/50',
                rec.completed && 'opacity-60'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5',
                rec.completed 
                  ? 'bg-primary border-primary' 
                  : 'border-muted-foreground/30'
              )}>
                {rec.completed && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1">
                <p className={cn(
                  'text-sm',
                  rec.completed && 'line-through'
                )}>{rec.text}</p>
                <p className="text-xs text-muted-foreground">{rec.section}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ready to Proceed */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Check className="h-4 w-4" />
            <span className="font-medium text-sm">Ready to proceed?</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Review the insights above. You can edit any field by hovering and clicking the AI enhance icon. All changes are saved automatically.
          </p>
          <div className="flex items-center gap-1 text-xs text-primary mt-2">
            <ArrowRight className="h-3 w-3" />
            <span>Next: Smart Interview to refine details</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalysisConfidencePanel;
