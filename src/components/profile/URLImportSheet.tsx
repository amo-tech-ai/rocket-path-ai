import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Globe, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useProfileImport, type ExtractedField } from '@/hooks/useProfileImport';
import { toast } from 'sonner';

interface URLImportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentValues: Record<string, unknown>;
  onApply: (fields: ExtractedField[]) => void;
}

const CONFIDENCE_COLORS: Record<string, string> = {
  high: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-red-100 text-red-700 border-red-200',
};

function formatValue(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ');
  if (v === null || v === undefined) return '';
  return String(v);
}

export function URLImportSheet({ open, onOpenChange, currentValues, onApply }: URLImportSheetProps) {
  const [url, setUrl] = useState('');
  const {
    isExtracting,
    error,
    fields,
    selectedCount,
    extractFromURL,
    toggleField,
    toggleAll,
    reset,
  } = useProfileImport();

  const handleExtract = async () => {
    if (!url.trim()) return;
    await extractFromURL(url.trim(), currentValues);
  };

  const handleApply = () => {
    const selected = fields.filter(f => f.selected);
    if (selected.length === 0) return;
    onApply(selected);
    toast.success(`${selected.length} field${selected.length > 1 ? 's' : ''} imported from URL`);
    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Import from URL
          </SheetTitle>
          <SheetDescription>
            Paste a company website, LinkedIn, or Crunchbase URL to auto-fill your profile.
          </SheetDescription>
        </SheetHeader>

        {/* URL Input */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleExtract()}
              className="pl-9"
              disabled={isExtracting}
            />
          </div>
          <Button onClick={handleExtract} disabled={isExtracting || !url.trim()}>
            {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Extract'}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {fields.length > 0 && (
          <div className="flex-1 overflow-y-auto mt-4 -mx-6 px-6 space-y-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">
                {fields.length} field{fields.length > 1 ? 's' : ''} found
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleAll(true)}>
                  Select all
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toggleAll(false)}>
                  Deselect all
                </Button>
              </div>
            </div>

            {fields.map(field => (
              <label
                key={field.key}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  field.selected ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-transparent'
                }`}
              >
                <Checkbox
                  checked={field.selected}
                  onCheckedChange={() => toggleField(field.key)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{field.label}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${CONFIDENCE_COLORS[field.confidence]}`}
                    >
                      {field.confidence}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground truncate">
                    {formatValue(field.value)}
                  </p>
                  {field.hasConflict && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="truncate">Current: {formatValue(field.currentValue)}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      <span className="truncate text-foreground">{formatValue(field.value)}</span>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Extracting state */}
        {isExtracting && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Analyzing page with AI...</p>
            </div>
          </div>
        )}

        {/* Footer */}
        {fields.length > 0 && (
          <SheetFooter className="mt-4 gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={selectedCount === 0}>
              Apply {selectedCount} field{selectedCount !== 1 ? 's' : ''}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
