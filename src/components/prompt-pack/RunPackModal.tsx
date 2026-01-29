/**
 * RunPackModal Component
 * Executes a prompt pack and displays results with apply options
 */

import { useState, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Loader2, 
  Play,
  Eye,
  Download,
  XCircle,
  Zap 
} from 'lucide-react';
import { useRunPack, usePreviewApply, useApplyOutputs } from '@/hooks/usePromptPack';
import type { PackWithSteps, RunPackResponse, ApplyResponse } from '@/hooks/usePromptPack';

interface RunPackModalProps {
  pack: PackWithSteps | null;
  startupId: string;
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess?: () => void;
}

type RunState = 'idle' | 'running' | 'completed' | 'failed' | 'previewing' | 'applying';

export function RunPackModal({ pack, startupId, isOpen, onClose, onApplySuccess }: RunPackModalProps) {
  const [runState, setRunState] = useState<RunState>('idle');
  const [runResult, setRunResult] = useState<RunPackResponse | null>(null);
  const [previewResult, setPreviewResult] = useState<ApplyResponse | null>(null);

  const runPack = useRunPack();
  const previewApply = usePreviewApply();
  const applyOutputs = useApplyOutputs();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setRunState('idle');
      setRunResult(null);
      setPreviewResult(null);
    }
  }, [isOpen]);

  if (!pack) return null;

  const handleRun = async () => {
    setRunState('running');
    try {
      const result = await runPack.mutateAsync({
        startupId,
        packId: pack.id,
      });
      setRunResult(result);
      setRunState(result.success ? 'completed' : 'failed');
    } catch {
      setRunState('failed');
    }
  };

  const handlePreview = async () => {
    if (!runResult?.final_output) return;
    setRunState('previewing');
    try {
      const result = await previewApply.mutateAsync({
        startupId,
        outputsJson: runResult.final_output,
      });
      setPreviewResult(result);
      setRunState('completed');
    } catch {
      setRunState('completed');
    }
  };

  const handleApply = async () => {
    if (!runResult?.final_output) return;
    setRunState('applying');
    try {
      await applyOutputs.mutateAsync({
        startupId,
        outputsJson: runResult.final_output,
      });
      onApplySuccess?.();
      onClose();
    } catch {
      setRunState('completed');
    }
  };

  const progress = runResult 
    ? (runResult.meta.completed_steps / runResult.meta.total_steps) * 100 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {pack.category}
            </Badge>
            {runState === 'running' && (
              <Badge variant="secondary" className="animate-pulse">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Running
              </Badge>
            )}
            {runState === 'completed' && (
              <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
            {runState === 'failed' && (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Failed
              </Badge>
            )}
          </div>
          <DialogTitle>{pack.title}</DialogTitle>
          <DialogDescription>
            {runState === 'idle' && 'Click "Run" to execute this prompt pack for your startup.'}
            {runState === 'running' && 'Executing AI steps...'}
            {runState === 'completed' && 'Review the results and apply to your startup.'}
            {runState === 'failed' && 'Execution failed. Please try again.'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        {(runState === 'running' || runResult) && (
          <div className="py-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {runResult 
                  ? `${runResult.meta.completed_steps}/${runResult.meta.total_steps} steps completed`
                  : 'Processing...'}
              </span>
              {runResult && (
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    ${runResult.meta.total_cost_usd.toFixed(4)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {(runResult.meta.total_latency_ms / 1000).toFixed(1)}s
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" />
                    {runResult.meta.total_tokens.input + runResult.meta.total_tokens.output} tokens
                  </span>
                </div>
              )}
            </div>
            <Progress value={runState === 'running' ? undefined : progress} className="h-2" />
          </div>
        )}

        <Separator />

        {/* Results display */}
        <ScrollArea className="h-[350px] pr-4">
          {runState === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Play className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                This pack has {pack.steps?.length || 0} step(s).<br />
                Click "Run" to start the AI workflow.
              </p>
            </div>
          )}

          {runState === 'running' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">
                Executing AI steps...<br />
                This may take a moment.
              </p>
            </div>
          )}

          {(runState === 'completed' || runState === 'previewing' || runState === 'applying') && runResult && (
            <div className="space-y-4">
              {/* Step results */}
              <div>
                <h4 className="text-sm font-medium mb-3">Step Results</h4>
                <div className="space-y-2">
                  {runResult.results.map((result, index) => (
                    <div
                      key={result.step_id}
                      className={`p-3 rounded-lg border ${
                        result.success 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-destructive/5 border-destructive/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{result.purpose}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>${result.cost_usd.toFixed(4)}</span>
                          <span>{(result.latency_ms / 1000).toFixed(1)}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final output preview */}
              {runResult.final_output && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Final Output</h4>
                  <pre className="p-3 rounded-lg bg-muted text-xs overflow-auto max-h-[150px]">
                    {JSON.stringify(runResult.final_output, null, 2)}
                  </pre>
                </div>
              )}

              {/* Preview results */}
              {previewResult && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Apply Preview</h4>
                  <div className="space-y-2">
                    {previewResult.applied.map((item) => (
                      <div
                        key={item.table}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                      >
                        <span className="font-mono text-sm">{item.table}</span>
                        <Badge variant="secondary">
                          {item.count} record(s) to {item.action}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {runState === 'idle' && (
            <Button onClick={handleRun}>
              <Play className="h-4 w-4 mr-2" />
              Run Pack
            </Button>
          )}

          {runState === 'completed' && runResult?.success && (
            <>
              <Button variant="outline" onClick={handlePreview} disabled={previewApply.isPending}>
                <Eye className="h-4 w-4 mr-2" />
                {previewApply.isPending ? 'Previewing...' : 'Preview Apply'}
              </Button>
              <Button onClick={handleApply} disabled={applyOutputs.isPending}>
                <Download className="h-4 w-4 mr-2" />
                {applyOutputs.isPending ? 'Applying...' : 'Apply to Startup'}
              </Button>
            </>
          )}

          {runState === 'failed' && (
            <Button onClick={handleRun}>
              <Play className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RunPackModal;
