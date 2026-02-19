/**
 * Coaching Feedback Component
 * Displays AI coaching feedback for interview answers
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CoachingFeedbackProps {
  coaching: string | null;
  isLoading: boolean;
  onDismiss: () => void;
  questionTopic?: string;
}

export function CoachingFeedback({
  coaching,
  isLoading,
  onDismiss,
  questionTopic,
}: CoachingFeedbackProps) {
  if (!isLoading && !coaching) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        <Card className={cn(
          "p-4 border-l-4",
          isLoading 
            ? "border-l-muted bg-muted/30" 
            : "border-l-primary bg-primary/5"
        )}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn(
                "p-2 rounded-lg shrink-0",
                isLoading ? "bg-muted" : "bg-primary/10"
              )}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Lightbulb className="h-4 w-4 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    Industry Coach
                  </span>
                  {questionTopic && (
                    <span className="text-xs text-muted-foreground">
                      • {questionTopic}
                    </span>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                  </div>
                ) : (
                  <p className="text-sm text-foreground leading-relaxed">
                    {coaching}
                  </p>
                )}
              </div>
            </div>

            {!isLoading && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={onDismiss}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default CoachingFeedback;
