import { Sparkles, Globe, Search, Target, FileText, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WizardAIPanelProps {
  currentStep: number;
  isProcessing?: boolean;
  extractions?: {
    company_name?: string;
    industry?: string;
    features?: string[];
    competitors?: string[];
  };
}

const stepGuidance = [
  {
    title: 'What Gemini Will Do',
    items: [
      { icon: Globe, text: 'Run URL Context on all links' },
      { icon: Search, text: 'Search the web using grounded search' },
      { icon: Target, text: 'Extract features, audience, pricing, problem' },
      { icon: FileText, text: 'Find real competitors + trends' },
      { icon: Brain, text: 'Combine with your description + target market' },
      { icon: Sparkles, text: 'Autofill later steps' },
    ],
  },
  {
    title: 'AI Analysis',
    items: [
      { icon: Brain, text: 'Analyzing your startup context' },
      { icon: Search, text: 'Researching market and competitors' },
      { icon: Target, text: 'Identifying opportunities' },
    ],
  },
  {
    title: 'Smart Interview',
    items: [
      { icon: Brain, text: 'Asking clarifying questions' },
      { icon: Target, text: 'Refining your profile' },
      { icon: Sparkles, text: 'Building comprehensive analysis' },
    ],
  },
  {
    title: 'Final Review',
    items: [
      { icon: FileText, text: 'Profile strength score' },
      { icon: Target, text: 'Areas for improvement' },
      { icon: Sparkles, text: 'Ready to generate assets' },
    ],
  },
];

export function WizardAIPanel({
  currentStep,
  isProcessing = false,
  extractions,
}: WizardAIPanelProps) {
  const currentGuidance = stepGuidance[currentStep - 1] || stepGuidance[0];

  return (
    <div className="p-6 space-y-6">
      {/* Main Guidance Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            {currentGuidance.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentGuidance.items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Context Card */}
      {currentStep === 1 && (
        <Card className="bg-accent/30 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-5 w-5 text-primary" />
              Why accurate context?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The more details you provide here, the better Gemini can tailor your Pitch Deck, 
              One-Pager, and Financial Models in later steps.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm font-medium text-primary">AI is processing...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extractions Display */}
      {extractions && Object.keys(extractions).length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Extracted Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {extractions.company_name && (
              <div>
                <span className="text-xs text-muted-foreground">Company</span>
                <p className="text-sm font-medium">{extractions.company_name}</p>
              </div>
            )}
            {extractions.industry && (
              <div>
                <span className="text-xs text-muted-foreground">Industry</span>
                <p className="text-sm font-medium">{extractions.industry}</p>
              </div>
            )}
            {extractions.features && extractions.features.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">Features</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {extractions.features.slice(0, 5).map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-accent rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer Note */}
      <p className="text-xs text-muted-foreground text-center px-4">
        Gemini 3 uses Google Search Grounding to find up-to-date market data that matches your startup's context.
      </p>
    </div>
  );
}

export default WizardAIPanel;
