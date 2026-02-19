import { Plus, X, Target, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WizardData } from '@/pages/EventWizard';

interface WizardStepStrategyProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const goalSuggestions = [
  'Generate investor leads',
  'Build brand awareness',
  'Network with founders',
  'Showcase product',
  'Recruit talent',
  'Press coverage',
  'Partnership opportunities',
  'Customer acquisition',
];

const metricSuggestions = [
  'Number of qualified leads',
  'Investor meetings scheduled',
  'Press mentions',
  'Social media engagement',
  'Partnership discussions',
  'Demo requests',
  'Email signups',
];

const audiences = [
  { value: 'investors', label: 'Investors / VCs' },
  { value: 'founders', label: 'Founders & Entrepreneurs' },
  { value: 'enterprise', label: 'Enterprise Customers' },
  { value: 'developers', label: 'Developers / Tech' },
  { value: 'general', label: 'General Public' },
  { value: 'mixed', label: 'Mixed Audience' },
];

export default function WizardStepStrategy({ data, updateData }: WizardStepStrategyProps) {
  const [newGoal, setNewGoal] = useState('');
  const [newMetric, setNewMetric] = useState('');

  const addGoal = (goal: string) => {
    if (goal && !data.goals.includes(goal)) {
      updateData({ goals: [...data.goals, goal] });
    }
    setNewGoal('');
  };

  const removeGoal = (goal: string) => {
    updateData({ goals: data.goals.filter(g => g !== goal) });
  };

  const addMetric = (metric: string) => {
    if (metric && !data.success_metrics.includes(metric)) {
      updateData({ success_metrics: [...data.success_metrics, metric] });
    }
    setNewMetric('');
  };

  const removeMetric = (metric: string) => {
    updateData({ success_metrics: data.success_metrics.filter(m => m !== metric) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Event Strategy</h2>
        <p className="text-muted-foreground">
          Define your goals and who you want to reach.
        </p>
      </div>

      <div className="space-y-6">
        {/* Goals */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Event Goals <span className="text-destructive">*</span>
          </Label>
          
          <div className="flex flex-wrap gap-2">
            {data.goals.map((goal) => (
              <Badge
                key={goal}
                variant="secondary"
                className="gap-1 py-1.5 px-3"
              >
                {goal}
                <button onClick={() => removeGoal(goal)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGoal(newGoal)}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => addGoal(newGoal)}
              disabled={!newGoal}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground">Suggestions:</span>
            {goalSuggestions
              .filter(g => !data.goals.includes(g))
              .slice(0, 4)
              .map((goal) => (
                <Button
                  key={goal}
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => addGoal(goal)}
                >
                  + {goal}
                </Button>
              ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Target Audience
          </Label>
          <Select
            value={data.target_audience}
            onValueChange={(value) => updateData({ target_audience: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Who is this event for?" />
            </SelectTrigger>
            <SelectContent>
              {audiences.map((audience) => (
                <SelectItem key={audience.value} value={audience.value}>
                  {audience.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expected Attendees */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Expected Attendees
            </span>
            <span className="font-bold text-lg">{data.expected_attendees}</span>
          </Label>
          <Slider
            value={[data.expected_attendees]}
            onValueChange={([value]) => updateData({ expected_attendees: value })}
            min={10}
            max={500}
            step={10}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10</span>
            <span>100</span>
            <span>250</span>
            <span>500</span>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget
            </span>
            <span className="font-bold text-lg">${data.budget.toLocaleString()}</span>
          </Label>
          <Slider
            value={[data.budget]}
            onValueChange={([value]) => updateData({ budget: value })}
            min={0}
            max={50000}
            step={500}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$10k</span>
            <span>$25k</span>
            <span>$50k</span>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Success Metrics (optional)
          </Label>
          
          <div className="flex flex-wrap gap-2">
            {data.success_metrics.map((metric) => (
              <Badge
                key={metric}
                variant="outline"
                className="gap-1 py-1.5 px-3"
              >
                {metric}
                <button onClick={() => removeMetric(metric)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a metric..."
              value={newMetric}
              onChange={(e) => setNewMetric(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMetric(newMetric)}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => addMetric(newMetric)}
              disabled={!newMetric}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground">Suggestions:</span>
            {metricSuggestions
              .filter(m => !data.success_metrics.includes(m))
              .slice(0, 3)
              .map((metric) => (
                <Button
                  key={metric}
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => addMetric(metric)}
                >
                  + {metric}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
