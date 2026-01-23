import { useState, useEffect } from 'react';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnrich?: () => void;
  isEnriching?: boolean;
  minWords?: number;
}

export function DescriptionInput({
  value,
  onChange,
  onEnrich,
  isEnriching = false,
  minWords = 50,
}: DescriptionInputProps) {
  const [wordCount, setWordCount] = useState(0);
  
  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [value]);

  const isValid = wordCount >= minWords;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="description">Describe your startup *</Label>
        <div className="flex items-center gap-2">
          {onEnrich && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEnrich}
              disabled={!isValid || isEnriching}
              className="h-7 text-xs gap-1"
            >
              {isEnriching ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              Analyze
            </Button>
          )}
        </div>
      </div>
      <Textarea
        id="description"
        placeholder="Describe what your startup does, the problem you solve, and who your customers are. Be specific about your unique value proposition..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-none"
      />
      <div className="flex items-center justify-between">
        <p
          className={cn(
            'text-xs flex items-center gap-1',
            isValid ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {wordCount}/{minWords} words
          {isValid && <Check className="h-3 w-3" />}
        </p>
        {!isValid && (
          <p className="text-xs text-muted-foreground">
            Add at least {minWords} words for AI analysis
          </p>
        )}
      </div>
    </div>
  );
}

export default DescriptionInput;
