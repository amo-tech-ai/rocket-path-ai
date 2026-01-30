/**
 * Resume Interview Dialog
 * Shows when user has saved interview progress
 * Implements Task 24: Fix Interview Answer Persistence
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { History, RefreshCw } from 'lucide-react';

interface ResumeInterviewDialogProps {
  open: boolean;
  answeredCount: number;
  onResume: () => void;
  onStartFresh: () => void;
}

export function ResumeInterviewDialog({
  open,
  answeredCount,
  onResume,
  onStartFresh,
}: ResumeInterviewDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <History className="h-5 w-5 text-primary" />
            </div>
            <AlertDialogTitle>Resume Interview?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            You have <span className="font-semibold text-foreground">{answeredCount} answer{answeredCount !== 1 ? 's' : ''}</span> saved from your previous session.
            Would you like to continue where you left off?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onStartFresh}
            className="sm:w-auto w-full flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Start Fresh
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onResume}
            className="sm:w-auto w-full flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ResumeInterviewDialog;
