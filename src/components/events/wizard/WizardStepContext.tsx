import { ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WizardData } from '@/pages/EventWizard';

interface WizardStepContextProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
}

const eventTypes = [
  { value: 'demo_day', label: 'Demo Day / Showcase' },
  { value: 'pitch_night', label: 'Pitch Night' },
  { value: 'networking', label: 'Networking Event' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'investor_meetup', label: 'Investor Meetup' },
  { value: 'founder_dinner', label: 'Founder Dinner' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'conference', label: 'Conference' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'other', label: 'Other' },
];

export default function WizardStepContext({ data, updateData }: WizardStepContextProps) {
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtractFromUrl = async () => {
    if (!data.reference_url) return;

    setIsExtracting(true);
    // TODO: Call AI edge function to extract details from URL
    // For now, simulate with a timeout
    setTimeout(() => {
      // Mock extraction - in production this would call the AI
      setIsExtracting(false);
    }, 1500);
  };

  const handleGenerateDescription = async () => {
    if (!data.name || !data.event_type) return;

    // TODO: Call AI edge function to generate description
    // For now, set a placeholder
    const typeLabel = eventTypes.find(t => t.value === data.event_type)?.label || data.event_type;
    updateData({
      description: `Join us for ${data.name}, an exciting ${typeLabel.toLowerCase()} where founders, investors, and industry experts come together. This event will feature curated presentations, networking opportunities, and valuable insights for the startup ecosystem.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Event Context</h2>
        <p className="text-muted-foreground">
          Let's start with the basics. What kind of event are you planning?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Event Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Q1 Demo Day 2024"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_type">
            Event Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.event_type}
            onValueChange={(value) => updateData({ event_type: value })}
          >
            <SelectTrigger id="event_type">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference_url">Reference URL (optional)</Label>
          <div className="flex gap-2">
            <Input
              id="reference_url"
              placeholder="https://example.com/similar-event"
              value={data.reference_url}
              onChange={(e) => updateData({ reference_url: e.target.value })}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleExtractFromUrl}
              disabled={!data.reference_url || isExtracting}
            >
              {isExtracting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste a URL and we'll extract event details automatically
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Description</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={handleGenerateDescription}
              disabled={!data.name || !data.event_type}
            >
              <Sparkles className="h-3 w-3" />
              Generate with AI
            </Button>
          </div>
          <Textarea
            id="description"
            placeholder="Describe your event..."
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
