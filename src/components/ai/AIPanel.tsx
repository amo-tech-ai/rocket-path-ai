/**
 * AIPanel — Persistent AI chat panel (360px right column)
 *
 * Lives in DashboardLayout, survives page navigation.
 * Uses AIAssistantProvider for chat state and useAIPanel for visibility.
 */

import { useEffect, useRef, useCallback } from 'react';
import {
  Brain,
  X,
  Trash2,
  MessageSquare,
  Loader2,
  Keyboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGlobalAIAssistant } from '@/hooks/useGlobalAIAssistant';
import { useReportAIContext } from '@/hooks/useReportAIContext';
import { useDashboardAIContext } from '@/hooks/useDashboardAIContext';
import { AIMessageBubble } from './AIMessageBubble';
import { AIQuickActions } from './AIQuickActions';
import { AIChatInput } from './AIChatInput';

interface AIPanelProps {
  onClose: () => void;
}

export function AIPanel({ onClose }: AIPanelProps) {
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

  // MVP-06: Section-aware context for report dimension pages
  const reportAI = useReportAIContext();
  const isOnDimension = reportAI.isOnDimensionPage && isAuthenticated;

  // Dashboard-specific quick actions
  const dashboardAI = useDashboardAIContext();
  const isOnDashboard = dashboardAI.isOnDashboard && isAuthenticated;

  // Priority chain: dimension context > dashboard context > default
  const effectiveQuickActions = isOnDimension
    ? reportAI.quickActions
    : isOnDashboard
      ? dashboardAI.quickActions
      : quickActions;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      // Use requestAnimationFrame to ensure the DOM has updated
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages]);

  const handleSend = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage],
  );

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
              isAuthenticated ? 'bg-primary/10' : 'bg-sage/10',
            )}
            style={
              isOnDimension && reportAI.dimensionColor
                ? { backgroundColor: `${reportAI.dimensionColor}15` }
                : undefined
            }
          >
            <Brain
              className={cn(
                'w-4.5 h-4.5',
                isAuthenticated ? 'text-primary' : 'text-sage',
              )}
              style={
                isOnDimension && reportAI.dimensionColor
                  ? { color: reportAI.dimensionColor }
                  : undefined
              }
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm truncate">Atlas</h2>
              {isOnDimension && reportAI.dimensionLabel ? (
                <Badge
                  className="text-[10px] h-5 px-1.5 flex-shrink-0 text-white"
                  style={{ backgroundColor: reportAI.dimensionColor ?? undefined }}
                >
                  {reportAI.dimensionLabel}
                </Badge>
              ) : (
                <Badge
                  variant={isAuthenticated ? 'default' : 'secondary'}
                  className="text-[10px] h-5 px-1.5 flex-shrink-0"
                >
                  {modeLabel}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {contextLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
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
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close panel (Ctrl+J)"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
            <div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center mb-4',
                isAuthenticated ? 'bg-primary/10' : 'bg-sage/10',
              )}
            >
              <MessageSquare
                className={cn(
                  'w-7 h-7',
                  isAuthenticated ? 'text-primary' : 'text-sage',
                )}
              />
            </div>
            <h3 className="font-semibold text-sm mb-1">
              {isOnDimension
                ? `Ask about ${reportAI.dimensionLabel}`
                : isOnDashboard
                  ? 'Your startup at a glance'
                  : isAuthenticated
                    ? 'How can I help you today?'
                    : "Hi! I'm Atlas"}
            </h3>
            <p className="text-xs text-muted-foreground mb-6 max-w-[280px]">
              {isOnDimension
                ? 'Get insights about this dimension, drill into sub-scores, or learn how to improve.'
                : isOnDashboard
                  ? 'Ask about your health score, risks, next steps, or get a weekly digest.'
                  : isAuthenticated
                    ? 'Ask about your startup, get recommendations, or explore insights.'
                    : 'I can answer questions about StartupAI. Sign in to unlock personalized guidance!'}
            </p>

            {/* Quick Actions — dimension-specific when on a dimension page */}
            <AIQuickActions actions={effectiveQuickActions} onAction={executeQuickAction} />

            {/* Keyboard hint */}
            <div className="mt-6 flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
              <Keyboard className="w-3 h-3" />
              <span>
                <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">
                  ⌘J
                </kbd>{' '}
                to toggle
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <AIMessageBubble
                  key={message.id}
                  message={message}
                  onSuggestedAction={handleSuggestedAction}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    isAuthenticated ? 'bg-primary/10' : 'bg-sage/10',
                  )}
                >
                  <Loader2
                    className={cn(
                      'w-4 h-4 animate-spin',
                      isAuthenticated ? 'text-primary' : 'text-sage',
                    )}
                  />
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
      <div className="p-4 border-t bg-background flex-shrink-0">
        <AIChatInput
          onSend={handleSend}
          isLoading={isLoading}
          placeholder={
            isAuthenticated
              ? 'Ask anything about your startup...'
              : 'Ask about StartupAI...'
          }
          autoFocus
        />
      </div>
    </div>
  );
}

export default AIPanel;
