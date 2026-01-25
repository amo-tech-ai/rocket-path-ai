import { useState } from 'react';
import { Sparkles, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { LeanCanvasData } from '@/hooks/useLeanCanvas';

interface BoxSuggestionPopoverProps {
  boxKey: keyof LeanCanvasData;
  boxTitle: string;
  currentItems: string[];
  startupId: string;
  canvasData: LeanCanvasData;
  onApplySuggestion: (item: string) => void;
}

export function BoxSuggestionPopover({
  boxKey,
  boxTitle,
  currentItems,
  startupId,
  canvasData,
  onApplySuggestion,
}: BoxSuggestionPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [appliedIndexes, setAppliedIndexes] = useState<Set<number>>(new Set());

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    setAppliedIndexes(new Set());

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: `Suggest 3-4 items for the "${boxTitle}" section of my Lean Canvas. 
Current items: ${currentItems.length > 0 ? currentItems.join(', ') : 'None yet'}.
Return ONLY a JSON array of suggestion strings, no explanations. Example: ["suggestion 1", "suggestion 2", "suggestion 3"]`,
          action: 'chat',
          context: {
            screen: 'lean-canvas',
            startup_id: startupId,
            data: { 
              box_key: boxKey,
              current_items: currentItems,
              canvas: canvasData 
            }
          }
        }
      });

      if (error) throw error;

      const responseText = data?.response || data?.message || '';
      
      // Parse JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          setSuggestions(parsed.filter((s: any) => 
            typeof s === 'string' && s.trim() && !currentItems.includes(s.trim())
          ).slice(0, 4));
        }
      }

      if (suggestions.length === 0 && !jsonMatch) {
        // Fallback: extract bullet points
        const bullets = responseText.match(/[-•*]\s*(.+)/g);
        if (bullets) {
          setSuggestions(
            bullets
              .map((b: string) => b.replace(/^[-•*]\s*/, '').trim())
              .filter((s: string) => s && !currentItems.includes(s))
              .slice(0, 4)
          );
        }
      }
    } catch (err) {
      console.error('Suggestion error:', err);
      toast.error('Failed to get suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (suggestion: string, index: number) => {
    onApplySuggestion(suggestion);
    setAppliedIndexes(prev => new Set([...prev, index]));
    toast.success('Added to canvas');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && suggestions.length === 0) {
      fetchSuggestions();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          title="AI Suggestions"
        >
          <Sparkles className="w-3.5 h-3.5 text-sage" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sage" />
              AI Suggestions
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-2">
              <AnimatePresence>
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-secondary/50 group/item"
                  >
                    <span className="text-xs flex-1 leading-relaxed">{suggestion}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => handleApply(suggestion, index)}
                      disabled={appliedIndexes.has(index)}
                    >
                      {appliedIndexes.has(index) ? (
                        <span className="text-sage text-xs">✓</span>
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={fetchSuggestions}
                disabled={isLoading}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Generate more
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              No suggestions available. Try adding more context to your canvas.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
