/**
 * CanvasCoachChat
 * Chat-based AI coach for the Lean Canvas sidebar.
 * Messages, typing indicator, suggestion cards, chips, score badge.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Plus, Loader2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCanvasCoach, type CoachResult } from '@/hooks/useCanvasCoach';
import { CANVAS_BOX_CONFIG, type LeanCanvasData } from '@/hooks/useLeanCanvas';

interface CanvasCoachChatProps {
  canvasData: LeanCanvasData;
  startup: { name: string; industry: string; stage: string; description: string };
  onApplySuggestion: (boxKey: string, item: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: CoachResult['suggestions'];
}

const DEFAULT_CHIPS = [
  'Review my problem statement',
  'Who are my early adopters?',
  'Help me find my moat',
  'Is my pricing realistic?',
];

function getBoxTitle(key: string): string {
  return CANVAS_BOX_CONFIG.find(b => b.key === key)?.title || key;
}

export function CanvasCoachChat({ canvasData, startup, onApplySuggestion }: CanvasCoachChatProps) {
  const { sendMessage, isLoading } = useCanvasCoach();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filledBoxes = Object.values(canvasData).filter(b => b.items?.length > 0).length;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I can see your canvas has **${filledBoxes}/9 boxes** filled. Pick a chip below or ask me anything about your business model.`,
    },
  ]);
  const [chips, setChips] = useState<string[]>(DEFAULT_CHIPS);
  const [canvasScore, setCanvasScore] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [appliedItems, setAppliedItems] = useState<Set<string>>(new Set());

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Build conversation for the edge function (exclude welcome)
    const conversationMessages = [...messages.filter(m => m.id !== 'welcome'), userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    const result = await sendMessage(conversationMessages, canvasData, startup);

    if (result) {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: result.reply,
        suggestions: result.suggestions,
      };
      setMessages(prev => [...prev, aiMsg]);
      setChips(result.next_chips.length > 0 ? result.next_chips : DEFAULT_CHIPS);
      setCanvasScore(result.canvas_score);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had trouble analyzing your canvas. Please try again.',
        },
      ]);
    }

    inputRef.current?.focus();
  }, [messages, canvasData, startup, isLoading, sendMessage]);

  const handleChipClick = (chip: string) => {
    handleSend(chip);
  };

  const handleApplySuggestion = (boxKey: string, item: string) => {
    onApplySuggestion(boxKey, item);
    setAppliedItems(prev => new Set(prev).add(`${boxKey}:${item}`));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-2 border-b mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sage" />
          <span className="text-sm font-medium">Canvas Coach</span>
        </div>
        {canvasScore !== null && (
          <Badge variant="secondary" className="text-xs tabular-nums">
            {canvasScore}/100
          </Badge>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 pr-2">
        <div ref={scrollRef} className="space-y-3 pb-2">
          {messages.map(msg => (
            <div key={msg.id}>
              {/* Message bubble */}
              <div
                className={`text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-sage/10 rounded-lg px-3 py-2 ml-6'
                    : 'text-muted-foreground'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="text-foreground font-medium">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-1.5 space-y-0.5">{children}</ul>,
                      li: ({ children }) => <li>{children}</li>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>

              {/* Suggestion cards */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {msg.suggestions.map((s, i) => {
                    const applied = appliedItems.has(`${s.box_key}:${s.item}`);
                    return (
                      <Card
                        key={`${msg.id}-sug-${i}`}
                        className="p-2.5 border-sage/30 bg-sage-light/10"
                      >
                        <div className="text-[10px] uppercase tracking-wider text-sage font-medium mb-1">
                          {getBoxTitle(s.box_key)}
                        </div>
                        <p className="text-xs mb-1.5">{s.item}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground italic line-clamp-1 mr-2">
                            {s.reasoning}
                          </span>
                          <Button
                            variant={applied ? 'ghost' : 'sage'}
                            size="sm"
                            className="h-6 text-[10px] px-2 shrink-0"
                            disabled={applied}
                            onClick={() => handleApplySuggestion(s.box_key, s.item)}
                          >
                            {applied ? (
                              'Added'
                            ) : (
                              <>
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-center gap-1.5 text-muted-foreground px-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-[10px]">Analyzing canvas...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chips */}
      <div className="flex flex-wrap gap-1 py-2 border-t mt-1">
        {chips.map(chip => (
          <button
            key={chip}
            onClick={() => handleChipClick(chip)}
            disabled={isLoading}
            className="text-[10px] px-2 py-1 rounded-full border border-sage/30 text-sage hover:bg-sage/10 transition-colors disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-1.5">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your canvas..."
          className="text-xs h-8"
          disabled={isLoading}
        />
        <Button
          size="sm"
          variant="sage"
          className="h-8 w-8 p-0 shrink-0"
          onClick={() => handleSend(inputValue)}
          disabled={isLoading || !inputValue.trim()}
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
