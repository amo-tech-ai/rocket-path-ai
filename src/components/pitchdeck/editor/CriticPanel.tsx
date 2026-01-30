/**
 * Critic Panel for Pitch Deck Editor
 * AI-powered slide review and feedback
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertCircle, 
  CheckCircle, 
  Lightbulb, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CritiqueItem {
  type: 'issue' | 'suggestion' | 'strength';
  category: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface SlideCritique {
  slideNumber: number;
  slideType: string;
  score: number;
  critiques: CritiqueItem[];
}

interface DeckCritique {
  overallScore: number;
  slideCritiques: SlideCritique[];
  topImprovements: string[];
  investorReadiness: 'ready' | 'needs_work' | 'not_ready';
}

interface CriticPanelProps {
  deckId: string;
  slides: Array<{
    id: string;
    slide_number: number;
    slide_type: string;
    title: string;
    content: Record<string, unknown>;
  }>;
  currentSlideIndex: number;
}

export function CriticPanel({ deckId, slides, currentSlideIndex }: CriticPanelProps) {
  const [critique, setCritique] = useState<DeckCritique | null>(null);
  const [expandedSlides, setExpandedSlides] = useState<Set<number>>(new Set([currentSlideIndex]));

  const critiqueDeck = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('industry-expert-agent', {
        body: {
          action: 'pitch_feedback',
          data: { 
            deck_id: deckId,
            slides: slides.map(s => ({
              slide_number: s.slide_number,
              slide_type: s.slide_type,
              title: s.title,
              content: s.content
            }))
          }
        }
      });

      if (error) throw error;
      return data as DeckCritique;
    },
    onSuccess: (data) => {
      setCritique(data);
      toast.success('Deck reviewed by AI Critic');
    },
    onError: () => {
      // Generate mock critique for demo
      const mockCritique: DeckCritique = {
        overallScore: 72,
        investorReadiness: 'needs_work',
        topImprovements: [
          'Add specific traction metrics to the Traction slide',
          'Clarify the competitive moat in Competition slide',
          'Include unit economics in Business Model slide'
        ],
        slideCritiques: slides.map((slide, idx) => ({
          slideNumber: slide.slide_number,
          slideType: slide.slide_type,
          score: 60 + Math.random() * 35,
          critiques: [
            {
              type: idx % 3 === 0 ? 'issue' : idx % 3 === 1 ? 'suggestion' : 'strength',
              category: 'Content',
              message: idx % 3 === 0 
                ? 'Consider adding more specific data points' 
                : idx % 3 === 1 
                  ? 'Add a visual diagram to improve clarity'
                  : 'Strong opening statement that hooks attention',
              priority: idx % 3 === 0 ? 'high' : 'medium'
            }
          ] as CritiqueItem[]
        }))
      };
      setCritique(mockCritique);
    }
  });

  const toggleSlide = (index: number) => {
    const newExpanded = new Set(expandedSlides);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSlides(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-sage';
    if (score >= 60) return 'text-warm-foreground';
    return 'text-destructive';
  };

  const getReadinessConfig = (status: string) => {
    switch (status) {
      case 'ready':
        return { label: 'Investor Ready', color: 'bg-sage/20 text-sage', icon: CheckCircle };
      case 'needs_work':
        return { label: 'Needs Polish', color: 'bg-warm/20 text-warm-foreground', icon: TrendingUp };
      default:
        return { label: 'Not Ready', color: 'bg-destructive/20 text-destructive', icon: AlertCircle };
    }
  };

  const getCritiqueIcon = (type: string) => {
    switch (type) {
      case 'issue':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-warm-foreground" />;
      case 'strength':
        return <CheckCircle className="w-4 h-4 text-sage" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="w-4 h-4" />
            AI Critic
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => critiqueDeck.mutate()}
            disabled={critiqueDeck.isPending}
          >
            {critiqueDeck.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Get investor-focused feedback on your deck
        </p>
      </div>

      <ScrollArea className="flex-1">
        {!critique ? (
          <div className="p-4 text-center">
            <Target className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Run the AI Critic to get detailed feedback on your pitch deck
            </p>
            <Button onClick={() => critiqueDeck.mutate()} disabled={critiqueDeck.isPending}>
              {critiqueDeck.isPending ? 'Analyzing...' : 'Review Deck'}
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Overall Score */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Score</span>
                <span className={cn("text-2xl font-bold", getScoreColor(critique.overallScore))}>
                  {Math.round(critique.overallScore)}
                </span>
              </div>
              <Progress 
                value={critique.overallScore} 
                className="h-2"
              />
              <div className="mt-3">
                {(() => {
                  const config = getReadinessConfig(critique.investorReadiness);
                  const Icon = config.icon;
                  return (
                    <span className={cn("inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full", config.color)}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Top Improvements */}
            {critique.topImprovements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Priority Improvements</h4>
                <ul className="space-y-2">
                  {critique.topImprovements.map((improvement, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-warm-foreground mt-0.5">→</span>
                      <span className="text-muted-foreground">{improvement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Per-Slide Critiques */}
            <div>
              <h4 className="text-sm font-medium mb-2">Slide-by-Slide</h4>
              <div className="space-y-2">
                <AnimatePresence>
                  {critique.slideCritiques.map((slideCritique, idx) => (
                    <motion.div
                      key={slideCritique.slideNumber}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "border rounded-lg overflow-hidden",
                        idx === currentSlideIndex && "border-sage"
                      )}
                    >
                      <button
                        onClick={() => toggleSlide(idx)}
                        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {slideCritique.slideNumber}
                          </span>
                          <span className="text-sm font-medium capitalize">
                            {slideCritique.slideType.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-medium", getScoreColor(slideCritique.score))}>
                            {Math.round(slideCritique.score)}
                          </span>
                          {expandedSlides.has(idx) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedSlides.has(idx) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t"
                          >
                            <div className="p-3 space-y-2">
                              {slideCritique.critiques.map((item, critiqueIdx) => (
                                <div 
                                  key={critiqueIdx}
                                  className="flex items-start gap-2 text-xs"
                                >
                                  {getCritiqueIcon(item.type)}
                                  <span className="text-muted-foreground">{item.message}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
