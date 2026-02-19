/**
 * Deal Advisor Panel
 * AI-powered next action suggestions for deals
 */

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Lightbulb, 
  RefreshCw, 
  ArrowRight,
  AlertCircle,
  Clock,
  Mail,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DealAdvice {
  nextAction: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  templates: Array<{
    type: string;
    subject: string;
    preview: string;
  }>;
  warnings: string[];
  stageTips: string[];
}

interface DealAdvisorPanelProps {
  deal: {
    id: string;
    name: string;
    stage: string;
    amount?: number;
    expected_close?: string;
    contact?: { name: string; email?: string } | null;
  } | null;
}

export function DealAdvisorPanel({ deal }: DealAdvisorPanelProps) {
  const [advice, setAdvice] = useState<DealAdvice | null>(null);

  const getAdvice = useMutation({
    mutationFn: async () => {
      if (!deal) throw new Error('No deal selected');

      const { data, error } = await supabase.functions.invoke('crm-agent', {
        body: {
          action: 'suggest_action',
          data: { 
            deal_id: deal.id,
            stage: deal.stage,
            contact: deal.contact
          }
        }
      });

      if (error) throw error;
      return data as DealAdvice;
    },
    onSuccess: (data) => {
      setAdvice(data);
    },
    onError: () => {
      // Generate fallback advice based on stage
      const fallbackAdvice = generateFallbackAdvice(deal?.stage || 'intro');
      setAdvice(fallbackAdvice);
    }
  });

  // Auto-fetch advice when deal changes
  useEffect(() => {
    if (deal) {
      getAdvice.mutate();
    } else {
      setAdvice(null);
    }
  }, [deal?.id]);

  const generateFallbackAdvice = (stage: string): DealAdvice => {
    const stageAdvice: Record<string, DealAdvice> = {
      intro: {
        nextAction: 'Send a personalized intro email with a clear ask',
        priority: 'high',
        reasoning: 'First impressions matter. A strong intro email sets the tone for the relationship.',
        templates: [
          {
            type: 'email',
            subject: 'Quick intro - [Your Company] + [Their Focus]',
            preview: 'Hi {name}, I noticed your investment in {portfolio_company}...'
          }
        ],
        warnings: [],
        stageTips: [
          'Keep the email under 150 words',
          'Include a specific ask (meeting, call)',
          'Reference their portfolio or thesis'
        ]
      },
      meeting: {
        nextAction: 'Send follow-up within 24 hours with next steps',
        priority: 'high',
        reasoning: 'Strike while interest is warm. Timely follow-up shows professionalism.',
        templates: [
          {
            type: 'email',
            subject: 'Great meeting - next steps',
            preview: 'Thanks for taking the time to chat today. As discussed...'
          }
        ],
        warnings: ['Meeting was 3+ days ago - follow up urgently'],
        stageTips: [
          'Recap key discussion points',
          'Address any concerns raised',
          'Propose clear next steps with dates'
        ]
      },
      dd: {
        nextAction: 'Prepare data room with key documents',
        priority: 'medium',
        reasoning: 'DD is the most detail-intensive phase. Have materials ready before they ask.',
        templates: [
          {
            type: 'document',
            subject: 'Data Room Checklist',
            preview: 'Financial model, cap table, contracts, metrics dashboard...'
          }
        ],
        warnings: ['Ensure all documents are up to date'],
        stageTips: [
          'Anticipate questions about unit economics',
          'Have customer references ready',
          'Prepare answers for common DD questions'
        ]
      },
      term_sheet: {
        nextAction: 'Review terms with your lawyer',
        priority: 'high',
        reasoning: 'Term sheet negotiation is critical. Get legal advice before responding.',
        templates: [],
        warnings: ['Do not sign without legal review'],
        stageTips: [
          'Focus on key terms: valuation, board seats, liquidation',
          'Understand protective provisions',
          'Negotiate in good faith but protect your interests'
        ]
      },
      closed_won: {
        nextAction: 'Send thank you and schedule kickoff',
        priority: 'medium',
        reasoning: 'Celebrate the win and set up the working relationship.',
        templates: [],
        warnings: [],
        stageTips: [
          'Introduce them to your team',
          'Set up regular update cadence',
          'Leverage their network for intros'
        ]
      },
      closed_lost: {
        nextAction: 'Request feedback and stay in touch',
        priority: 'low',
        reasoning: 'Learn from the pass and maintain the relationship for the future.',
        templates: [],
        warnings: [],
        stageTips: [
          'Ask for specific feedback',
          'Request intros to other investors',
          'Keep them updated on progress'
        ]
      }
    };

    return stageAdvice[stage] || stageAdvice.intro;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-warm/10 text-warm-foreground border-warm/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  if (!deal) {
    return (
      <div className="p-4 text-center py-8">
        <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">
          Select a deal to get AI-powered advice
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Deal Advisor
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => getAdvice.mutate()}
            disabled={getAdvice.isPending}
          >
            {getAdvice.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {deal.name} • {deal.stage.replace('_', ' ')}
        </p>
      </div>

      <ScrollArea className="flex-1">
        {getAdvice.isPending ? (
          <div className="p-4 space-y-3">
            <div className="h-20 bg-muted animate-pulse rounded-lg" />
            <div className="h-16 bg-muted animate-pulse rounded-lg" />
          </div>
        ) : advice ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={deal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4"
            >
              {/* Next Action */}
              <div className={cn(
                "p-4 rounded-lg border",
                getPriorityColor(advice.priority)
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Next Action</span>
                </div>
                <p className="text-sm font-medium">{advice.nextAction}</p>
                <p className="text-xs mt-2 opacity-80">{advice.reasoning}</p>
              </div>

              {/* Warnings */}
              {advice.warnings.length > 0 && (
                <div className="space-y-2">
                  {advice.warnings.map((warning, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 p-2 rounded"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Templates */}
              {advice.templates.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    SUGGESTED TEMPLATES
                  </h4>
                  <div className="space-y-2">
                    {advice.templates.map((template, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getActionIcon(template.type)}
                          <span className="text-sm font-medium">{template.subject}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{template.preview}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stage Tips */}
              {advice.stageTips.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    STAGE TIPS
                  </h4>
                  <ul className="space-y-2">
                    {advice.stageTips.map((tip, idx) => (
                      <li 
                        key={idx}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="w-3 h-3 text-sage flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </ScrollArea>
    </div>
  );
}
