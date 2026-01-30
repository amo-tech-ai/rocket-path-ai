/**
 * AI Message Bubble Component
 * 
 * Renders a single chat message with markdown support.
 */

import { motion } from 'framer-motion';
import { Brain, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import type { AIMessage } from '@/providers/AIAssistantProvider';

interface AIMessageBubbleProps {
  message: AIMessage;
  onSuggestedAction?: (action: { type: string; label: string; payload?: Record<string, unknown> }) => void;
  isAuthenticated?: boolean;
}

export function AIMessageBubble({ message, onSuggestedAction, isAuthenticated }: AIMessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isAuthenticated ? "bg-primary/10" : "bg-sage/10"
        )}>
          <Brain className={cn(
            "w-4 h-4",
            isAuthenticated ? "text-primary" : "text-sage"
          )} />
        </div>
      )}
      
      <div className="flex flex-col gap-2 max-w-[85%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm",
            isUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ol]:mb-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Suggested Actions */}
        {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.suggestedActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestedAction?.(action)}
                className="text-xs h-7"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
      )}
    </motion.div>
  );
}

export default AIMessageBubble;
