import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lightbulb, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileAIPanelProps {
  type: 'user' | 'company';
  completionPercentage: number;
  onImprove?: () => void;
  isImproving?: boolean;
}

export function ProfileAIPanel({ 
  type, 
  completionPercentage, 
  onImprove,
  isImproving = false 
}: ProfileAIPanelProps) {
  const suggestions = type === 'user' ? [
    { text: 'Add a professional bio to improve AI recommendations', priority: 'high' },
    { text: 'Connect LinkedIn for automatic profile enrichment', priority: 'medium' },
    { text: 'Set your timezone for accurate scheduling', priority: 'low' },
  ] : [
    { text: 'Add company tagline for better positioning', priority: 'high' },
    { text: 'Link LinkedIn company page for credibility', priority: 'high' },
    { text: 'Complete traction metrics for investor matching', priority: 'medium' },
    { text: 'Add key features to improve AI suggestions', priority: 'low' },
  ];

  const insights = type === 'user' ? [
    'You typically work on Tuesdays and Thursdays',
    'Your most-used features: Tasks, Projects, CRM',
    'Profile last updated 7 days ago',
  ] : [
    'Tagline could be more compelling',
    'Industry categorization is accurate',
    'Differentiator needs more specificity',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Intelligence
        </span>
      </div>

      {/* AI Coach Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">
              {type === 'user' ? 'Profile Coach' : 'AI Profile Coach'}
            </p>
            <p className="text-xs text-muted-foreground">Data Quality Audit</p>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-4">
          <p className="text-xs font-medium text-green-600 mb-2">Strengths</p>
          <div className="space-y-1.5">
            {completionPercentage >= 50 && (
              <p className="text-xs text-muted-foreground">• Basic information is complete</p>
            )}
            {completionPercentage >= 75 && (
              <p className="text-xs text-muted-foreground">• Profile is well-structured</p>
            )}
            {completionPercentage >= 90 && (
              <p className="text-xs text-muted-foreground">• Ready for AI optimization</p>
            )}
          </div>
        </div>

        {/* Gaps */}
        {completionPercentage < 100 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-amber-600 mb-2">Risks / Gaps</p>
            <div className="space-y-1.5">
              {insights.slice(0, 2).map((insight, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {insight}</p>
              ))}
            </div>
          </div>
        )}

        {/* Auto-Improve Button */}
        <Button 
          className="w-full" 
          size="sm"
          onClick={onImprove}
          disabled={isImproving}
        >
          {isImproving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Auto-Improve Profile
        </Button>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          Enhances copy, clarity, and positioning
        </p>
      </motion.div>

      {/* Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-medium">Suggestions</span>
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 rounded-lg border bg-card text-xs"
            >
              <div className="flex items-start gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-[10px] ${
                    suggestion.priority === 'high' ? 'border-red-300 text-red-600' :
                    suggestion.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                    'border-green-300 text-green-600'
                  }`}
                >
                  {suggestion.priority}
                </Badge>
                <p className="text-muted-foreground leading-relaxed">
                  {suggestion.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity Insights */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium">Insights</span>
        </div>
        <div className="space-y-2">
          {insights.map((insight, i) => (
            <p key={i} className="text-xs text-muted-foreground pl-6">
              • {insight}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
