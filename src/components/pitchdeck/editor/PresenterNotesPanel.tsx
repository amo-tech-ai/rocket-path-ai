/**
 * Presenter Notes Panel
 * AI-generated talking points for each slide
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Mic, RefreshCw, Copy, Check, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PresenterNotesPanelProps {
  slideId: string;
  slideType: string;
  slideContent: Record<string, unknown>;
  existingNotes?: string;
  onNotesUpdate: (notes: string) => void;
}

export function PresenterNotesPanel({
  slideId,
  slideType,
  slideContent,
  existingNotes = '',
  onNotesUpdate
}: PresenterNotesPanelProps) {
  const [notes, setNotes] = useState(existingNotes);
  const [copied, setCopied] = useState(false);

  const generateNotes = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('pitch-deck-agent', {
        body: {
          action: 'generate_presenter_notes',
          data: {
            slide_id: slideId,
            slide_type: slideType,
            content: slideContent
          }
        }
      });

      if (error) throw error;
      return data.notes as string;
    },
    onSuccess: (generatedNotes) => {
      setNotes(generatedNotes);
      onNotesUpdate(generatedNotes);
      toast.success('Presenter notes generated');
    },
    onError: () => {
      // Generate fallback notes
      const fallbackNotes = generateFallbackNotes(slideType);
      setNotes(fallbackNotes);
      onNotesUpdate(fallbackNotes);
    }
  });

  const generateFallbackNotes = (type: string): string => {
    const notesMap: Record<string, string> = {
      cover: `• Open with energy and confidence
• State your one-liner clearly
• Make eye contact with key investors
• Estimated time: 30 seconds`,
      problem: `• Start with a story or statistic
• Make the pain tangible and relatable
• Quantify the cost of the problem
• Pause for impact after key points
• Estimated time: 1-2 minutes`,
      solution: `• Transition smoothly from problem
• Focus on outcomes, not features
• Use simple, clear language
• Show don't tell when possible
• Estimated time: 1-2 minutes`,
      traction: `• Lead with your strongest metric
• Show momentum and growth rate
• Mention notable customers/users
• Be prepared for follow-up questions
• Estimated time: 1-2 minutes`,
      market: `• Present TAM/SAM/SOM clearly
• Cite credible sources
• Explain why now is the right time
• Show your positioning
• Estimated time: 1 minute`,
      team: `• Highlight relevant experience
• Show domain expertise
• Mention key advisors if notable
• Convey passion and commitment
• Estimated time: 1 minute`,
      ask: `• Be specific about amount
• Explain use of funds clearly
• Share expected milestones
• End with confidence
• Estimated time: 1 minute`
    };

    return notesMap[type] || `• Speak clearly and with confidence
• Maintain eye contact with audience
• Pause after key points
• Be prepared for questions
• Estimated time: 1-2 minutes`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Notes copied to clipboard');
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    onNotesUpdate(value);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Presenter Notes
          </h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!notes}
            >
              {copied ? (
                <Check className="w-4 h-4 text-sage" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => generateNotes.mutate()}
              disabled={generateNotes.isPending}
            >
              {generateNotes.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Talking points for presenting this slide
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {!notes && !generateNotes.isPending ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Generate AI-powered talking points for this slide
              </p>
              <Button
                onClick={() => generateNotes.mutate()}
                disabled={generateNotes.isPending}
                size="sm"
              >
                Generate Notes
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <Textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Enter your presenter notes..."
                className="min-h-[200px] text-sm resize-none"
              />

              {notes && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    Est. speaking time: {Math.ceil(notes.split(' ').length / 150)} min
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
