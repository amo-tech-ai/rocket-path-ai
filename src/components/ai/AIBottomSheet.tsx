/**
 * AI Bottom Sheet Component
 * 
 * Mobile slide-up panel for the AI assistant.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  X, 
  Send, 
  Loader2,
  MessageSquare,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGlobalAIAssistant } from '@/hooks/useGlobalAIAssistant';
import { AIMessageBubble } from './AIMessageBubble';
import { AIQuickActions } from './AIQuickActions';

interface AIBottomSheetProps {
  onClose: () => void;
}

export function AIBottomSheet({ onClose }: AIBottomSheetProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    isAuthenticated,
    messages,
    modeLabel,
    contextLabel,
    quickActions,
    sendMessage,
    clearMessages,
    executeQuickAction,
    handleSuggestedAction,
  } = useGlobalAIAssistant();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[9998]"
      />
      
      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[9999]",
          "bg-background rounded-t-3xl shadow-2xl",
          "h-[85vh] flex flex-col"
        )}
        role="dialog"
        aria-label="AI Assistant"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isAuthenticated ? "bg-primary/10" : "bg-sage/10"
            )}>
              <Brain className={cn(
                "w-5 h-5",
                isAuthenticated ? "text-primary" : "text-sage"
              )} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Atlas</h2>
                <Badge 
                  variant={isAuthenticated ? "default" : "secondary"} 
                  className="text-xs"
                >
                  {modeLabel}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{contextLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearMessages}
                className="h-10 w-10 text-muted-foreground"
                aria-label="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10"
              aria-label="Close"
            >
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 pt-8">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                isAuthenticated ? "bg-primary/10" : "bg-sage/10"
              )}>
                <MessageSquare className={cn(
                  "w-8 h-8",
                  isAuthenticated ? "text-primary" : "text-sage"
                )} />
              </div>
              <h3 className="font-semibold mb-2">
                {isAuthenticated ? 'How can I help you today?' : 'Hi! I\'m Atlas'}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[300px]">
                {isAuthenticated 
                  ? 'Ask about your startup, get recommendations, or explore insights.'
                  : 'I can answer questions about StartupAI. Sign in to unlock personalized guidance!'}
              </p>
              
              {/* Quick Actions */}
              <AIQuickActions 
                actions={quickActions}
                onAction={executeQuickAction}
                variant="mobile"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <AIMessageBubble 
                  key={message.id} 
                  message={message}
                  onSuggestedAction={handleSuggestedAction}
                  isAuthenticated={isAuthenticated}
                />
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                    isAuthenticated ? "bg-primary/10" : "bg-sage/10"
                  )}>
                    <Loader2 className={cn(
                      "w-4.5 h-4.5 animate-spin",
                      isAuthenticated ? "text-primary" : "text-sage"
                    )} />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <p className="text-sm text-muted-foreground">Thinking...</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-background pb-safe">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAuthenticated ? "Ask anything..." : "Ask about StartupAI..."}
              disabled={isLoading}
              className="flex-1 h-12 text-base"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-12 w-12"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default AIBottomSheet;
