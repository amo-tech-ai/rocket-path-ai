import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDailyInsights, useWeeklySummary, type Insight } from '@/hooks/useInsights';

interface AIStrategicReviewProps {
  startupId?: string;
  onGenerateReport?: () => void;
}

const defaultInsights: Insight[] = [
  {
    category: 'opportunity',
    title: 'Getting Started',
    description: "Click 'Generate Insights' to get AI-powered recommendations based on your startup data.",
    priority: 'medium',
    actionable: true,
  },
];

export function AIStrategicReview({ 
  startupId,
  onGenerateReport 
}: AIStrategicReviewProps) {
  const [insights, setInsights] = useState<Insight[]>(defaultInsights);
  const [summary, setSummary] = useState<string | null>(null);
  
  const dailyInsights = useDailyInsights();
  const weeklySummary = useWeeklySummary();

  const handleGenerateInsights = async () => {
    if (!startupId) return;
    
    const result = await dailyInsights.mutateAsync({ startupId });
    if (result.success && result.insights) {
      setInsights(result.insights);
      setSummary(result.summary || null);
    }
  };

  const handleGenerateWeekly = async () => {
    if (!startupId) return;
    
    const result = await weeklySummary.mutateAsync({ startupId });
    if (result.success) {
      onGenerateReport?.();
    }
  };

  const isLoading = dailyInsights.isPending;
  const isGeneratingWeekly = weeklySummary.isPending;

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'opportunity': return Lightbulb;
      case 'action': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'milestone': return TrendingUp;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (category: string) => {
    switch (category) {
      case 'opportunity': return 'text-primary';
      case 'action': return 'text-sage';
      case 'risk': return 'text-warm-foreground';
      case 'milestone': return 'text-primary';
      default: return 'text-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-5 text-white"
      style={{ background: 'hsl(var(--ai-background))' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold">AI Strategic Review</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleGenerateInsights}
          disabled={isLoading || !startupId}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {summary && (
        <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/80">{summary}</p>
        </div>
      )}

      <div className="space-y-4 mb-5">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.category);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-start gap-2 mb-2">
                <Icon className={`w-4 h-4 ${getInsightColor(insight.category)} flex-shrink-0 mt-0.5`} />
                <span className="text-sm font-medium text-white">{insight.title}</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed pl-6">
                {insight.description}
              </p>
              {insight.suggested_action && (
                <p className="text-xs text-primary mt-2 pl-6">
                  → {insight.suggested_action}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-2">
        <Button 
          variant="outline"
          size="sm"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          onClick={handleGenerateInsights}
          disabled={isLoading || !startupId}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          Generate Insights
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className="w-full text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleGenerateWeekly}
          disabled={isGeneratingWeekly || !startupId}
        >
          {isGeneratingWeekly ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Generate Weekly Report
        </Button>
      </div>
    </motion.div>
  );
}
