/**
 * RealtimeChat Component
 * 
 * Complete chat interface with real-time messaging:
 * - Token streaming display
 * - Room-based isolation
 * - Presence awareness
 * - Typing indicators
 * - Auto-scroll on new messages
 * 
 * @see docs/tasks/06-realtime-chat.md
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Brain, 
  Send, 
  Loader2, 
  Square, 
  Users,
  Wifi,
  WifiOff,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  useRealtimeChatRoom, 
  type ChatMessage, 
  type ChatPresence 
} from '@/hooks/realtime/useRealtimeChatRoom';

// ============ Types ============

interface RealtimeChatProps {
  /** Unique identifier for the chat room */
  roomName: string;
  /** Current user's display name */
  username: string;
  /** Optional startup ID for context scoping */
  startupId?: string;
  /** Optional initial messages to display */
  messages?: ChatMessage[];
  /** Callback when new messages arrive (for persistence) */
  onMessage?: (messages: ChatMessage[]) => void;
  /** Optional className for styling */
  className?: string;
  /** Show presence avatars */
  showPresence?: boolean;
  /** Placeholder text for input */
  placeholder?: string;
  /** Optional header content */
  header?: React.ReactNode;
  /** Quick action suggestions */
  quickActions?: Array<{
    label: string;
    action: string;
    icon?: React.ReactNode;
  }>;
}

// ============ Subcomponents ============

/** Presence indicator showing online users */
function PresenceAvatars({ 
  presence, 
  maxVisible = 3 
}: { 
  presence: ChatPresence[]; 
  maxVisible?: number;
}) {
  const visible = presence.slice(0, maxVisible);
  const remaining = presence.length - maxVisible;

  if (presence.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {visible.map((p) => (
          <Tooltip key={p.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarImage src={p.avatar} alt={p.name} />
                <AvatarFallback className="text-xs">
                  {p.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{p.name}{p.isTyping ? ' (typing...)' : ''}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remaining > 0 && (
          <Avatar className="h-6 w-6 border-2 border-background">
            <AvatarFallback className="text-xs bg-muted">
              +{remaining}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <Badge variant="outline" className="text-xs gap-1">
        <Users className="h-3 w-3" />
        {presence.length}
      </Badge>
    </div>
  );
}

/** Connection status indicator */
function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "flex items-center gap-1 text-xs",
          isConnected ? "text-primary" : "text-destructive"
        )}>
          {isConnected ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {isConnected ? 'Connected' : 'Disconnected - Reconnecting...'}
      </TooltipContent>
    </Tooltip>
  );
}

/** Typing indicator */
function TypingIndicator({ typingUsers }: { typingUsers: ChatPresence[] }) {
  if (typingUsers.length === 0) return null;

  const names = typingUsers.map(u => u.name).join(', ');
  const text = typingUsers.length === 1 
    ? `${names} is typing...` 
    : `${names} are typing...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground"
    >
      <span className="flex gap-1">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
      </span>
      <span>{text}</span>
    </motion.div>
  );
}

/** Single chat message */
function ChatMessageItem({ 
  message, 
  isCurrentUser 
}: { 
  message: ChatMessage; 
  isCurrentUser: boolean;
}) {
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {/* AI Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {message.isStreaming ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <Brain className="w-4 h-4 text-primary" />
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isAssistant 
            ? "bg-muted" 
            : "bg-primary text-primary-foreground"
        )}
      >
        {isAssistant ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
            )}
          </div>
        ) : (
          <p className="text-sm">{message.content}</p>
        )}

        {/* Metadata */}
        {message.metadata?.model && !message.isStreaming && (
          <div className="mt-2 text-xs opacity-60">
            {message.metadata.provider} • {message.metadata.model}
          </div>
        )}

        {/* Suggested Actions */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.suggestedActions.map((action, idx) => (
              <Button 
                key={idx} 
                variant="outline" 
                size="sm"
                className="text-xs h-7"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.user?.avatar} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {message.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}

/** Empty state */
function EmptyState({ 
  quickActions,
  onActionClick,
}: { 
  quickActions?: RealtimeChatProps['quickActions'];
  onActionClick: (action: string) => void;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-lg font-semibold mb-2">Start a Conversation</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-md">
        Ask me anything about your startup, get personalized recommendations, 
        or let me help you with tasks.
      </p>
      
      {quickActions && quickActions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
          {quickActions.map((qa, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onActionClick(qa.action)}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
            >
              {qa.icon && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {qa.icon}
                </div>
              )}
              <span className="text-sm font-medium">{qa.label}</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Main Component ============

export function RealtimeChat({
  roomName,
  username,
  startupId,
  messages: initialMessages,
  onMessage,
  className,
  showPresence = true,
  placeholder = "Type your message...",
  header,
  quickActions,
}: RealtimeChatProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the realtime chat room hook
  const {
    messages,
    presence,
    isConnected,
    isStreaming,
    sendMessage,
    setTyping,
    stopStreaming,
  } = useRealtimeChatRoom({
    roomId: roomName,
    startupId,
    username,
    initialMessages,
    onMessage: (msg) => {
      if (onMessage) {
        onMessage([msg]);
      }
    },
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Get typing users (excluding current user)
  const typingUsers = presence.filter(p => p.isTyping && p.name !== username);

  // Handle send
  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    
    const message = input;
    setInput('');
    await sendMessage(message);
    inputRef.current?.focus();
  }, [input, isStreaming, sendMessage]);

  // Handle input change with typing indicator
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      setTyping(true);
    }
  }, [setTyping]);

  // Handle key down
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Handle quick action click
  const handleQuickAction = useCallback((action: string) => {
    setInput(action);
    inputRef.current?.focus();
  }, []);

  return (
    <div className={cn(
      "flex flex-col h-full bg-background rounded-lg border",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {header || (
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-medium">{roomName}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          {showPresence && <PresenceAvatars presence={presence} />}
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <EmptyState 
            quickActions={quickActions} 
            onActionClick={handleQuickAction}
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessageItem
                  key={message.id}
                  message={message}
                  isCurrentUser={message.user?.name === username}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {/* Typing Indicator */}
        <AnimatePresence>
          <TypingIndicator typingUsers={typingUsers} />
        </AnimatePresence>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={!isConnected}
            className="flex-1 h-10"
          />
          {isStreaming ? (
            <Button
              onClick={stopStreaming}
              variant="destructive"
              size="icon"
              className="h-10 w-10"
            >
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !isConnected}
              size="icon"
              className="h-10 w-10"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Real-time chat powered by StartupAI
        </p>
      </div>
    </div>
  );
}

export default RealtimeChat;
