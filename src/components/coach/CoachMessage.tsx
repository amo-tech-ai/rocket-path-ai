/**
 * Coach Message
 * Styled message bubble for coach chat
 */

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface CoachMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function CoachMessage({ role, content, timestamp }: CoachMessageProps) {
  const isCoach = role === 'assistant';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        !isCoach && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div 
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isCoach ? "bg-primary/10" : "bg-secondary"
        )}
      >
        {isCoach ? (
          <Bot className="w-4 h-4 text-primary" />
        ) : (
          <User className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      
      {/* Message */}
      <div 
        className={cn(
          "flex-1 max-w-[85%]",
          !isCoach && "flex flex-col items-end"
        )}
      >
        <div 
          className={cn(
            "rounded-2xl px-4 py-3",
            isCoach 
              ? "bg-primary/5 rounded-tl-sm" 
              : "bg-secondary rounded-tr-sm"
          )}
        >
          {isCoach ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  code: ({ children }) => <code className="px-1 py-0.5 rounded bg-muted text-xs">{children}</code>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-foreground">{content}</p>
          )}
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <span className="text-[10px] text-muted-foreground mt-1 px-1">
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}
