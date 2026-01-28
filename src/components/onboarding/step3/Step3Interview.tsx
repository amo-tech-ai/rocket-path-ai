import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { InterviewAnswer } from '@/hooks/useWizardSession';

// Sub-components
import InterviewLoadingSkeleton from './InterviewLoadingSkeleton';
import InterviewComplete from './InterviewComplete';
import TopicBadges from './TopicBadges';
import QuestionCard from './QuestionCard';
import InterviewNavigation from './InterviewNavigation';
import SignalsPanel from './SignalsPanel';
import CoachingFeedback from './CoachingFeedback';

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
  onAnswer: (questionId: string, answerId: string, answerText?: string, questionKey?: string) => Promise<void>;
  onSkip: () => void;
  onComplete: () => void;
  isProcessing: boolean;
  currentQuestionIndex: number;
  onSetCurrentIndex: (index: number) => void;
  // Coaching props
  coachingFeedback?: string | null;
  isCoaching?: boolean;
  onDismissCoaching?: () => void;
}

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
  coachingFeedback,
  isCoaching = false,
  onDismissCoaching,
}: Step3InterviewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  
  // Guard: If questions failed to load or are empty, show loading state
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
    
    // Get answer text for coaching
    const answerText = currentQuestion.type === 'multi_select'
      ? selectedMulti.map(id => currentQuestion.options?.find(o => o.id === id)?.text).filter(Boolean).join(', ')
      : currentQuestion.options?.find(o => o.id === selectedAnswer)?.text;
    
    // Pass question ID as questionKey for coaching lookup
    await onAnswer(currentQuestion.id, answerId, answerText, currentQuestion.id);
    onSetCurrentIndex(currentQuestionIndex + 1);
  };

  const handleSkip = () => {
    onSetCurrentIndex(currentQuestionIndex + 1);
    onSkip();
  };

  const handleToggleMulti = (optionId: string) => {
    if (selectedMulti.includes(optionId)) {
      setSelectedMulti(selectedMulti.filter(id => id !== optionId));
    } else {
      setSelectedMulti([...selectedMulti, optionId]);
    }
  };

  // Loading state
  if (!hasQuestions) {
    return <InterviewLoadingSkeleton />;
  }

  // Complete state
  if (isComplete) {
    return <InterviewComplete onComplete={onComplete} />;
  }

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
      <TopicBadges questions={questions} answers={answers} />

      {/* Question Card */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            selectedMulti={selectedMulti}
            onSelectAnswer={setSelectedAnswer}
            onToggleMulti={handleToggleMulti}
          />
        )}
      </AnimatePresence>

      {/* Coaching Feedback */}
      <CoachingFeedback
        coaching={coachingFeedback || null}
        isLoading={isCoaching}
        onDismiss={onDismissCoaching || (() => {})}
        questionTopic={currentQuestion?.topic}
      />

      {/* Navigation */}
      <InterviewNavigation
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        selectedMulti={selectedMulti}
        isProcessing={isProcessing}
        onContinue={handleContinue}
        onSkip={handleSkip}
      />

      {/* Signals Detected */}
      <SignalsPanel signals={signals} />
    </div>
  );
}

export default Step3Interview;
