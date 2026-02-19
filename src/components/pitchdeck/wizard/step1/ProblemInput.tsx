/**
 * Problem Input Component
 * Enhanced problem field with AI suggestions
 */

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProblemInputProps {
  value: string;
  onChange: (value: string) => void;
  onRequestSuggestions?: () => void;
  isLoadingSuggestions?: boolean;
  error?: string;
}

export function ProblemInput({
  value,
  onChange,
  onRequestSuggestions,
  isLoadingSuggestions = false,
  error,
}: ProblemInputProps) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const minChars = 50;
  const maxChars = 2000;
  const isValid = charCount >= minChars;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="problem" className="flex items-center gap-2">
          Problem Statement
          <span className="text-destructive">*</span>
        </Label>
        {onRequestSuggestions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRequestSuggestions}
            disabled={isLoadingSuggestions}
            className="h-7 text-xs gap-1"
          >
            {isLoadingSuggestions ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            Get AI Suggestions
          </Button>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Describe the problem you're solving. Be specific about who experiences this pain and why existing solutions fall short.
      </p>
      
      <Textarea
        id="problem"
        placeholder="What specific problem does your target customer face? How are they currently solving it? What's broken about current solutions? What's the cost of this problem (time, money, frustration)?"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
        className={cn('min-h-[140px] resize-none', error && 'border-destructive')}
      />
      
      <div className="flex items-center justify-between">
        <p
          className={cn(
            'text-xs',
            isValid ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {charCount}/{maxChars} characters
        </p>
        {!isValid && !error && (
          <p className="text-xs text-muted-foreground">
            Add at least {minChars} characters for a compelling problem statement
          </p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
