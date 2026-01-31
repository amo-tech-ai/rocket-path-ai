/**
 * AutoSaveIndicator Component
 * Displays the status of background persistence for interview answers.
 */

import { format } from 'date-fns';
import { CheckCircle2, CloudUpload, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
    lastSaved: Date | null;
    isSaving: boolean;
    className?: string;
}

export function AutoSaveIndicator({ lastSaved, isSaving, className }: AutoSaveIndicatorProps) {
    return (
        <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground transition-all duration-300", className)}>
            {isSaving ? (
                <>
                    <CloudUpload className="h-3 w-3 animate-bounce" />
                    <span>Saving...</span>
                </>
            ) : lastSaved ? (
                <>
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span>Saved {format(lastSaved, 'HH:mm:ss')}</span>
                </>
            ) : (
                <>
                    <Clock className="h-3 w-3" />
                    <span>Not saved yet</span>
                </>
            )}
        </div>
    );
}
