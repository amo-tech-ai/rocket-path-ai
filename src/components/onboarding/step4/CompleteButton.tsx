import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompleteButtonProps {
  isCompleting: boolean;
  onComplete: () => void;
}

export function CompleteButton({ isCompleting, onComplete }: CompleteButtonProps) {
  return (
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
  );
}

export default CompleteButton;
