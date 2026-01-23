import { Sparkles, Globe, Search, Target, FileText, Brain, TrendingUp, BarChart3, Users, MessageSquare, CheckCircle2, AlertCircle, Loader2, Signal, Zap, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ReadinessScore, InvestorScore, AISummary } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';

interface AdvisorPersona {
  name: string;
  title: string;
  intro: string;
}

interface WizardAIPanelProps {
  currentStep: number;
  isProcessing?: boolean;
  extractions?: {
    company_name?: string;
    industry?: string;
    features?: string[];
    competitors?: string[];
    tagline?: string;
    target_customers?: string[];
  };
  readinessScore?: ReadinessScore | null;
  investorScore?: InvestorScore | null;
  aiSummary?: AISummary | null;
  signals?: string[];
  advisor?: AdvisorPersona | null;
  questionCount?: { answered: number; total: number };
}

// Step-specific advisor personas
const ADVISORS: Record<number, AdvisorPersona> = {
  1: {
    name: 'Luna',
    title: 'Context Specialist',
    intro: 'I\'ll analyze your digital footprint and build a comprehensive profile.',
  },
  2: {
    name: 'Atlas',
    title: 'Market Analyst',
    intro: 'Let me benchmark your startup against industry standards.',
  },
  3: {
    name: 'Sage',
    title: 'Strategy Advisor',
    intro: 'I\'ll ask a few questions to understand your unique position.',
  },
  4: {
    name: 'Nova',
    title: 'Investor Relations',
    intro: 'Here\'s your investor-ready profile and score.',
  },
};

// Step-specific guidance content
const stepGuidance = [
  {
    title: 'What Gemini Will Do',
    items: [
      { icon: Globe, text: 'Analyze your website and LinkedIn' },
      { icon: Search, text: 'Research market using Google Search' },
      { icon: Target, text: 'Extract features, audience, pricing' },
      { icon: FileText, text: 'Find real competitors & trends' },
      { icon: Brain, text: 'Combine with your description' },
      { icon: Sparkles, text: 'Autofill profile fields' },
    ],
  },
  {
    title: 'AI Analysis',
    items: [
      { icon: BarChart3, text: 'Calculating readiness score' },
      { icon: TrendingUp, text: 'Benchmarking against industry' },
      { icon: Target, text: 'Identifying market position' },
      { icon: Users, text: 'Analyzing team composition' },
    ],
  },
  {
    title: 'Smart Interview',
    items: [
      { icon: MessageSquare, text: 'Adaptive questions based on gaps' },
      { icon: Brain, text: 'Extracting traction signals' },
      { icon: Target, text: 'Understanding your strategy' },
      { icon: Sparkles, text: 'Building investor narrative' },
    ],
  },
  {
    title: 'Final Review',
    items: [
      { icon: CheckCircle2, text: 'Investor-ready score (0-100)' },
      { icon: FileText, text: 'AI-generated summary' },
      { icon: Target, text: 'Improvement recommendations' },
      { icon: Sparkles, text: 'Ready to generate assets' },
    ],
  },
];

const SIGNAL_LABELS: Record<string, { label: string; color: string }> = {
  b2b_saas: { label: 'B2B SaaS', color: 'bg-primary/10 text-primary' },
  has_revenue: { label: 'Has Revenue', color: 'bg-accent text-accent-foreground' },
  pre_revenue: { label: 'Pre-Revenue', color: 'bg-muted text-muted-foreground' },
  raising_seed: { label: 'Raising Seed', color: 'bg-secondary text-secondary-foreground' },
  technical_founder: { label: 'Technical Team', color: 'bg-accent text-accent-foreground' },
  early_traction: { label: 'Early Traction', color: 'bg-primary/10 text-primary' },
  product_market_fit: { label: 'PMF Signals', color: 'bg-accent text-accent-foreground' },
};

function getScoreColor(score: number) {
  if (score >= 80) return 'text-primary';
  if (score >= 65) return 'text-primary/80';
  if (score >= 50) return 'text-muted-foreground';
  return 'text-destructive';
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
}

