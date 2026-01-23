import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, SkipForward, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { InterviewAnswer } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'multi_select' | 'text' | 'number';
  options?: { id: string; text: string; emoji?: string }[];
  topic: string;
  why_matters: string;
}

export interface AdvisorPersona {
  name: string;
  title: string;
  intro: string;
}

interface Step3InterviewProps {
  sessionId: string;
  questions: Question[];
  answers: InterviewAnswer[];
  signals: string[];
  advisor: AdvisorPersona | null;
  onAnswer: (questionId: string, answerId: string, answerText?: string) => Promise<void>;
  onSkip: () => void;
  onComplete: () => void;
  isProcessing: boolean;
  currentQuestionIndex: number;
  onSetCurrentIndex: (index: number) => void;
}

const SIGNAL_LABELS: Record<string, { label: string; color: string }> = {
  b2b_saas: { label: 'B2B SaaS', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  has_revenue: { label: 'Has Revenue', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  pre_revenue: { label: 'Pre-Revenue', color: 'bg-muted text-muted-foreground' },
  raising_seed: { label: 'Raising Seed', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  technical_founder: { label: 'Technical Team', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  early_traction: { label: 'Early Traction', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
  product_market_fit: { label: 'PMF Signals', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' },
};

const TOPICS = ['Business Model', 'Market', 'Traction', 'Team', 'Funding'];

export function Step3Interview({
  sessionId,
  questions,
  answers,
  signals,
  advisor,
  onAnswer,
  onSkip,
  onComplete,
  isProcessing,
  currentQuestionIndex,
  onSetCurrentIndex,
}: Step3InterviewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  
  // Guard: If questions failed to load or are empty, show loading state instead of "complete"
  const hasQuestions = questions && questions.length > 0;
  const currentQuestion = hasQuestions ? questions[currentQuestionIndex] : null;
  const isComplete = hasQuestions && currentQuestionIndex >= questions.length;
  const progressPercent = hasQuestions ? Math.min((currentQuestionIndex / questions.length) * 100, 100) : 0;

  // Reset selection when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setSelectedMulti([]);
  }, [currentQuestionIndex]);

  const handleContinue = async () => {
    if (!currentQuestion) return;
    
    const answerId = currentQuestion.type === 'multi_select' 
      ? selectedMulti.join(',') 
      : selectedAnswer;
    
    if (!answerId) return;
    
    await onAnswer(currentQuestion.id, answerId);
    onSetCurrentIndex(currentQuestionIndex + 1);
  };

  const handleSkip = () => {
    onSetCurrentIndex(currentQuestionIndex + 1);
    onSkip();
  };

  // Loading state: questions haven't loaded yet
  if (!hasQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Loading Interview Questions...</h2>
        <p className="text-muted-foreground">
          Preparing your personalized interview. This may take a moment.
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Interview Complete!</h2>
        <p className="text-muted-foreground mb-6">
          You've answered all questions. Let's review your profile.
        </p>
        <Button onClick={onComplete} size="lg">
          Continue to Review
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  const topicsCovered = [...new Set(answers.map(a => {
    const q = questions.find(q => q.id === a.question_id);
    return q?.topic;
  }).filter(Boolean))] as string[];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="font-medium">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Topics Covered */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => {
          const isCovered = topicsCovered.includes(topic.toLowerCase());
          return (
            <Badge
              key={topic}
              variant={isCovered ? 'default' : 'outline'}
              className={cn(
                'text-xs',
                isCovered && 'bg-primary text-primary-foreground'
              )}
            >
              {isCovered && <Check className="h-3 w-3 mr-1" />}
              {topic}
            </Badge>
          );
        })}
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
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.text}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  <RadioGroup
                    value={selectedAnswer || ''}
                    onValueChange={setSelectedAnswer}
                    className="space-y-3"
                  >
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer',
                          selectedAnswer === option.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent/50'
                        )}
                        onClick={() => setSelectedAnswer(option.id)}
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.emoji && <span className="mr-2">{option.emoji}</span>}
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === 'multi_select' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.id}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer',
                          selectedMulti.includes(option.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent/50'
                        )}
                        onClick={() => {
                          if (selectedMulti.includes(option.id)) {
                            setSelectedMulti(selectedMulti.filter(id => id !== option.id));
                          } else {
                            setSelectedMulti([...selectedMulti, option.id]);
                          }
                        }}
                      >
                        <Checkbox
                          checked={selectedMulti.includes(option.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMulti([...selectedMulti, option.id]);
                            } else {
                              setSelectedMulti(selectedMulti.filter(id => id !== option.id));
                            }
                          }}
                        />
                        <Label className="flex-1 cursor-pointer">{option.text}</Label>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Answer honestly — accuracy improves your score more than optimism.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={handleSkip}>
          <SkipForward className="h-4 w-4 mr-2" />
          Skip Question
        </Button>
        <Button
          onClick={handleContinue}
          disabled={
            isProcessing ||
            (currentQuestion?.type === 'multiple_choice' && !selectedAnswer) ||
            (currentQuestion?.type === 'multi_select' && selectedMulti.length === 0)
          }
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Signals Detected */}
      {signals.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">SIGNALS DETECTED</p>
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
        </div>
      )}
    </div>
  );
}

export default Step3Interview;
