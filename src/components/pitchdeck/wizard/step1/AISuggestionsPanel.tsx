/**
 * AI Suggestions Panel Component
 * Shows AI-generated suggestions with add-to-field capability
 */

import { motion } from 'framer-motion';
import { Sparkles, Plus, Lightbulb, TrendingUp, Users, AlertTriangle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface AISuggestion {
  id: string;
  text: string;
  explanation?: string;
  realWorldFraming?: string;
  category?: 'problem' | 'solution' | 'market' | 'trend' | 'gap';
  confidence?: number;
}

export interface IndustryInsight {
  coreProblems: string[];
  buyingPersonas: string[];
  existingSolutions: {
    ai: string[];
    nonAi: string[];
  };
  gaps: string[];
  trends: string[];
}

interface AISuggestionsPanelProps {
  title: string;
  suggestions: AISuggestion[];
  industryInsights?: IndustryInsight;
  onAddSuggestion: (suggestion: AISuggestion) => void;
  isLoading?: boolean;
  activeField?: string;
}

const categoryIcons = {
  problem: AlertTriangle,
  solution: Lightbulb,
  market: Users,
  trend: TrendingUp,
  gap: Building2,
};

const categoryColors = {
  problem: 'text-red-500 bg-red-500/10',
  solution: 'text-emerald-500 bg-emerald-500/10',
  market: 'text-blue-500 bg-blue-500/10',
  trend: 'text-purple-500 bg-purple-500/10',
  gap: 'text-amber-500 bg-amber-500/10',
};

export function AISuggestionsPanel({
  title,
  suggestions,
  industryInsights,
  onAddSuggestion,
  isLoading = false,
  activeField,
}: AISuggestionsPanelProps) {
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

        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent mb-3" />
                <p className="text-sm text-muted-foreground">Analyzing your industry...</p>
              </div>
            )}

            {/* Industry Insights Section */}
            {industryInsights && !isLoading && (
              <div className="space-y-4">
                {/* Core Problems */}
                {industryInsights.coreProblems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      Core Industry Problems
                    </p>
                    {industryInsights.coreProblems.map((problem, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-foreground p-2 rounded bg-muted/30"
                      >
                        {problem}
                      </div>
                    ))}
                  </div>
                )}

                {/* Buying Personas */}
                {industryInsights.buyingPersonas.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      Buying Personas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {industryInsights.buyingPersonas.map((persona, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600"
                        >
                          {persona}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Market Gaps */}
                {industryInsights.gaps.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      Unmet Needs & Gaps
                    </p>
                    {industryInsights.gaps.map((gap, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-foreground p-2 rounded bg-amber-500/10 border border-amber-500/20"
                      >
                        {gap}
                      </div>
                    ))}
                  </div>
                )}

                {/* Trends */}
                {industryInsights.trends.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-purple-500" />
                      Market Trends
                    </p>
                    {industryInsights.trends.map((trend, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-muted-foreground p-2 rounded bg-muted/30"
                      >
                        {trend}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && !isLoading && (
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {activeField === 'problem' ? 'Problem Suggestions' : 'AI Suggestions'}
                </p>
                {suggestions.map((suggestion, index) => {
                  const Icon = categoryIcons[suggestion.category || 'problem'];
                  const colorClasses = categoryColors[suggestion.category || 'problem'];
                  
                  return (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start gap-2">
                            <div className={cn('w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5', colorClasses)}>
                              <Icon className="w-3 h-3" />
                            </div>
                            <span className="text-sm text-foreground leading-snug">
                              {suggestion.text}
                            </span>
                          </div>
                          {suggestion.explanation && (
                            <p className="text-xs text-muted-foreground ml-7">
                              {suggestion.explanation}
                            </p>
                          )}
                          {suggestion.realWorldFraming && (
                            <p className="text-xs text-muted-foreground/80 ml-7 italic">
                              "{suggestion.realWorldFraming}"
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddSuggestion(suggestion)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-7 px-2"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && suggestions.length === 0 && !industryInsights && (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Select an industry to see AI insights
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  AI will analyze market trends, problems, and opportunities
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
}
