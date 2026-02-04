/**
 * Validator Chat Message
 * Message bubble component for chat interface
 */

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ValidatorChatMessageProps {
  message: ChatMessage;
  isTyping?: boolean;
}

export default function ValidatorChatMessage({
  message,
  isTyping,
}: ValidatorChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        !isAssistant && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isAssistant
            ? "bg-primary/10 text-primary"
            : "bg-sage text-sage-foreground"
        )}
      >
        {isAssistant ? (
          <Bot className="w-4 h-4" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex-1 max-w-[85%]",
          !isAssistant && "text-right"
        )}
      >
        <div
          className={cn(
            "inline-block px-4 py-3 rounded-2xl",
            isAssistant
              ? "bg-card border border-border rounded-tl-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm"
          )}
        >
          {isTyping ? (
            <div className="flex items-center gap-1">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-current"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-current"
              />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-current"
              />
            </div>
          ) : (
            <div className={cn(
              "text-sm prose prose-sm max-w-none",
              isAssistant ? "prose-gray" : "prose-invert"
            )}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <p className={cn(
          "text-xs text-muted-foreground mt-1",
          !isAssistant && "text-right"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </motion.div>
  );
}
