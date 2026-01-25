import { ChevronRight, SkipForward, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Question } from './Step3Interview';

interface InterviewNavigationProps {
  currentQuestion: Question | null;
  selectedAnswer: string | null;
  selectedMulti: string[];
  isProcessing: boolean;
  onContinue: () => void;
  onSkip: () => void;
}

export function InterviewNavigation({
  currentQuestion,
  selectedAnswer,
  selectedMulti,
  isProcessing,
  onContinue,
  onSkip,
}: InterviewNavigationProps) {
  const isDisabled =
    isProcessing ||
    !currentQuestion ||
    (currentQuestion?.type === 'multiple_choice' && !selectedAnswer) ||
    (currentQuestion?.type === 'multi_select' && selectedMulti.length === 0);

  return (
    <div className="flex items-center justify-between pt-4">
      <Button variant="ghost" onClick={onSkip}>
        <SkipForward className="h-4 w-4 mr-2" />
        Skip Question
      </Button>
      <Button onClick={onContinue} disabled={isDisabled}>
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
  );
}

export default InterviewNavigation;
