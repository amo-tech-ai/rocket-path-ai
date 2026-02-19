import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Save, Loader2 } from "lucide-react";
import { useUpdateSprint, type Sprint } from "@/hooks/useSprints";
import { useToast } from "@/hooks/use-toast";
import type { Json } from '@/integrations/supabase/types';

interface PDCAEditorProps {
  sprint: Sprint;
}

function parseJsonArray(val: Json | null): string[] {
  if (Array.isArray(val)) return val.map(String);
  return [];
}

function parseJsonObject(val: Json | null): Record<string, string> {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k, String(v ?? '')])
    );
  }
  return {};
}

export function PDCAEditor({ sprint }: PDCAEditorProps) {
  const updateSprint = useUpdateSprint();
  const { toast } = useToast();

  // Plan fields
  const [hypothesis, setHypothesis] = useState(sprint.hypothesis || '');
  const [experimentDesign, setExperimentDesign] = useState(sprint.experiment_design || '');
  const [successCriteria, setSuccessCriteria] = useState(sprint.success_criteria || '');
  const [method, setMethod] = useState(sprint.method || '');

  // Do fields
  const [actionsTaken, setActionsTaken] = useState(parseJsonArray(sprint.actions_taken).join('\n'));
  const [notes, setNotes] = useState(sprint.notes || '');

  // Check fields
  const [results, setResults] = useState(
    typeof sprint.results === 'string' ? sprint.results : JSON.stringify(sprint.results || '')
  );
  const [metricsAchieved, setMetricsAchieved] = useState(
    Object.entries(parseJsonObject(sprint.metrics_achieved))
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')
  );
  const [success, setSuccess] = useState(sprint.success ?? false);

  // Act fields
  const [learnings, setLearnings] = useState(parseJsonArray(sprint.learnings).join('\n'));
  const [decision, setDecision] = useState(sprint.decision || '');
  const [decisionRationale, setDecisionRationale] = useState(sprint.decision_rationale || '');
  const [nextSteps, setNextSteps] = useState(parseJsonArray(sprint.next_steps).join('\n'));

  const [savingSection, setSavingSection] = useState<string | null>(null);

  const saveSection = async (section: string) => {
    setSavingSection(section);
    try {
      let updates: Partial<Sprint> = {};
      switch (section) {
        case 'plan':
          updates = {
            hypothesis,
            experiment_design: experimentDesign,
            success_criteria: successCriteria,
            method,
            pdca_step: 'do',
          };
          break;
        case 'do':
          updates = {
            actions_taken: actionsTaken.split('\n').filter(Boolean) as unknown as Json,
            notes,
            pdca_step: 'check',
          };
          break;
        case 'check':
          updates = {
            results: results as unknown as Json,
            metrics_achieved: Object.fromEntries(
              metricsAchieved.split('\n').filter(Boolean).map(line => {
                const [k, ...v] = line.split(':');
                return [k.trim(), v.join(':').trim()];
              })
            ) as unknown as Json,
            success,
            pdca_step: 'act',
          };
          break;
        case 'act':
          updates = {
            learnings: learnings.split('\n').filter(Boolean) as unknown as Json,
            decision,
            decision_rationale: decisionRationale,
            next_steps: nextSteps.split('\n').filter(Boolean) as unknown as Json,
          };
          break;
      }
      await updateSprint.mutateAsync({ id: sprint.id, ...updates });
      toast({ title: `${section.charAt(0).toUpperCase() + section.slice(1)} saved` });
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSavingSection(null);
    }
  };

  const sections = [
    {
      key: 'plan',
      label: 'Plan',
      color: 'text-blue-600',
      content: (
        <div className="space-y-3">
          <div>
            <Label>Hypothesis</Label>
            <Textarea value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} rows={2} placeholder="We believe that..." />
          </div>
          <div>
            <Label>Experiment Design</Label>
            <Textarea value={experimentDesign} onChange={(e) => setExperimentDesign(e.target.value)} rows={2} placeholder="How we'll test this..." />
          </div>
          <div>
            <Label>Success Criteria</Label>
            <Textarea value={successCriteria} onChange={(e) => setSuccessCriteria(e.target.value)} rows={2} placeholder="We'll know it works if..." />
          </div>
          <div>
            <Label>Method</Label>
            <Textarea value={method} onChange={(e) => setMethod(e.target.value)} rows={2} placeholder="Steps to execute..." />
          </div>
        </div>
      ),
    },
    {
      key: 'do',
      label: 'Do',
      color: 'text-amber-600',
      content: (
        <div className="space-y-3">
          <div>
            <Label>Actions Taken (one per line)</Label>
            <Textarea value={actionsTaken} onChange={(e) => setActionsTaken(e.target.value)} rows={4} placeholder="- Contacted 10 prospects..." />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Observations during execution..." />
          </div>
        </div>
      ),
    },
    {
      key: 'check',
      label: 'Check',
      color: 'text-purple-600',
      content: (
        <div className="space-y-3">
          <div>
            <Label>Results</Label>
            <Textarea value={results} onChange={(e) => setResults(e.target.value)} rows={3} placeholder="What happened..." />
          </div>
          <div>
            <Label>Metrics Achieved (key: value, one per line)</Label>
            <Textarea value={metricsAchieved} onChange={(e) => setMetricsAchieved(e.target.value)} rows={3} placeholder="conversion_rate: 12%&#10;signups: 45" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={success} onCheckedChange={(v) => setSuccess(v === true)} />
            <Label>Success criteria met</Label>
          </div>
        </div>
      ),
    },
    {
      key: 'act',
      label: 'Act',
      color: 'text-green-600',
      content: (
        <div className="space-y-3">
          <div>
            <Label>Learnings (one per line)</Label>
            <Textarea value={learnings} onChange={(e) => setLearnings(e.target.value)} rows={3} placeholder="Key insights..." />
          </div>
          <div>
            <Label>Decision</Label>
            <Select value={decision} onValueChange={setDecision}>
              <SelectTrigger>
                <SelectValue placeholder="Choose action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="continue">Continue</SelectItem>
                <SelectItem value="adjust">Adjust</SelectItem>
                <SelectItem value="pivot">Pivot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Decision Rationale</Label>
            <Textarea value={decisionRationale} onChange={(e) => setDecisionRationale(e.target.value)} rows={2} placeholder="Why this decision..." />
          </div>
          <div>
            <Label>Next Steps (one per line)</Label>
            <Textarea value={nextSteps} onChange={(e) => setNextSteps(e.target.value)} rows={3} placeholder="- Run follow-up interviews..." />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <Collapsible key={section.key} defaultOpen={section.key === sprint.pdca_step}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <span className={`font-medium ${section.color}`}>{section.label}</span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3">
            {section.content}
            <Button
              size="sm"
              className="mt-3"
              onClick={() => saveSection(section.key)}
              disabled={savingSection === section.key}
            >
              {savingSection === section.key ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><Save className="h-4 w-4 mr-1" /> Save {section.label}</>
              )}
            </Button>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
