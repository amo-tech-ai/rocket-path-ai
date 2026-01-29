/**
 * Global Chatbot Launcher
 * Fixed bottom-right icon accessible on ALL authenticated screens
 * Opens the StartupAI Copilot chat panel
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  Brain,
  Sparkles,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAIChat, AIMessage } from '@/hooks/useAIChat';
import { useStartup } from '@/hooks/useDashboardData';
import ReactMarkdown from 'react-markdown';

// Chat message component
function ChatMessage({ message }: { message: AIMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Brain className="w-3.5 h-3.5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ChatbotLauncherProps {
  className?: string;
}

export function ChatbotLauncher({ className }: ChatbotLauncherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: startup } = useStartup();
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();

  // Hide on /ai-chat page (dedicated chat page)
  const isOnChatPage = location.pathname === '/ai-chat';

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput('');
    
    await sendMessage(message, 'chat', {
      screen: location.pathname,
      startup_id: startup?.id,
      data: {
        startup_name: startup?.name,
        industry: startup?.industry,
        stage: startup?.stage,
      },
    });
  }, [input, isLoading, sendMessage, location.pathname, startup]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleGoToFullChat = useCallback(() => {
    setIsOpen(false);
    navigate('/ai-chat');
  }, [navigate]);

  // Don't render on the dedicated chat page
  if (isOnChatPage) return null;

  return (
    <>
      {/* Launcher Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={buttonRef}
            variant="default"
            size="icon"
            onClick={handleOpen}
            aria-label="Open StartupAI Copilot"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className={cn(
              "fixed z-50 rounded-full shadow-lg",
              "w-14 h-14 min-w-[44px] min-h-[44px]", // 44px+ tap target
              "bottom-4 right-4", // Base position
              "sm:bottom-6 sm:right-6", // Larger screens
              "mb-safe", // Safe area for notches
              "transition-all duration-200",
              "hover:scale-105 hover:shadow-xl",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isOpen && "scale-0 opacity-0",
              className
            )}
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          <p>StartupAI Copilot</p>
        </TooltipContent>
      </Tooltip>

      {/* Chat Panel - Sheet on mobile, floating panel on desktop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Desktop: Floating Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "hidden sm:flex fixed z-50 flex-col",
                "bg-background border rounded-2xl shadow-2xl overflow-hidden",
                "bottom-6 right-6",
                isExpanded 
                  ? "w-[480px] h-[600px]" 
                  : "w-[380px] h-[500px]"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">StartupAI Copilot</h2>
                    <p className="text-xs text-muted-foreground">Your AI advisor</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
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
                    onClick={handleClose}
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
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">How can I help?</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Ask about fundraising, strategy, or get recommendations.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGoToFullChat}
                      className="text-xs"
                    >
                      Open Full Chat
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <ChatMessage key={index} message={message} />
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                        </div>
                        <div className="bg-muted rounded-2xl px-3 py-2">
                          <p className="text-xs text-muted-foreground">Thinking...</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    disabled={isLoading}
                    className="flex-1 h-10 text-sm"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-10 w-10"
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

            {/* Mobile: Bottom Sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent 
                side="bottom" 
                className="h-[85vh] rounded-t-2xl p-0 sm:hidden"
              >
                <SheetHeader className="px-4 py-3 border-b">
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="block font-semibold text-sm">StartupAI Copilot</span>
                      <span className="block text-xs font-normal text-muted-foreground">Your AI advisor</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col h-[calc(85vh-60px)]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center px-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <MessageSquare className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">How can I help?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Ask about fundraising, strategy, or get recommendations.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGoToFullChat}
                        >
                          Open Full Chat
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message, index) => (
                          <ChatMessage key={index} message={message} />
                        ))}
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-2"
                          >
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                            </div>
                            <div className="bg-muted rounded-2xl px-3 py-2">
                              <p className="text-xs text-muted-foreground">Thinking...</p>
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
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
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
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatbotLauncher;
