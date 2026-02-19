import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InterviewCompleteProps {
  onComplete: () => void;
}

export function InterviewComplete({ onComplete }: InterviewCompleteProps) {
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

export default InterviewComplete;
