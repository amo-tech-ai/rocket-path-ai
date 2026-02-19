import { useState } from 'react';
import { Globe, Loader2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  onExtract?: () => void;
  isExtracting?: boolean;
  extractionDone?: boolean;
  extractionError?: string;
}

export function URLInput({
  value,
  onChange,
  onExtract,
  isExtracting = false,
  extractionDone = false,
  extractionError,
}: URLInputProps) {
  const isValidUrl = (url: string) => {
    if (!url.trim()) return false;
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const hasValidUrl = isValidUrl(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="website_url">Website URL (recommended)</Label>
        {extractionDone && (
          <span className="text-xs text-primary flex items-center gap-1">
            <Check className="h-3 w-3" /> Extracted
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="website_url"
            placeholder="https://yourcompany.com"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              'pl-10',
              extractionError && 'border-destructive',
              extractionDone && 'border-primary'
            )}
            disabled={isExtracting}
          />
        </div>
        {onExtract && (
          <Button
            variant={extractionDone ? 'outline' : 'default'}
            onClick={onExtract}
            disabled={!hasValidUrl || isExtracting}
            className="gap-2"
          >
            {isExtracting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : extractionDone ? (
              <>
                <Sparkles className="h-4 w-4" />
                Re-extract
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Extract with AI
              </>
            )}
          </Button>
        )}
      </div>
      {extractionError && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {extractionError}
        </p>
      )}
    </div>
  );
}

export default URLInput;
