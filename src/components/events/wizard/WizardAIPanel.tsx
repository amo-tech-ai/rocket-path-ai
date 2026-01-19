import { Sparkles, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WizardData } from '@/pages/EventWizard';

interface WizardAIPanelProps {
  currentStep: number;
  data: WizardData;
  suggestions: string[];
}

const stepGuidance: Record<number, { title: string; tips: string[]; examples?: string[] }> = {
  1: {
    title: 'Getting Started',
    tips: [
      'Choose a clear, memorable event name',
      'Select the event type that best matches your goals',
      'If you have a reference event, paste the URL for AI extraction',
    ],
    examples: ['TechCrunch Disrupt', 'YC Demo Day', '500 Startups showcase'],
  },
  2: {
    title: 'Define Your Strategy',
    tips: [
      'Set 2-3 primary goals for focused planning',
      'Match your budget to attendee expectations',
      'Define success metrics early for tracking ROI',
    ],
  },
  3: {
    title: 'Plan the Logistics',
    tips: [
      'Book venues 4-6 weeks in advance',
      'Consider timezone for virtual attendees',
      'Allow buffer time for networking',
    ],
  },
  4: {
    title: 'Final Review',
    tips: [
      'Double-check all dates and times',
      'Verify budget aligns with goals',
      'Ready to create? AI will generate your task list',
    ],
  },
};

// Calculate event readiness based on filled fields
function getReadinessScore(data: WizardData): number {
  let score = 0;
  if (data.name) score += 15;
  if (data.event_type) score += 10;
  if (data.description) score += 10;
  if (data.goals.length > 0) score += 15;
  if (data.target_audience) score += 10;
  if (data.expected_attendees > 0) score += 10;
  if (data.budget > 0) score += 10;
  if (data.event_date) score += 15;
  if (data.venue_name || data.location_type === 'virtual') score += 5;
  return Math.min(score, 100);
}

export default function WizardAIPanel({ currentStep, data, suggestions }: WizardAIPanelProps) {
  const guidance = stepGuidance[currentStep];
  const readiness = getReadinessScore(data);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* AI Header */}
        <div className="flex items-center gap-2 text-lg font-semibold">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          AI Planning Assistant
        </div>

        {/* Current Step Guidance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              {guidance.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {guidance.tips.map((tip, i) => (
              <p key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary">•</span>
                {tip}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Similar Events (Step 1) */}
        {currentStep === 1 && guidance.examples && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Similar Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {guidance.examples.map((example, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{example}</span>
                  <Badge variant="outline" className="text-xs">
                    Template
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Event Readiness Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Event Readiness</span>
              <span className={`text-lg font-bold ${
                readiness >= 80 ? 'text-emerald-500' :
                readiness >= 50 ? 'text-amber-500' : 'text-muted-foreground'
              }`}>
                {readiness}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  readiness >= 80 ? 'bg-emerald-500' :
                  readiness >= 50 ? 'bg-amber-500' : 'bg-muted-foreground'
                }`}
                style={{ width: `${readiness}%` }}
              />
            </div>

            {/* Completion Checklist */}
            <div className="mt-4 space-y-2">
              <ChecklistItem label="Event name" done={!!data.name} />
              <ChecklistItem label="Event type" done={!!data.event_type} />
              <ChecklistItem label="Goals defined" done={data.goals.length > 0} />
              <ChecklistItem label="Date selected" done={!!data.event_date} />
              <ChecklistItem label="Budget set" done={data.budget > 0} />
            </div>
          </CardContent>
        </Card>

        {/* Warnings */}
        {currentStep === 2 && data.expected_attendees > 200 && data.budget < 10000 && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                Budget Advisory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700">
                For {data.expected_attendees}+ attendees, consider a budget of at least $10,000
                for quality catering and venue.
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((suggestion, i) => (
                <p key={i} className="text-sm text-muted-foreground">
                  {suggestion}
                </p>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}

function ChecklistItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
      )}
      <span className={done ? 'text-foreground' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  );
}
