import { useState } from 'react';
import { Sparkles, Wand2, CheckCircle, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LeanCanvasData, usePreFillCanvas, useValidateCanvas, CANVAS_BOX_CONFIG, EMPTY_CANVAS } from '@/hooks/useLeanCanvas';
import { CanvasCoachChat } from './CanvasCoachChat';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasAIPanelProps {
  startupId: string;
  canvasData: LeanCanvasData;
  onPreFillApply: (data: Partial<LeanCanvasData>) => void;
  onValidationComplete: (results: Record<string, { validation: 'valid' | 'warning' | 'error'; message: string }>) => void;
  startup?: { name: string; industry: string; stage: string; description: string };
  onApplySuggestion?: (boxKey: string, item: string) => void;
}

export function CanvasAIPanel({
  startupId,
  canvasData,
  onPreFillApply,
  onValidationComplete,
  startup,
  onApplySuggestion,
}: CanvasAIPanelProps) {
  const [preFillSuggestions, setPreFillSuggestions] = useState<Partial<LeanCanvasData> | null>(null);
  const [validationResults, setValidationResults] = useState<string | null>(null);
  
  const preFill = usePreFillCanvas();
  const validate = useValidateCanvas();

  // Calculate completion
  const filledBoxes = Object.values(canvasData).filter(box => box.items?.length > 0).length;
  const completionPercent = Math.round((filledBoxes / 9) * 100);

  const handlePreFill = async () => {
    try {
      const result = await preFill.mutateAsync(startupId);
      
      // Parse the AI response to extract canvas data
      const responseText = result?.response || result?.message || '';
      const parsed = parseCanvasFromResponse(responseText);
      
      if (Object.keys(parsed).length > 0) {
        setPreFillSuggestions(parsed);
        toast.success('Pre-fill suggestions ready! Review and apply.');
      } else {
        toast.info('Could not extract suggestions. Your profile may need more details.');
      }
    } catch (err) {
      console.error('Pre-fill error:', err);
      toast.error('Failed to pre-fill canvas');
    }
  };

  const parseCanvasFromResponse = (response: string): Partial<LeanCanvasData> => {
    const result: Partial<LeanCanvasData> = {};
    
    // Try JSON parsing first
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        for (const key of Object.keys(EMPTY_CANVAS)) {
          if (parsed[key]) {
            const items = Array.isArray(parsed[key]) 
              ? parsed[key] 
              : parsed[key]?.items || parsed[key]?.list || [];
            if (items.length > 0) {
              result[key as keyof LeanCanvasData] = { 
                items: items.map((i: any) => String(i)).slice(0, 5) 
              };
            }
          }
        }
        if (Object.keys(result).length > 0) return result;
      }
    } catch {
      // Fall back to text parsing
    }

    // Text-based parsing
    const sections: Record<string, string[]> = {};
    let currentSection = '';
    
    for (const line of response.split('\n')) {
      const headerMatch = line.match(/^#+\s*(.+)|^\*\*(.+)\*\*/);
      if (headerMatch) {
        const header = (headerMatch[1] || headerMatch[2]).toLowerCase();
        for (const box of CANVAS_BOX_CONFIG) {
          if (header.includes(box.title.toLowerCase())) {
            currentSection = box.key;
            sections[currentSection] = [];
            break;
          }
        }
      } else if (currentSection) {
        const bulletMatch = line.match(/^[\-\*\•]\s*(.+)/);
        if (bulletMatch && bulletMatch[1].trim()) {
          sections[currentSection].push(bulletMatch[1].trim());
        }
      }
    }

    for (const [key, items] of Object.entries(sections)) {
      if (items.length > 0) {
        result[key as keyof LeanCanvasData] = { items: items.slice(0, 5) };
      }
    }

    return result;
  };

  const applyPreFill = () => {
    if (preFillSuggestions) {
      onPreFillApply(preFillSuggestions);
      setPreFillSuggestions(null);
      toast.success('Pre-fill applied!');
    }
  };

  const handleValidate = async () => {
    try {
      const result = await validate.mutateAsync({ startupId, canvasData });
      setValidationResults(result?.response || result?.message || 'Validation complete');
      toast.success('Canvas validated');
    } catch (err) {
      console.error('Validation error:', err);
      toast.error('Failed to validate canvas');
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sage" />
            Canvas Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-2" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{filledBoxes}/9 boxes filled</span>
          </div>
        </CardContent>
      </Card>

      {/* AI Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">AI Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="sage"
            size="sm"
            className="w-full justify-start"
            onClick={handlePreFill}
            disabled={preFill.isPending}
          >
            {preFill.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            Pre-fill from Profile
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleValidate}
            disabled={validate.isPending || completionPercent < 50}
          >
            {validate.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Validate Hypotheses
          </Button>
        </CardContent>
      </Card>

      {/* Pre-fill Suggestions */}
      <AnimatePresence>
        {preFillSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-sage/40 bg-sage-light/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Pre-fill Ready</span>
                  <Badge variant="secondary" className="text-xs">
                    {Object.keys(preFillSuggestions).length} boxes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  {Object.entries(preFillSuggestions).map(([key, box]) => (
                    <div key={key} className="flex items-center gap-2 py-1">
                      <CheckCircle className="w-3 h-3 text-sage" />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-muted-foreground/60">({box.items?.length || 0} items)</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="sage" onClick={applyPreFill} className="flex-1">
                    Apply All
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPreFillSuggestions(null)}>
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Results */}
      <AnimatePresence>
        {validationResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Validation Results</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setValidationResults(null)}
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-10">
                  {validationResults}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Coach */}
      {startup && onApplySuggestion && (
        <CanvasCoachChat
          canvasData={canvasData}
          startup={startup}
          onApplySuggestion={onApplySuggestion}
        />
      )}
    </div>
  );
}
