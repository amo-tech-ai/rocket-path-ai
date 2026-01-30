/**
 * AI Drawer Component
 * 
 * Desktop slide-in panel for the AI assistant.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Loader2,
  MessageSquare,
  User,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGlobalAIAssistant } from '@/hooks/useGlobalAIAssistant';
import { AIMessageBubble } from './AIMessageBubble';
import { AIQuickActions } from './AIQuickActions';

interface AIDrawerProps {
  onClose: () => void;
}

export function AIDrawer({ onClose }: AIDrawerProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isExpanded,
    isLoading,
    isAuthenticated,
    messages,
    modeLabel,
    contextLabel,
    quickActions,
    toggleExpanded,
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

  // Focus input when drawer opens
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

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
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        "fixed flex flex-col z-[9999]",
        "bg-background border rounded-2xl shadow-2xl overflow-hidden",
        "bottom-6 right-6",
        isExpanded 
          ? "w-[480px] h-[640px]" 
          : "w-[380px] h-[520px]"
      )}
      role="dialog"
      aria-label="AI Assistant"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center",
            isAuthenticated ? "bg-primary/10" : "bg-sage/10"
          )}>
            <Brain className={cn(
              "w-4.5 h-4.5",
              isAuthenticated ? "text-primary" : "text-sage"
            )} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm">Atlas</h2>
              <Badge 
                variant={isAuthenticated ? "default" : "secondary"} 
                className="text-[10px] h-5 px-1.5"
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
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="h-8 w-8"
            aria-label={isExpanded ? "Minimize panel" : "Expand panel"}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
              isAuthenticated ? "bg-primary/10" : "bg-sage/10"
            )}>
              <MessageSquare className={cn(
                "w-7 h-7",
                isAuthenticated ? "text-primary" : "text-sage"
              )} />
            </div>
            <h3 className="font-semibold text-sm mb-1">
              {isAuthenticated ? 'How can I help you today?' : 'Hi! I\'m Atlas'}
            </h3>
            <p className="text-xs text-muted-foreground mb-6 max-w-[280px]">
              {isAuthenticated 
                ? 'Ask about your startup, get recommendations, or explore insights.'
                : 'I can answer questions about StartupAI. Sign in to unlock personalized guidance!'}
            </p>
            
            {/* Quick Actions */}
            <AIQuickActions 
              actions={quickActions}
              onAction={executeQuickAction}
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
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  isAuthenticated ? "bg-primary/10" : "bg-sage/10"
                )}>
                  <Loader2 className={cn(
                    "w-4 h-4 animate-spin",
                    isAuthenticated ? "text-primary" : "text-sage"
                  )} />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAuthenticated ? "Ask anything about your startup..." : "Ask about StartupAI..."}
            disabled={isLoading}
            className="flex-1 h-11 text-sm"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-11 w-11"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default AIDrawer;
