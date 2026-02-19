/**
 * Coach Panel
 * Right panel container for the validation coach chat
 */

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoachSession } from '@/hooks/useCoachSession';
import CoachProgress from './CoachProgress';
import CoachMessage from './CoachMessage';
import QuickActions from './QuickActions';
import CoachInput from './CoachInput';

interface CoachPanelProps {
  startupId: string;
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export default function CoachPanel({ 
  startupId, 
  onClose, 
  onMinimize,
  isMinimized = false,
}: CoachPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    isSending,
    sendMessage,
    suggestedActions,
    progress,
    phase,
    startSession,
  } = useCoachSession({ 
    startupId,
    onError: (error) => console.error('Coach error:', error),
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Start session if no messages
  useEffect(() => {
    if (!isLoading && messages.length === 0) {
      startSession();
    }
  }, [isLoading, messages.length, startSession]);

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={onMinimize}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="h-full flex flex-col bg-muted/30 border-l border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">Your Coach</h3>
            <p className="text-xs text-muted-foreground capitalize">{phase.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onMinimize && (
            <Button variant="ghost" size="icon" onClick={onMinimize} className="h-8 w-8">
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 border-b border-border bg-background/30">
        <CoachProgress phase={phase} progress={progress} />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-12 w-1/2 ml-auto" />
              <Skeleton className="h-20 w-3/4" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <CoachMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                />
              ))}
              {isSending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs">Coach is thinking...</span>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {suggestedActions.length > 0 && !isSending && (
        <div className="px-4 pb-2">
          <QuickActions 
            actions={suggestedActions} 
            onSelect={handleQuickAction}
            disabled={isSending}
          />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-background/50">
        <CoachInput 
          onSend={sendMessage} 
          disabled={isSending || isLoading}
          placeholder={isSending ? 'Waiting for response...' : 'Type your message...'}
        />
      </div>
    </motion.div>
  );
}
