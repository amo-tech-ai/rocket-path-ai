import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";
import { useCreateExperiment, useGenerateExperiment, useAssumptions } from "@/hooks/useExperiments";
import { useToast } from "@/hooks/use-toast";

const EXPERIMENT_TYPES = [
  { value: 'customer_interview', label: 'Customer Interview' },
  { value: 'survey', label: 'Survey' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'prototype_test', label: 'Prototype Test' },
  { value: 'concierge', label: 'Concierge' },
  { value: 'wizard_of_oz', label: 'Wizard of Oz' },
  { value: 'smoke_test', label: 'Smoke Test' },
  { value: 'a_b_test', label: 'A/B Test' },
  { value: 'fake_door', label: 'Fake Door' },
  { value: 'other', label: 'Other' },
] as const;

interface CreateExperimentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startupId: string;
  startupContext: { name: string; industry: string; stage: string; description: string };
}

export function CreateExperimentDialog({
  open,
  onOpenChange,
  startupId,
  startupContext,
}: CreateExperimentDialogProps) {
  const { toast } = useToast();
  const { data: assumptions = [] } = useAssumptions(startupId);
  const createExperiment = useCreateExperiment();
  const generateExperiment = useGenerateExperiment();

  const [title, setTitle] = useState('');
  const [assumptionId, setAssumptionId] = useState('');
  const [experimentType, setExperimentType] = useState<string>('customer_interview');
  const [hypothesis, setHypothesis] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [method, setMethod] = useState('');
  const [targetSampleSize, setTargetSampleSize] = useState<number | undefined>();

  const selectedAssumption = assumptions.find(a => a.id === assumptionId);

  const handleGenerate = async () => {
    if (!selectedAssumption) {
      toast({ title: "Select an assumption first", variant: "destructive" });
      return;
    }
    try {
      const result = await generateExperiment.mutateAsync({
        assumption_text: selectedAssumption.statement,
        experiment_type: experimentType,
        startup_context: startupContext,
      });
      setHypothesis(result.hypothesis);
      setSuccessCriteria(result.success_criteria);
      setMethod(result.method);
      setTargetSampleSize(result.target_sample_size);
      if (!title) setTitle(`${experimentType.replace(/_/g, ' ')} — ${selectedAssumption.statement.slice(0, 40)}`);
      toast({ title: "Experiment designed by AI" });
    } catch (err) {
      toast({
        title: "AI generation failed",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!assumptionId || !title || !hypothesis || !successCriteria) {
      toast({ title: "Fill in required fields", variant: "destructive" });
      return;
    }
    try {
      await createExperiment.mutateAsync({
        assumption_id: assumptionId,
        title,
        hypothesis,
        success_criteria: successCriteria,
        experiment_type: experimentType as any,
        method: method || undefined,
        target_sample_size: targetSampleSize,
      });
      toast({ title: "Experiment created" });
      resetForm();
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Failed to create experiment",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setAssumptionId('');
    setExperimentType('customer_interview');
    setHypothesis('');
    setSuccessCriteria('');
    setMethod('');
    setTargetSampleSize(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Experiment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label>Assumption *</Label>
            <Select value={assumptionId} onValueChange={setAssumptionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select assumption to test" />
              </SelectTrigger>
              <SelectContent>
                {assumptions.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    <span className="line-clamp-1">{a.statement}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {assumptions.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">No assumptions found. Run a validation first.</p>
            )}
          </div>

          <div>
            <Label>Experiment Type</Label>
            <Select value={experimentType} onValueChange={setExperimentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPERIMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGenerate}
            disabled={!assumptionId || generateExperiment.isPending}
          >
            {generateExperiment.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Generate with AI</>
            )}
          </Button>

          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Experiment title" />
          </div>

          <div>
            <Label>Hypothesis *</Label>
            <Textarea value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder="If we..., then..." rows={2} />
          </div>

          <div>
            <Label>Success Criteria *</Label>
            <Textarea value={successCriteria} onChange={(e) => setSuccessCriteria(e.target.value)} placeholder="The experiment succeeds if..." rows={2} />
          </div>

          <div>
            <Label>Method</Label>
            <Textarea value={method} onChange={(e) => setMethod(e.target.value)} placeholder="Step-by-step methodology" rows={3} />
          </div>

          <div>
            <Label>Target Sample Size</Label>
            <Input
              type="number"
              value={targetSampleSize ?? ''}
              onChange={(e) => setTargetSampleSize(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g. 20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createExperiment.isPending}>
              {createExperiment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
