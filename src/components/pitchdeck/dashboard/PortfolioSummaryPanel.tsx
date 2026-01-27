/**
 * Portfolio Summary Panel
 * AI-driven insights and recommendations
 */

import { Link } from 'react-router-dom';
import { 
  Sparkles,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PortfolioStats, PitchDeckSummary } from '@/hooks/usePitchDecks';

interface PortfolioSummaryPanelProps {
  portfolioStats: PortfolioStats;
  allDecks: PitchDeckSummary[];
  onResumeInProgress: () => void;
  onFilterReview: () => void;
  onCreateNew: () => void;
}

export function PortfolioSummaryPanel({
  portfolioStats,
  allDecks,
  onResumeInProgress,
  onFilterReview,
  onCreateNew,
}: PortfolioSummaryPanelProps) {
  const inProgressCount = allDecks.filter(d => d.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Decks</span>
            <span className="font-semibold">{portfolioStats.total_decks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Signal</span>
            <span className={cn(
              "font-semibold",
              portfolioStats.average_signal >= 70 ? "text-green-600" :
              portfolioStats.average_signal >= 50 ? "text-yellow-600" : "text-red-600"
            )}>
              {portfolioStats.average_signal}%
            </span>
          </div>
          
          {portfolioStats.strongest_deck && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">Strongest:</span>
              </div>
              <Link 
                to={`/app/pitch-deck/${portfolioStats.strongest_deck.id}/edit`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {portfolioStats.strongest_deck.title} ({portfolioStats.strongest_deck.signal}%)
              </Link>
            </div>
          )}
          
          {portfolioStats.weakest_deck && portfolioStats.decks_needing_attention > 0 && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-muted-foreground">Needs Work:</span>
              </div>
              <Link 
                to={`/app/pitch-deck/${portfolioStats.weakest_deck.id}/edit`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {portfolioStats.weakest_deck.title} ({portfolioStats.weakest_deck.signal}%)
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {inProgressCount > 0 && (
            <RecommendationItem
              title="Complete Your Draft"
              description={`You have ${inProgressCount} deck(s) in progress`}
              action="Resume"
              onClick={onResumeInProgress}
            />
          )}
          
          {portfolioStats.decks_needing_attention > 0 && (
            <RecommendationItem
              title="Improve Signal"
              description={`${portfolioStats.decks_needing_attention} deck(s) below 50% signal strength`}
              action="Review"
              onClick={onFilterReview}
            />
          )}

          {allDecks.length === 0 && (
            <RecommendationItem
              title="Create Your First Deck"
              description="Start with our AI-powered wizard"
              action="Create"
              onClick={onCreateNew}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface RecommendationItemProps {
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}

function RecommendationItem({ 
  title, 
  description, 
  action, 
  onClick 
}: RecommendationItemProps) {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50">
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button size="sm" variant="outline" onClick={onClick}>
        {action}
      </Button>
    </div>
  );
}
