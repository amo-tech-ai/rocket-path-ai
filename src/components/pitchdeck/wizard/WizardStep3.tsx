/**
 * Wizard Step 3: Smart Interview
 * AI-powered industry-specific questions
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, HelpCircle, CheckCircle2, SkipForward } from 'lucide-react';
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
  isLoadingQuestions?: boolean;
  isSaving?: boolean;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  market: { label: 'Market', color: 'bg-blue-500/10 text-blue-600' },
  traction: { label: 'Traction', color: 'bg-emerald-500/10 text-emerald-600' },
  competition: { label: 'Competition', color: 'bg-orange-500/10 text-orange-600' },
  team: { label: 'Team', color: 'bg-purple-500/10 text-purple-600' },
  financials: { label: 'Financials', color: 'bg-amber-500/10 text-amber-600' },
  product: { label: 'Product', color: 'bg-sage/10 text-sage' },
};

export function WizardStep3({
  initialData,
  questions,
  researchContext,
  onContinue,
  onBack,
  isLoadingQuestions = false,
  isSaving = false,
}: WizardStep3Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialData?.questions) {
      const answersMap: Record<string, string> = {};
      const skippedSet = new Set<string>();
      
      initialData.questions.forEach(q => {
        if (q.response) answersMap[q.id] = q.response;
        if (q.skipped) skippedSet.add(q.id);
      });
      
      setAnswers(answersMap);
      setSkippedQuestions(skippedSet);
    }
  }, [initialData]);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? ((answeredCount + skippedQuestions.size) / questions.length) * 100 : 0;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    // Remove from skipped if user starts typing
    if (skippedQuestions.has(questionId)) {
      setSkippedQuestions(prev => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    }
  };

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
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-sage border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Analyzing your startup profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Smart Interview
        </h2>
        <p className="text-muted-foreground mt-1">
          Answer industry-specific questions to strengthen your deck
        </p>
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
            className="space-y-4 p-6 rounded-xl border border-border bg-muted/20"
          >
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn(
                  'text-xs',
                  CATEGORY_LABELS[currentQuestion.category]?.color || 'bg-muted text-muted-foreground'
                )}
              >
                {CATEGORY_LABELS[currentQuestion.category]?.label || currentQuestion.category}
              </Badge>
              {currentQuestion.slide_mapping && (
                <span className="text-xs text-muted-foreground">
                  → {currentQuestion.slide_mapping.replace(/_/g, ' ')} slide
                </span>
              )}
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label className="text-lg font-medium text-foreground">
                {currentQuestion.question}
              </Label>
              
              {/* Why it matters hint */}
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>This helps investors understand your competitive positioning</span>
              </div>
            </div>

            {/* Answer Input */}
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="resize-none"
            />

            {/* Answer Quality Indicator */}
            <div className="flex items-center gap-2 text-xs">
              {answers[currentQuestion.id]?.length > 0 ? (
                answers[currentQuestion.id].length < 50 ? (
                  <span className="text-amber-500">Brief answer</span>
                ) : answers[currentQuestion.id].length < 150 ? (
                  <span className="text-sage flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Good answer
                  </span>
                ) : (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Detailed answer
                  </span>
                )
              ) : skippedQuestions.has(currentQuestion.id) ? (
                <span className="text-muted-foreground">Skipped</span>
              ) : null}
            </div>

            {/* Question Navigation */}
            <div className="flex items-center justify-between pt-2">
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
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={cn(
              'w-8 h-8 rounded-full text-sm font-medium transition-all',
              index === currentQuestionIndex && 'bg-sage text-sage-foreground',
              index !== currentQuestionIndex && answers[q.id] && 'bg-sage/20 text-sage',
              index !== currentQuestionIndex && skippedQuestions.has(q.id) && 'bg-muted text-muted-foreground',
              index !== currentQuestionIndex && !answers[q.id] && !skippedQuestions.has(q.id) && 'bg-muted hover:bg-muted/80'
            )}
          >
            {index + 1}
          </button>
        ))}
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
