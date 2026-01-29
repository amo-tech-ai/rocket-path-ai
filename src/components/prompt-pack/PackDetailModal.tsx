/**
 * PackDetailModal Component
 * Shows detailed pack information with steps list
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Clock, Layers, Play, Sparkles } from 'lucide-react';
import type { PackWithSteps } from '@/hooks/usePromptPack';

interface PackDetailModalProps {
  pack: PackWithSteps | null;
  isOpen: boolean;
  onClose: () => void;
  onRun: (pack: PackWithSteps) => void;
  isLoading?: boolean;
}

export function PackDetailModal({ pack, isOpen, onClose, onRun, isLoading }: PackDetailModalProps) {
  if (!pack) return null;

  const estimatedTime = pack.metadata?.estimated_time_seconds;
  const stepCount = pack.steps?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {pack.category}
            </Badge>
            {pack.metadata?.model && (
              <Badge variant="secondary" className="text-xs">
                {pack.metadata.model}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              v{pack.version}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{pack.title}</DialogTitle>
          <DialogDescription className="text-base">
            {pack.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 text-sm text-muted-foreground py-2">
          <span className="flex items-center gap-1.5">
            <Layers className="h-4 w-4" />
            {stepCount} {stepCount === 1 ? 'step' : 'steps'}
          </span>
          {estimatedTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              ~{estimatedTime < 60 ? `${estimatedTime}s` : `${Math.round(estimatedTime / 60)} min`}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            AI-powered
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 py-2">
          {pack.stage_tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {pack.industry_tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator />

        <div className="py-2">
          <h4 className="text-sm font-medium mb-3">Steps in this pack</h4>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              {pack.steps?.map((step, index) => (
                <div 
                  key={step.id} 
                  className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{step.purpose}</p>
                    {step.model_preference && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Model: {step.model_preference}
                      </p>
                    )}
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
                </div>
              ))}
              {(!pack.steps || pack.steps.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No steps information available
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onRun(pack)} disabled={isLoading}>
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Running...' : 'Run Pack'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PackDetailModal;
