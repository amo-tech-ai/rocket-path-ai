import { BarChart3, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WizardFormData } from '@/hooks/useWizardSession';

interface DetectedSignalsCardProps {
  data: WizardFormData;
}

interface Signal {
  category: string;
  items: { label: string; value: string }[];
}

export function DetectedSignalsCard({ data }: DetectedSignalsCardProps) {
  const signals: Signal[] = [
    {
      category: 'General',
      items: [
        { label: 'Industry', value: data.industry || 'Marketing Technology' },
        { label: 'Stage', value: data.stage || 'Seed / Series A Ready' },
        { label: 'Messaging', value: 'Clear & Value-Focused' },
      ],
    },
    {
      category: 'Product',
      items: [
        { label: 'Core Problem', value: 'Fragmented creative workflows' },
        { label: 'Solution Theme', value: 'Unified AI-native workspace' },
        { label: 'Differentiation', value: 'Deep Adobe integration' },
      ],
    },
    {
      category: 'Market',
      items: [
        { label: 'Competition Density', value: 'High' },
        { label: 'Trend Alignment', value: 'Strong (GenAI Wave)' },
      ],
    },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Detected Signals
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs text-muted-foreground cursor-help">
                  Read-only
                  <Info className="h-3 w-3 ml-1" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Signals are auto-detected and can be adjusted in step 3</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {signals.map((signalGroup) => (
            <div key={signalGroup.category}>
              <h4 className="font-medium text-sm mb-2">{signalGroup.category}</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {signalGroup.items.map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                      {item.label}
                    </span>
                    <span className="text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DetectedSignalsCard;