export function WizardAIPanel({
  currentStep,
  isProcessing = false,
  extractions,
  readinessScore,
  investorScore,
  aiSummary,
  signals = [],
  advisor: customAdvisor,
  questionCount,
}: WizardAIPanelProps) {
  const currentGuidance = stepGuidance[currentStep - 1] || stepGuidance[0];
  const advisor = customAdvisor || ADVISORS[currentStep];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Advisor Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{advisor.name}</p>
                <p className="text-xs text-muted-foreground">{advisor.title}</p>
                <p className="text-sm mt-2 text-foreground/80">{advisor.intro}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Indicator */}
        {isProcessing && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm font-medium text-primary">AI is processing...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Guidance + Extractions */}
        {currentStep === 1 && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-4 w-4 text-primary" />
                  {currentGuidance.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentGuidance.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Extractions Display */}
            {extractions && Object.keys(extractions).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Extracted Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {extractions.company_name && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Company</span>
                      <p className="text-sm font-medium">{extractions.company_name}</p>
                    </div>
                  )}
                  {extractions.industry && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Industry</span>
                      <p className="text-sm font-medium">{extractions.industry}</p>
                    </div>
                  )}
                  {extractions.tagline && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Value Prop</span>
                      <p className="text-sm">{extractions.tagline}</p>
                    </div>
                  )}
                  {extractions.features && extractions.features.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Features</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {extractions.features.slice(0, 5).map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {extractions.competitors && extractions.competitors.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Competitors</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {extractions.competitors.slice(0, 4).map((comp, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{comp}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Context Card */}
            <Card className="bg-accent/30">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    More details = better results. Your Pitch Deck, One-Pager, and Financial Models will be tailored to this context.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 2: Analysis Confidence Panel (Matching Reference Design) */}
        {currentStep === 2 && (
          <>
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
                        strokeDasharray={`${((readinessScore?.overall_score || 0) / 100) * 251.2} 251.2`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn('text-2xl font-bold', getScoreColor(readinessScore?.overall_score || 0))}>
                        {isProcessing ? '...' : `${readinessScore?.overall_score || 0}%`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getScoreLabel(readinessScore?.overall_score || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sources Analyzed</span>
                    <span className="font-medium">4 URLs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Signals Extracted</span>
                    <span className="font-medium">12 Signals</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Grounding</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-primary/10 text-primary border-primary/30"
                    >
                      Active
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
                  Strong founder-market fit with ex-Adobe pedigree. Clear product positioning in growing GenAI creative ops space. Competitive landscape is dense but differentiation via enterprise integrations is defensible.
                </p>
                
                <Separator className="bg-primary/10" />
                
                <div className="space-y-1">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    Primary Strengths
                  </span>
                  <p className="text-xs text-foreground/80">
                    Deep domain expertise + proven enterprise execution
                  </p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Primary Risks
                  </span>
                  <p className="text-xs text-muted-foreground">
                    High competitor density in DAM/creative space
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
                {[
                  { text: 'Validate Founder Details', section: 'Confirm dates & roles from LinkedIn', completed: false },
                  { text: 'Confirm Competitors', section: 'Are these the right rivals?', completed: false },
                  { text: 'Review Pricing', section: 'Check if Freemium is accurate', completed: false },
                ].map((rec, i) => (
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
                        'text-sm font-medium',
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
                  <CheckCircle2 className="h-4 w-4" />
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
          </>
        )}

        {/* Step 3: Interview Progress + Signals */}
        {currentStep === 3 && (
          <>
            {questionCount && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Interview Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Questions Answered</span>
                      <span className="font-medium">{questionCount.answered}/{questionCount.total}</span>
                    </div>
                    <Progress value={(questionCount.answered / questionCount.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {signals.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Signals Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {signals.map((signal) => {
                      const info = SIGNAL_LABELS[signal] || { label: signal, color: 'bg-muted text-muted-foreground' };
                      return (
                        <Badge key={signal} className={cn('text-xs', info.color)}>
                          {info.label}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  How This Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentGuidance.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-accent/30">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground text-center">
                  Answer honestly — accuracy improves your score more than optimism.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 4: Investor Score + Recommendations */}
        {currentStep === 4 && (
          <>
            {investorScore && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Investor Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className={cn('text-4xl font-bold', getScoreColor(investorScore.total_score))}>
                        {investorScore.total_score}
                      </span>
                      <span className="text-lg text-muted-foreground">/100</span>
                      <p className={cn('text-sm font-medium mt-1', getScoreColor(investorScore.total_score))}>
                        {getScoreLabel(investorScore.total_score)}
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {Object.entries(investorScore.breakdown).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="w-full aspect-square rounded-lg bg-accent flex items-center justify-center mb-1">
                            <span className="text-xs font-semibold">{value}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground capitalize">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {investorScore?.recommendations && investorScore.recommendations.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Quick Wins
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {investorScore.recommendations.slice(0, 3).map((rec, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 p-2 bg-accent/30 rounded-lg">
                      <span className="text-xs">{rec.action}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        +{rec.points_gain} pts
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {aiSummary && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">AI Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{aiSummary.summary}</p>
                  {aiSummary.strengths.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-primary mb-1">Strengths</p>
                      <ul className="space-y-0.5">
                        {aiSummary.strengths.slice(0, 2).map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  What's Next
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentGuidance.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center px-4">
          Powered by Gemini 3 with Google Search Grounding
        </p>
      </div>
    </ScrollArea>
  );
}

export default WizardAIPanel;
