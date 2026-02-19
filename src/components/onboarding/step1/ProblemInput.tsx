/**
 * ProblemInput Component
 * Task 09: Canvas Fields - Captures the core problem being solved
 * Maps to Lean Canvas "Problem" box
 */

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProblemInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  showError?: boolean;
}

const SUGGESTION_CHIPS = [
  "What's the cost?",
  "How often does it happen?",
  "How urgent is it?",
  "Who feels it most?",
];

export function ProblemInput({
  value,
  onChange,
  onBlur,
  error,
  touched,
  showError,
}: ProblemInputProps) {
  const shouldShowError = showError || touched;
  const hasError = shouldShowError && error;

  const handleChipClick = (chip: string) => {
    const suffix = value.trim() ? ` ${chip}` : chip;
    onChange(value + suffix);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="problem" className="flex items-center gap-2">
        <span>What problem are you solving?</span>
        <span className="text-destructive">*</span>
      </Label>
      
      <Textarea
        id="problem"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Small businesses waste 10+ hours/week on manual invoicing and chasing payments..."
        className={cn(
          'min-h-[100px] resize-y',
          hasError && 'border-destructive focus-visible:ring-destructive'
        )}
      />

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Lightbulb className="h-3 w-3" />
          Add detail:
        </span>
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {hasError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Describe the pain point or problem your product solves. Be specific about the impact.
      </p>
    </div>
  );
}

export default ProblemInput;
