/**
 * Step 2 AI Suggestions Panel Component
 * Context-aware AI suggestions for Problem, Solution, Differentiator fields
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, RefreshCw, Lightbulb, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { PitchSuggestion } from '@/hooks/usePitchSuggestions';

interface Step2AISuggestionsPanelProps {
  suggestions: {
    problem: PitchSuggestion[];
    core_solution: PitchSuggestion[];
    differentiation: PitchSuggestion[];
  };
  isLoading: boolean;
  activeField: 'problem' | 'core_solution' | 'differentiation' | null;
  focusedField: 'problem' | 'core_solution' | 'differentiator' | null;
  onApplySuggestion: (field: string, text: string) => void;
  onRefresh: () => void;
  hasData: boolean;
}

const fieldConfig = {
  problem: {
    icon: Target,
    label: 'Problem Suggestions',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  core_solution: {
    icon: Lightbulb,
    label: 'Solution Suggestions',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  differentiation: {
    icon: Zap,
    label: 'Differentiation Suggestions',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
};

export function Step2AISuggestionsPanel({
  suggestions,
  isLoading,
  activeField,
  focusedField,
  onApplySuggestion,
  onRefresh,
  hasData,
}: Step2AISuggestionsPanelProps) {
  // Map focusedField to suggestions key
  const mappedFocusedField = focusedField === 'differentiator' ? 'differentiation' : focusedField;
  
  // Determine which suggestions to show based on focused field
  const currentSuggestions = mappedFocusedField 
    ? suggestions[mappedFocusedField] || []
    : [];

  const config = mappedFocusedField ? fieldConfig[mappedFocusedField] : null;
  const Icon = config?.icon || Sparkles;

  return (
    <div className="sticky top-8 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="bg-muted/30 px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sage/10 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-sage" />
              </div>
              <span className="text-sm font-medium text-foreground">AI Assistant</span>
            </div>
            {hasData && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-7 px-2"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[450px]">
          <div className="p-4 space-y-4">
            {/* Tips Section */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Investors look for clear pain + proof</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Metrics strengthen your narrative</span>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mb-3" />
                <p className="text-sm text-muted-foreground">
                  Generating {mappedFocusedField ? config?.label.toLowerCase() : 'suggestions'}...
                </p>
              </div>
            )}

            {/* Field-Specific Suggestions */}
            {!isLoading && mappedFocusedField && currentSuggestions.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={mappedFocusedField}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn('w-5 h-5 rounded flex items-center justify-center', config?.bgColor)}>
                      <Icon className={cn('w-3 h-3', config?.color)} />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {config?.label}
                    </p>
                  </div>

                  {currentSuggestions.map((suggestion, index) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      field={focusedField === 'differentiator' ? 'differentiator' : mappedFocusedField}
                      index={index}
                      onApply={onApplySuggestion}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* All Suggestions Overview (when no field focused) */}
            {!isLoading && !mappedFocusedField && hasData && (
              <div className="space-y-4">
                {(['problem', 'core_solution', 'differentiation'] as const).map((field) => {
                  const fieldSuggestions = suggestions[field] || [];
                  const fieldCfg = fieldConfig[field];
                  const FieldIcon = fieldCfg.icon;
                  
                  if (fieldSuggestions.length === 0) return null;

                  return (
                    <div key={field} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-5 h-5 rounded flex items-center justify-center', fieldCfg.bgColor)}>
                          <FieldIcon className={cn('w-3 h-3', fieldCfg.color)} />
                        </div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {fieldCfg.label}
                        </p>
                      </div>
                      {fieldSuggestions.slice(0, 2).map((suggestion, index) => (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          field={field === 'differentiation' ? 'differentiator' : field}
                          index={index}
                          onApply={onApplySuggestion}
                          compact
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !hasData && (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click on a field to see AI suggestions
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  AI will generate investor-ready copy
                </p>
              </div>
            )}

            {/* Focused field but no suggestions */}
            {!isLoading && mappedFocusedField && currentSuggestions.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No suggestions yet
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="mt-3"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  Generate Suggestions
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: PitchSuggestion;
  field: string;
  index: number;
  onApply: (field: string, text: string) => void;
  compact?: boolean;
}

function SuggestionCard({ suggestion, field, index, onApply, compact = false }: SuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border",
        compact && "p-2"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1">
          <span className={cn(
            "text-foreground leading-snug block",
            compact ? "text-xs" : "text-sm"
          )}>
            {suggestion.text}
          </span>
          {!compact && suggestion.reason && (
            <p className="text-xs text-muted-foreground">
              {suggestion.reason}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onApply(field, suggestion.text)}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-7 px-2"
        >
          <Plus className="w-3 h-3 mr-1" />
          Apply
        </Button>
      </div>
    </motion.div>
  );
}
