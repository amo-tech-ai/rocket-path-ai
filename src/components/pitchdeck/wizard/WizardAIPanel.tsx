/**
 * Wizard AI Panel Component
 * Right panel with AI suggestions and tips
 */

import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Plus, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WizardAIPanelProps {
  title?: string;
  tips?: string[];
  suggestions?: Array<{ text: string; action?: () => void }>;
  confidenceLevel?: 'low' | 'medium' | 'high';
  confidenceText?: string;
  isLoading?: boolean;
}

export function WizardAIPanel({
  title = 'AI Assistant',
  tips,
  suggestions,
  confidenceLevel,
  confidenceText,
  isLoading = false,
}: WizardAIPanelProps) {
  const confidenceConfig = {
    low: { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertCircle },
    medium: { color: 'text-sage', bg: 'bg-sage/10', icon: Info },
    high: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
  };

  return (
    <div className="sticky top-8 space-y-4">
      {/* AI Assistant Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sage/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-sage" />
            </div>
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Tips */}
          {tips && tips.length > 0 && (
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{tip}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Suggestions with +Add buttons */}
          {suggestions && suggestions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                AI Suggestions
              </p>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-foreground line-clamp-2">
                    {suggestion.text}
                  </span>
                  {suggestion.action && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={suggestion.action}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-7 px-2"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Confidence Level */}
          {confidenceLevel && confidenceText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'p-3 rounded-lg',
                confidenceConfig[confidenceLevel].bg
              )}
            >
              <div className="flex items-start gap-2">
                {(() => {
                  const Icon = confidenceConfig[confidenceLevel].icon;
                  return (
                    <Icon className={cn('w-4 h-4 mt-0.5', confidenceConfig[confidenceLevel].color)} />
                  );
                })()}
                <div>
                  <p className={cn('text-xs font-medium', confidenceConfig[confidenceLevel].color)}>
                    Confidence Level
                  </p>
                  <p className="text-sm text-foreground mt-0.5">{confidenceText}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-sage border-t-transparent" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
