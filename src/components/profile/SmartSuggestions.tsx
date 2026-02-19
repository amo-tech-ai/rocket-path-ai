import { Card } from '@/components/ui/card';
import { Sparkles, ArrowRight, Lightbulb, TrendingUp, Users, Target } from 'lucide-react';

interface Suggestion {
  id: string;
  category: 'positioning' | 'market' | 'team' | 'traction';
  title: string;
  description: string;
  action: string;
  field?: string;
}

interface SmartSuggestionsProps {
  missingFields: string[];
  industry?: string | null;
  stage?: string | null;
  onNavigateToField?: (field: string) => void;
}

const CATEGORY_CONFIG = {
  positioning: { icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  market: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  team: { icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  traction: { icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

function generateSuggestions(missingFields: string[], _industry?: string | null, _stage?: string | null): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (missingFields.includes('Tagline')) {
    suggestions.push({
      id: 'tagline',
      category: 'positioning',
      title: 'Add a compelling tagline',
      description: 'A clear one-liner helps investors and customers instantly understand your value.',
      action: 'Write tagline',
      field: 'tagline',
    });
  }

  if (missingFields.includes('Description')) {
    suggestions.push({
      id: 'description',
      category: 'positioning',
      title: 'Write your company description',
      description: 'A 2-3 sentence description is essential for pitch decks and investor outreach.',
      action: 'Write description',
      field: 'description',
    });
  }

  if (missingFields.includes('Website')) {
    suggestions.push({
      id: 'website',
      category: 'market',
      title: 'Add your website URL',
      description: 'A web presence adds credibility and helps AI analyze your positioning.',
      action: 'Add URL',
      field: 'website',
    });
  }

  if (missingFields.includes('LinkedIn')) {
    suggestions.push({
      id: 'linkedin',
      category: 'market',
      title: 'Connect your LinkedIn',
      description: 'LinkedIn integration helps with investor matching and social proof.',
      action: 'Connect',
      field: 'linkedin',
    });
  }

  if (missingFields.includes('Industry')) {
    suggestions.push({
      id: 'industry',
      category: 'market',
      title: 'Select your industry',
      description: 'Industry classification enables market sizing and competitor analysis.',
      action: 'Select industry',
      field: 'industry',
    });
  }

  if (missingFields.includes('Stage')) {
    suggestions.push({
      id: 'stage',
      category: 'traction',
      title: 'Set your funding stage',
      description: 'This helps match you with stage-appropriate investors and benchmarks.',
      action: 'Set stage',
      field: 'stage',
    });
  }

  // Always show general suggestions if profile is partially complete
  if (suggestions.length < 3) {
    suggestions.push({
      id: 'differentiator',
      category: 'positioning',
      title: 'Strengthen your differentiator',
      description: 'A clear unfair advantage is the #1 factor investors look for.',
      action: 'Improve',
      field: 'unique_value',
    });
  }

  return suggestions.slice(0, 4);
}

export function SmartSuggestions({ missingFields, industry, stage, onNavigateToField }: SmartSuggestionsProps) {
  const suggestions = generateSuggestions(missingFields, industry, stage);

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">Smart Suggestions</h4>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const config = CATEGORY_CONFIG[suggestion.category];
          const Icon = config.icon;
          return (
            <Card
              key={suggestion.id}
              className="p-3 cursor-pointer hover:bg-muted/50 transition-colors border-border"
              onClick={() => suggestion.field && onNavigateToField?.(suggestion.field)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{suggestion.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
