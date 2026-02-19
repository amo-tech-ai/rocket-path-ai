/**
 * Wizard Step 3: Smart Interview
 * AI-powered industry-specific questions with signal extraction
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  SkipForward,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { type Step3Data, type InterviewQuestion } from '@/lib/pitchDeckSchema';
import { cn } from '@/lib/utils';

interface WizardStep3Props {
  initialData?: Partial<Step3Data>;
  questions: InterviewQuestion[];
  researchContext?: Record<string, unknown>;
  onContinue: (data: Step3Data) => void;
  onBack: () => void;
  onAnswerSave?: (questionId: string, answer: string) => void;
  isLoadingQuestions?: boolean;
  isSaving?: boolean;
}

const CATEGORY_CONFIG: Record<string, { 
  label: string; 
  color: string; 
  icon: typeof Target;
  hints: string[];
}> = {
  market: { 
    label: 'Market', 
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    icon: Users,
    hints: [
      'Quantify your market size with TAM, SAM, SOM',
      'Reference credible sources for market data',
      'Show market trends that favor your solution'
    ]
  },
  traction: { 
    label: 'Traction', 
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    icon: TrendingUp,
    hints: [
      'Include specific numbers: users, revenue, growth %',
      'Month-over-month growth is compelling',
      'Customer testimonials add credibility'
    ]
  },
  competition: { 
    label: 'Competition', 
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    icon: Shield,
    hints: [
      'Name 2-3 direct competitors',
      'Explain your defensible moat',
      'Show why switching is hard'
    ]
  },
  team: { 
    label: 'Team', 
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    icon: Users,
    hints: [
      'Highlight domain expertise',
      'Prior startup or relevant experience',
      'Why this team wins in this market'
    ]
  },
  financials: { 
    label: 'Financials', 
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    icon: DollarSign,
    hints: [
      'Include unit economics: CAC, LTV, margins',
      'Burn rate and runway context',
      'Clear use of funds breakdown'
    ]
  },
  product: { 
    label: 'Product', 
    color: 'bg-sage/10 text-sage border-sage/20',
    icon: Target,
    hints: [
      'Focus on key differentiating features',
      'Technical moats investors understand',
      'Customer outcomes over features'
    ]
  },
};

// Investor-focused "why it matters" per category
const WHY_IT_MATTERS: Record<string, string> = {
  market: 'Investors need to see a large, growing market to justify potential returns',
  traction: 'Evidence of product-market fit is the #1 signal VCs look for at seed stage',
  competition: 'Smart investors research competitors — show you understand the landscape',
  team: 'At early stages, investors bet on founders as much as the idea',
  financials: 'Unit economics prove your business model works at scale',
  product: 'Technical differentiation creates defensibility against competitors',
};

// Signal extraction patterns
const SIGNAL_PATTERNS = {
  has_revenue: /(\$[\d,]+|revenue|MRR|ARR|paying customers)/i,
  has_users: /(\d+\s*(users|customers|clients|active))/i,
  has_growth: /(growth|growing|increased|doubled|tripled|\d+%)/i,
  has_moat: /(moat|proprietary|patent|exclusive|defensib)/i,
  has_metrics: /(CAC|LTV|margin|churn|retention|\d+%)/i,
  has_team_strength: /(founded|built|led|experience|years|worked at)/i,
};

function extractSignals(answer: string): string[] {
  const signals: string[] = [];
  Object.entries(SIGNAL_PATTERNS).forEach(([signal, pattern]) => {
    if (pattern.test(answer)) {
      signals.push(signal);
    }
  });
  return signals;
}

function getAnswerQuality(answer: string): {
  level: 'none' | 'brief' | 'good' | 'detailed';
  label: string;
  color: string;
  signals: string[];
} {
  const signals = extractSignals(answer);
  const length = answer.length;
  
  if (length === 0) {
    return { level: 'none', label: '', color: '', signals: [] };
  }
  
  if (length < 50) {
    return { 
      level: 'brief', 
      label: 'Brief — add more detail for a stronger deck', 
      color: 'text-amber-500',
      signals 
    };
  }
  
  if (length < 150 || signals.length < 2) {
    return { 
      level: 'good', 
      label: 'Good answer', 
      color: 'text-sage',
      signals 
    };
  }
  
  return { 
    level: 'detailed', 
    label: 'Detailed answer with strong signals', 
    color: 'text-emerald-500',
    signals 
  };
}

export function WizardStep3({
  initialData,
  questions,
  researchContext,
  onContinue,
  onBack,
  onAnswerSave,
  isLoadingQuestions = false,
  isSaving = false,
}: WizardStep3Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
  const [extractedSignals, setExtractedSignals] = useState<Record<string, string[]>>({});
  const [showHints, setShowHints] = useState(true);

  useEffect(() => {
    if (initialData?.questions) {
      const answersMap: Record<string, string> = {};
      const skippedSet = new Set<string>();
      const signalsMap: Record<string, string[]> = {};
      
      initialData.questions.forEach(q => {
        if (q.response) {
          answersMap[q.id] = q.response;
          signalsMap[q.id] = extractSignals(q.response);
        }
        if (q.skipped) skippedSet.add(q.id);
      });
      
      setAnswers(answersMap);
      setSkippedQuestions(skippedSet);
      setExtractedSignals(signalsMap);
    }
  }, [initialData]);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).filter(id => answers[id]?.length > 0).length;
  const progress = questions.length > 0 ? ((answeredCount + skippedQuestions.size) / questions.length) * 100 : 0;
  
  // Calculate overall signal strength from answers
  const totalSignals = Object.values(extractedSignals).flat();
  const uniqueSignals = [...new Set(totalSignals)];

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Extract signals in real-time
    const signals = extractSignals(value);
    setExtractedSignals(prev => ({ ...prev, [questionId]: signals }));
    
    // Remove from skipped if user starts typing
    if (skippedQuestions.has(questionId)) {
      setSkippedQuestions(prev => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    }
  }, [skippedQuestions]);

  // Debounced auto-save (call parent handler if provided)
  useEffect(() => {
    if (!currentQuestion || !onAnswerSave) return;
    
    const answer = answers[currentQuestion.id];
    if (!answer) return;
    
    const timeoutId = setTimeout(() => {
      onAnswerSave(currentQuestion.id, answer);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [answers, currentQuestion, onAnswerSave]);

  const handleSkip = () => {
    if (currentQuestion) {
      setSkippedQuestions(prev => new Set(prev).add(currentQuestion.id));
      goToNext();
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleContinue = () => {
    const formattedQuestions: InterviewQuestion[] = questions.map(q => ({
      ...q,
      response: answers[q.id] || '',
      skipped: skippedQuestions.has(q.id),
    }));

    const step3Data: Step3Data = {
      questions: formattedQuestions,
      research_context: researchContext as Step3Data['research_context'],
      questions_answered: answeredCount,
      questions_total: questions.length,
      answers: answers,
      extracted_signals: uniqueSignals,
    };

    onContinue(step3Data);
  };

  if (isLoadingQuestions) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Smart Interview
          </h2>
          <p className="text-muted-foreground mt-1">
            Preparing personalized questions...
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-sage border-t-transparent" />
            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-sage" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">
              Analyzing your startup profile...
            </p>
            <p className="text-xs text-muted-foreground">
              Generating industry-specific questions with AI
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Smart Interview
          </h2>
          <p className="text-muted-foreground mt-1">
            No questions available
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-sm text-muted-foreground">
            Unable to generate questions. Please go back and complete previous steps.
          </p>
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Previous Step
          </Button>
        </div>
      </div>
    );
  }

  const categoryConfig = CATEGORY_CONFIG[currentQuestion?.category] || CATEGORY_CONFIG.product;
  const CategoryIcon = categoryConfig.icon;
  const answerQuality = currentQuestion ? getAnswerQuality(answers[currentQuestion.id] || '') : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Smart Interview
          </h2>
          <p className="text-muted-foreground mt-1">
            Answer industry-specific questions to strengthen your deck
          </p>
        </div>
        
        {/* Signal strength indicator */}
        {uniqueSignals.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/20">
            <Sparkles className="w-4 h-4 text-sage" />
            <span className="text-sm font-medium text-sage">
              {uniqueSignals.length} signals detected
            </span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sage font-medium">
            {answeredCount} answered
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 p-6 rounded-xl border border-border bg-card"
          >
            {/* Category Badge & Slide Mapping */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={cn('text-xs gap-1', categoryConfig.color)}
                >
                  <CategoryIcon className="w-3 h-3" />
                  {categoryConfig.label}
                </Badge>
                {currentQuestion.slide_mapping && (
                  <span className="text-xs text-muted-foreground">
                    → {currentQuestion.slide_mapping.replace(/_/g, ' ')} slide
                  </span>
                )}
              </div>
              
              {(currentQuestion.source === 'ai_generated' || currentQuestion.source === 'fallback') && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="w-3 h-3" />
                  {currentQuestion.source === 'ai_generated' ? 'AI Generated' : 'Template'}
                </Badge>
              )}
            </div>

            {/* Question */}
            <div className="space-y-3">
              <Label className="text-lg font-medium text-foreground leading-relaxed">
                {currentQuestion.question}
              </Label>
              
              {/* Why it matters - dynamic per category */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-sage" />
                <div className="space-y-1">
                  <span className="text-sm text-foreground font-medium">
                    Why this matters
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {WHY_IT_MATTERS[currentQuestion.category] || 
                      'This helps investors understand your competitive positioning'}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <Textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={5}
                className="resize-none"
              />
              
              {/* Answer Quality & Signals */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {answerQuality?.level !== 'none' && (
                    <>
                      {answerQuality?.level === 'detailed' && (
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                      )}
                      {answerQuality?.level === 'good' && (
                        <CheckCircle2 className="w-3 h-3 text-sage" />
                      )}
                      <span className={answerQuality?.color}>
                        {answerQuality?.label}
                      </span>
                    </>
                  )}
                  {skippedQuestions.has(currentQuestion.id) && (
                    <span className="text-muted-foreground">Skipped</span>
                  )}
                </div>
                
                {/* Signal badges */}
                {answerQuality?.signals && answerQuality.signals.length > 0 && (
                  <div className="flex gap-1">
                    {answerQuality.signals.slice(0, 3).map(signal => (
                      <Badge 
                        key={signal} 
                        variant="secondary" 
                        className="text-[10px] px-1.5 py-0"
                      >
                        {signal.replace('has_', '').replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Hints (collapsible) */}
            {showHints && categoryConfig.hints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 p-3 rounded-lg bg-sage/5 border border-sage/10"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-sage">
                  <Lightbulb className="w-3 h-3" />
                  Pro Tips
                </div>
                <ul className="space-y-1">
                  {categoryConfig.hints.map((hint, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-sage">•</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Question Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrev}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Skip
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleContinue}
                  disabled={isSaving}
                  className="bg-sage hover:bg-sage/90"
                >
                  {isSaving ? 'Saving...' : 'Complete Interview'}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Pills */}
      <div className="flex flex-wrap gap-2">
        {questions.map((q, index) => {
          const hasAnswer = answers[q.id]?.length > 0;
          const isSkipped = skippedQuestions.has(q.id);
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={cn(
                'w-8 h-8 rounded-full text-sm font-medium transition-all',
                isCurrent && 'bg-sage text-sage-foreground ring-2 ring-sage/30',
                !isCurrent && hasAnswer && 'bg-sage/20 text-sage',
                !isCurrent && isSkipped && 'bg-muted text-muted-foreground',
                !isCurrent && !hasAnswer && !isSkipped && 'bg-muted hover:bg-muted/80 text-foreground'
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              Continue to Review
              <span aria-hidden>→</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
