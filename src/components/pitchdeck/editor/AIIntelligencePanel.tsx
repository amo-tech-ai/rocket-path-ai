/**
 * AI Intelligence Panel
 * Right sidebar for AI analysis and suggestions
 */

import { 
  Sparkles,
  Lightbulb,
  Plus,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AISuggestion, SlideAnalysis } from '@/hooks/usePitchDeckEditor';

interface AIIntelligencePanelProps {
  slideAnalysis: SlideAnalysis | null;
  aiSuggestions: AISuggestion[];
  isLoadingSuggestions: boolean;
  onFetchSuggestions: () => void;
  onApplySuggestion: (id: string) => void;
  onDismissSuggestion: (id: string) => void;
}

export function AIIntelligencePanel({
  slideAnalysis,
  aiSuggestions,
  isLoadingSuggestions,
  onFetchSuggestions,
  onApplySuggestion,
  onDismissSuggestion,
}: AIIntelligencePanelProps) {
  return (
    <aside className="w-80 border-l border-border bg-muted/30 overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Intelligence
        </h3>
      </div>

      {/* Slide Analysis */}
      {slideAnalysis ? (
        <SlideAnalysisSection analysis={slideAnalysis} />
      ) : isLoadingSuggestions ? (
        <div className="p-4 border-b border-border">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : null}

      {/* AI Suggestions */}
      <SuggestionsSection 
        suggestions={aiSuggestions}
        isLoading={isLoadingSuggestions}
        onApply={onApplySuggestion}
        onDismiss={onDismissSuggestion}
      />

      {/* Quick Actions */}
      <QuickActionsSection onImproveSlide={onFetchSuggestions} />
    </aside>
  );
}

function SlideAnalysisSection({ analysis }: { analysis: SlideAnalysis }) {
  return (
    <div className="p-4 border-b border-border">
      <h4 className="text-sm font-medium mb-3">Slide Analysis</h4>
      <div className="space-y-3">
        <AnalysisBar label="Clarity" value={analysis.clarity} />
        <AnalysisBar label="Impact" value={analysis.impact} />
        <AnalysisBar label="Tone" value={analysis.tone} />
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Overall</span>
            <span className={cn(
              "font-semibold",
              analysis.overall >= 7 ? "text-green-600" :
              analysis.overall >= 5 ? "text-yellow-600" : "text-red-600"
            )}>
              {analysis.overall}/10
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{analysis.feedback}</p>
        </div>
      </div>
    </div>
  );
}

function AnalysisBar({ label, value }: { label: string; value: number }) {
  const percentage = value * 10;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className={cn(
          value >= 7 ? "text-green-600" :
          value >= 5 ? "text-yellow-600" : "text-red-600"
        )}>
          {value}/10
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          value >= 7 ? "[&>div]:bg-green-500" :
          value >= 5 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
        )}
      />
    </div>
  );
}

interface SuggestionsSectionProps {
  suggestions: AISuggestion[];
  isLoading: boolean;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}

function SuggestionsSection({ suggestions, isLoading, onApply, onDismiss }: SuggestionsSectionProps) {
  return (
    <div className="p-4">
      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
        <Lightbulb className="w-4 h-4" />
        Suggestions
      </h4>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-3">
          {suggestions.filter(s => !s.applied).map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onApply={() => onApply(suggestion.id)}
              onDismiss={() => onDismiss(suggestion.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No suggestions for this slide.
        </p>
      )}
    </div>
  );
}

function SuggestionCard({ 
  suggestion, 
  onApply, 
  onDismiss 
}: { 
  suggestion: AISuggestion; 
  onApply: () => void; 
  onDismiss: () => void;
}) {
  const typeColors: Record<string, string> = {
    clarity: 'bg-blue-100 text-blue-700',
    impact: 'bg-purple-100 text-purple-700',
    metric: 'bg-green-100 text-green-700',
    problem: 'bg-orange-100 text-orange-700',
    industry: 'bg-cyan-100 text-cyan-700',
    tone: 'bg-pink-100 text-pink-700',
  };

  return (
    <Card className="bg-background">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={cn("text-xs capitalize", typeColors[suggestion.type])}>
            {suggestion.type}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={onDismiss}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-sm mb-2">{suggestion.suggestion}</p>
        <p className="text-xs text-muted-foreground mb-3">{suggestion.reasoning}</p>
        <Button size="sm" className="w-full" onClick={onApply}>
          Apply
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickActionsSection({ onImproveSlide }: { onImproveSlide: () => void }) {
  return (
    <div className="p-4 border-t border-border">
      <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
      <div className="space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={onImproveSlide}>
          <Sparkles className="w-4 h-4 mr-2" />
          Improve This Slide
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Add a Metric
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <ImageIcon className="w-4 h-4 mr-2" />
          Generate Image
        </Button>
      </div>
    </div>
  );
}
