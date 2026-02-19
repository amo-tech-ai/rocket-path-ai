/**
 * ResumeInterviewDialog Component
 * Prompts the user to resume an interrupted interview session.
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
} from "@/components/ui/alert-dialog";
import { useWizardSession } from "@/hooks/useWizardSession";

interface ResumeInterviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    progress: number;
}

export function ResumeInterviewDialog({ open, onOpenChange, progress }: ResumeInterviewDialogProps) {
    const { setCurrentStep } = useWizardSession();

    const handleResume = async () => {
        // Jump to Step 3 (Interview)
        await setCurrentStep(3);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Resume your interview?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You have an unfinished interview with {progress} answers saved.
                        Would you like to pick up where you left off?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Start over</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResume}>
                        Resume Interview
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
