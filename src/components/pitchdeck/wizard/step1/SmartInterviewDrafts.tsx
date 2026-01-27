/**
 * Smart Interview Drafts Component
 * Shows AI-generated draft answers based on company context
 */

import { motion } from 'framer-motion';
import { MessageSquare, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DraftAnswer {
  id: string;
  question: string;
  draftAnswer: string;
  category: string;
  confidence: number;
}

interface SmartInterviewDraftsProps {
  drafts: DraftAnswer[];
  onAddDraft: (draft: DraftAnswer) => void;
  isLoading?: boolean;
  targetFieldId?: string;
}

export function SmartInterviewDrafts({
  drafts,
  onAddDraft,
  isLoading = false,
  targetFieldId,
}: SmartInterviewDraftsProps) {
  if (isLoading) {
    return (
      <div className="p-4 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-sage" />
          <span className="text-sm font-medium">Smart Interview</span>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground ml-2">Generating drafts...</span>
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return null;
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-sage" />
        <span className="text-sm font-medium">Smart Interview Drafts</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Based on your description and industry, here are draft answers to key questions:
      </p>
      
      <div className="space-y-3">
        {drafts.map((draft, index) => (
          <motion.div
            key={draft.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-xs font-medium text-foreground">
                {draft.question}
              </p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                {draft.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {draft.draftAnswer}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddDraft(draft)}
              className="h-7 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-3 h-3" />
              Add to my answer
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
