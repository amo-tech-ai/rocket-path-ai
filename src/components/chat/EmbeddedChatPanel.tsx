/**
 * Embedded Chat Panel Component
 * Reusable AI chat component that can be embedded in any dashboard page
 */

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Send, 
  Sparkles, 
  MessageSquare,
  Loader2,
  Minimize2,
  Maximize2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIChat, AIMessage } from "@/hooks/useAIChat";
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface EmbeddedChatPanelProps {
  context: string;
  startupId?: string;
  contextData?: Record<string, unknown>;
  suggestions?: Array<{ label: string; action: string }>;
  title?: string;
  placeholder?: string;
  className?: string;
  minimizable?: boolean;
}

// Compact message component
function ChatBubble({ message }: { message: AIMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Brain className="w-3 h-3 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 text-xs",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-xs dark:prose-invert max-w-none [&>p]:mb-1 [&>p]:mt-0 [&>ul]:my-1 [&>ol]:my-1">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function EmbeddedChatPanel({ 
  context, 
  startupId, 
  contextData,
  suggestions = [],
  title = "AI Assistant",
  placeholder = "Ask a question...",
  className,
  minimizable = true
}: EmbeddedChatPanelProps) {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    
    // Always use 'chat' action, but include context for routing
    await sendMessage(message, 'chat', {
      screen: context,
      startup_id: startupId,
      data: contextData,
    });
  };

  const handleSuggestion = (action: string) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn("", className)}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMinimized(false)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            {title}
          </span>
          <Maximize2 className="w-3 h-3" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("", className)}
    >
      <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Brain className="w-4 h-4 text-primary" />
            {title}
          </CardTitle>
          <div className="flex gap-1">
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={clearMessages}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            {minimizable && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Messages Area */}
          {messages.length > 0 ? (
            <ScrollArea ref={scrollRef} className="h-48 pr-2">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <ChatBubble key={index} message={message} />
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="w-3 h-3 text-primary animate-spin" />
                    </div>
                    <div className="bg-muted rounded-xl px-3 py-2">
                      <p className="text-xs text-muted-foreground">Thinking...</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="py-4 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-3">
                Ask me anything about this page
              </p>
              
              {/* Quick Suggestions */}
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {suggestions.slice(0, 3).map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => handleSuggestion(suggestion.action)}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {suggestion.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="text-xs h-8"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-8 w-8"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default EmbeddedChatPanel;
