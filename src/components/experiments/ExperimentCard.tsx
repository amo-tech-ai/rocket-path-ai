import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Trash2, Play, Pause, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Experiment } from "@/hooks/useExperiments";

const STATUS_COLORS: Record<string, string> = {
  designed: "bg-slate-100 text-slate-700",
  recruiting: "bg-blue-100 text-blue-700",
  running: "bg-amber-100 text-amber-700",
  collecting: "bg-purple-100 text-purple-700",
  analyzing: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  paused: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};

const TYPE_LABELS: Record<string, string> = {
  customer_interview: "Interview",
  survey: "Survey",
  landing_page: "Landing Page",
  prototype_test: "Prototype",
  concierge: "Concierge",
  wizard_of_oz: "Wizard of Oz",
  smoke_test: "Smoke Test",
  a_b_test: "A/B Test",
  fake_door: "Fake Door",
  other: "Other",
};

const STATUS_PROGRESS: Record<string, number> = {
  designed: 10,
  recruiting: 25,
  running: 50,
  collecting: 65,
  analyzing: 80,
  completed: 100,
  paused: 0,
  cancelled: 0,
};

interface ExperimentCardProps {
  experiment: Experiment;
  onStatusChange: (id: string, status: Experiment['status']) => void;
  onDelete: (id: string) => void;
  onClick: (experiment: Experiment) => void;
}

export function ExperimentCard({ experiment, onStatusChange, onDelete, onClick }: ExperimentCardProps) {
  const progress = STATUS_PROGRESS[experiment.status] ?? 0;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(experiment)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold line-clamp-2">{experiment.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              {experiment.status === 'designed' && (
                <DropdownMenuItem onClick={() => onStatusChange(experiment.id, 'running')}>
                  <Play className="h-4 w-4 mr-2" /> Start Running
                </DropdownMenuItem>
              )}
              {experiment.status === 'running' && (
                <DropdownMenuItem onClick={() => onStatusChange(experiment.id, 'paused')}>
                  <Pause className="h-4 w-4 mr-2" /> Pause
                </DropdownMenuItem>
              )}
              {experiment.status === 'paused' && (
                <DropdownMenuItem onClick={() => onStatusChange(experiment.id, 'running')}>
                  <Play className="h-4 w-4 mr-2" /> Resume
                </DropdownMenuItem>
              )}
              {['running', 'collecting', 'analyzing'].includes(experiment.status) && (
                <DropdownMenuItem onClick={() => onStatusChange(experiment.id, 'completed')}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Complete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(experiment.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {TYPE_LABELS[experiment.experiment_type] || experiment.experiment_type}
          </Badge>
          <Badge className={`text-xs ${STATUS_COLORS[experiment.status] || ''}`}>
            {experiment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{experiment.hypothesis}</p>
        <Progress value={progress} className="h-1.5" />
        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
          <span>{experiment.target_sample_size ? `n=${experiment.target_sample_size}` : ''}</span>
          <span>{progress}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
