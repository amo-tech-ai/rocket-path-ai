/**
 * Validator Chat Input
 * Premium input area with suggestions and generate button
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Send, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ValidatorChatInputProps {
  onSendMessage: (message: string) => void;
  onGenerate: () => void;
  onSendAndGenerate?: (text: string) => void;
  isProcessing: boolean;
  canGenerate: boolean;
  generateDisabledReason?: string;
  placeholder?: string;
  prefillText?: string;
  suggestions?: string[];
}

// Static fallback chips — shown only in the initial empty state before any AI response.
// Once the AI generates dynamic suggestions (via `suggestions` prop), these are replaced.
const SUGGESTION_CHIPS = [
  "AI tool for small business",
  "Marketplace connecting X and Y",
  "SaaS platform for industry",
  "Mobile app for consumers",
];

export default function ValidatorChatInput({
  onSendMessage,
  onGenerate,
  onSendAndGenerate,
  isProcessing,
  canGenerate,
  generateDisabledReason,
  placeholder = "Describe your startup idea, problem, or goal...",
  prefillText,
  suggestions,
}: ValidatorChatInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Handle prefill from suggestion chips
  useEffect(() => {
    if (prefillText) {
      setInput(prefillText);
      setShowSuggestions(false);
      // Focus the textarea so user can edit/send
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [prefillText]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    onSendMessage(input.trim());
    setInput('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      setInput('');
      textareaRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      {/* Suggestion Chips — dynamic (AI-generated per question) or static (initial state) */}
      <AnimatePresence>
        {(() => {
          // 037-DSC: Show AI suggestions when available, static chips for initial empty state.
          // Dynamic chips bypass `showSuggestions` — they reappear after each AI question
          // even if the user previously focused/dismissed. Static chips respect `showSuggestions`.
          const hasDynamic = suggestions && suggestions.length > 0;
          const showChips = hasDynamic ? !input : (showSuggestions && !input);
          const chips = hasDynamic ? suggestions : SUGGESTION_CHIPS;
          if (!showChips) return null;

          return (
            <motion.div
              key={hasDynamic ? 'dynamic' : 'static'}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              className="flex flex-wrap gap-2"
            >
              {chips.map((chip, i) => (
                <motion.button
                  key={chip}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.1 }}
                  onClick={() => handleSuggestionClick(chip)}
                  aria-label={`Suggestion: ${chip}`}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full transition-colors",
                    hasDynamic
                      ? "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary border border-primary/20"
                      : "text-muted-foreground bg-muted/50 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {chip}
                </motion.button>
              ))}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(false)}
          aria-label="Message input"
          placeholder={placeholder}
          disabled={isProcessing}
          className={cn(
            "min-h-[120px] pr-24 resize-none",
            "bg-card border-2 border-border",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
            "text-base placeholder:text-muted-foreground",
            "transition-all duration-200"
          )}
        />
        
        {/* Character count */}
        <div className="absolute bottom-3 left-4 text-xs text-muted-foreground">
          {input.length}/500 recommended
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isProcessing}
          aria-disabled={!input.trim() || isProcessing}
          aria-label="Send message"
          size="icon"
          variant="ghost"
          className="absolute bottom-3 right-14 h-8 w-8"
        >
          <Send className="w-4 h-4" />
        </Button>

        {/* Generate Button */}
        <div className="absolute bottom-3 right-3" title={!canGenerate && !input.trim() && generateDisabledReason ? generateDisabledReason : undefined}>
          <Button
            onClick={() => {
              if (canGenerate) {
                // Normal flow: send any unsent text then generate
                if (input.trim()) {
                  onSendMessage(input.trim());
                  setInput('');
                }
                onGenerate();
              } else if (input.trim() && onSendAndGenerate) {
                // Quick-generate: skip Q&A, send text and start validation
                onSendAndGenerate(input.trim());
                setInput('');
                setShowSuggestions(false);
              }
            }}
            disabled={(!canGenerate && !input.trim()) || isProcessing}
            aria-disabled={(!canGenerate && !input.trim()) || isProcessing}
            aria-label={!canGenerate && !input.trim() && generateDisabledReason ? generateDisabledReason : "Generate validation report"}
            size="sm"
            className={cn(
              "gap-2",
              (canGenerate || input.trim()) && "bg-primary hover:bg-primary/90"
            )}
          >
            {isProcessing ? (
              <motion.div
                animate={shouldReduceMotion ? undefined : { rotate: 360 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : (
              <>
                Generate
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-center text-muted-foreground">
        Enter to send · Esc to clear · <span className="text-primary">AI suggests. You decide.</span>
      </p>
    </div>
  );
}
