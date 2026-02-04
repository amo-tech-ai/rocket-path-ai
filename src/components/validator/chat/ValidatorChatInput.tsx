/**
 * Validator Chat Input
 * Premium input area with suggestions and generate button
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ValidatorChatInputProps {
  onSendMessage: (message: string) => void;
  onGenerate: () => void;
  isProcessing: boolean;
  canGenerate: boolean;
  placeholder?: string;
}

const SUGGESTION_CHIPS = [
  "AI tool for small business",
  "Marketplace connecting X and Y",
  "SaaS platform for industry",
  "Mobile app for consumers",
];

export default function ValidatorChatInput({
  onSendMessage,
  onGenerate,
  isProcessing,
  canGenerate,
  placeholder = "Describe your startup idea, problem, or goal...",
}: ValidatorChatInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

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
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      {/* Suggestion Chips */}
      <AnimatePresence>
        {showSuggestions && !input && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
          >
            {SUGGESTION_CHIPS.map((chip, i) => (
              <motion.button
                key={chip}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSuggestionClick(chip)}
                className="px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 rounded-full hover:bg-muted hover:text-foreground transition-colors"
              >
                {chip}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(false)}
          placeholder={placeholder}
          disabled={isProcessing}
          className={cn(
            "min-h-[120px] pr-24 resize-none",
            "bg-card border-2 border-border",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
            "text-base placeholder:text-muted-foreground/60",
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
          size="icon"
          variant="ghost"
          className="absolute bottom-3 right-14 h-8 w-8"
        >
          <Send className="w-4 h-4" />
        </Button>

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={!canGenerate || isProcessing}
          size="sm"
          className={cn(
            "absolute bottom-3 right-3 gap-2",
            canGenerate && "bg-primary hover:bg-primary/90"
          )}
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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

      {/* Helper text */}
      <p className="text-xs text-center text-muted-foreground">
        Press Enter to send • <span className="text-primary">AI suggests. You decide.</span>
      </p>
    </div>
  );
}
