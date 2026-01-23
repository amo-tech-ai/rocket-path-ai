import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TargetMarketInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
}

const MIN_CHARS = 10;
const MAX_CHARS = 200;

export function TargetMarketInput({
  value,
  onChange,
  error,
  touched,
}: TargetMarketInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const charCount = localValue.length;
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, MAX_CHARS);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const showError = touched && error;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  return (
    <div className="space-y-2">
      <Label htmlFor="target_market" className="flex items-center gap-1">
        Target market
        <span className="text-destructive">*</span>
      </Label>
      <Textarea
        id="target_market"
        placeholder="e.g. B2B fashion brands, event organizers, agencies"
        value={localValue}
        onChange={handleChange}
        rows={2}
        className={cn(
          'resize-none transition-colors',
          showError && 'border-destructive focus-visible:ring-destructive'
        )}
      />
      <div className="flex items-center justify-between text-xs">
        <p className="text-muted-foreground">
          Who pays, who uses, and where they operate.
        </p>
        <span
          className={cn(
            'tabular-nums',
            charCount < MIN_CHARS && 'text-muted-foreground',
            charCount >= MIN_CHARS && charCount <= MAX_CHARS && 'text-primary',
            charCount >= MAX_CHARS && 'text-destructive'
          )}
        >
          {charCount}/{MAX_CHARS}
        </span>
      </div>
      {showError && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

export default TargetMarketInput;
