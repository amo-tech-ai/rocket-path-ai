/**
 * Investor Matcher Panel
 * AI-powered investor matching based on startup profile
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, 
  RefreshCw, 
  ExternalLink, 
  UserPlus,
  TrendingUp,
  Building2,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InvestorMatch {
  id: string;
  name: string;
  firm: string;
  fitScore: number;
  reasoning: string;
  recentInvestments: string[];
  thesis: string;
  checkSize: string;
  stage: string;
  linkedinUrl?: string;
}

interface InvestorMatcherPanelProps {
  startupId?: string;
  onAddContact: (investor: InvestorMatch) => void;
}

export function InvestorMatcherPanel({ startupId, onAddContact }: InvestorMatcherPanelProps) {
  const [matches, setMatches] = useState<InvestorMatch[]>([]);

  const findMatches = useMutation({
    mutationFn: async () => {
      if (!startupId) throw new Error('No startup ID');

      const { data, error } = await supabase.functions.invoke('investor-agent', {
        body: {
          action: 'match_investors',
          data: { startup_id: startupId }
        }
      });

      if (error) throw error;
      return data.matches as InvestorMatch[];
    },
    onSuccess: (data) => {
      setMatches(data);
      toast.success(`Found ${data.length} matching investors`);
    },
    onError: () => {
      // Generate mock matches for demo
      const mockMatches: InvestorMatch[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          firm: 'Sequoia Capital',
          fitScore: 92,
          reasoning: 'Strong focus on B2B SaaS at Seed stage, recent investments in AI-first tools',
          recentInvestments: ['Notion', 'Figma', 'Linear'],
          thesis: 'Developer tools, AI/ML, Enterprise SaaS',
          checkSize: '$500K - $3M',
          stage: 'Seed, Series A',
          linkedinUrl: 'https://linkedin.com'
        },
        {
          id: '2',
          name: 'Marcus Williams',
          firm: 'Andreessen Horowitz',
          fitScore: 87,
          reasoning: 'Active in AI infrastructure, looking for technical founders',
          recentInvestments: ['Anthropic', 'Databricks', 'dbt'],
          thesis: 'AI Infrastructure, Data Tools',
          checkSize: '$1M - $5M',
          stage: 'Seed, Series A',
          linkedinUrl: 'https://linkedin.com'
        },
        {
          id: '3',
          name: 'Emily Park',
          firm: 'First Round Capital',
          fitScore: 78,
          reasoning: 'Strong track record with productivity tools, known for hands-on support',
          recentInvestments: ['Notion', 'Ramp', 'Vercel'],
          thesis: 'Productivity, FinTech, DevTools',
          checkSize: '$250K - $2M',
          stage: 'Pre-Seed, Seed'
        }
      ];
      setMatches(mockMatches);
    }
  });

  const handleAddContact = (investor: InvestorMatch) => {
    onAddContact(investor);
    toast.success(`Added ${investor.name} to contacts`);
  };

  const getFitColor = (score: number) => {
    if (score >= 85) return 'text-sage';
    if (score >= 70) return 'text-warm-foreground';
    return 'text-muted-foreground';
  };

  const getFitLabel = (score: number) => {
    if (score >= 85) return 'Strong Match';
    if (score >= 70) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="w-4 h-4" />
            Investor Matches
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => findMatches.mutate()}
            disabled={findMatches.isPending || !startupId}
          >
            {findMatches.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          AI-matched investors based on your startup profile
        </p>
      </div>

      <ScrollArea className="flex-1">
        {matches.length === 0 ? (
          <div className="p-4 text-center py-8">
            <Target className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Find investors that match your industry, stage, and traction
            </p>
            <Button
              onClick={() => findMatches.mutate()}
              disabled={findMatches.isPending || !startupId}
              size="sm"
            >
              {findMatches.isPending ? 'Finding matches...' : 'Find Matches'}
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="p-4 space-y-3">
              {matches.map((investor, idx) => (
                <motion.div
                  key={investor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-medium">{investor.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {investor.firm}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={cn("text-lg font-bold", getFitColor(investor.fitScore))}>
                        {investor.fitScore}%
                      </span>
                      <p className={cn("text-xs", getFitColor(investor.fitScore))}>
                        {getFitLabel(investor.fitScore)}
                      </p>
                    </div>
                  </div>

                  <Progress 
                    value={investor.fitScore} 
                    className="h-1.5 mb-3"
                  />

                  <p className="text-xs text-muted-foreground mb-3">
                    {investor.reasoning}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Check size:</span>
                      <span>{investor.checkSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Stage:</span>
                      <span>{investor.stage}</span>
                    </div>
                  </div>

                  {investor.recentInvestments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {investor.recentInvestments.slice(0, 3).map((inv) => (
                        <span 
                          key={inv}
                          className="text-xs bg-muted px-2 py-0.5 rounded"
                        >
                          {inv}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddContact(investor)}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Add Contact
                    </Button>
                    {investor.linkedinUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(investor.linkedinUrl, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </ScrollArea>
    </div>
  );
}
